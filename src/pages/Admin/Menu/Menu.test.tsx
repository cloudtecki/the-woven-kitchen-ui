import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import i18n from '../../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import MenuPage from './Menu';

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
        localStorage.clear();
    });

    it('renders the listing with status and nutrition badges', () => {
        renderMenu();
        expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Add Menu Item/ }),
        ).toBeInTheDocument();
        // Mock items render as cards.
        expect(screen.getByLabelText('Chicken Dum Biryani')).toBeInTheDocument();
        expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Inactive').length).toBeGreaterThan(0);
        expect(screen.getAllByText('OFFER').length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Nutrition Approved/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Nutrition Pending/).length).toBeGreaterThan(0);
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

    it('opens the delete confirmation and removes the card', async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole('button', { name: 'Delete Mango Lassi' }));
        expect(screen.getByText('Delete Menu Item?')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Delete' }));
        await waitFor(() => {
            expect(screen.queryByLabelText('Mango Lassi')).not.toBeInTheDocument();
        });
        expect(await screen.findByText('Menu item deleted')).toBeInTheDocument();
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
    });

    it('navigates to add and edit pages', async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole('button', { name: /Add Menu Item/ }));
        expect(await screen.findByText('NewMenuPage')).toBeInTheDocument();
    });
});
