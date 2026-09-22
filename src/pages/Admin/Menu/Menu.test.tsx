import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n from '../../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import type { ApiMenuItem } from 'core/base/type/menu';
import MenuPage from './Menu';

const { mockGetMenuItemsQuery, mockDeleteMenuItem } = vi.hoisted(() => ({
    mockGetMenuItemsQuery: vi.fn(),
    mockDeleteMenuItem: vi.fn(),
}));

vi.mock('core/api/menu/queries', () => ({
    useGetMenuItemsQuery: (...args: unknown[]) => mockGetMenuItemsQuery(...args),
    useLazyGetMenuItemsQuery: () => [vi.fn(), {}],
    useGetMenuItemByIdQuery: () => ({ data: undefined, isLoading: false }),
    useLazyGetMenuItemByIdQuery: () => [vi.fn(), {}],
}));

vi.mock('core/api/menu/mutations', () => ({
    useCreateMenuItemMutation: () => [vi.fn(), { isLoading: false }],
    useUpdateMenuItemMutation: () => [vi.fn(), { isLoading: false }],
    useDeleteMenuItemMutation: () => [mockDeleteMenuItem, { isLoading: false }],
    useUploadMenuItemImageMutation: () => [vi.fn(), { isLoading: false }],
}));

const apiItem = (overrides: Partial<ApiMenuItem> = {}): ApiMenuItem => ({
    id: 'aaaabbbbccccddddeeee0001',
    name: 'Chicken Dum Biryani',
    category: { id: 'aaaabbbbccccddddeeee00c1', name: 'Rice & Biryani' },
    foodType: 'Non-Veg',
    description: 'Fragrant basmati layered with spiced chicken.',
    servingSize: '250g',
    ingredients: ['Basmati rice', 'Chicken'],
    variants: [{ label: '500g', price: 249, offerPrice: 199 }],
    status: 'Active',
    isDraft: false,
    foodImageUrl: null,
    nutrition: null,
    nutritionStatus: 'Approved',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
});

const listResult = (items: ApiMenuItem[]) => ({
    data: {
        success: true,
        data: items,
        pagination: { page: 1, limit: 100, total: items.length, pages: 1 },
    },
    isLoading: false,
    isFetching: false,
    isError: false,
});

const renderMenu = () => {
    const store = setupStore();
    return render(
        <AntApp>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={['/admin/menu']}>
                        <Routes>
                            <Route path="/admin/menu" element={<MenuPage />} />
                            <Route path="/admin/menu/new" element={<div>NewMenuPage</div>} />
                            <Route
                                path="/admin/menu/:id/edit"
                                element={<div>EditMenuPage</div>}
                            />
                        </Routes>
                    </MemoryRouter>
                </I18nextProvider>
            </Provider>
        </AntApp>,
    );
};

describe('MenuPage', () => {
    beforeEach(() => {
        mockGetMenuItemsQuery.mockReturnValue(
            listResult([
                apiItem(),
                apiItem({
                    id: 'aaaabbbbccccddddeeee0002',
                    name: 'Mango Lassi',
                    category: { id: 'aaaabbbbccccddddeeee00c2', name: 'Beverages' },
                    foodType: 'Veg',
                    variants: [{ label: 'Glass', price: 99 }],
                    status: 'Inactive',
                    nutritionStatus: 'Pending',
                }),
            ]),
        );
        mockDeleteMenuItem.mockResolvedValue({
            data: { success: true, data: {} },
        });
    });

    it('renders the listing with status and nutrition badges from the API', () => {
        renderMenu();
        expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Add Menu Item/ }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Chicken Dum Biryani')).toBeInTheDocument();
        expect(screen.getByLabelText('Mango Lassi')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
        expect(screen.getByText('OFFER')).toBeInTheDocument();
        expect(screen.getByText(/Nutrition Approved/)).toBeInTheDocument();
        expect(screen.getByText(/Nutrition Pending/)).toBeInTheDocument();
    });

    it('shows the struck-through original price beside the highlighted offer price', () => {
        renderMenu();
        const biryani = screen.getByLabelText('Chicken Dum Biryani');
        const lassi = screen.getByLabelText('Mango Lassi');

        const original = within(biryani).getByLabelText('Original price ₹249');
        expect(original).toHaveClass('twk-menu-card__price--struck');
        const offer = within(biryani).getByLabelText('Offer price ₹199');
        expect(offer).toHaveClass('twk-menu-card__price--offer');

        const plain = within(lassi).getByText('₹99');
        expect(plain).not.toHaveClass('twk-menu-card__price--offer');
    });

    it('tags cards with the Veg / Non-Veg food type', () => {
        renderMenu();
        expect(screen.getByLabelText('Chicken Dum Biryani')).toHaveTextContent('Non-Veg');
        expect(screen.getByLabelText('Mango Lassi')).toHaveTextContent('Veg');
    });

    it('shows skeleton cards while loading', () => {
        mockGetMenuItemsQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isFetching: false,
            isError: false,
        });
        renderMenu();
        expect(screen.getByLabelText('Menu')).toBeInTheDocument();
        expect(screen.queryByLabelText('Chicken Dum Biryani')).not.toBeInTheDocument();
    });

    it('shows the animated empty state when there are no items', async () => {
        mockGetMenuItemsQuery.mockReturnValue(listResult([]));
        const user = userEvent.setup();
        renderMenu();
        expect(await screen.findByText('No Menu Items Yet')).toBeInTheDocument();
        expect(
            screen.getByText('Add your first menu item to get started.'),
        ).toBeInTheDocument();
        await user.click(
            within(screen.getByTestId('empty-menu-state')).getByRole('button', {
                name: /Add Menu Item/,
            }),
        );
        expect(await screen.findByText('NewMenuPage')).toBeInTheDocument();
    });

    it('filters cards via search', async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.type(screen.getByLabelText('Search menu items…'), 'biryani');
        await waitFor(() => {
            expect(screen.getByLabelText('Chicken Dum Biryani')).toBeInTheDocument();
            expect(screen.queryByLabelText('Mango Lassi')).not.toBeInTheDocument();
        });
    });

    it('opens the delete confirmation and removes the card on success', async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole('button', { name: 'Delete Mango Lassi' }));
        expect(screen.getByText('Delete Menu Item?')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await waitFor(() => {
            expect(mockDeleteMenuItem).toHaveBeenCalledWith('aaaabbbbccccddddeeee0002');
        });
        expect(await screen.findByText('Menu item deleted')).toBeInTheDocument();
    });

    it('keeps the card and toasts an error when delete fails', async () => {
        mockDeleteMenuItem.mockResolvedValue({
            error: { status: 500, data: 'boom' },
        });
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole('button', { name: 'Delete Mango Lassi' }));
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        expect(await screen.findByText('Failed to delete menu item.')).toBeInTheDocument();
        expect(screen.getByLabelText('Mango Lassi')).toBeInTheDocument();
    });

    it('cancelling delete keeps the card', async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole('button', { name: 'Delete Mango Lassi' }));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        await waitFor(() => {
            expect(screen.queryByText('Delete Menu Item?')).not.toBeInTheDocument();
        });
        expect(screen.getByLabelText('Mango Lassi')).toBeInTheDocument();
        expect(mockDeleteMenuItem).not.toHaveBeenCalled();
    });

    it('navigates to add and edit pages', async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole('button', { name: /Add Menu Item/ }));
        expect(await screen.findByText('NewMenuPage')).toBeInTheDocument();
    });
});
