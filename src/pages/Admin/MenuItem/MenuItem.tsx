import { useNavigate, useParams } from 'react-router';
import MenuForm from 'components/custom/MenuForm';
import { ROUTES } from 'core/base/const/routes';
import type { MenuItem } from 'core/base/type/menu';
import { findMenuItem, upsertMenuItem } from 'pages/Admin/Menu/menu.storage';

import './MenuItem.scss';

/**
 * Add / Edit Menu Item page. Both modes share `MenuForm`;
 * `mode` controls title text and empty vs. pre-filled state.
 * UI-only: persists to localStorage, no backend calls.
 */
const MenuItemPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const mode = id ? 'edit' : 'create';
    const initialValue = id ? findMenuItem(id) : undefined;

    const goBack = () => navigate(ROUTES.ADMIN_MENU);

    const handleSave = (item: MenuItem) => {
        upsertMenuItem(item);
        // Save & Continue stays on the form (advances to Nutrition tab
        // inside MenuForm); only Draft with explicit back navigates.
        // For create-mode saves we keep the user on the page per spec
        // ("stays on the same page" for draft; continue advances tab).
    };

    const handleDraftAndBack = (item: MenuItem) => {
        handleSave(item);
        // Draft stays on same page per spec — do not navigate away.
    };

    return (
        <div className="twk-menu-item-page">
            <MenuForm
                mode={mode}
                initialValue={initialValue}
                onBack={goBack}
                onSaveDraft={handleDraftAndBack}
                onSaveContinue={handleSave}
            />
        </div>
    );
};

export default MenuItemPage;
