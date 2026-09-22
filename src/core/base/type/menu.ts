export type MenuItemStatus = 'Active' | 'Inactive' | 'Draft';

export type FoodType = 'Veg' | 'Non-Veg';

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
    foodType: FoodType;
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

// ---------------------------------------------------------------------------
// Backend API contract (strict spec: category is a ref, prices are numbers)
// ---------------------------------------------------------------------------

export type ApiMenuStatus = 'Active' | 'Inactive';

export type ApiCategory = {
    id: string;
    name: string;
};

export type ApiMenuVariant = {
    label: string;
    price: number;
    offerPrice?: number;
};

export type ApiMenuItem = {
    id: string;
    name: string;
    category: ApiCategory | string | null;
    foodType: FoodType;
    description: string | null;
    servingSize: string | null;
    ingredients: string[];
    variants: ApiMenuVariant[];
    status: ApiMenuStatus;
    isDraft: boolean;
    foodImageUrl: string | null;
    nutrition: {
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
    } | null;
    nutritionStatus: 'Approved' | 'Pending';
    createdAt: string;
    updatedAt: string;
};

export type MenuListParams = {
    page?: number;
    limit?: number;
    category?: string;
    status?: ApiMenuStatus;
    isDraft?: boolean;
    search?: string;
};

export type CreateMenuItemRequest = {
    name: string;
    category: string;
    foodType: FoodType;
    description?: string;
    servingSize?: string;
    ingredients?: string[];
    variants: ApiMenuVariant[];
    status?: ApiMenuStatus;
    isDraft?: boolean;
    foodImageUrl?: string;
    nutrition?: ApiMenuItem['nutrition'];
    nutritionStatus?: ApiMenuItem['nutritionStatus'];
};

export type UpdateMenuItemRequest = Partial<CreateMenuItemRequest>;

export type MenuListApiResponse = {
    success: boolean;
    data: ApiMenuItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
};

export type CategoryListApiResponse = {
    success: boolean;
    data: ApiCategory[];
};

export type MenuItemApiResponse = {
    success: boolean;
    data: ApiMenuItem;
    message?: string;
};

export type DeleteMenuItemApiResponse = {
    success: boolean;
    data: Record<string, never>;
    message?: string;
};
