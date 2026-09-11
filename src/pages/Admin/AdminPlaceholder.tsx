import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import { useCurrentUser } from 'common/hooks/useCurrentUser';

import './AdminPlaceholder.scss';

export type AdminPlaceholderProps = {
    titleKey: string;
    descriptionKey: string;
};

/**
 * Sprint 2 placeholder for admin sections. Navigation + route guards are the
 * deliverable; business content for each section lands in later sprints.
 */
export const AdminPlaceholder = ({ titleKey, descriptionKey }: AdminPlaceholderProps) => {
    const { t } = useTranslation(['admin']);
    const { user, role } = useCurrentUser();

    return (
        <div className="twk-admin-page">
            <Typography.Title level={2} className="twk-admin-page__title">
                {t(titleKey)}
            </Typography.Title>
            <Typography.Paragraph className="twk-admin-page__description">
                {t(descriptionKey)}
            </Typography.Paragraph>
            {user && role && (
                <Typography.Text className="twk-admin-page__user" type="secondary">
                    {t('pages.signedInAs', {
                        name: user.name,
                        role: t(`roles.${role}`),
                    })}
                </Typography.Text>
            )}
        </div>
    );
};

export default AdminPlaceholder;
