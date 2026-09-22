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

type CardPricing =
    | { kind: 'offer'; original: number; offer: number }
    | { kind: 'plain'; value: string }
    | null;

/**
 * Best price to headline on the card. When any variant carries an offer
 * price, the original is shown struck-through next to the highlighted
 * offer (the cheapest offer wins). Otherwise the plain price/range is used.
 */
const cardPricing = (item: MenuItem): CardPricing => {
    const parsed = item.variants
        .map((v) => ({
            original: Number(v.price),
            offer: v.offerPrice?.trim() ? Number(v.offerPrice) : undefined,
        }))
        .filter((p) => Number.isFinite(p.original));

    if (parsed.length === 0) return null;

    const offers = parsed.filter(
        (p): p is { original: number; offer: number } =>
            p.offer !== undefined && Number.isFinite(p.offer),
    );
    if (offers.length > 0) {
        const best = offers.reduce((a, b) => (a.offer <= b.offer ? a : b));
        return { kind: 'offer', original: best.original, offer: best.offer };
    }

    const originals = parsed.map((p) => p.original);
    const min = Math.min(...originals);
    const max = Math.max(...originals);
    return { kind: 'plain', value: min === max ? `₹${min}` : `₹${min} – ₹${max}` };
};

/**
 * Menu listing card: status pill, OFFER ribbon, nutrition pill, price pair
 * (struck-through original + highlighted offer), Veg/Non-Veg badge, and
 * Edit/Delete actions. Entry/exit/hover animations are CSS-only.
 */
const MenuCard = ({ item, index = 0, leaving = false, onEdit, onDelete }: MenuCardProps) => {
    const { t } = useTranslation(['admin']);
    const hasOffer = item.variants.some((v) => v.offerPrice?.trim());
    const pricing = cardPricing(item);
    const isVeg = item.foodType === 'Veg';
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
                    <div className="twk-menu-card__meta">
                        <span className="twk-menu-card__category">{item.category}</span>
                        <span
                            className={`twk-menu-card__badge twk-menu-card__badge--${isVeg ? 'veg' : 'nonveg'}`}
                        >
                            {isVeg ? t('menu.foodTypeVeg') : t('menu.foodTypeNonVeg')}
                        </span>
                    </div>
                </div>
                {item.description && (
                    <p className="twk-menu-card__desc">{item.description}</p>
                )}
                <div className="twk-menu-card__pricing">
                    <div className="twk-menu-card__prices">
                        {pricing?.kind === 'offer' ? (
                            <>
                                <span
                                    className="twk-menu-card__price twk-menu-card__price--struck"
                                    aria-label={`Original price ₹${pricing.original}`}
                                >
                                    ₹{pricing.original}
                                </span>
                                <span
                                    className="twk-menu-card__price twk-menu-card__price--offer"
                                    aria-label={`Offer price ₹${pricing.offer}`}
                                >
                                    ₹{pricing.offer}
                                </span>
                            </>
                        ) : (
                            <span className="twk-menu-card__price">
                                {pricing?.kind === 'plain' ? pricing.value : '—'}
                            </span>
                        )}
                    </div>
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
