import { describe, expect, it } from 'vitest';
import { ROUTES } from 'core/base/const/routes';
import {
    NAVIGATION_ITEMS,
    getDefaultPathForRole,
    getNavigationForRole,
    isPathAllowedForRole,
} from 'core/base/const/navigation';

describe('navigation config', () => {
    it('exposes one item per admin section with no duplicate paths', () => {
        expect(NAVIGATION_ITEMS).toHaveLength(10);
        const paths = NAVIGATION_ITEMS.map((item) => item.path);
        expect(new Set(paths).size).toBe(paths.length);
    });

    it('grants ADMIN every navigation item', () => {
        const keys = getNavigationForRole('ADMIN').map((item) => item.key);
        expect(keys).toEqual([
            'dashboard',
            'customers',
            'menu',
            'daily-menu',
            'orders',
            'payments',
            'deliveries',
            'expenses',
            'reports',
            'settings',
        ]);
    });

    it('grants CUSTOMER only dashboard, daily menu, orders and settings', () => {
        const keys = getNavigationForRole('CUSTOMER').map((item) => item.key);
        expect(keys).toEqual(['dashboard', 'daily-menu', 'orders', 'settings']);
    });

    it('returns no items without a role', () => {
        expect(getNavigationForRole(null)).toEqual([]);
        expect(getNavigationForRole(undefined)).toEqual([]);
    });

    it('authorizes routes against the same table the sidebar uses', () => {
        expect(isPathAllowedForRole(ROUTES.ADMIN_CUSTOMERS, 'ADMIN')).toBe(true);
        expect(isPathAllowedForRole(ROUTES.ADMIN_CUSTOMERS, 'CUSTOMER')).toBe(false);
        expect(isPathAllowedForRole(ROUTES.ADMIN_ORDERS, 'CUSTOMER')).toBe(true);
        expect(isPathAllowedForRole(ROUTES.ADMIN_ORDERS, null)).toBe(false);
        expect(isPathAllowedForRole('/admin/unknown', 'ADMIN')).toBe(false);
    });

    it('resolves the default landing path per role', () => {
        expect(getDefaultPathForRole('ADMIN')).toBe(ROUTES.ADMIN_DASHBOARD);
        expect(getDefaultPathForRole('CUSTOMER')).toBe(ROUTES.ADMIN_DASHBOARD);
        expect(getDefaultPathForRole(null)).toBe(ROUTES.LOGIN);
    });
});
