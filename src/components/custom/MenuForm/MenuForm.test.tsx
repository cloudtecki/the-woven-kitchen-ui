import { App as AntApp } from 'antd';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import i18n from '../../../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
import MenuForm from './MenuForm';

const renderForm = (props?: Partial<React.ComponentProps<typeof MenuForm>>) => {
    const store = setupStore();
    const onBack = vi.fn();
    const onSaveDraft = vi.fn();
    const onSaveContinue = vi.fn();
    render(
        <AntApp>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter>
                        <MenuForm
                            mode="create"
                            onBack={onBack}
                            onSaveDraft={onSaveDraft}
                            onSaveContinue={onSaveContinue}
                            {...props}
                        />
                    </MemoryRouter>
                </I18nextProvider>
            </Provider>
        </AntApp>,
    );
    return { onBack, onSaveDraft, onSaveContinue };
};

describe('MenuForm', () => {
    it('renders create mode with empty fields and two tabs', () => {
        renderForm();
        expect(screen.getByText('Add Menu Item')).toBeInTheDocument();
        expect(screen.getByText('New Item')).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Basic Info' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Nutrition (AI)' })).toBeInTheDocument();
        expect(screen.getByText('Save Draft')).toBeInTheDocument();
        expect(screen.getByText(/Save & Continue/)).toBeInTheDocument();
    });

    it('pre-fills fields in edit mode', () => {
        renderForm({
            mode: 'edit',
            initialValue: {
                id: 'menu-1',
                name: 'Chicken Dum Biryani',
                category: 'Rice & Biryani',
                foodType: 'Non-Veg',
                description: 'Tasty',
                servingSize: '250g',
                ingredients: ['Rice'],
                variants: [{ id: 'v1', label: '500g', price: '249' }],
                status: 'Active',
                nutritionApproved: true,
            },
        });
        expect(screen.getByText('Edit Menu Item')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Chicken Dum Biryani')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Update & Continue/ })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Save & Continue/ })).not.toBeInTheDocument();
        expect(screen.getByText('Non-Veg')).toBeInTheDocument();
    });

    it('uses server-backed categoryOptions when provided', async () => {
        const user = userEvent.setup();
        renderForm({
            categoryOptions: [
                { value: 'Rice & Biryani', label: 'Rice & Biryani' },
                { value: 'Noodles', label: 'Noodles' },
            ],
        });
        const combobox = screen.getByRole('combobox', { name: 'Category' });
        await user.click(combobox);
        expect(await screen.findByTitle('Noodles')).toBeInTheDocument();
        expect(screen.getByTitle('Rice & Biryani')).toBeInTheDocument();
        expect(screen.queryByTitle('Curries')).not.toBeInTheDocument();
    });

    it('shows validation errors on Save & Continue with empty mandatory fields', async () => {
        const user = userEvent.setup();
        const { onSaveContinue } = renderForm();
        await user.click(screen.getByRole('button', { name: /Save & Continue/ }));
        expect(await screen.findByText('Item Name is required')).toBeInTheDocument();
        expect(screen.getByText('Category is required')).toBeInTheDocument();
        expect(
            screen.getByText('At least one variant with a price is required'),
        ).toBeInTheDocument();
        expect(onSaveContinue).not.toHaveBeenCalled();
    });

    it('saves draft without validation', async () => {
        const user = userEvent.setup();
        const { onSaveDraft } = renderForm();
        await user.click(screen.getByRole('button', { name: 'Save Draft' }));
        expect(onSaveDraft).toHaveBeenCalledTimes(1);
        expect(onSaveDraft.mock.calls[0][0].status).toBe('Draft');
    });

    it('advances to Nutrition tab after valid Save & Continue', async () => {
        const user = userEvent.setup();
        renderForm();
        await user.type(screen.getByPlaceholderText('e.g. Chicken Dum Biryani'), 'Test Biryani');
        await user.click(screen.getByRole('combobox', { name: 'Category' }));
        await user.click(screen.getByTitle('Curries'));
        await user.type(screen.getByPlaceholderText('e.g. 500g'), 'Regular');
        await user.type(screen.getByPlaceholderText('Price'), '199');
        await user.click(screen.getByRole('button', { name: /Save & Continue/ }));
        expect(await screen.findByText('Generate Nutrition with AI')).toBeInTheDocument();
        expect(screen.getByText(/Test Biryani/)).toBeInTheDocument();
    });

    it('captures the selected food type on save', async () => {
        const user = userEvent.setup();
        const { onSaveContinue } = renderForm();
        await user.type(screen.getByPlaceholderText('e.g. Chicken Dum Biryani'), 'Test Biryani');
        await user.click(screen.getByRole('combobox', { name: 'Category' }));
        await user.click(screen.getByTitle('Curries'));
        await user.type(screen.getByPlaceholderText('e.g. 500g'), 'Regular');
        await user.type(screen.getByPlaceholderText('Price'), '199');
        await user.click(screen.getByRole('combobox', { name: 'Food Type' }));
        await user.click(screen.getByTitle('Veg'));
        await user.click(screen.getByRole('button', { name: /Save & Continue/ }));
        await waitFor(() => {
            expect(onSaveContinue).toHaveBeenCalledTimes(1);
        });
        expect(onSaveContinue.mock.calls[0][0].foodType).toBe('Veg');
    });
});
