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
import SignupPage from './Signup';
import { useSignupMutation } from 'core/api/auth';

vi.mock('core/api/auth', () => ({
    useSignupMutation: vi.fn(),
}));

const signupTrigger = vi.fn();

const mockSignupHook = (isLoading = false) => {
    (useSignupMutation as unknown as Mock).mockReturnValue([
        signupTrigger,
        { isLoading },
    ]);
};

const renderSignup = (ui: ReactElement) => {
    const store = setupStore();
    return render(
        <AntApp>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={['/signup']}>
                        <Routes>
                            <Route path="/signup" element={ui} />
                            <Route path="/login" element={<div>LoginLayout</div>} />
                            <Route path="/" element={<div>HomeLayout</div>} />
                        </Routes>
                    </MemoryRouter>
                </I18nextProvider>
            </Provider>
        </AntApp>,
    );
};

const validFormValues = {
    name: 'Customer One',
    phone: '+91 98765 43210',
    email: 'customer@example.com',
    password: 'StrongPassword123',
    confirmPassword: 'StrongPassword123',
};

const successfulResponse = {
    data: {
        success: true,
        data: {
            id: 'u1',
            name: 'Customer One',
            email: 'customer@example.com',
            phone: '9876543210',
            role: 'CUSTOMER' as const,
            bio: null,
            isActive: true,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
        },
        message: 'Signup successful',
    },
};

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Full Name'), validFormValues.name);
    await user.type(screen.getByLabelText('Mobile Number'), validFormValues.phone);
    await user.type(screen.getByLabelText('Email Address'), validFormValues.email);
    await user.type(screen.getByLabelText('Password'), validFormValues.password);
    await user.type(
        screen.getByLabelText('Confirm Password'),
        validFormValues.confirmPassword,
    );
};

