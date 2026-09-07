import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import {
    EditOutlined,
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    PhoneOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { App as AntApp, Button, Checkbox, Form, Input } from 'antd';
import AuthShell from 'components/custom/AuthShell';
import {
    ChefHatIcon,
    HeartIcon,
    ScooterIcon,
} from 'components/custom/AuthIcons';
import { useSignupMutation } from 'core/api/auth';
import { ROUTES } from 'core/base/const/routes';
import {
    EMAIL_REGEX,
    NAME_MAX_LENGTH,
    PASSWORD_REGEX,
    SIGNUP_BIO_MAX_LENGTH,
    normalizeEmail,
    normalizePhone,
    isValidPhone,
} from 'core/base/const/validation';
import { SignupRequest } from 'core/base/type/auth';

import './Signup.scss';

type SignupFormValues = {
    name: string;
    phone: string;
    alternatePhone?: string;
    email: string;
    password: string;
    confirmPassword: string;
    bio?: string;
    consent: boolean;
};

const SignupPage = () => {
    const { t } = useTranslation(['auth']);
    const { message } = AntApp.useApp();
    const navigate = useNavigate();
    const [form] = Form.useForm<SignupFormValues>();
    const [signup, { isLoading }] = useSignupMutation();
    const [submitting, setSubmitting] = useState(false);
    const bioValue = Form.useWatch('bio', form) ?? '';

    const busy = isLoading || submitting;

    const showComingSoon = () => {
        message.info(t('signup.comingSoonMessage'));
    };

    const onFinish = async (values: SignupFormValues) => {
        if (busy) {
            return;
        }
        setSubmitting(true);
        try {
            const payload: SignupRequest = {
                name: values.name.trim(),
                email: normalizeEmail(values.email),
                phone: normalizePhone(values.phone),
                password: values.password,
            };
            if (values.alternatePhone) {
                payload.alternatePhone = normalizePhone(values.alternatePhone);
            }
            if (values.bio?.trim()) {
                payload.bio = values.bio.trim();
            }

            const result = await signup(payload);
            if (result.data) {
                message.success(t('signup.successMessage'));
                navigate(ROUTES.LOGIN);
                return;
            }
            const errorPayload = result.error as { data?: unknown } | undefined;
            const errorMessage =
                typeof errorPayload?.data === 'string' ? errorPayload.data : '';
            if (/email/i.test(errorMessage)) {
                form.setFields([
                    { name: 'email', errors: [t('signup.emailDuplicationError')] },
                ]);
                return;
            }
            if (/mobile|phone/i.test(errorMessage)) {
                form.setFields([
                    { name: 'phone', errors: [t('signup.mobileDuplicationError')] },
                ]);
                return;
            }
            message.error(t('signup.genericErrorMessage'));
        } catch {
            message.error(t('signup.genericErrorMessage'));
        } finally {
            setSubmitting(false);
        }
    };

    const validateEmailOrEmpty = (value?: string, invalidMessage?: string) => {
        const currentValue = (value ?? '').trim();
        if (!currentValue) {
            return Promise.resolve();
        }
        if (!EMAIL_REGEX.test(currentValue)) {
            return Promise.reject(
                new Error(invalidMessage ?? t('signup.emailInvalid')),
            );
        }
        return Promise.resolve();
    };

    // Compact trust badges live in the hero so the form always fits the viewport.
    const heroBadges = [
        t('features.freshTitle'),
        t('hero.signupBadgeMeals'),
        t('features.loveTitle'),
    ];

    return (
        <AuthShell
            variant="signup"
            heroTitle={
                <>
                    <span className="twk-hl-dark">{t('hero.signupTitle1')}</span>
                    <span className="twk-hl-green">{t('hero.signupTitle2')}</span>
                    <span className="twk-hl-dark">{t('hero.signupTitle3')}</span>
                </>
            }
            heroSubtitle={
                <>
                    {t('hero.signupSubtitle')}
                    <span className="twk-auth-shell__sub-icon twk-hl-green">
                        <HeartIcon />
                    </span>
                </>
            }
            badgeIcon={<ScooterIcon />}
            badgeText={t('hero.signupBadge')}
            cardTitle={t('signup.title')}
            cardSubtitle={t('signup.subtitle')}
            heroBadges={heroBadges}
        >
            <Form<SignupFormValues>
                form={form}
                layout="vertical"
                requiredMark={false}
                className="twk-auth-form twk-signup-form"
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: t('signup.fullNameRequired'),
                        },
                        {
                            max: NAME_MAX_LENGTH,
                            message: t('signup.fullNameMax'),
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder={t('signup.fullNamePlaceholder')}
                        autoComplete="name"
                        aria-label={t('signup.fullName')}
                    />
                </Form.Item>
                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: t('signup.mobileRequired'),
                        },
                        {
                            validator: (_, value?: string) => {
                                const currentValue = (value ?? '').trim();
                                if (!currentValue) {
                                    return Promise.resolve();
                                }
                                if (!isValidPhone(currentValue)) {
                                    return Promise.reject(
                                        new Error(t('signup.mobileInvalid')),
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input
                        prefix={<MobileOutlined />}
                        placeholder={t('signup.mobilePlaceholder')}
                        inputMode="tel"
                        autoComplete="tel"
                        aria-label={t('signup.mobile')}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: t('signup.emailRequired'),
                        },
                        {
                            validator: (_, value?: string) =>
                                validateEmailOrEmpty(value),
                        },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder={t('signup.emailPlaceholder')}
                        autoComplete="email"
                        aria-label={t('signup.email')}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: t('signup.passwordRequired'),
                        },
                        {
                            validator: (_, value?: string) => {
                                const currentValue = (value ?? '') as string;
                                if (!currentValue) {
                                    return Promise.resolve();
                                }
                                if (!PASSWORD_REGEX.test(currentValue)) {
                                    return Promise.reject(
                                        new Error(
                                            t('signup.passwordPolicyViolation'),
                                        ),
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t('signup.passwordPlaceholder')}
                        autoComplete="new-password"
                        aria-label={t('signup.password')}
                    />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: t('signup.confirmPasswordRequired'),
                        },
                        {
                            validator: (_, value?: string) => {
                                const currentValue = (value ?? '') as string;
                                if (!currentValue) {
                                    return Promise.resolve();
                                }
                                if (currentValue !== form.getFieldValue('password')) {
                                    return Promise.reject(
                                        new Error(
                                            t('signup.confirmPasswordMismatch'),
                                        ),
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t('signup.confirmPasswordPlaceholder')}
                        autoComplete="new-password"
                        aria-label={t('signup.confirmPassword')}
                    />
                </Form.Item>
                <Form.Item
                    name="alternatePhone"
                    dependencies={['phone']}
                    rules={[
                        {
                            validator: (_, value?: string) => {
                                const currentValue = (value ?? '').trim();
                                if (!currentValue) {
                                    return Promise.resolve();
                                }
                                if (!isValidPhone(currentValue)) {
                                    return Promise.reject(
                                        new Error(
                                            t('signup.alternateMobileInvalid'),
                                        ),
                                    );
                                }
                                const primary = normalizePhone(
                                    (form.getFieldValue('phone') ?? '') as string,
                                );
                                if (primary && normalizePhone(currentValue) === primary) {
                                    return Promise.reject(
                                        new Error(t('signup.alternateMobileSame')),
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder={t('signup.alternateMobilePlaceholder')}
                        inputMode="tel"
                        autoComplete="tel"
                        aria-label={t('signup.alternateMobile')}
                    />
                </Form.Item>
                <Form.Item
                    name="bio"
                    rules={[
                        {
                            max: SIGNUP_BIO_MAX_LENGTH,
                            message: t('signup.bioMax'),
                        },
                    ]}
                >
                    <Input
                        prefix={<EditOutlined />}
                        placeholder={t('signup.bioPlaceholder')}
                        aria-label={t('signup.bio')}
                        maxLength={SIGNUP_BIO_MAX_LENGTH}
                        suffix={
                            <span
                                className="twk-signup-form__count"
                                aria-hidden="true"
                            >{`${bioValue.length}/${SIGNUP_BIO_MAX_LENGTH}`}</span>
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="consent"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value: boolean) => {
                                if (value === true) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(t('signup.consentRequired')),
                                );
                            },
                        },
                    ]}
                >
                    <Checkbox>
                        <span className="twk-signup-form__consent">
                            {t('signup.consentPrefix')}{' '}
                            <button
                                type="button"
                                className="twk-signup-form__terms-link"
                                onClick={showComingSoon}
                            >
                                {t('signup.consentTerms')}
                            </button>
                            <br />
                            {t('signup.consentAnd')}{' '}
                            <button
                                type="button"
                                className="twk-signup-form__terms-link"
                                onClick={showComingSoon}
                            >
                                {t('signup.consentPrivacy')}
                            </button>
                        </span>
                    </Checkbox>
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="twk-auth-submit"
                    loading={busy}
                    disabled={busy}
                >
                    {busy ? t('signup.submitting') : t('signup.submit')}
                    <span className="twk-auth-submit__badge" aria-hidden="true">
                        <ChefHatIcon />
                    </span>
                </Button>
            </Form>
            <p className="twk-auth-switch">
                {t('signup.alreadyHaveAccount')}{' '}
                <Link to={ROUTES.LOGIN}>{t('signup.loginLink')}</Link>
            </p>
        </AuthShell>
    );
};

export default SignupPage;
