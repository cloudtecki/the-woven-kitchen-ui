export const PHONE_REGEX = /^[6-9]\d{9}$/;

export const PHONE_ERROR_MESSAGE =
  'Phone number must be a valid 10-digit Indian mobile number (e.g. 9876543210)';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,64}$/;

export const PASSWORD_POLICY_MESSAGE =
  'Password must be 8-64 characters long and include at least one uppercase letter, one lowercase letter, and one number, without spaces';

export const NAME_MAX_LENGTH = 100;
export const BIO_MAX_LENGTH = 500;
// Stricter client-side limit for the signup UI (reference design shows a 0/120 counter)
export const SIGNUP_BIO_MAX_LENGTH = 120;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizePhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits;
};

export const isValidPhone = (value: string): boolean =>
  PHONE_REGEX.test(normalizePhone(value));

export const normalizeEmail = (value: string): string =>
  value.trim().toLowerCase();

export const USER_ROLES = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
} as const;