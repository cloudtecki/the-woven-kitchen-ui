import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { App as AntApp, Empty, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ConfirmModal from 'components/custom/ConfirmModal';
import MenuCard from 'components/custom/MenuCard';
import TwkButton from 'components/custom/TwkButton';
import { ROUTES } from 'core/base/const/routes';
import type { MenuItem } from 'core/base/type/menu';
import { loadMenuItems, removeMenuItem } from 'pages/Admin/Menu/menu.storage';

import './Menu.scss';

const EXIT_MS = 220;

/**
 * Menu Items listing (UI-only). Cards animate in staggered,
 * lift on hover, slide in on add, fade+collapse on delete.
 */
const MenuPage = () => {
    const { t } = useTranslation(['admin']);
    const { message } = AntApp.useApp();
    const navigate = useNavigate();

    const [items, setItems] = useState<MenuItem[]>(() => loadMenuItems());
    const [query, setQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
    const [leavingId, setLeavingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
            (i) =>
                i.name.toLowerCase().includes(q) ||
                i.category.toLowerCase().includes(q),
        );
    }, [items, query]);

    const goAdd = () => navigate(ROUTES.ADMIN_MENU_NEW);
    const goEdit = (item: MenuItem) =>
        navigate(ROUTES.ADMIN_MENU_EDIT.replace(':id', item.id));

    const confirmDelete = () => {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        setLeavingId(id);
        // Let the exit animation play before removing from the grid.
        window.setTimeout(() => {
            const next = removeMenuItem(id);
            setItems(next);
            setLeavingId(null);
            setDeleteTarget(null);
            message.success(t('menu.deletedToast'));
        }, EXIT_MS);
    };

    return (
        <div className="twk-menu-page">
            <div className="twk-menu-page__head">
                <div>
                    <h2 className="twk-menu-page__title">{t('menu.title')}</h2>
                    <p className="twk-menu-page__desc">{t('pages.menu.description')}</p>
                </div>
                <TwkButton variant="primary" icon={<PlusOutlined />} onClick={goAdd}>
                    {t('menu.addItem')}
                </TwkButton>
            </div>

            <div className="twk-menu-page__toolbar">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('menu.searchPlaceholder')}
                    prefix={<SearchOutlined aria-hidden="true" />}
                    allowClear
                    aria-label={t('menu.searchPlaceholder')}
                    className="twk-menu-page__search"
                />
            </div>

            {filtered.length === 0 ? (
                <Empty description={t('menu.emptyList')} className="twk-menu-page__empty" />
            ) : (
                <div className="twk-menu-page__grid">
                    {filtered.map((item, idx) => (
                        <MenuCard
                            key={item.id}
                            item={item}
                            index={idx}
                            leaving={leavingId === item.id}
                            onEdit={goEdit}
                            onDelete={setDeleteTarget}
                        />
                    ))}
                </div>
            )}

            <ConfirmModal
                open={deleteTarget !== null}
                title={t('menu.deleteTitle')}
                body={deleteTarget ? t('menu.deleteBody', { name: deleteTarget.name }) : ''}
                confirmLabel={t('menu.confirmDelete')}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default MenuPage;
