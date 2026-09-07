import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const strokeDefaults = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

export const ChefHatIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
        <path
            d="M12 3.5c-2.4 0-4.2 1.5-4.7 3.6-1.7.3-3 1.8-3 3.6 0 2 1.6 3.6 3.5 3.6.4 0 .8-.1 1.1-.2V19h6.2v-5.5c.3.1.7.2 1.1.2 1.9 0 3.5-1.6 3.5-3.6 0-1.8-1.3-3.3-3-3.6C16.2 5 14.4 3.5 12 3.5z"
            fill="currentColor"
            stroke="none"
        />
        <rect x="7.6" y="16.4" width="8.8" height="2.4" rx="1.2" fill="currentColor" stroke="none" />
    </svg>
);

export const ShieldCheckIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <path d="M12 3l7 2.8v5.4c0 4.4-2.9 7.3-7 9.3-4.1-2-7-4.9-7-9.3V5.8L12 3z" />
        <path d="M9 11.6l2.1 2.1 4-4.2" />
    </svg>
);

export const LeafIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <path d="M5.5 19.5C5.5 10.5 12 5 20 5c0 8-5.2 14.5-14.5 14.5z" />
        <path d="M5.5 19.5c2.8-4.8 6.4-8.6 11-10.8" />
    </svg>
);

export const TruckIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <path d="M2.5 6.5h11.5V16H2.5z" />
        <path d="M14 10h3.6l3.4 3.4V16H14" />
        <circle cx="7" cy="17.8" r="1.8" />
        <circle cx="17.2" cy="17.8" r="1.8" />
    </svg>
);

export const HeartIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
        <path
            d="M12 20.5S3.5 15.4 3.5 9.6C3.5 6.9 5.6 5 8 5c1.6 0 3.1.9 4 2.2C12.9 5.9 14.4 5 16 5c2.4 0 4.5 1.9 4.5 4.6 0 5.8-8.5 10.9-8.5 10.9z"
            fill="currentColor"
            stroke="none"
        />
    </svg>
);

export const ClocheIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <path d="M4 16.5h16" />
        <path d="M5 16.5a7 7 0 0 1 14 0" />
        <path d="M12 9.5V7.5" />
        <circle cx="12" cy="6" r="1.2" />
        <path d="M3 19.5h18" />
    </svg>
);

export const ClockIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3.2 2" />
    </svg>
);

export const SmileIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.5 14.5c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2" />
        <circle cx="9" cy="9.8" r="0.4" fill="currentColor" />
        <circle cx="15" cy="9.8" r="0.4" fill="currentColor" />
    </svg>
);

export const ScooterIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <circle cx="6" cy="17" r="2.4" />
        <circle cx="18" cy="17" r="2.4" />
        <path d="M8.4 17h5l1.6-6H18" />
        <path d="M13 5.5h3.5L18 11" />
        <path d="M10 5.5h4v4h-4z" />
    </svg>
);

export const BowlIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...strokeDefaults} aria-hidden="true" focusable="false" {...props}>
        <path d="M4 12h16a8 7 0 0 1-16 0z" />
        <path d="M9 8.5c0-1.5 1.5-1.5 1.5-3M13.5 8.5c0-1.5 1.5-1.5 1.5-3" />
        <circle cx="12" cy="12.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);

export const BrandMarkIcon = (props: IconProps) => (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" {...props}>
        <g fill="currentColor">
            <circle cx="17" cy="13" r="6.5" />
            <circle cx="26" cy="9.5" r="7.5" />
            <circle cx="34" cy="13.5" r="6" />
            <rect x="16" y="15" width="18" height="5.5" rx="2.75" />
        </g>
        <path
            d="M10 24 h28 c 0 8 -6 13 -14 13 s -14 -5 -14 -13 z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinejoin="round"
        />
        <path
            d="M10 24 c 2 -1.5 5 -2.5 8 -3 M38 24 c -2 -1.5 -5 -2.5 -8 -3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M8 40 c 3 -4.5 8 -7 14 -7.5 M40 40 c -3 -4.5 -8 -7 -14 -7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
        />
        <ellipse cx="9" cy="34" rx="3" ry="4.5" fill="currentColor" transform="rotate(-24 9 34)" />
        <ellipse cx="39" cy="34" rx="3" ry="4.5" fill="currentColor" transform="rotate(24 39 34)" />
    </svg>
);

export const GoogleIcon = (props: IconProps) => (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" {...props}>
        <path
            fill="#FFC107"
            d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"
        />
        <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
        />
        <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
        />
        <path
            fill="#1976D2"
            d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"
        />
    </svg>
);

export const FacebookIcon = (props: IconProps) => (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" {...props}>
        <circle cx="24" cy="24" r="24" fill="#1877F2" />
        <path
            fill="#fff"
            d="M31.8 24.2l.9-6H27V14c0-1.7.8-3.4 3.6-3.4h2.8V5.2s-2.5-.4-4.9-.4c-5 0-8.3 3-8.3 8.5v4.9h-5.6v6h5.6v14.6h6.9V24.2h5.7z"
        />
    </svg>
);
