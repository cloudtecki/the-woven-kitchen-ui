import { describe, expect, it, beforeEach } from 'vitest';
import type { ApiMenuItem } from 'core/base/type/menu';
import {
    mapApiMenuItemToUi,
    mapUiMenuItemToApiPayload,
    rememberCategories,
    resolveMenuImageUrl,
} from './menu.service';

const apiItem = (overrides: Partial<ApiMenuItem> = {}): ApiMenuItem => ({
    id: 'aaaabbbbccccddddeeee0001',
    name: 'Chicken Dum Biryani',
    category: { id: 'aaaabbbbccccddddeeee00c1', name: 'Rice & Biryani' },
    foodType: 'Non-Veg',
    description: 'Tasty',
    servingSize: '250g',
    ingredients: ['Rice'],
    variants: [
        { label: '500g', price: 249, offerPrice: 199 },
        { label: '1kg', price: 449 },
    ],
    status: 'Active',
    isDraft: false,
    foodImageUrl: '/uploads/menu/abc.png',
    nutrition: null,
    nutritionStatus: 'Pending',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
});

describe('menu.service mappers', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('maps an API item to the UI model', () => {
        const ui = mapApiMenuItemToUi(apiItem());
        expect(ui.id).toBe('aaaabbbbccccddddeeee0001');
        expect(ui.category).toBe('Rice & Biryani');
        expect(ui.foodType).toBe('Non-Veg');
        expect(ui.status).toBe('Active');
        expect(ui.nutritionApproved).toBe(false);
        expect(ui.variants[0].price).toBe('249');
        expect(ui.variants[0].offerPrice).toBe('199');
        expect(ui.variants[1].offerPrice).toBeUndefined();
        expect(ui.imageUrl).toBe('http://localhost:7000/api/uploads/menu/abc.png');
    });

    it('maps drafts to Draft status and approved nutrition', () => {
        const ui = mapApiMenuItemToUi(
            apiItem({ isDraft: true, nutritionStatus: 'Approved' }),
        );
        expect(ui.status).toBe('Draft');
        expect(ui.nutritionApproved).toBe(true);
    });

    it('maps UI fields to a strict-spec payload', () => {
        const payload = mapUiMenuItemToApiPayload({
            name: '  Test Biryani ',
            categoryId: 'aaaabbbbccccddddeeee00c1',
            foodType: 'Non-Veg',
            description: 'desc',
            servingSize: '',
            ingredients: ['Rice'],
            variants: [{ label: '', price: '199', offerPrice: '' }],
            status: 'Active',
            isDraft: false,
            nutritionApproved: false,
        });
        expect(payload.name).toBe('Test Biryani');
        expect(payload.category).toBe('aaaabbbbccccddddeeee00c1');
        expect(payload.foodType).toBe('Non-Veg');
        expect(payload.servingSize).toBeUndefined();
        expect(payload.variants).toEqual([{ label: 'Standard', price: 199 }]);
        expect(payload.isDraft).toBe(false);
        expect(payload.foodImageUrl).toBeUndefined();
    });

    it('drops blob image URLs from the payload (uploaded separately)', () => {
        const payload = mapUiMenuItemToApiPayload({
            name: 'x',
            categoryId: 'aaaabbbbccccddddeeee00c1',
            foodType: 'Veg',
            ingredients: [],
            variants: [{ label: 'R', price: '10' }],
            status: 'Active',
            isDraft: true,
            foodImageUrl: 'blob:http://localhost/abc',
            nutritionApproved: false,
        });
        expect(payload.foodImageUrl).toBeUndefined();
        expect(payload.isDraft).toBe(true);
    });

    it('round-trips the food type through ui -> payload and api -> ui', () => {
        const payload = mapUiMenuItemToApiPayload({
            name: 'Paneer',
            categoryId: 'aaaabbbbccccddddeeee00c1',
            foodType: 'Veg',
            ingredients: [],
            variants: [{ label: 'R', price: '10' }],
            status: 'Active',
            isDraft: false,
            nutritionApproved: false,
        });
        expect(payload.foodType).toBe('Veg');

        const ui = mapApiMenuItemToUi(apiItem({ foodType: 'Veg' }));
        expect(ui.foodType).toBe('Veg');
    });

    it('defaults to Non-Veg when a legacy API item omits foodType', () => {
        const legacy = apiItem({ foodType: 'Non-Veg' });
        delete (legacy as { foodType?: unknown }).foodType;
        expect(mapApiMenuItemToUi(legacy).foodType).toBe('Non-Veg');
    });

    it('learns category ids from populated items', () => {
        const map = rememberCategories([apiItem()]);
        expect(map['Rice & Biryani']).toBe('aaaabbbbccccddddeeee00c1');
        expect(JSON.parse(localStorage.getItem('twk-menu-category-map-v1') ?? '{}')).toEqual(
            map,
        );
    });

    it('resolves image URLs', () => {
        expect(resolveMenuImageUrl(null)).toBeUndefined();
        expect(resolveMenuImageUrl('https://cdn/x.png')).toBe('https://cdn/x.png');
        expect(resolveMenuImageUrl('blob:abc')).toBe('blob:abc');
    });
});
