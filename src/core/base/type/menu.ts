export type MenuItemStatus = 'Active' | 'Inactive' | 'Draft';

export type MenuVariant = {
    id: string;
    label: string;
    price: string;
    offerPrice?: string;
};

export type MenuItem = {
    id: string;
    name: string;
    category: string;
    description?: string;
    servingSize?: string;
    ingredients: string[];
    variants: MenuVariant[];
    imageUrl?: string;
    status: MenuItemStatus;
    nutritionApproved: boolean;
};

export type MenuFormMode = 'create' | 'edit';

export const MENU_CATEGORIES = [
    'Rice & Biryani',
    'Curries',
    'Starters',
    'Breads',
    'Desserts',
    'Beverages',
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];
