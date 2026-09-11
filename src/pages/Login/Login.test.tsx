import { ReactElement } from 'react';
import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import i18n from '../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import LoginPage from './Login';
import { useLoginMutation } from 'core/api/auth';

vi.mock('core/api/auth', () => ({
    useLoginMutation: vi.fn(),
}));

const loginTrigger = vi.fn();

const mockLoginHook = (isLoading = false) => {
    (useLoginMutation as unknown as Mock).mockReturnValue([
        loginTrigger,
        { isLoading },
    ]);
};

const renderLogin = (ui: ReactElement) => {
    const store = setupStore();
    return render(
        <AntApp>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={['/login']}>
                        <Routes>
                            <Route path="/login" element={ui} />
                            <Route path="/signup" element={<div>SignupLayout</div>} />
                            <Route path="/" element={<div>HomeLayout</div>} />
                            <Route
                                path="/admin/dashboard"
                                element={<div>AdminDashboardLayout</div>}
                            />
                        </Routes>
                    </MemoryRouter>
                </I18nextProvider>
            </Provider>
        </AntApp>,
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mockLoginHook();
    });

    it('renders the login page with email and password fields', () => {
        renderLogin(<LoginPage />);
        expect(
            screen.getByRole('heading', { name: 'Login to Your Account' }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Login' }),
        ).toBeInTheDocument();
    });

    it('renders the hero, badge, trust features and social options', () => {
        renderLogin(<LoginPage />);
        expect(screen.getByText('Welcome')).toBeInTheDocument();
        expect(screen.getByText('Back!')).toBeInTheDocument();
        expect(screen.getByText('Great taste, every time!')).toBeInTheDocument();
        expect(screen.getByText('Wide Menu')).toBeInTheDocument();
        expect(screen.getByText('Expert Chefs')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Forgot Password?' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Google' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Facebook' }),
        ).toBeInTheDocument();
    });

    it('shows required-field validation errors on empty submit', async () => {
        const user = userEvent.setup();
        renderLogin(<LoginPage />);
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(
            await screen.findByText('Email Address is required'),
        ).toBeInTheDocument();
        expect(await screen.findByText('Password is required')).toBeInTheDocument();
        expect(loginTrigger).not.toHaveBeenCalled();
    });

    it('rejects an invalid email value', async () => {
        const user = userEvent.setup();
        renderLogin(<LoginPage />);
        await user.type(screen.getByLabelText('Email Address'), 'not-an-email');
        await user.type(screen.getByLabelText('Password'), 'StrongPassword123');
        await user.click(screen.getByRole('button', { name: 'Login' }));
        expect(
            await screen.findByText('Enter a valid email address'),
        ).toBeInTheDocument();
        expect(loginTrigger).not.toHaveBeenCalled();
    });

    it('submits a trimmed email to the login API', async () => {
        const user = userEvent.setup();
        const token = 'jwt-token';
        const userData = {
            id: 'u1',
            name: 'Customer One',
            email: 'customer@example.com',
            phone: '9876543210',
            role: 'CUSTOMER' as const,
            bio: null,
            isActive: true,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
        };
        loginTrigger.mockResolvedValue({
            data: {
                success: true,
                data: { token, user: userData },
                message: 'Login successful',
            },
        });

        renderLogin(<LoginPage />);
        await user.type(
            screen.getByLabelText('Email Address'),
            ' customer@example.com ',
        );
        await user.type(screen.getByLabelText('Password'), 'StrongPassword123');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(await screen.findByText('AdminDashboardLayout')).toBeInTheDocument();
        expect(loginTrigger).toHaveBeenCalledWith({
            email: 'customer@example.com',
            password: 'StrongPassword123',
        });
        expect(localStorage.getItem('twk_access_token')).toBe(token);
    });

    it('shows a generic message for invalid credentials', async () => {
        const user = userEvent.setup();
        loginTrigger.mockResolvedValue({
            error: { status: 401, data: 'Invalid email or password' },
        });

        renderLogin(<LoginPage />);
        await user.type(
            screen.getByLabelText('Email Address'),
            'customer@example.com',
        );
        await user.type(screen.getByLabelText('Password'), 'WrongPassword123');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(
            await screen.findByText('Invalid email or password.'),
        ).toBeInTheDocument();
        expect(localStorage.getItem('twk_access_token')).toBeNull();
    });

    it('shows a coming-soon toast for forgot password', async () => {
        const user = userEvent.setup();
        renderLogin(<LoginPage />);
        await user.click(screen.getByRole('button', { name: 'Forgot Password?' }));
        expect(
            await screen.findByText('Coming soon! We are working on it.'),
        ).toBeInTheDocument();
        expect(loginTrigger).not.toHaveBeenCalled();
    });

    it('shows a coming-soon toast for social login', async () => {
        const user = userEvent.setup();
        renderLogin(<LoginPage />);
        await user.click(screen.getByRole('button', { name: 'Google' }));
        expect(
            await screen.findByText('Coming soon! We are working on it.'),
        ).toBeInTheDocument();
        expect(loginTrigger).not.toHaveBeenCalled();
    });

    it('toggles password visibility', async () => {
        const user = userEvent.setup();
        renderLogin(<LoginPage />);
        const passwordInput = screen.getByLabelText('Password');
        expect(passwordInput).toHaveAttribute('type', 'password');

        const toggle = document.querySelector('.ant-input-password-icon');
        expect(toggle).not.toBeNull();
        await user.click(toggle as Element);
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });

    it('navigates to the signup page via the switch link', async () => {
        const user = userEvent.setup();
        renderLogin(<LoginPage />);
        await user.click(screen.getByRole('link', { name: 'Sign up' }));
        expect(await screen.findByText('SignupLayout')).toBeInTheDocument();
    });
});
