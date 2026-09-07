import './FoodAnimation.scss';

export type FoodAnimationVariant = 'login' | 'signup';

export type FoodAnimationProps = {
  variant: FoodAnimationVariant;
  ariaLabel?: string;
};

const SignupScene = () => (
  <>
    <g className="twk-food-animation__steam">
      <path className="twk-food-animation__steam-curve" d="M182 128 c 7 -11 -7 -20 0 -30 c 7 -11 -7 -20 0 -30" />
      <path
        className="twk-food-animation__steam-curve twk-food-animation__steam-curve--2"
        d="M202 128 c 7 -11 -7 -20 0 -30 c 7 -11 -7 -20 0 -30"
      />
      <path
        className="twk-food-animation__steam-curve twk-food-animation__steam-curve--3"
        d="M222 128 c 7 -11 -7 -20 0 -30 c 7 -11 -7 -20 0 -30"
      />
    </g>

    {/* floating ingredients */}
    <g className="twk-food-animation__float">
      <circle className="twk-food-animation__tomato" cx="108" cy="118" r="17" />
      <circle className="twk-food-animation__tomato-inner" cx="108" cy="118" r="10.5" />
      <ellipse className="twk-food-animation__seed" cx="104" cy="114" rx="2" ry="3.2" />
      <ellipse className="twk-food-animation__seed" cx="112" cy="114" rx="2" ry="3.2" />
      <ellipse className="twk-food-animation__seed" cx="104" cy="122" rx="2" ry="3.2" />
      <ellipse className="twk-food-animation__seed" cx="112" cy="122" rx="2" ry="3.2" />
    </g>
    <g className="twk-food-animation__float twk-food-animation__float--2">
      <path
        className="twk-food-animation__leaf"
        transform="translate(298 84)"
        d="M0 0 c 14 -16 30 -16 44 0 c -14 16 -30 16 -44 0 z"
      />
    </g>
    <g className="twk-food-animation__float twk-food-animation__float--3">
      <path
        className="twk-food-animation__leaf twk-food-animation__leaf--small"
        transform="translate(74 172)"
        d="M0 0 c -12 -10 -12 -24 0 -34 c 12 10 12 24 0 34 z"
      />
    </g>
    <circle
      className="twk-food-animation__onion-ring twk-food-animation__float twk-food-animation__float--2"
      cx="318"
      cy="152"
      r="9"
    />
    <circle className="twk-food-animation__pea twk-food-animation__float" cx="142" cy="86" r="5" />
    <circle className="twk-food-animation__pea twk-food-animation__float twk-food-animation__float--3" cx="252" cy="66" r="4" />
    <circle className="twk-food-animation__drop twk-food-animation__float twk-food-animation__float--2" cx="172" cy="118" r="4" />
    <circle className="twk-food-animation__drop twk-food-animation__float" cx="288" cy="122" r="3.5" />
    <circle className="twk-food-animation__sparkle twk-food-animation__float twk-food-animation__float--3" cx="200" cy="56" r="3" />
    <circle className="twk-food-animation__sparkle twk-food-animation__float" cx="88" cy="106" r="2.5" />

    {/* noodle mound */}
    <g className="twk-food-animation__noodles">
      <ellipse cx="200" cy="188" rx="72" ry="26" />
      <path d="M148 182 c 10 -12 26 -12 34 -2 c -8 8 -24 8 -34 2 z" />
      <path d="M196 176 c 10 -12 26 -12 34 -2 c -8 8 -24 8 -34 2 z" />
      <path d="M168 192 c 10 -10 26 -10 36 0" />
      <path d="M214 190 c 8 -8 22 -8 30 0" />
      <rect x="160" y="162" width="13" height="13" rx="3" transform="rotate(18 166 168)" />
      <rect x="228" y="158" width="12" height="12" rx="3" transform="rotate(-14 234 164)" />
      <circle cx="200" cy="168" r="5" />
      <circle cx="246" cy="180" r="4" />
    </g>

    {/* legs */}
    <path className="twk-food-animation__limb" d="M172 272 L168 296" />
    <ellipse className="twk-food-animation__shoe" cx="163" cy="299" rx="10" ry="6" />
    <path className="twk-food-animation__limb" d="M228 272 L232 296" />
    <ellipse className="twk-food-animation__shoe" cx="237" cy="299" rx="10" ry="6" />

    {/* arms */}
    <path className="twk-food-animation__limb" d="M112 232 C90 238 78 250 74 264" />
    <circle className="twk-food-animation__hand" cx="73" cy="266" r="7" />
    <path className="twk-food-animation__limb" d="M288 230 C306 218 312 202 310 186" />
    <circle className="twk-food-animation__hand" cx="310" cy="183" r="7" />

    {/* bowl */}
    <path
      className="twk-food-animation__bowl-buddy"
      d="M105 200 h190 c 0 42 -42 70 -95 70 s -95 -28 -95 -70 z"
    />
    <ellipse className="twk-food-animation__bowl-rim" cx="200" cy="200" rx="95" ry="20" />

    {/* face */}
    <circle className="twk-food-animation__face-eye" cx="168" cy="234" r="13" />
    <circle className="twk-food-animation__face-pupil" cx="170" cy="236" r="6" />
    <circle className="twk-food-animation__face-spark" cx="172" cy="233.5" r="2" />
    <path className="twk-food-animation__face-wink" d="M220 234 q 8 -8 16 0" />
    <path
      className="twk-food-animation__face-smile"
      d="M186 252 q 14 16 28 0 q -2 14 -14 14 t -14 -14 z"
    />
    <ellipse className="twk-food-animation__face-tongue" cx="200" cy="262" rx="6" ry="4" />
    <ellipse className="twk-food-animation__face-blush" cx="150" cy="250" rx="7" ry="5" />
    <ellipse className="twk-food-animation__face-blush" cx="250" cy="250" rx="7" ry="5" />
  </>
);

