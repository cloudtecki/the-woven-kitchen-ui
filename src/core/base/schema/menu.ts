import { array, boolean, mixed, number, object, string } from 'yup';

export const ApiCategorySchema = object({
    id: string().required(),
    name: string().required(),
});

export const ApiMenuVariantSchema = object({
    label: string().required(),
    price: number().required(),
    offerPrice: number().notRequired(),
});

export const ApiMenuItemSchema = object({
    id: string().required(),
    name: string().required(),
    category: mixed().notRequired(),
    foodType: string().oneOf(['Veg', 'Non-Veg']).notRequired(),
    description: string().nullable().notRequired(),
    servingSize: string().nullable().notRequired(),
    ingredients: array().of(string().required()).notRequired(),
    variants: array().of(ApiMenuVariantSchema.required()).notRequired(),
    status: string().oneOf(['Active', 'Inactive']).required(),
    isDraft: boolean().required(),
    foodImageUrl: string().nullable().notRequired(),
    nutrition: mixed().nullable().notRequired(),
    nutritionStatus: string().oneOf(['Approved', 'Pending']).required(),
    createdAt: string().notRequired(),
    updatedAt: string().notRequired(),
});

export const MenuPaginationSchema = object({
    page: number().required(),
    limit: number().required(),
    total: number().required(),
    pages: number().required(),
});

export const MenuListApiResponseSchema = object({
    success: boolean().required(),
    data: array().of(ApiMenuItemSchema.required()).required(),
    pagination: MenuPaginationSchema.required(),
});

export const CategoryListApiResponseSchema = object({
    success: boolean().required(),
    data: array().of(ApiCategorySchema.required()).required(),
});

export const MenuItemApiResponseSchema = object({
    success: boolean().required(),
    data: ApiMenuItemSchema.required(),
    message: string().notRequired(),
});

export const DeleteMenuItemApiResponseSchema = object({
    success: boolean().required(),
    data: mixed().notRequired(),
    message: string().notRequired(),
});
