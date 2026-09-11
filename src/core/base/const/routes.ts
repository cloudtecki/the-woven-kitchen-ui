export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    ID: '/:id',
    TEST: '/test',
    LOGIN: '/login',
    SIGNUP: '/signup',
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_CUSTOMERS: '/admin/customers',
    ADMIN_MENU: '/admin/menu',
    ADMIN_DAILY_MENU: '/admin/daily-menu',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_PAYMENTS: '/admin/payments',
    ADMIN_DELIVERIES: '/admin/deliveries',
    ADMIN_EXPENSES: '/admin/expenses',
    ADMIN_REPORTS: '/admin/reports',
    ADMIN_SETTINGS: '/admin/settings',
    FORBIDDEN: '/forbidden',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];