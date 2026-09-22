import { App as AntApp } from 'antd';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmptyMenuState from './EmptyMenuState';

describe('EmptyMenuState', () => {
    it('renders title, hint and action that fires on click', async () => {
        const user = userEvent.setup();
        const onAction = vi.fn();
        render(
            <AntApp>
                <EmptyMenuState
                    title="No Menu Items Yet"
                    description="Add your first menu item to get started."
                    actionLabel="+ Add Menu Item"
                    onAction={onAction}
                />
            </AntApp>,
        );
        expect(screen.getByText('No Menu Items Yet')).toBeInTheDocument();
        expect(
            screen.getByText('Add your first menu item to get started.'),
        ).toBeInTheDocument();
        await user.click(
            within(screen.getByTestId('empty-menu-state')).getByRole('button', {
                name: /Add Menu Item/,
            }),
        );
        expect(onAction).toHaveBeenCalledTimes(1);
    });
});
