export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    ID: '/:id',
    TEST: '/test',
    LOGIN: '/login',
    SIGNUP: '/signup',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];