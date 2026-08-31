export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    ID: '/:id',
    TEST: '/test',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];