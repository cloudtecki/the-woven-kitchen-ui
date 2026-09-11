import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, Result } from 'antd';
import { getDefaultPathForRole } from 'core/base/const/navigation';
import { ROUTES } from 'core/base/const/routes';
import { useCurrentUser } from 'common/hooks/useCurrentUser';

import './Forbidden.scss';

const ForbiddenPage = () => {
    const { t } = useTranslation(['admin']);
    const { role, isAuthenticated } = useCurrentUser();
    const backPath = getDefaultPathForRole(role);

    return (
        <div className="twk-forbidden">
            <Result
                status="403"
                title={t('forbidden.title')}
                subTitle={t('forbidden.message')}
                extra={
                    <Link to={isAuthenticated ? backPath : ROUTES.LOGIN}>
                        <Button type="primary">{t('forbidden.back')}</Button>
                    </Link>
                }
            />
        </div>
    );
};

export default ForbiddenPage;
