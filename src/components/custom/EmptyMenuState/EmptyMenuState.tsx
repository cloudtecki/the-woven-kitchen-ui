import { PlusOutlined } from '@ant-design/icons';
import TwkButton from 'components/custom/TwkButton';

import './EmptyMenuState.scss';

export type EmptyMenuStateProps = {
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
};

/**
 * Reusable animated empty state. Shows a gently floating empty-plate
 * illustration (fade-in + scale-up on load, soft looping float),
 * a heading, supporting text and a primary action button.
 */
const EmptyMenuState = ({ title, description, actionLabel, onAction }: EmptyMenuStateProps) => (
    <div className="twk-empty-menu" data-testid="empty-menu-state" role="status">
        <div className="twk-empty-menu__art" aria-hidden="true">
            <svg viewBox="0 0 200 160" focusable="false">
                <g className="twk-empty-menu__steam">
                    <path d="M86 52 c 4 -7 -4 -12 0 -19 c 4 -7 -4 -12 0 -19" />
                    <path d="M100 52 c 4 -7 -4 -12 0 -19 c 4 -7 -4 -12 0 -19" />
                    <path d="M114 52 c 4 -7 -4 -12 0 -19 c 4 -7 -4 -12 0 -19" />
                </g>
                <g className="twk-empty-menu__plate-group">
                    <ellipse
                        className="twk-empty-menu__plate-shadow"
                        cx="100"
                        cy="132"
                        rx="52"
                        ry="9"
                    />
                    <ellipse
                        className="twk-empty-menu__plate"
                        cx="100"
                        cy="108"
                        rx="58"
                        ry="26"
                    />
                    <ellipse
                        className="twk-empty-menu__plate-inner"
                        cx="100"
                        cy="106"
                        rx="42"
                        ry="18"
                    />
                    <g className="twk-empty-menu__cutlery">
                        <rect x="34" y="86" width="5" height="42" rx="2.5" transform="rotate(18 36 107)" />
                        <rect x="161" y="86" width="5" height="42" rx="2.5" transform="rotate(-18 163 107)" />
                    </g>
                    <g className="twk-empty-menu__sparkles">
                        <circle cx="52" cy="52" r="3" />
                        <circle cx="150" cy="44" r="2.5" />
                        <circle cx="162" cy="76" r="2" />
                    </g>
                </g>
            </svg>
        </div>
        <h3 className="twk-empty-menu__title">{title}</h3>
        <p className="twk-empty-menu__desc">{description}</p>
        <TwkButton variant="primary" icon={<PlusOutlined />} onClick={onAction}>
            {actionLabel}
        </TwkButton>
    </div>
);

export default EmptyMenuState;
