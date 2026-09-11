import { useEffect } from 'react';
import { useGetCurrentUserQuery } from 'core/api/auth';
import { setAuthUser } from 'core/api/auth/auth.slice';
import type { AuthRole, AuthUser } from 'core/base/type/auth';
import { AuthService } from 'core/http/auth.service';
import { useAppDispatch } from 'core/store/useAppDispatch';
import { useAppSelector } from 'core/store/useAppSelector';

export type CurrentUserState = {
    user: AuthUser | null;
    role: AuthRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
};

/**
 * Single source of truth for the authenticated user.
 * - Token check is synchronous via AuthService (JWT exp).
 * - Profile comes from Redux; on reload (Redux empty, token valid) the
 *   `GET /api/users/me` query hydrates it exactly once per mount chain.
 * - While the profile loads, callers must show loading state and must NOT
 *   redirect or render role-filtered UI prematurely.
 */
export const useCurrentUser = (): CurrentUserState => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const isAuthenticated = AuthService.isAuthenticated();

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetCurrentUserQuery(undefined, { skip: !isAuthenticated });

    useEffect(() => {
        if (data?.data && data.data.id !== user?.id) {
            dispatch(setAuthUser(data.data));
        }
    }, [data, user?.id, dispatch]);

    const effectiveUser = data?.data ?? user;

    return {
        user: effectiveUser ?? null,
        role: effectiveUser?.role ?? null,
        isAuthenticated,
        isLoading: isAuthenticated && !effectiveUser && (isLoading || isFetching),
        isError,
        refetch,
    };
};

export default useCurrentUser;
