import { baseApi } from 'core/api/base.api';
import { STORE_TAGS } from 'core/base/const/store';
import {
    CategoryListApiResponse,
    MenuItemApiResponse,
    MenuListApiResponse,
    MenuListParams,
} from 'core/base/type/menu';
import { MenuService } from 'core/service/menu.service';

export const menuQueriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<CategoryListApiResponse, void>({
            queryFn: async () => {
                return MenuService.getCategories();
            },
            providesTags: [STORE_TAGS.CATEGORIES],
        }),
        getMenuItems: builder.query<MenuListApiResponse, MenuListParams | void>({
            queryFn: async (params) => {
                return MenuService.getMenuItems(params ?? {});
            },
            providesTags: [STORE_TAGS.MENU],
        }),
        getMenuItemById: builder.query<MenuItemApiResponse, string>({
            queryFn: async (id: string) => {
                return MenuService.getMenuItemById(id);
            },
            providesTags: (_result, _error, id) => [{ type: STORE_TAGS.MENU, id }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
    useGetMenuItemsQuery,
    useLazyGetMenuItemsQuery,
    useGetMenuItemByIdQuery,
    useLazyGetMenuItemByIdQuery,
} = menuQueriesApi;
