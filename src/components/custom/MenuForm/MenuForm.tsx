import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeftOutlined,
    CameraOutlined,
    CloseOutlined,
    ProductOutlined,
    RobotOutlined,
} from '@ant-design/icons';
import { App as AntApp, Input, Select, Tag, Tooltip } from 'antd';
import TwkButton from 'components/custom/TwkButton';
import type { MenuFormMode, MenuItem, MenuItemStatus, MenuVariant } from 'core/base/type/menu';
import { MENU_CATEGORIES } from 'core/base/type/menu';

import './MenuForm.scss';

export type MenuFormProps = {
    mode: MenuFormMode;
    initialValue?: MenuItem;
    onBack: () => void;
    onSaveDraft: (item: MenuItem) => void;
    onSaveContinue: (item: MenuItem) => void;
};

type TabKey = 'basic' | 'nutrition';

const newVariant = (label = '', price = '', offerPrice = ''): MenuVariant => ({
    id: `v-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    label,
    price,
    offerPrice,
});

const toMenuItem = (
    base: Partial<MenuItem> | undefined,
    fields: {
        name: string;
        category: string;
        description: string;
        servingSize: string;
        ingredients: string[];
        variants: MenuVariant[];
        imageUrl?: string;
        status: MenuItemStatus;
    },
    statusOverride?: MenuItemStatus,
): MenuItem => ({
    id: base?.id ?? `menu-${Date.now()}`,
    name: fields.name.trim(),
    category: fields.category,
    description: fields.description.trim() || undefined,
    servingSize: fields.servingSize.trim() || undefined,
    ingredients: fields.ingredients,
    variants: fields.variants.filter((v) => v.label.trim() || v.price.trim()),
    imageUrl: fields.imageUrl,
    status: statusOverride ?? fields.status,
    nutritionApproved: base?.nutritionApproved ?? false,
});

/**
 * Shared Add/Edit Menu Item form. `mode` controls title text and
 * whether fields start empty (create) or pre-filled (edit).
 * UI-only: no backend calls; parents persist to local list state.
 */
const MenuForm = ({ mode, initialValue, onBack, onSaveDraft, onSaveContinue }: MenuFormProps) => {
    const { t } = useTranslation(['admin']);
    const { message } = AntApp.useApp();
    const fileRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<TabKey>('basic');
    const [name, setName] = useState(initialValue?.name ?? '');
    const [category, setCategory] = useState(initialValue?.category ?? '');
    const [description, setDescription] = useState(initialValue?.description ?? '');
    const [servingSize, setServingSize] = useState(initialValue?.servingSize ?? '');
    const [ingredients, setIngredients] = useState<string[]>(initialValue?.ingredients ?? []);
    const [addingIngredient, setAddingIngredient] = useState(false);
    const [ingredientDraft, setIngredientDraft] = useState('');
    const [variants, setVariants] = useState<MenuVariant[]>(
        initialValue?.variants?.length ? initialValue.variants : [newVariant()],
    );
    const [imageUrl, setImageUrl] = useState<string | undefined>(initialValue?.imageUrl);
    const [status, setStatus] = useState<MenuItemStatus>(
        initialValue?.status && initialValue.status !== 'Draft'
            ? initialValue.status
            : 'Active',
    );
    const [errors, setErrors] = useState<{ name?: string; category?: string; variants?: string }>({});
    const [touched, setTouched] = useState(false);

    const subtitle = useMemo(() => {
        if (mode === 'edit') return initialValue?.name || t('menu.editItem');
        return t('menu.newItem');
    }, [mode, initialValue, t]);

    const validate = () => {
        const next: typeof errors = {};
        if (!name.trim()) next.name = t('menu.itemNameRequired');
        if (!category) next.category = t('menu.categoryRequired');
        const hasPricedVariant = variants.some((v) => v.price.trim());
        if (!hasPricedVariant) next.variants = t('menu.variantRequired');
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const collect = () => ({
        name,
        category,
        description,
        servingSize,
        ingredients,
        variants,
        imageUrl,
        status,
    });

    const handleSaveDraft = () => {
        const item = toMenuItem(initialValue, collect(), 'Draft');
        onSaveDraft(item);
        message.success(t('menu.draftSavedToast'));
    };

    const handleSaveContinue = () => {
        setTouched(true);
        if (!validate()) return;
        const item = toMenuItem(initialValue, collect());
        onSaveContinue(item);
        message.success(t('menu.savedToast'));
        setActiveTab('nutrition');
    };

    const addIngredient = () => {
        const value = ingredientDraft.trim();
        if (!value) {
            setAddingIngredient(false);
            setIngredientDraft('');
            return;
        }
        if (!ingredients.includes(value)) setIngredients((prev) => [...prev, value]);
        setIngredientDraft('');
        setAddingIngredient(false);
    };

    const updateVariant = (id: string, patch: Partial<MenuVariant>) => {
        setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
        if (touched) validate();
    };

    const removeVariant = (id: string) => {
        setVariants((prev) => (prev.length <= 1 ? prev : prev.filter((v) => v.id !== id)));
    };

    const handleImageFile = (file: File | undefined) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setImageUrl(url);
    };

    const showGenerateSoon = () => {
        message.info(t('menu.comingSoon'));
    };

    return (
        <div className="twk-menu-form">
            <div className="twk-menu-form__header">
                <button
                    type="button"
                    className="twk-menu-form__back"
                    onClick={onBack}
                    aria-label={t('menu.backToList')}
                >
                    <ArrowLeftOutlined />
                </button>
                <div className="twk-menu-form__titles">
                    <h2 className="twk-menu-form__title">
                        {mode === 'create' ? t('menu.addItem') : t('menu.editItem')}
                    </h2>
                    <p className="twk-menu-form__subtitle">{subtitle}</p>
                </div>
            </div>

            <div className="twk-menu-form__tabs" role="tablist" aria-label={t('menu.title')}>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'basic'}
                    className={`twk-menu-form__tab${activeTab === 'basic' ? ' twk-menu-form__tab--active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                >
                    {t('menu.basicInfo')}
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'nutrition'}
                    className={`twk-menu-form__tab${activeTab === 'nutrition' ? ' twk-menu-form__tab--active' : ''}`}
                    onClick={() => setActiveTab('nutrition')}
                >
                    {t('menu.nutritionAi')}
                </button>
            </div>

            {activeTab === 'basic' ? (
                <div className="twk-menu-form__panel" role="tabpanel">
                    <div className="twk-menu-form__field">
                        <label htmlFor="twk-menu-name">
                            {t('menu.itemName')} <span aria-hidden="true">*</span>
                        </label>
                        <Input
                            id="twk-menu-name"
                            value={name}
                            placeholder={t('menu.itemNamePlaceholder')}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (touched) validate();
                            }}
                            status={errors.name ? 'error' : undefined}
                        />
                        {touched && errors.name && (
                            <span className="twk-menu-form__error">{errors.name}</span>
                        )}
                    </div>

                    <div className="twk-menu-form__field">
                        <label htmlFor="twk-menu-category">
                            {t('menu.category')} <span aria-hidden="true">*</span>
                        </label>
                        <Select
                            id="twk-menu-category"
                            value={category || undefined}
                            placeholder={t('menu.categoryPlaceholder')}
                            onChange={(v) => {
                                setCategory(v);
                                if (touched) validate();
                            }}
                            status={errors.category ? 'error' : undefined}
                            options={MENU_CATEGORIES.map((c) => ({ value: c, label: c }))}
                            aria-label={t('menu.category')}
                        />
                        {touched && errors.category && (
                            <span className="twk-menu-form__error">{errors.category}</span>
                        )}
                    </div>

                    <div className="twk-menu-form__field">
                        <label htmlFor="twk-menu-desc">{t('menu.description')}</label>
                        <Input.TextArea
                            id="twk-menu-desc"
                            value={description}
                            rows={3}
                            placeholder={t('menu.descriptionPlaceholder')}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="twk-menu-form__field">
                        <label htmlFor="twk-menu-serving">{t('menu.servingSize')}</label>
                        <Input
                            id="twk-menu-serving"
                            value={servingSize}
                            placeholder={t('menu.servingSizePlaceholder')}
                            onChange={(e) => setServingSize(e.target.value)}
                        />
                    </div>

                    <div className="twk-menu-form__field">
                        <span className="twk-menu-form__label">{t('menu.ingredients')}</span>
                        <div className="twk-menu-form__chips">
                            {ingredients.map((ing) => (
                                <Tag
                                    key={ing}
                                    closable
                                    onClose={() =>
                                        setIngredients((prev) => prev.filter((i) => i !== ing))
                                    }
                                    className="twk-menu-form__chip"
                                >
                                    {ing}
                                </Tag>
                            ))}
                            {addingIngredient ? (
                                <Input
                                    autoFocus
                                    size="small"
                                    value={ingredientDraft}
                                    placeholder={t('menu.ingredientPlaceholder')}
                                    onChange={(e) => setIngredientDraft(e.target.value)}
                                    onPressEnter={addIngredient}
                                    onBlur={addIngredient}
                                    className="twk-menu-form__chip-input"
                                />
                            ) : (
                                <button
                                    type="button"
                                    className="twk-menu-form__link"
                                    onClick={() => setAddingIngredient(true)}
                                >
                                    {t('menu.addIngredient')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="twk-menu-form__field">
                        <div className="twk-menu-form__row-head">
                            <span className="twk-menu-form__label">{t('menu.variantsPricing')}</span>
                            <button
                                type="button"
                                className="twk-menu-form__link"
                                onClick={() => setVariants((prev) => [...prev, newVariant()])}
                            >
                                {t('menu.addVariant')}
                            </button>
                        </div>
                        <div className="twk-menu-form__variants">
                            {variants.map((v) => (
                                <div key={v.id} className="twk-menu-form__variant-row">
                                    <Input
                                        value={v.label}
                                        placeholder={t('menu.variantPlaceholder')}
                                        onChange={(e) =>
                                            updateVariant(v.id, { label: e.target.value })
                                        }
                                        aria-label={t('menu.variantLabel')}
                                        className="twk-menu-form__variant-label"
                                    />
                                    <Input
                                        value={v.price}
                                        placeholder={t('menu.price')}
                                        inputMode="decimal"
                                        onChange={(e) =>
                                            updateVariant(v.id, { price: e.target.value })
                                        }
                                        aria-label={t('menu.price')}
                                    />
                                    <Input
                                        value={v.offerPrice ?? ''}
                                        placeholder={t('menu.offerPrice')}
                                        inputMode="decimal"
                                        onChange={(e) =>
                                            updateVariant(v.id, { offerPrice: e.target.value })
                                        }
                                        aria-label={t('menu.offerPrice')}
                                        className={
                                            v.offerPrice?.trim()
                                                ? 'twk-menu-form__offer-set'
                                                : undefined
                                        }
                                    />
                                    <Tooltip title="Remove">
                                        <button
                                            type="button"
                                            className="twk-menu-form__remove"
                                            onClick={() => removeVariant(v.id)}
                                            aria-label={`Remove variant ${v.label || ''}`}
                                            disabled={variants.length <= 1}
                                        >
                                            <CloseOutlined />
                                        </button>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                        {touched && errors.variants && (
                            <span className="twk-menu-form__error">{errors.variants}</span>
                        )}
                    </div>

                    <div className="twk-menu-form__field">
                        <span className="twk-menu-form__label">{t('menu.foodImage')}</span>
                        <button
                            type="button"
                            className="twk-menu-form__upload"
                            onClick={() => fileRef.current?.click()}
                            aria-label={t('menu.foodImageHint')}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={name || t('menu.foodImage')}
                                    className="twk-menu-form__preview"
                                />
                            ) : (
                                <>
                                    <CameraOutlined className="twk-menu-form__upload-icon" />
                                    <span className="twk-menu-form__upload-hint">
                                        {t('menu.foodImageHint')}
                                    </span>
                                    <span className="twk-menu-form__upload-sub">
                                        {t('menu.foodImageConstraints')}
                                    </span>
                                </>
                            )}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            hidden
                            onChange={(e) => handleImageFile(e.target.files?.[0])}
                            aria-hidden="true"
                            tabIndex={-1}
                        />
                    </div>

                    <div className="twk-menu-form__field">
                        <label htmlFor="twk-menu-status">{t('menu.status')}</label>
                        <Select
                            id="twk-menu-status"
                            value={status}
                            onChange={(v: MenuItemStatus) => setStatus(v)}
                            options={[
                                { value: 'Active', label: t('menu.statusActive') },
                                { value: 'Inactive', label: t('menu.statusInactive') },
                            ]}
                            aria-label={t('menu.status')}
                        />
                    </div>

                    <div className="twk-menu-form__footer">
                        <TwkButton variant="secondary" onClick={handleSaveDraft}>
                            {t('menu.saveDraft')}
                        </TwkButton>
                        <TwkButton variant="primary" onClick={handleSaveContinue}>
                            {t('menu.saveContinue')} →
                        </TwkButton>
                    </div>
                </div>
            ) : (
                <div className="twk-menu-form__panel" role="tabpanel">
                    <div className="twk-menu-form__summary">
                        <div className="twk-menu-form__summary-title">
                            <ProductOutlined aria-hidden="true" />
                            <strong>{name || t('menu.newItem')}</strong>
                        </div>
                        <div className="twk-menu-form__summary-chips">
                            {servingSize.trim() && (
                                <span className="twk-menu-form__pill">
                                    {t('menu.serving', { value: servingSize.trim() })}
                                </span>
                            )}
                            <span className="twk-menu-form__pill">
                                {t('menu.ingredientsCount', { count: ingredients.length })}
                            </span>
                        </div>
                    </div>

                    <div className="twk-menu-form__ai-card">
                        <RobotOutlined
                            className="twk-menu-form__ai-icon"
                            aria-hidden="true"
                        />
                        <h3>{t('menu.generateTitle')}</h3>
                        <p>{t('menu.generateBody')}</p>
                        <TwkButton variant="primary" onClick={showGenerateSoon}>
                            {initialValue?.nutritionApproved
                                ? t('menu.regenerateButton')
                                : t('menu.generateButton')}{' '}
                            ✨
                        </TwkButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuForm;
