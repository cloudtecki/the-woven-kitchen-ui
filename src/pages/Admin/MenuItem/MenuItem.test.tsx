import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n from '../../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import type { ApiMenuItem } from 'core/base/type/menu';
import { MenuService } from 'core/service/menu.service';
import MenuItemPage from './MenuItem';

const { mockCreateMenuItem, mockUpdateMenuItem, mockUploadImage } = vi.hoisted(() => ({
    mockCreateMenuItem: vi.fn(),
    mockUpdateMenuItem: vi.fn(),
    mockUploadImage: vi.fn(),
}));

const mockMenuItemQuery = vi.hoisted(() => ({ current: vi.fn() }));
const mockGetCategoriesQuery = vi.hoisted(() => ({ current: vi.fn() }));

vi.mock('core/api/menu/queries', () => ({
    useGetCategoriesQuery: (...args: unknown[]) => mockGetCategoriesQuery.current(...args),
    useLazyGetCategoriesQuery: () => [vi.fn(), {}],
    useGetMenuItemsQuery: () => ({ data: undefined, isLoading: false, isFetching: false, isError: false }),
    useLazyGetMenuItemsQuery: () => [vi.fn(), {}],
    useGetMenuItemByIdQuery: (...args: unknown[]) => mockMenuItemQuery.current(...args),
    useLazyGetMenuItemByIdQuery: () => [vi.fn(), {}],
}));

vi.mock('core/api/menu/mutations', () => ({
    useCreateMenuItemMutation: () => [mockCreateMenuItem, { isLoading: false }],
    useUpdateMenuItemMutation: () => [mockUpdateMenuItem, { isLoading: false }],
    useDeleteMenuItemMutation: () => [vi.fn(), { isLoading: false }],
    useUploadMenuItemImageMutation: () => [mockUploadImage, { isLoading: false }],
}));

const apiItem: ApiMenuItem = {
    id: 'aaaabbbbccccddddeeee0001',
    name: 'Chicken Dum Biryani',
    category: { id: 'aaaabbbbccccddddeeee00c1', name: 'Rice & Biryani' },
    foodType: 'Non-Veg',
    description: 'Tasty',
    servingSize: '250g',
    ingredients: ['Rice'],
    variants: [{ label: '500g', price: 249 }],
    status: 'Active',
    isDraft: false,
    foodImageUrl: null,
    nutrition: null,
    nutritionStatus: 'Pending',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
};

const renderAt = (entry: string) => {
    const store = setupStore();
    return render(
        <AntApp>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={[entry]}>
                        <Routes>
                            <Route path="/admin/menu/new" element={<MenuItemPage />} />
                            <Route path="/admin/menu/:id/edit" element={<MenuItemPage />} />
                        </Routes>
                    </MemoryRouter>
                </I18nextProvider>
            </Provider>
        </AntApp>,
    );
};

describe('MenuItemPage', () => {
    beforeEach(() => {
        mockMenuItemQuery.current.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        });
        mockGetCategoriesQuery.current.mockReturnValue({
            data: {
                success: true,
                data: [
                    { id: 'aaaabbbbccccddddeeee00c2', name: 'Rice & Biryani' },
                    { id: 'aaaabbbbccccddddeeee00c1', name: 'Curries' },
                ],
            },
            isLoading: false,
            isFetching: false,
            isError: false,
        });
        vi.spyOn(MenuService, 'resolveCategoryId').mockResolvedValue(
            'aaaabbbbccccddddeeee00c1',
        );
        mockCreateMenuItem.mockResolvedValue({
            data: { success: true, data: apiItem },
        });
        mockUpdateMenuItem.mockResolvedValue({
            data: { success: true, data: apiItem },
        });
    });

    it('create mode saves a draft through the API', async () => {
        const user = userEvent.setup();
        renderAt('/admin/menu/new');
        await user.type(
            screen.getByPlaceholderText('e.g. Chicken Dum Biryani'),
            'Test Biryani',
        );
        await user.click(screen.getByRole('combobox', { name: 'Category' }));
        await user.click(screen.getByTitle('Curries'));
        await user.type(screen.getByPlaceholderText('e.g. 500g'), 'Regular');
        await user.type(screen.getByPlaceholderText('Price'), '199');
        await user.click(screen.getByRole('combobox', { name: 'Food Type' }));
        await user.click(screen.getByTitle('Veg'));
        await user.click(screen.getByRole('button', { name: 'Save Draft' }));
        await waitFor(() => {
            expect(mockCreateMenuItem).toHaveBeenCalledTimes(1);
        });
        const payload = mockCreateMenuItem.mock.calls[0][0];
        expect(payload.name).toBe('Test Biryani');
        expect(payload.isDraft).toBe(true);
        expect(payload.category).toBe('aaaabbbbccccddddeeee00c1');
        expect(payload.foodType).toBe('Veg');
        expect(payload.variants).toEqual([{ label: 'Regular', price: 199 }]);
        expect(await screen.findByText('Draft saved')).toBeInTheDocument();
        expect(mockUploadImage).not.toHaveBeenCalled();
    });

    it('create mode surfaces backend validation errors on fields', async () => {
        mockCreateMenuItem.mockResolvedValue({
            error: { status: 400, data: 'Name is required' },
        });
        const user = userEvent.setup();
        renderAt('/admin/menu/new');
        await user.type(
            screen.getByPlaceholderText('e.g. Chicken Dum Biryani'),
            'Test Biryani',
        );
        await user.click(screen.getByRole('combobox', { name: 'Category' }));
        await user.click(screen.getByTitle('Curries'));
        await user.type(screen.getByPlaceholderText('e.g. 500g'), 'Regular');
        await user.type(screen.getByPlaceholderText('Price'), '199');
        await user.click(screen.getByRole('button', { name: /Save & Continue/ }));
        expect(await screen.findByText('Name is required')).toBeInTheDocument();
    });

    it('edit mode prefills the form from the API', async () => {
        mockMenuItemQuery.current.mockReturnValue({
            data: { success: true, data: apiItem },
            isLoading: false,
            isError: false,
        });
        renderAt('/admin/menu/aaaabbbbccccddddeeee0001/edit');
        expect(await screen.findByDisplayValue('Chicken Dum Biryani')).toBeInTheDocument();
        expect(screen.getByText('Edit Menu Item')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Update & Continue/ })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Save & Continue/ })).not.toBeInTheDocument();
        expect(screen.getAllByText('Non-Veg').length).toBeGreaterThan(0);
    });

    it('edit mode shows an error state when the item cannot be loaded', async () => {
        mockMenuItemQuery.current.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });
        renderAt('/admin/menu/aaaabbbbccccddddeeee0001/edit');
        expect(await screen.findByText('Menu item not found.')).toBeInTheDocument();
    });
});
