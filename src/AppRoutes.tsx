import { RouteObject, useRoutes, Navigate } from 'react-router';
import { ReactNode, lazy } from 'react';
import { ROUTES } from 'core/base/const/routes';
import { AuthService } from 'core/http/auth.service';
import App from 'App';

const HomePage = lazy(() => import('pages/Home/Home.tsx'));
const SamplePage = lazy(() => import('pages/Test/Test.tsx'));
const LoginPage = lazy(() => import('pages/Login/Login.tsx'));
const SignupPage = lazy(() => import('pages/Signup/Signup.tsx'));

type GuestOnlyProps = {
  children: ReactNode;
};

type RequireAuthProps = {
  children: ReactNode;
};

export const GuestOnly = ({ children }: GuestOnlyProps) => {
  if (AuthService.isAuthenticated()) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return children;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

export const AppRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.TEST,
        element: (
          <RequireAuth>
            <SamplePage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: ROUTES.SIGNUP,
        element: (
          <GuestOnly>
            <SignupPage />
          </GuestOnly>
        ),
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
];

export type { RouteObject };
export { useRoutes };