describe('SignupPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mockSignupHook();
    });

    it('renders the signup page with all required fields', () => {
        renderSignup(<SignupPage />);
        expect(
            screen.getByRole('heading', { name: 'Create Your Account' }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Alternate Mobile Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Bio')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Mobile Number *'),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Alternate Mobile Number (Optional)'),
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email Address *')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Bio (Optional)')).toBeInTheDocument();
        expect(screen.getByText('0/120')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Terms & Conditions' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Privacy Policy' }),
        ).toBeInTheDocument();
    });

    it('updates the bio character counter as the user types', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await user.type(screen.getByLabelText('Bio'), 'Yum');
        expect(screen.getByText('3/120')).toBeInTheDocument();
    });

    it('shows a coming-soon toast for the legal links', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await user.click(
            screen.getByRole('button', { name: 'Terms & Conditions' }),
        );
        expect(
            await screen.findByText('Coming soon! We are working on it.'),
        ).toBeInTheDocument();
        expect(signupTrigger).not.toHaveBeenCalled();
    });

    it('renders the hero, badge and compact trust badges', () => {
        renderSignup(<SignupPage />);
        expect(screen.getByText('Join')).toBeInTheDocument();
        // "The Woven" and "Cloud Kitchen" appear in both the brand mark and the headline
        expect(screen.getAllByText('The Woven')).toHaveLength(2);
        expect(screen.getAllByText('Cloud Kitchen')).toHaveLength(2);
        expect(
            screen.getByText('Delicious meals at your doorstep'),
        ).toBeInTheDocument();
        expect(screen.getByText('Fresh Ingredients')).toBeInTheDocument();
        expect(screen.getByText('Home-style Meals')).toBeInTheDocument();
        expect(screen.getByText('Made With Love')).toBeInTheDocument();
        // The large bottom feature strip is omitted so the form fits the viewport
        expect(screen.queryByText('Safe & Secure')).not.toBeInTheDocument();
        expect(screen.queryByText('Fast Delivery')).not.toBeInTheDocument();
    });

    it('requires consent agreement before submission', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        await user.click(screen.getByRole('button', { name: 'Create Account' }));
        expect(
            await screen.findByText(
                'Please agree to the Terms & Conditions to continue',
            ),
        ).toBeInTheDocument();
        expect(signupTrigger).not.toHaveBeenCalled();
    });

    it('rejects an invalid email', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        const emailInput = screen.getByLabelText('Email Address');
        await user.clear(emailInput);
        await user.type(emailInput, 'not-an-email');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));
        expect(
            await screen.findByText('Enter a valid email address'),
        ).toBeInTheDocument();
        expect(signupTrigger).not.toHaveBeenCalled();
    });

    it('rejects an invalid primary phone number', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        const phoneInput = screen.getByLabelText('Mobile Number');
        await user.clear(phoneInput);
        await user.type(phoneInput, '12345');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));
        expect(
            await screen.findByText('Enter a valid 10-digit Indian mobile number'),
        ).toBeInTheDocument();
        expect(signupTrigger).not.toHaveBeenCalled();
    });

    it('rejects an alternate phone equal to the primary phone', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        await user.type(
            screen.getByLabelText('Alternate Mobile Number'),
            '9876543210',
        );
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));
        expect(
            await screen.findByText(
                'Alternate mobile number cannot be the same as the primary mobile number',
            ),
        ).toBeInTheDocument();
        expect(signupTrigger).not.toHaveBeenCalled();
    });

    it('rejects a password that violates the policy', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        const passwordInput = screen.getByLabelText('Password');
        const confirmInput = screen.getByLabelText('Confirm Password');
        await user.clear(passwordInput);
        await user.clear(confirmInput);
        await user.type(passwordInput, 'weakpassword');
        await user.type(confirmInput, 'weakpassword');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));
        expect(
            await screen.findByText(
                'Password must be 8-64 characters and include an uppercase letter, a lowercase letter, and a number, without spaces',
            ),
        ).toBeInTheDocument();
        expect(signupTrigger).not.toHaveBeenCalled();
    });

    it('rejects a confirm password mismatch', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        const confirmInput = screen.getByLabelText('Confirm Password');
        await user.click(confirmInput);
        await user.clear(confirmInput);
        await user.type(confirmInput, 'DifferentPassword123');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));
        expect(
            await screen.findByText('Passwords do not match'),
        ).toBeInTheDocument();
        expect(signupTrigger).not.toHaveBeenCalled();
    });

    it('submits a normalized payload to the signup API and redirects to login', async () => {
        const user = userEvent.setup();
        signupTrigger.mockResolvedValue(successfulResponse);

        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        await user.type(
            screen.getByLabelText('Alternate Mobile Number'),
            '9123456780',
        );
        await user.type(screen.getByLabelText('Bio'), 'Home-style food lover.');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));

        expect(await screen.findByText('LoginLayout')).toBeInTheDocument();
        expect(signupTrigger).toHaveBeenCalledWith({
            name: 'Customer One',
            email: 'customer@example.com',
            phone: '9876543210',
            alternatePhone: '9123456780',
            password: 'StrongPassword123',
            bio: 'Home-style food lover.',
        });
    });

    it('displays the duplicate email error close to the email field', async () => {
        const user = userEvent.setup();
        signupTrigger.mockResolvedValue({
            error: { status: 409, data: 'Email already registered' },
        });

        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));

        expect(
            await screen.findByText('Email already registered'),
        ).toBeInTheDocument();
        const emailItem = screen.getByLabelText('Email Address').closest('.ant-form-item');
        expect(emailItem).toHaveClass('ant-form-item-has-error');
    });

    it('displays the duplicate mobile error close to the phone field', async () => {
        const user = userEvent.setup();
        signupTrigger.mockResolvedValue({
            error: { status: 409, data: 'Phone number is already registered' },
        });

        renderSignup(<SignupPage />);
        await fillRequiredFields(user);
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Create Account' }));

        expect(
            await screen.findByText('Mobile number already registered'),
        ).toBeInTheDocument();
        const phoneItem = screen.getByLabelText('Mobile Number').closest(
            '.ant-form-item',
        );
        expect(phoneItem).toHaveClass('ant-form-item-has-error');
    });

    it('toggles password visibility for both password fields', async () => {
        const user = userEvent.setup();
        renderSignup(<SignupPage />);
        const passwordInput = screen.getByLabelText('Password');
        expect(passwordInput).toHaveAttribute('type', 'password');

        const toggles = document.querySelectorAll('.ant-input-password-icon');
        await user.click(toggles[0] as Element);
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });
});