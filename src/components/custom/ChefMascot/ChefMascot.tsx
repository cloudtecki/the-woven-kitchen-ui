import type { FoodAnimationVariant } from 'components/custom/FoodAnimation';

import './ChefMascot.scss';

export type ChefMascotProps = {
    variant: FoodAnimationVariant;
    label?: string;
};

const ChefMascot = ({ variant, label }: ChefMascotProps) => {
    const mustache = variant === 'login';

    return (
        <div
            className={`twk-chef-mascot twk-chef-mascot--${variant}`}
            role="img"
            aria-label={label}
        >
            <svg viewBox="0 0 170 150" focusable="false" aria-hidden="true">
                <ellipse cx="85" cy="78" rx="66" ry="64" className="twk-chef-mascot__halo" />

                <g className="twk-chef-mascot__sprig twk-chef-mascot__sprig--left">
                    <path d="M28 52 c 8 -10 20 -11 30 -4 c -8 10 -20 11 -30 4 z" />
                    <path d="M30 50 c 6 6 12 10 18 12" />
                </g>
                <g className="twk-chef-mascot__sprig twk-chef-mascot__sprig--right">
                    <path d="M142 48 c -8 -10 -20 -11 -30 -4 c 8 10 20 11 30 4 z" />
                    <path d="M140 46 c -6 6 -12 10 -18 12" />
                </g>
                <circle cx="42" cy="112" r="3.4" className="twk-chef-mascot__dot" />
                <circle cx="130" cy="116" r="2.6" className="twk-chef-mascot__dot" />
                <circle cx="146" cy="86" r="3" className="twk-chef-mascot__dot" />

                {!mustache && (
                    <g className="twk-chef-mascot__arm">
                        <path d="M44 108 c -8 2 -13 8 -14 18" />
                        <circle cx="30" cy="127" r="4.5" />
                        <path d="M30 124 L22 96" />
                        <ellipse cx="20" cy="88" rx="5" ry="9" />
                        <path d="M20 88 m -5 0 a 5 9 0 0 0 10 0 M20 88 m -2.5 0 a 2.5 9 0 0 0 5 0 M20 88 l 0 0" />
                    </g>
                )}

                <g className="twk-chef-mascot__hat">
                    <circle cx="62" cy="46" r="17" />
                    <circle cx="85" cy="36" r="20" />
                    <circle cx="108" cy="46" r="17" />
                    <rect x="60" y="52" width="50" height="15" rx="7.5" />
                </g>

                <circle cx="85" cy="98" r="36" className="twk-chef-mascot__face" />

                <ellipse cx="72" cy="94" rx="4.4" ry="5.4" className="twk-chef-mascot__eye" />
                <circle cx="73.6" cy="92.2" r="1.5" className="twk-chef-mascot__spark" />
                {mustache ? (
                    <>
                        <ellipse cx="98" cy="94" rx="4.4" ry="5.4" className="twk-chef-mascot__eye" />
                        <circle cx="99.6" cy="92.2" r="1.5" className="twk-chef-mascot__spark" />
                    </>
                ) : (
                    <path d="M93 94 q 5 -6 11 -1" className="twk-chef-mascot__wink" />
                )}

                <ellipse cx="62" cy="106" rx="5" ry="3.4" className="twk-chef-mascot__blush" />
                <ellipse cx="108" cy="106" rx="5" ry="3.4" className="twk-chef-mascot__blush" />

                {mustache ? (
                    <g className="twk-chef-mascot__mouth">
                        <path d="M78 108 c 2 5 12 5 14 0 c -4 1 -10 1 -14 0 z" />
                        <path
                            className="twk-chef-mascot__mustache"
                            d="M85 112 c -8 1 -17 -1 -21 -7 c 6 -1 9 0 12 1 c -3 -3 -3 -6 -2 -8 c 5 2 9 6 11 11 c 2 -5 6 -9 11 -11 c 1 2 1 5 -2 8 c 3 -1 6 -2 12 -1 c -4 6 -13 8 -21 7 z"
                        />
                    </g>
                ) : (
                    <g className="twk-chef-mascot__mouth">
                        <path d="M73 106 c 3 9 21 9 24 0 c -1 6 -6 10 -12 10 s -11 -4 -12 -10 z" />
                        <path d="M79 112 c 2 2 10 2 12 0 c -1 3 -4 4 -6 4 s -5 -1 -6 -4 z" />
                    </g>
                )}
            </svg>
        </div>
    );
};

export default ChefMascot;
