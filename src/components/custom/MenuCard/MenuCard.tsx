import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import StatusBadge from 'components/custom/StatusBadge';
import type { MenuItem } from 'core/base/type/menu';

import './MenuCard.scss';

export type MenuCardProps = {
    item: MenuItem;
    index?: number;
    leaving?: boolean;
    onEdit: (item: MenuItem) => void;
    onDelete: (item: MenuItem) => void;
};

const priceRange = (item: MenuItem): string => {
    const prices = item.variants
        .map((v) => Number(v.offerPrice ?? v.price))
        .filter((n) => !Number.isNaN(n));
    if (prices.length === 0) return '—';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₹${min}` : `₹${min} – ₹${max}`;
};

/**
 * Menu listing card: status pill, OFFER ribbon, nutrition pill,
 * Edit/Delete actions. Entry/exit/hover animations are CSS-only.
 */
const MenuCard = ({ item, index = 0, leaving = false, onEdit, onDelete }: MenuCardProps) => {
    const { t } = useTranslation(['admin']);
    const hasOffer = item.variants.some((v) => v.offerPrice?.trim());
    const statusVariant =
        item.status === 'Active' ? 'active' : item.status === 'Draft' ? 'draft' : 'inactive';

    const style = { '--twk-card-delay': `${Math.min(index, 12) * 60}ms` } as CSSProperties;

    return (
        <article
            className={`twk-menu-card${leaving ? ' twk-menu-card--leaving' : ''}`}
            style={style}
            data-testid={`menu-card-${item.id}`}
            aria-label={item.name}
        >
            <div className="twk-menu-card__media">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="twk-menu-card__image" />
                ) : (
                    <div className="twk-menu-card__image twk-menu-card__image--placeholder" aria-hidden="true">
                        <PictureOutlined />
                    </div>
                )}
                {hasOffer && (
                    <span className="twk-menu-card__offer">{t('menu.offer')}</span>
                )}
                <span className="twk-menu-card__status">
                    <StatusBadge
                        variant={statusVariant}
                        label={t(
                            item.status === 'Active'
                                ? 'menu.statusActive'
                                : item.status === 'Draft'
                                  ? 'menu.statusDraft'
                                  : 'menu.statusInactive',
                        )}
                    />
                </span>
            </div>
            <div className="twk-menu-card__body">
                <div className="twk-menu-card__top">
                    <h3 className="twk-menu-card__name">{item.name}</h3>
                    <span className="twk-menu-card__category">{item.category}</span>
                </div>
                {item.description && (
                    <p className="twk-menu-card__desc">{item.description}</p>
                )}
                <div className="twk-menu-card__pricing">
                    <span className="twk-menu-card__price">{priceRange(item)}</span>
                    <StatusBadge
                        variant={item.nutritionApproved ? 'approved' : 'pending'}
                        label={t(
                            item.nutritionApproved
                                ? 'menu.nutritionApproved'
                                : 'menu.nutritionPending',
                        )}
                    />
                </div>
                <div className="twk-menu-card__actions">
                    <button
                        type="button"
                        className="twk-menu-card__action"
                        onClick={() => onEdit(item)}
                        aria-label={`${t('menu.edit')} ${item.name}`}
                    >
                        <EditOutlined /> {t('menu.edit')}
                    </button>
                    <button
                        type="button"
                        className="twk-menu-card__action twk-menu-card__action--danger"
                        onClick={() => onDelete(item)}
                        aria-label={`${t('menu.delete')} ${item.name}`}
                    >
                        <DeleteOutlined /> {t('menu.delete')}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default MenuCard;
