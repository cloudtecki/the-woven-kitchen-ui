import { RouteObject, useRoutes, Navigate } from 'react-router';
import { ReactNode, lazy } from 'react';
import { ROUTES } from 'core/base/const/routes';
import { NAVIGATION_ITEMS } from 'core/base/const/navigation';
import type { AuthRole } from 'core/base/type/auth';
import { AuthService } from 'core/http/auth.service';
import ProtectedRoute from 'components/custom/ProtectedRoute';
import AdminLayout from 'Layout/AdminLayout';
import App from 'App';

const SamplePage = lazy(() => import('pages/Test/Test.tsx'));
const LoginPage = lazy(() => import('pages/Login/Login.tsx'));
const SignupPage = lazy(() => import('pages/Signup/Signup.tsx'));
const ForbiddenPage = lazy(() => import('pages/Forbidden/Forbidden.tsx'));
const DashboardPage = lazy(() => import('pages/Admin/Dashboard/Dashboard.tsx'));
const CustomersPage = lazy(() => import('pages/Admin/Customers/Customers.tsx'));
const MenuPage = lazy(() => import('pages/Admin/Menu/Menu.tsx'));
const DailyMenuPage = lazy(() => import('pages/Admin/DailyMenu/DailyMenu.tsx'));
const OrdersPage = lazy(() => import('pages/Admin/Orders/Orders.tsx'));
const PaymentsPage = lazy(() => import('pages/Admin/Payments/Payments.tsx'));
const DeliveriesPage = lazy(() => import('pages/Admin/Deliveries/Deliveries.tsx'));
const ExpensesPage = lazy(() => import('pages/Admin/Expenses/Expenses.tsx'));
const ReportsPage = lazy(() => import('pages/Admin/Reports/Reports.tsx'));
const SettingsPage = lazy(() => import('pages/Admin/Settings/Settings.tsx'));

type GuestOnlyProps = {
  children: ReactNode;
};

type RequireAuthProps = {
  children: ReactNode;
};

export const GuestOnly = ({ children }: GuestOnlyProps) => {
  if (AuthService.isAuthenticated()) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }
  return children;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

/**
 * Single permission source: role lists come from NAVIGATION_ITEMS, the same
 * table the sidebar filters on. Never hardcode roles per route here.
 */
const rolesFor = (path: string): AuthRole[] =>
  NAVIGATION_ITEMS.find((item) => item.path === path)?.allowedRoles ?? [];

const adminChild = (path: string, page: ReactNode) => ({
  path,
  element: <ProtectedRoute allowedRoles={rolesFor(path)}>{page}</ProtectedRoute>,
});

export const AppRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <RequireAuth>
            <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
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
        path: ROUTES.FORBIDDEN,
        element: (
          <RequireAuth>
            <ForbiddenPage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.ADMIN,
        element: (
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
          },
          adminChild(ROUTES.ADMIN_DASHBOARD, <DashboardPage />),
          adminChild(ROUTES.ADMIN_CUSTOMERS, <CustomersPage />),
          adminChild(ROUTES.ADMIN_MENU, <MenuPage />),
          adminChild(ROUTES.ADMIN_DAILY_MENU, <DailyMenuPage />),
          adminChild(ROUTES.ADMIN_ORDERS, <OrdersPage />),
          adminChild(ROUTES.ADMIN_PAYMENTS, <PaymentsPage />),
          adminChild(ROUTES.ADMIN_DELIVERIES, <DeliveriesPage />),
          adminChild(ROUTES.ADMIN_EXPENSES, <ExpensesPage />),
          adminChild(ROUTES.ADMIN_REPORTS, <ReportsPage />),
          adminChild(ROUTES.ADMIN_SETTINGS, <SettingsPage />),
        ],
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
