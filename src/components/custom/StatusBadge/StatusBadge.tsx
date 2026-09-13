import './StatusBadge.scss';

export type StatusBadgeVariant = 'active' | 'inactive' | 'draft' | 'approved' | 'pending';

export type StatusBadgeProps = {
    variant: StatusBadgeVariant;
    label: string;
};

/**
 * Shared status pill. Colour transitions are animated so toggling
 * Active ↔ Inactive fades rather than switching instantly.
 */
const StatusBadge = ({ variant, label }: StatusBadgeProps) => (
    <span className={`twk-status-badge twk-status-badge--${variant}`}>
        {variant === 'approved' && <span aria-hidden="true">✓ </span>}
        {variant === 'pending' && <span aria-hidden="true">⏳ </span>}
        {label}
    </span>
);

export default StatusBadge;
