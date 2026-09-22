import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { App as AntApp, Input, Skeleton } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ConfirmModal from 'components/custom/ConfirmModal';
import EmptyMenuState from 'components/custom/EmptyMenuState';
import MenuCard from 'components/custom/MenuCard';
import TwkButton from 'components/custom/TwkButton';
import { useGetMenuItemsQuery } from 'core/api/menu/queries';
import { useDeleteMenuItemMutation } from 'core/api/menu/mutations';
import { ROUTES } from 'core/base/const/routes';
import type { MenuItem } from 'core/base/type/menu';
import { mapApiMenuItemToUi, rememberCategories } from 'core/service/menu.service';

import './Menu.scss';

const EXIT_MS = 220;

/**
 * Menu Items listing backed by the Menu API. Cards animate in staggered,
 * lift on hover, slide in on add, fade+collapse on delete. An animated
 * empty state replaces the grid when there are no items.
 */
const MenuPage = () => {
    const { t } = useTranslation(['admin']);
    const { message } = AntApp.useApp();
    const navigate = useNavigate();

    const {
        data: menuResponse,
        isLoading,
        isFetching,
        isError,
    } = useGetMenuItemsQuery({ page: 1, limit: 100 });
    const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

    const [query, setQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
    const [leavingId, setLeavingId] = useState<string | null>(null);

    const items = useMemo<MenuItem[]>(() => {
        const apiItems = menuResponse?.data ?? [];
        rememberCategories(apiItems);
        return apiItems.map(mapApiMenuItemToUi);
    }, [menuResponse]);

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

    const confirmDelete = async () => {
        if (!deleteTarget || isDeleting) return;
        const id = deleteTarget.id;
        setLeavingId(id);
        // Let the exit animation play before calling the API.
        await new Promise((resolve) => window.setTimeout(resolve, EXIT_MS));
        const result = await deleteMenuItem(id);
        if (!result.data) {
            // Keep the item in the list; do not silently fail.
            setLeavingId(null);
            message.error(t('menu.deleteFailed'));
            return;
        }
        setLeavingId(null);
        setDeleteTarget(null);
        message.success(t('menu.deletedToast'));
    };

    const loading = isLoading || isFetching;

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

            {loading ? (
                <div className="twk-menu-page__grid" aria-busy="true" aria-label={t('menu.title')}>
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="twk-menu-page__skeleton-card">
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <EmptyMenuState
                    title={t('menu.loadFailed')}
                    description={t('menu.emptyHint')}
                    actionLabel={t('menu.addItem')}
                    onAction={goAdd}
                />
            ) : filtered.length === 0 ? (
                <EmptyMenuState
                    title={t('menu.emptyTitle')}
                    description={t('menu.emptyHint')}
                    actionLabel={`+ ${t('menu.addItem')}`}
                    onAction={goAdd}
                />
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
                loading={isDeleting}
                onCancel={() => {
                    if (!isDeleting) setDeleteTarget(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default MenuPage;
