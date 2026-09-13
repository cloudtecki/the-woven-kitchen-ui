import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import TwkButton from 'components/custom/TwkButton';

import './ConfirmModal.scss';

export type ConfirmModalProps = {
    open: boolean;
    title: string;
    body: string;
    confirmLabel: string;
    cancelLabel?: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

/**
 * Shared destructive confirmation dialog (used for Delete Menu Item).
 * Cancel / outside-click closes without action.
 */
const ConfirmModal = ({
    open,
    title,
    body,
    confirmLabel,
    cancelLabel,
    loading = false,
    onCancel,
    onConfirm,
}: ConfirmModalProps) => {
    const { t } = useTranslation(['admin']);

    return (
        <Modal
            className="twk-confirm-modal"
            open={open}
            title={title}
            onCancel={onCancel}
            maskClosable
            footer={null}
            destroyOnHidden
            aria-label={title}
        >
            <p className="twk-confirm-modal__body">{body}</p>
            <div className="twk-confirm-modal__actions">
                <TwkButton variant="secondary" onClick={onCancel}>
                    {cancelLabel ?? t('menu.cancel')}
                </TwkButton>
                <TwkButton variant="destructive" loading={loading} onClick={onConfirm}>
                    {confirmLabel}
                </TwkButton>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
