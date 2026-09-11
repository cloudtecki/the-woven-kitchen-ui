import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { clearAuthUser } from 'core/api/auth/auth.slice';
import type { AuthRole } from 'core/base/type/auth';
import { ROUTES } from 'core/base/const/routes';
import { useAppDispatch } from 'core/store/useAppDispatch';
import { AuthService } from 'core/http/auth.service';
import { useCurrentUser } from 'common/hooks/useCurrentUser';

import './ProtectedRoute.scss';

export type ProtectedRouteProps = {
    children: ReactNode;
    /** When set, the authenticated user's role must be included. */
    allowedRoles?: AuthRole[];
};

/**
 * Reusable route guard: Authentication check → Role authorization check →
 * allow, loading, or redirect. Sidebar filtering alone is not authorization;
 * every role-restricted route must pass through here.
 */
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { t } = useTranslation(['admin']);
    const dispatch = useAppDispatch();
    const { user, role, isAuthenticated, isLoading, isError } = useCurrentUser();

    // Token exists but profile fetch failed (revoked/expired server-side):
    // drop the stale session so the user lands on Login, not a blank shell.
    useEffect(() => {
        if (isAuthenticated && isError && !user) {
            AuthService.clearAuth();
            dispatch(clearAuthUser());
        }
    }, [isAuthenticated, isError, user, dispatch]);

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (isLoading || (isAuthenticated && !user && !isError)) {
        return (
            <div className="twk-protected-route__loading" role="status" aria-live="polite">
                <Spin size="large" aria-label={t('loading.message')} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role as AuthRole)) {
        return <Navigate to={ROUTES.FORBIDDEN} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
