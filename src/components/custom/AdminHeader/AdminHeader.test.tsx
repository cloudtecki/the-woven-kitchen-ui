import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import i18n from '../../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import type { AuthUser } from 'core/base/type/auth';
import { useGetCurrentUserQuery } from 'core/api/auth';
import AdminHeader from './AdminHeader';

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

const makeToken = (role: string) => {
  const payload = btoa(
    JSON.stringify({
      userId: 'u1',
      role,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  );
  return `header.${payload}.signature`;
};

const renderHeader = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem('twk_access_token', makeToken(user.role));
  }
  mockedQuery.mockReturnValue({
    data: user ? { success: true, data: user } : undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  });
  const store = setupStore(user ? { auth: { user } } : undefined);
  return render(
    <AntApp>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <Routes>
              <Route path="/admin/dashboard" element={<AdminHeader />} />
              <Route path="/login" element={<div>LoginLayout</div>} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    </AntApp>,
  );
};

describe('AdminHeader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('displays the username and role from user data', () => {
    renderHeader(adminUser);
    expect(screen.getByText('Admin One')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('logs out, clears the session and redirects to login', async () => {
    const user = userEvent.setup();
    renderHeader(adminUser);
    expect(localStorage.getItem('twk_access_token')).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    const logoutItem = await screen.findByText('Logout');
    await user.click(logoutItem);
    expect(await screen.findByText('LoginLayout')).toBeInTheDocument();
    expect(localStorage.getItem('twk_access_token')).toBeNull();
  });

  it('shows the notification bell with unread count', async () => {
    const user = userEvent.setup();
    renderHeader(adminUser);
    expect(
      screen.getByRole('button', { name: 'Notifications' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(await screen.findByText('New order received')).toBeInTheDocument();
  });
});
