import { baseApi } from 'core/api/base.api';
import { STORE_TAGS } from 'core/base/const/store';
import {
    CreateMenuItemRequest,
    DeleteMenuItemApiResponse,
    MenuItemApiResponse,
    UpdateMenuItemRequest,
} from 'core/base/type/menu';
import { MenuService } from 'core/service/menu.service';

export const menuMutationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMenuItem: builder.mutation<MenuItemApiResponse, CreateMenuItemRequest>({
            queryFn: async (payload: CreateMenuItemRequest) => {
                return MenuService.createMenuItem(payload);
            },
            invalidatesTags: [STORE_TAGS.MENU],
        }),
        updateMenuItem: builder.mutation<
            MenuItemApiResponse,
            { id: string; payload: UpdateMenuItemRequest }
        >({
            queryFn: async ({ id, payload }) => {
                return MenuService.updateMenuItem(id, payload);
            },
            invalidatesTags: (_result, _error, { id }) => [
                STORE_TAGS.MENU,
                { type: STORE_TAGS.MENU, id },
            ],
        }),
        deleteMenuItem: builder.mutation<DeleteMenuItemApiResponse, string>({
            queryFn: async (id: string) => {
                return MenuService.deleteMenuItem(id);
            },
            invalidatesTags: [STORE_TAGS.MENU],
        }),
        uploadMenuItemImage: builder.mutation<
            MenuItemApiResponse,
            { id: string; file: File }
        >({
            queryFn: async ({ id, file }) => {
                return MenuService.uploadMenuItemImage(id, file);
            },
            invalidatesTags: (_result, _error, { id }) => [
                STORE_TAGS.MENU,
                { type: STORE_TAGS.MENU, id },
            ],
        }),
    }),
});

export const {
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
    useUploadMenuItemImageMutation,
} = menuMutationsApi;
