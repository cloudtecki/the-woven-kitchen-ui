import type { ComponentType } from 'react';
import {
    BarChartOutlined,
    BookOutlined,
    CalendarOutlined,
    CarOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { ROUTES } from 'core/base/const/routes';
import type { AuthRole } from 'core/base/type/auth';

export interface NavigationItem {
    key: string;
    /** i18n key in the `admin` namespace, e.g. `nav.dashboard`. */
    labelKey: string;
    path: string;
    icon: ComponentType<{ className?: string }>;
    allowedRoles: AuthRole[];
}

const ADMIN: AuthRole = 'ADMIN';
const CUSTOMER: AuthRole = 'CUSTOMER';
const ALL: AuthRole[] = [ADMIN, CUSTOMER];

/**
 * Centralized role-based navigation. Sidebar and route guards must both
 * derive permissions from this table — no hardcoded role checks elsewhere.
 *
 * Backend permission source (backend-twk-admin):
 * - Users list/manage (`GET/PATCH/DELETE /api/users/*`) → ADMIN only
 *   (src/api/routes/user.routes.js + authorizeRoles(ROLES.ADMIN)).
 * - Menu manage (`POST/PATCH/DELETE /api/menu`) → ADMIN only;
 *   tomorrow menu (`GET /api/menu/tomorrow`) → ADMIN + CUSTOMER
 *   (src/api/routes/menu.routes.js).
 * - Orders list/view/create (`GET/POST /api/orders`) → ADMIN + CUSTOMER;
 *   order update (`PATCH /api/orders/:id`) → ADMIN only
 *   (src/api/routes/order.routes.js).
 * - `/api/users/me` (profile) → any authenticated user.
 *
 * ASSUMPTIONS (no backend endpoint exists yet for these areas):
 * Dashboard, Payments, Deliveries, Expenses, Reports are ADMIN-only because
 * they expose business-wide operational/financial data. Settings is shared
 * because it hosts the own-profile section backed by `/api/users/me`.
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        key: 'dashboard',
        labelKey: 'nav.dashboard',
        path: ROUTES.ADMIN_DASHBOARD,
        icon: DashboardOutlined,
        allowedRoles: ALL,
    },
    {
        key: 'customers',
        labelKey: 'nav.customers',
        path: ROUTES.ADMIN_CUSTOMERS,
        icon: TeamOutlined,
        allowedRoles: [ADMIN],
    },
    {
        key: 'menu',
        labelKey: 'nav.menu',
        path: ROUTES.ADMIN_MENU,
        icon: BookOutlined,
        allowedRoles: [ADMIN],
    },
    {
        key: 'daily-menu',
        labelKey: 'nav.dailyMenu',
        path: ROUTES.ADMIN_DAILY_MENU,
        icon: CalendarOutlined,
        allowedRoles: ALL,
    },
    {
        key: 'orders',
        labelKey: 'nav.orders',
        path: ROUTES.ADMIN_ORDERS,
        icon: ShoppingCartOutlined,
        allowedRoles: ALL,
    },
    {
        key: 'payments',
        labelKey: 'nav.payments',
        path: ROUTES.ADMIN_PAYMENTS,
        icon: CreditCardOutlined,
        allowedRoles: [ADMIN],
    },
    {
        key: 'deliveries',
        labelKey: 'nav.deliveries',
        path: ROUTES.ADMIN_DELIVERIES,
        icon: CarOutlined,
        allowedRoles: [ADMIN],
    },
    {
        key: 'expenses',
        labelKey: 'nav.expenses',
        path: ROUTES.ADMIN_EXPENSES,
        icon: WalletOutlined,
        allowedRoles: [ADMIN],
    },
    {
        key: 'reports',
        labelKey: 'nav.reports',
        path: ROUTES.ADMIN_REPORTS,
        icon: BarChartOutlined,
        allowedRoles: [ADMIN],
    },
    {
        key: 'settings',
        labelKey: 'nav.settings',
        path: ROUTES.ADMIN_SETTINGS,
        icon: SettingOutlined,
        allowedRoles: ALL,
    },
];

/** Navigation items visible to a role. Pure function — unit tested. */
export const getNavigationForRole = (role: AuthRole | null | undefined): NavigationItem[] => {
    if (!role) return [];
    return NAVIGATION_ITEMS.filter((item) => item.allowedRoles.includes(role));
};

/** First authorized path for a role (post-login / forbidden fallback). */
export const getDefaultPathForRole = (role: AuthRole | null | undefined): string => {
    return getNavigationForRole(role)[0]?.path ?? ROUTES.LOGIN;
};

/** Route-level authorization lookup. Pure function — unit tested. */
export const isPathAllowedForRole = (
    pathname: string,
    role: AuthRole | null | undefined,
): boolean => {
    if (!role) return false;
    const item = NAVIGATION_ITEMS.find((entry) => entry.path === pathname);
    if (!item) return false;
    return item.allowedRoles.includes(role);
};
