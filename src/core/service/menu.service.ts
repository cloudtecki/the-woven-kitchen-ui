import { API_URL } from 'core/base/const/env';
import { APIEndpoints } from 'core/base/enum/api';
import {
    CategoryListApiResponseSchema,
    DeleteMenuItemApiResponseSchema,
    MenuItemApiResponseSchema,
    MenuListApiResponseSchema,
} from 'core/base/schema/menu';
import {
    ApiCategory,
    ApiMenuItem,
    CategoryListApiResponse,
    CreateMenuItemRequest,
    DeleteMenuItemApiResponse,
    FoodType,
    MenuItem,
    MenuItemApiResponse,
    MenuListApiResponse,
    MenuListParams,
    UpdateMenuItemRequest,
} from 'core/base/type/menu';
import { ServiceBase } from 'core/http/base.service';
import { ApiIResult } from 'core/http/type';
import { Axios } from 'core/http';

const CATEGORY_CACHE_KEY = 'twk-menu-category-map-v1';
const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const newVariantId = () =>
    `v-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

/** Absolute URL for a backend-served image path (`/uploads/...`). */
export const resolveMenuImageUrl = (foodImageUrl?: string | null): string | undefined => {
    if (!foodImageUrl) return undefined;
    if (/^(https?:|blob:|data:)/i.test(foodImageUrl)) return foodImageUrl;
    if (foodImageUrl.startsWith('/')) return `${API_URL}${foodImageUrl}`;
    return foodImageUrl;
};

/** Backend DTO -> UI model (keeps card/form field names unchanged). */
export const mapApiMenuItemToUi = (item: ApiMenuItem): MenuItem => {
    const category =
        item.category && typeof item.category === 'object'
            ? item.category.name
            : (item.category ?? '');
    return {
        id: item.id,
        name: item.name,
        category,
        foodType: item.foodType ?? 'Non-Veg',
        description: item.description ?? undefined,
        servingSize: item.servingSize ?? undefined,
        ingredients: item.ingredients ?? [],
        variants: (item.variants ?? []).map((v) => ({
            id: newVariantId(),
            label: v.label,
            price: String(v.price),
            ...(v.offerPrice !== undefined && v.offerPrice !== null
                ? { offerPrice: String(v.offerPrice) }
                : {}),
        })),
        imageUrl: resolveMenuImageUrl(item.foodImageUrl),
        status: item.isDraft ? 'Draft' : item.status,
        nutritionApproved: item.nutritionStatus === 'Approved',
    };
};

/** UI form fields -> backend payload (strict spec: ObjectId category, numeric prices). */
export const mapUiMenuItemToApiPayload = (
    fields: {
        name: string;
        categoryId: string;
        foodType: FoodType;
        description?: string;
        servingSize?: string;
        ingredients: string[];
        variants: { label: string; price: string; offerPrice?: string }[];
        status: 'Active' | 'Inactive';
        isDraft: boolean;
        foodImageUrl?: string;
        nutritionApproved: boolean;
    },
): CreateMenuItemRequest => ({
    name: fields.name.trim(),
    category: fields.categoryId,
    foodType: fields.foodType,
    ...(fields.description?.trim() ? { description: fields.description.trim() } : {}),
    ...(fields.servingSize?.trim() ? { servingSize: fields.servingSize.trim() } : {}),
    ingredients: fields.ingredients,
    variants: fields.variants.map((v) => ({
        label: v.label.trim() || 'Standard',
        price: Number(v.price),
        ...(v.offerPrice?.trim() ? { offerPrice: Number(v.offerPrice) } : {}),
    })),
    status: fields.status,
    isDraft: fields.isDraft,
    ...(fields.foodImageUrl &&
    !fields.foodImageUrl.startsWith('blob:') &&
    fields.foodImageUrl.length <= 2048
        ? { foodImageUrl: fields.foodImageUrl }
        : {}),
    nutritionStatus: fields.nutritionApproved ? 'Approved' : 'Pending',
});

const readCategoryCache = (): Record<string, string> => {
    try {
        return JSON.parse(localStorage.getItem(CATEGORY_CACHE_KEY) ?? '{}') as Record<
            string,
            string
        >;
    } catch {
        return {};
    }
};

const writeCategoryCache = (map: Record<string, string>) => {
    try {
        localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(map));
    } catch {
        // Storage unavailable (private mode) — in-memory map still applies.
    }
};

/** Learn `name -> id` mappings from populated menu items + persist them. */
export const rememberCategories = (items: ApiMenuItem[]) => {
    const map = readCategoryCache();
    let changed = false;
    for (const item of items) {
        const category: ApiCategory | string | null = item.category;
        if (category && typeof category === 'object' && OBJECT_ID_RE.test(category.id)) {
            if (map[category.name] !== category.id) {
                map[category.name] = category.id;
                changed = true;
            }
        }
    }
    if (changed) writeCategoryCache(map);
    return map;
};

export class MenuService extends ServiceBase {
    private static menuUrl(id: string): string {
        return APIEndpoints.MENU_BY_ID.replace('{menuId}', id);
    }

    private static menuImageUrl(id: string): string {
        return APIEndpoints.MENU_IMAGE.replace('{menuId}', id);
    }

    static getCategories(): Promise<ApiIResult<CategoryListApiResponse>> {
        return this.get(APIEndpoints.GET_CATEGORIES, CategoryListApiResponseSchema);
    }

    static getMenuItems(
        params: MenuListParams = {},
    ): Promise<ApiIResult<MenuListApiResponse>> {
        const search = new URLSearchParams();
        search.set('page', String(params.page ?? 1));
        search.set('limit', String(params.limit ?? 100));
        if (params.category) search.set('category', params.category);
        if (params.status) search.set('status', params.status);
        if (typeof params.isDraft === 'boolean') search.set('isDraft', String(params.isDraft));
        if (params.search?.trim()) search.set('search', params.search.trim());
        return this.get(
            `${APIEndpoints.MENU}?${search.toString()}`,
            MenuListApiResponseSchema,
        );
    }

    static getMenuItemById(id: string): Promise<ApiIResult<MenuItemApiResponse>> {
        return this.get(this.menuUrl(id), MenuItemApiResponseSchema);
    }

    static createMenuItem(
        payload: CreateMenuItemRequest,
    ): Promise<ApiIResult<MenuItemApiResponse>> {
        return this.post(APIEndpoints.MENU, payload, MenuItemApiResponseSchema);
    }

    static updateMenuItem(
        id: string,
        payload: UpdateMenuItemRequest,
    ): Promise<ApiIResult<MenuItemApiResponse>> {
        return this.patch(this.menuUrl(id), payload, MenuItemApiResponseSchema);
    }

    static deleteMenuItem(id: string): Promise<ApiIResult<DeleteMenuItemApiResponse>> {
        return this.delete(this.menuUrl(id), DeleteMenuItemApiResponseSchema);
    }

    static uploadMenuItemImage(
        id: string,
        file: File,
    ): Promise<ApiIResult<MenuItemApiResponse>> {
        const form = new FormData();
        form.append('image', file);
        return this.post(this.menuImageUrl(id), form, MenuItemApiResponseSchema, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Resolve a display category name to its backend ObjectId.
     * Learns from populated menu items (see `rememberCategories`) and a
     * local cache; best-effort `GET /api/categories` probe for when the
     * backend exposes it.
     */
    static async resolveCategoryId(name: string): Promise<string | null> {
        if (OBJECT_ID_RE.test(name)) return name;
        const cached = readCategoryCache()[name];
        if (cached) return cached;
        try {
            const response = await Axios.get(`${APIEndpoints.GET_CATEGORIES}`);
            const data = response.data?.data;
            if (Array.isArray(data)) {
                const map = readCategoryCache();
                for (const c of data as ApiCategory[]) {
                    if (c && OBJECT_ID_RE.test(c.id)) map[c.name] = c.id;
                }
                writeCategoryCache(map);
                if (map[name]) return map[name];
            }
        } catch {
            // Backend has no category listing yet — fall through to learned map.
        }
        return readCategoryCache()[name] ?? null;
    }
}
