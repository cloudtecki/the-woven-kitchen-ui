import { App as AntApp } from 'antd';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import i18n from '../../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import type { AuthUser } from 'core/base/type/auth';
import { useGetCurrentUserQuery } from 'core/api/auth';
import AdminSidebar from './AdminSidebar';

vi.mock('core/api/auth', () => ({
    useGetCurrentUserQuery: vi.fn(),
}));

const mockedQuery = useGetCurrentUserQuery as unknown as Mock;

const baseUser: AuthUser = {
    id: 'u1',
    name: 'Test User',
    email: 'user@example.com',
    phone: '9876543210',
    role: 'ADMIN',
    bio: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
};

const makeToken = (role: string) => {
    const payload = btoa(
        JSON.stringify({ userId: 'u1', role, exp: Math.floor(Date.now() / 1000) + 3600 }),
    );
    return `header.${payload}.signature`;
};

const renderSidebar = (user: AuthUser, initialPath = '/admin/dashboard') => {
    localStorage.setItem('twk_access_token', makeToken(user.role));
    mockedQuery.mockReturnValue({
        data: { success: true, data: user },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
    });
    const store = setupStore({ auth: { user } });
    return render(
        <AntApp>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={[initialPath]}>
                        <AdminSidebar />
                    </MemoryRouter>
                </I18nextProvider>
            </Provider>
        </AntApp>,
    );
};

describe('AdminSidebar', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
    });

    it('shows all items for ADMIN', () => {
        renderSidebar({ ...baseUser, role: 'ADMIN' });
        expect(screen.getByRole('link', { name: 'Customers' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Reports' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument();
    });

    it('hides unauthorized items for CUSTOMER', () => {
        renderSidebar({ ...baseUser, role: 'CUSTOMER' });
        expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Daily Menu' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Customers' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Reports' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Payments' })).not.toBeInTheDocument();
    });

    it('navigates when a menu item is clicked', async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn();
        localStorage.setItem('twk_access_token', makeToken('ADMIN'));
        mockedQuery.mockReturnValue({
            data: { success: true, data: baseUser },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        });
        const store = setupStore({ auth: { user: baseUser } });
        render(
            <AntApp>
                <Provider store={store}>
                    <I18nextProvider i18n={i18n}>
                        <MemoryRouter initialEntries={['/admin/dashboard']}>
                            <AdminSidebar onNavigate={onNavigate} />
                        </MemoryRouter>
                    </I18nextProvider>
                </Provider>
            </AntApp>,
        );
        await user.click(screen.getByRole('link', { name: 'Orders' }));
        expect(onNavigate).toHaveBeenCalledTimes(1);
    });
});
