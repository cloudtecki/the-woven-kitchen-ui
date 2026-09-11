import { ReactElement } from 'react';
import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import i18n from '../../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import type { AuthUser } from 'core/base/type/auth';
import { useGetCurrentUserQuery } from 'core/api/auth';
import ProtectedRoute from './ProtectedRoute';

vi.mock('core/api/auth', () => ({
    useGetCurrentUserQuery: vi.fn(),
}));

const mockedQuery = useGetCurrentUserQuery as unknown as Mock;

const adminUser: AuthUser = {
    id: 'u-admin',
    name: 'Admin One',
    email: 'admin@example.com',
    phone: '9876543210',
    role: 'ADMIN',
    bio: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
};

const customerUser: AuthUser = { ...adminUser, id: 'u-cust', role: 'CUSTOMER' };

const makeToken = (role: string, expOffsetSec = 3600) => {
    const payload = btoa(
        JSON.stringify({ userId: 'u1', role, exp: Math.floor(Date.now() / 1000) + expOffsetSec }),
    );
    return `header.${payload}.signature`;
};

const renderGuard = (ui: ReactElement, preloadedUser: AuthUser | null) => {
    const store = setupStore(preloadedUser ? { auth: { user: preloadedUser } } : undefined);
    return render(
        <AntApp>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={['/guard']}>
                        <Routes>
                            <Route path="/guard" element={ui} />
                            <Route path="/login" element={<div>LoginLayout</div>} />
                            <Route path="/forbidden" element={<div>ForbiddenLayout</div>} />
                        </Routes>
                    </MemoryRouter>
                </I18nextProvider>
            </Provider>
        </AntApp>,
    );
};

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
    });

    it('redirects unauthenticated users to login', async () => {
        mockedQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        });
        renderGuard(<ProtectedRoute>{<div>Secret</div>}</ProtectedRoute>, null);
        expect(await screen.findByText('LoginLayout')).toBeInTheDocument();
    });

    it('renders children for an authorized ADMIN', async () => {
        localStorage.setItem('twk_access_token', makeToken('ADMIN'));
        mockedQuery.mockReturnValue({
            data: { success: true, data: adminUser },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        });
        renderGuard(
            <ProtectedRoute allowedRoles={['ADMIN']}>{<div>Secret</div>}</ProtectedRoute>,
            adminUser,
        );
        expect(await screen.findByText('Secret')).toBeInTheDocument();
    });

    it('redirects a CUSTOMER away from an ADMIN-only route', async () => {
        localStorage.setItem('twk_access_token', makeToken('CUSTOMER'));
        mockedQuery.mockReturnValue({
            data: { success: true, data: customerUser },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        });
        renderGuard(
            <ProtectedRoute allowedRoles={['ADMIN']}>{<div>Secret</div>}</ProtectedRoute>,
            customerUser,
        );
        expect(await screen.findByText('ForbiddenLayout')).toBeInTheDocument();
    });

    it('shows a loading state instead of redirecting while the profile loads', () => {
        localStorage.setItem('twk_access_token', makeToken('ADMIN'));
        mockedQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isFetching: true,
            isError: false,
            refetch: vi.fn(),
        });
        renderGuard(<ProtectedRoute allowedRoles={['ADMIN']}>{<div>Secret</div>}</ProtectedRoute>, null);
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.queryByText('Secret')).not.toBeInTheDocument();
    });

    it('redirects to login when the token is expired', async () => {
        localStorage.setItem('twk_access_token', makeToken('ADMIN', -3600));
        mockedQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        });
        renderGuard(<ProtectedRoute>{<div>Secret</div>}</ProtectedRoute>, null);
        expect(await screen.findByText('LoginLayout')).toBeInTheDocument();
    });
});
