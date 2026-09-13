import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button as AntButton } from 'antd';

import './TwkButton.scss';

export type TwkButtonVariant = 'primary' | 'secondary' | 'destructive' | 'link';

export type TwkButtonProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'type' | 'onClick' | 'color'
> & {
    variant?: TwkButtonVariant;
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
    htmlType?: 'button' | 'submit' | 'reset';
    onClick?: React.MouseEventHandler<HTMLElement>;
    ariaLabel?: string;
};

/**
 * Shared button primitive. Wraps Ant Design so all pages share
 * the same `twk-` styling while keeping antd a11y/behaviour.
 */
const TwkButton = ({
    variant = 'primary',
    loading = false,
    icon,
    children,
    htmlType = 'button',
    className = '',
    ariaLabel,
    ...rest
}: TwkButtonProps) => {
    const variantClass =
        variant === 'primary'
            ? 'twk-button--primary'
            : variant === 'secondary'
              ? 'twk-button--secondary'
              : variant === 'destructive'
                ? 'twk-button--destructive'
                : 'twk-button--link';

    return (
        <AntButton
            className={`twk-button ${variantClass} ${className}`.trim()}
            type={variant === 'primary' ? 'primary' : variant === 'link' ? 'link' : 'default'}
            danger={variant === 'destructive'}
            loading={loading}
            icon={icon}
            htmlType={htmlType}
            aria-label={ariaLabel}
            {...rest}
        >
            {children}
        </AntButton>
    );
};

export default TwkButton;
