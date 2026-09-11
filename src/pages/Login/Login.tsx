import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Divider, Form, Input } from 'antd';
import AuthShell, { AuthFeature } from 'components/custom/AuthShell';
import {
    BowlIcon,
    ChefHatIcon,
    ClockIcon,
    ClocheIcon,
    FacebookIcon,
    GoogleIcon,
    LeafIcon,
    SmileIcon,
} from 'components/custom/AuthIcons';
import { useLoginMutation } from 'core/api/auth';
import { setAuthUser } from 'core/api/auth/auth.slice';
import { ROUTES } from 'core/base/const/routes';
import { EMAIL_REGEX } from 'core/base/const/validation';
import { LoginRequest } from 'core/base/type/auth';
import { AuthService } from 'core/http/auth.service';
import { useAppDispatch } from 'core/store/useAppDispatch';

import './Login.scss';

type LoginFormValues = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { t } = useTranslation(['auth']);
    const { message } = AntApp.useApp();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm<LoginFormValues>();
    const [login, { isLoading }] = useLoginMutation();
    const [submitting, setSubmitting] = useState(false);

    const busy = isLoading || submitting;

    const onFinish = async (values: LoginFormValues) => {
        if (busy) {
            return;
        }
        setSubmitting(true);
        try {
            const payload: LoginRequest = {
                email: values.email.trim(),
                password: values.password,
            };
            const result = await login(payload);
            if (result.data) {
                AuthService.setAuthTokens(result.data.data.token);
                dispatch(setAuthUser(result.data.data.user));
                message.success(t('login.successMessage'));
                navigate(ROUTES.ADMIN_DASHBOARD);
                return;
            }
            const errorPayload = result.error as { status?: number } | undefined;
            if (errorPayload?.status === 400 || errorPayload?.status === 401) {
                message.error(t('login.invalidCredentialsMessage'));
            } else {
                message.error(t('login.genericErrorMessage'));
            }
        } catch {
            message.error(t('login.genericErrorMessage'));
        } finally {
            setSubmitting(false);
        }
    };

    const showComingSoon = () => {
        message.info(t('login.comingSoonMessage'));
    };

    const features: AuthFeature[] = [
        { icon: <ClocheIcon />, title: t('features.menuTitle'), text: t('features.menuText') },
        { icon: <ChefHatIcon />, title: t('features.chefsTitle'), text: t('features.chefsText') },
        { icon: <ClockIcon />, title: t('features.timelyTitle'), text: t('features.timelyText') },
        { icon: <SmileIcon />, title: t('features.happyTitle'), text: t('features.happyText') },
    ];

    return (
        <AuthShell
            variant="login"
            heroTitle={
                <>
                    <span className="twk-hl-light">{t('hero.loginTitle1')}</span>
                    <span className="twk-hl-lime">{t('hero.loginTitle2')}</span>
                </>
            }
            heroSubtitle={
                <>
                    {t('hero.loginSubtitle')}
                    <span className="twk-auth-shell__sub-icon twk-hl-lime">
                        <LeafIcon />
                    </span>
                </>
            }
            badgeIcon={<BowlIcon />}
            badgeText={t('hero.loginBadge')}
            cardTitle={t('login.title')}
            cardSubtitle={t('login.subtitle')}
            features={features}
        >
            <Form<LoginFormValues>
                form={form}
                layout="vertical"
                requiredMark={false}
                className="twk-auth-form twk-login-form"
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: t('login.emailRequired'),
                        },
                        {
                            validator: (_, value?: string) => {
                                const currentValue = value?.trim() ?? '';
                                if (!currentValue) {
                                    return Promise.resolve();
                                }
                                if (!EMAIL_REGEX.test(currentValue)) {
                                    return Promise.reject(
                                        new Error(t('login.emailInvalid')),
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder={t('login.emailPlaceholder')}
                        autoComplete="email"
                        allowClear
                        aria-label={t('login.email')}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: t('login.passwordRequired'),
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder={t('login.passwordPlaceholder')}
                        autoComplete="current-password"
                        aria-label={t('login.password')}
                    />
                </Form.Item>
                <div className="twk-login-form__forgot">
                    <Button type="link" onClick={showComingSoon}>
                        {t('login.forgotPassword')}
                    </Button>
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="twk-auth-submit"
                    loading={busy}
                    disabled={busy}
                >
                    {busy ? t('login.submitting') : t('login.submit')}
                    <span className="twk-auth-submit__badge" aria-hidden="true">
                        <ChefHatIcon />
                    </span>
                </Button>
            </Form>
            <p className="twk-auth-switch">
                {t('login.noAccount')} <Link to={ROUTES.SIGNUP}>{t('login.signupLink')}</Link>
            </p>
            <Divider plain className="twk-login-form__divider">
                {t('login.orContinueWith')}
            </Divider>
            <div className="twk-login-form__social">
                <Button
                    className="twk-login-form__social-button"
                    onClick={showComingSoon}
                    aria-label={t('login.google')}
                >
                    <GoogleIcon className="twk-login-form__social-icon" />
                    {t('login.google')}
                </Button>
                <Button
                    className="twk-login-form__social-button"
                    onClick={showComingSoon}
                    aria-label={t('login.facebook')}
                >
                    <FacebookIcon className="twk-login-form__social-icon" />
                    {t('login.facebook')}
                </Button>
            </div>
        </AuthShell>
    );
};

export default LoginPage;
