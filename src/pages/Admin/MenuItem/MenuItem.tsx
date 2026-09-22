import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { App as AntApp, Skeleton } from 'antd';
import MenuForm, { type MenuSaveContext } from 'components/custom/MenuForm';
import EmptyMenuState from 'components/custom/EmptyMenuState';
import { useGetCategoriesQuery, useGetMenuItemByIdQuery } from 'core/api/menu/queries';
import {
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useUploadMenuItemImageMutation,
} from 'core/api/menu/mutations';
import { ROUTES } from 'core/base/const/routes';
import type { MenuItem } from 'core/base/type/menu';
import {
    mapApiMenuItemToUi,
    mapUiMenuItemToApiPayload,
    MenuService,
    rememberCategories,
} from 'core/service/menu.service';

import './MenuItem.scss';

type FieldErrors = { name?: string; category?: string; variants?: string; foodType?: string };

type MutationResult = {
    data?: { data?: { id?: string }; message?: string };
    error?: { status?: number; data?: unknown };
};

const errorMessageOf = (result: MutationResult, fallback: string): string => {
    const data = result.error?.data;
    if (typeof data === 'string' && data.trim()) return data;
    return fallback;
};

const fieldForMessage = (message: string): keyof FieldErrors | null => {
    const text = message.toLowerCase();
    if (text.includes('food type') || text.includes('veg')) return 'foodType';
    if (text.includes('categor')) return 'category';
    if (text.includes('variant') || text.includes('price') || text.includes('offer')) {
        return 'variants';
    }
    if (text.includes('name')) return 'name';
    return null;
};

/**
 * Add / Edit Menu Item page backed by the Menu API. Both modes share
 * `MenuForm`; `mode` controls title text and empty vs. pre-filled state.
 */
const MenuItemPage = () => {
    const { t } = useTranslation(['admin']);
    const { message } = AntApp.useApp();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const mode = id ? 'edit' : 'create';

    const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
    const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
    const [uploadMenuItemImage, { isLoading: isUploading }] = useUploadMenuItemImageMutation();

    // Server categories drive the form dropdown and map a picked category name
    // straight to its backend ObjectId (no name -> id guessing on save).
    const { data: categoriesResponse } = useGetCategoriesQuery();

    const [serverErrors, setServerErrors] = useState<FieldErrors | undefined>(undefined);

    const categoryIdByName = useMemo(() => {
        const map = new Map<string, string>();
        for (const category of categoriesResponse?.data ?? []) {
            map.set(category.name, category.id);
        }
        return map;
    }, [categoriesResponse]);

    const categoryOptions = useMemo(
        () =>
            (categoriesResponse?.data ?? []).map((category) => ({
                value: category.name,
                label: category.name,
            })),
        [categoriesResponse],
    );

    const {
        data: detailResponse,
        isLoading: isDetailLoading,
        isError: isDetailError,
    } = useGetMenuItemByIdQuery(id ?? '', { skip: !id });

    const initialValue = useMemo<MenuItem | undefined>(() => {
        const apiItem = detailResponse?.data;
        if (!apiItem) return undefined;
        rememberCategories([apiItem]);
        return mapApiMenuItemToUi(apiItem);
    }, [detailResponse]);

    const goBack = () => navigate(ROUTES.ADMIN_MENU);
    const saving = isCreating || isUpdating || isUploading;

    const uploadImageIfNeeded = async (menuId: string, ctx?: MenuSaveContext) => {
        if (!ctx?.imageFile) return;
        const upload = (await uploadMenuItemImage({
            id: menuId,
            file: ctx.imageFile,
        })) as MutationResult;
        if (!upload.data) {
            message.error(t('menu.saveFailed'));
        }
    };

    const fail = (errorMessage: string): never => {
        const field = fieldForMessage(errorMessage);
        if (field) {
            setServerErrors((prev) => ({ ...prev, [field]: errorMessage }));
        } else {
            message.error(errorMessage || t('menu.saveFailed'));
        }
        throw new Error(errorMessage);
    };

    const buildPayload = async (item: MenuItem, isDraft: boolean) => {
        // Prefer the freshly fetched category list; fall back to the cache /
        // best-effort probe for categories that may not be listed yet.
        const categoryId =
            categoryIdByName.get(item.category) ??
            (await MenuService.resolveCategoryId(item.category));
        if (!categoryId) {
            const errorMessage = t('menu.categorySetupRequired', { name: item.category });
            setServerErrors((prev) => ({ ...prev, category: errorMessage }));
            throw new Error(errorMessage);
        }
        return mapUiMenuItemToApiPayload({
            name: item.name,
            categoryId,
            foodType: item.foodType,
            description: item.description,
            servingSize: item.servingSize,
            ingredients: item.ingredients,
            variants: item.variants,
            status: item.status === 'Draft' ? 'Active' : item.status,
            isDraft,
            foodImageUrl: item.imageUrl,
            nutritionApproved: item.nutritionApproved,
        });
    };

    const save = async (item: MenuItem, isDraft: boolean, ctx?: MenuSaveContext) => {
        setServerErrors(undefined);
        const payload = await buildPayload(item, isDraft);
        if (mode === 'edit' && id) {
            const result = (await updateMenuItem({ id, payload })) as MutationResult;
            if (!result.data) {
                fail(errorMessageOf(result, t('menu.saveFailed')));
            }
            await uploadImageIfNeeded(id, ctx);
            return;
        }
        const result = (await createMenuItem(payload)) as MutationResult;
        if (!result.data) {
            fail(errorMessageOf(result, t('menu.saveFailed')));
        }
        const createdId = result.data?.data?.id;
        if (createdId) {
            await uploadImageIfNeeded(createdId, ctx);
        }
    };

    const handleSaveDraft = (item: MenuItem, ctx?: MenuSaveContext) => save(item, true, ctx);
    const handleSaveContinue = (item: MenuItem, ctx?: MenuSaveContext) =>
        save(item, false, ctx);

    if (mode === 'edit' && isDetailLoading) {
        return (
            <div className="twk-menu-item-page" aria-busy="true">
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        );
    }

    if (mode === 'edit' && (isDetailError || (!isDetailLoading && !initialValue))) {
        return (
            <div className="twk-menu-item-page">
                <EmptyMenuState
                    title={t('menu.notFound')}
                    description={t('menu.emptyHint')}
                    actionLabel={t('menu.backToList')}
                    onAction={goBack}
                />
            </div>
        );
    }

    return (
        <div className="twk-menu-item-page">
            <MenuForm
                key={initialValue?.id ?? mode}
                mode={mode}
                initialValue={initialValue}
                categoryOptions={categoryOptions}
                onBack={goBack}
                onSaveDraft={handleSaveDraft}
                onSaveContinue={handleSaveContinue}
                saving={saving}
                serverErrors={serverErrors}
                onClearServerErrors={() => setServerErrors(undefined)}
            />
        </div>
    );
};

export default MenuItemPage;
