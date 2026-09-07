import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import FoodAnimation, {
    FoodAnimationVariant,
} from 'components/custom/FoodAnimation';
import ChefMascot from 'components/custom/ChefMascot';
import { BrandMarkIcon } from 'components/custom/AuthIcons';

import './AuthShell.scss';

export type AuthFeature = {
    icon: ReactNode;
    title: string;
    text: string;
};

export type AuthShellProps = {
    variant: FoodAnimationVariant;
    heroTitle: ReactNode;
    heroSubtitle: ReactNode;
    badgeIcon: ReactNode;
    badgeText: string;
    cardTitle: string;
    cardSubtitle?: string;
    features?: AuthFeature[];
    heroBadges?: string[];
    children: ReactNode;
};

const AuthShell = ({
    variant,
    heroTitle,
    heroSubtitle,
    badgeIcon,
    badgeText,
    cardTitle,
    cardSubtitle,
    features,
    heroBadges,
    children,
}: AuthShellProps) => {
    const { t } = useTranslation(['auth']);
    const animationLabel =
        variant === 'login'
            ? t('animation.loginAria')
            : t('animation.signupAria');
    const mascotLabel =
        variant === 'login' ? t('mascot.loginAria') : t('mascot.signupAria');

    return (
        <div className={`twk-auth-page twk-auth-page--${variant}`}>
            <div className="twk-auth-shell">
                <section className="twk-auth-shell__hero">
                    <div className="twk-auth-shell__brand">
                        <BrandMarkIcon className="twk-auth-shell__logo" />
                        <div className="twk-auth-shell__brand-text">
                            <span className="twk-auth-shell__brand-line1">
                                {t('brand.line1')}
                            </span>
                            <span className="twk-auth-shell__brand-line2">
                                {t('brand.line2')}
                            </span>
                        </div>
                    </div>
                    <h1 className="twk-auth-shell__headline">{heroTitle}</h1>
                    <p className="twk-auth-shell__sub">{heroSubtitle}</p>
                    <div className="twk-auth-shell__art">
                        <FoodAnimation variant={variant} ariaLabel={animationLabel} />
                    </div>
                    {heroBadges && heroBadges.length > 0 && (
                        <ul className="twk-auth-shell__hero-badges">
                            {heroBadges.map((badge) => (
                                <li key={badge}>{badge}</li>
                            ))}
                        </ul>
                    )}
                    <div className="twk-auth-shell__badge">
                        <span className="twk-auth-shell__badge-icon">{badgeIcon}</span>
                        <span>{badgeText}</span>
                    </div>
                </section>
                <section className="twk-auth-shell__form">
                    <div className="twk-auth-card">
                        <ChefMascot variant={variant} label={mascotLabel} />
                        <h2 className="twk-auth-card__title">{cardTitle}</h2>
                        {cardSubtitle && (
                            <p className="twk-auth-card__subtitle">{cardSubtitle}</p>
                        )}
                        {children}
                    </div>
                </section>
            </div>
            {features && features.length > 0 && (
                <footer className="twk-auth-features">
                    {features.map((feature) => (
                        <div className="twk-auth-features__item" key={feature.title}>
                            <span className="twk-auth-features__icon">{feature.icon}</span>
                            <span className="twk-auth-features__title">{feature.title}</span>
                            <span className="twk-auth-features__text">{feature.text}</span>
                        </div>
                    ))}
                </footer>
            )}
        </div>
    );
};

export default AuthShell;