const LoginScene = () => (
  <>
    <circle className="twk-food-animation__sparkle" cx="92" cy="108" r="6" />
    <circle
      className="twk-food-animation__sparkle"
      cx="310"
      cy="90"
      r="5"
    />

    <g className="twk-food-animation__steam">
      <path className="twk-food-animation__steam-curve" d="M178 168 c 7 -11 -7 -20 0 -30 c 7 -11 -7 -20 0 -30" />
      <path
        className="twk-food-animation__steam-curve twk-food-animation__steam-curve--2"
        d="M200 168 c 7 -11 -7 -20 0 -30 c 7 -11 -7 -20 0 -30"
      />
      <path
        className="twk-food-animation__steam-curve twk-food-animation__steam-curve--3"
        d="M222 168 c 7 -11 -7 -20 0 -30 c 7 -11 -7 -20 0 -30"
      />
    </g>

    <ellipse className="twk-food-animation__rice" cx="200" cy="200" rx="74" ry="26" />
    <path
      className="twk-food-animation__bowl"
      d="M126 196 a74 62 0 0 0 148 0 z"
    />
    <rect className="twk-food-animation__bowl-rim" x="120" y="192" width="160" height="9" rx="4.5" />

    <path
      className="twk-food-animation__spoon"
      d="M290 252 c 14 -20 10 -42 -6 -56"
    />

    <g className="twk-food-animation__herbs">
      <path
        className="twk-food-animation__herb twk-food-animation__herb--1"
        transform="translate(96 96)"
        d="M0 0 c 14 -16 30 -16 44 0 c -14 16 -30 16 -44 0 z"
      />
      <path
        className="twk-food-animation__herb twk-food-animation__herb--2"
        transform="translate(306 132)"
        d="M0 0 c 14 -16 30 -16 44 0 c -14 16 -30 16 -44 0 z"
      />
    </g>
  </>
);

const FoodAnimation = ({ variant, ariaLabel }: FoodAnimationProps) => {
  const scene = variant === 'signup' ? <SignupScene /> : <LoginScene />;

  return (
    <div
      className={`twk-food-animation twk-food-animation--${variant}`}
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 400 320" focusable="false" aria-hidden="true">
        {scene}
      </svg>
    </div>
  );
};

export default FoodAnimation;