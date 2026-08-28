'use client';

import * as React from 'react';

/*
::neup.documentation::cross-mark
::title Cross Mark

::public

Displays a spring-in cancellation mark with a soft red circular background
and two staggered red strokes. The animation runs once and holds its final
state.

::public end

::end
*/

export interface CrossMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width and height of the animation in pixels. */
  size?: number;
  /** Accessible label. Set to `null` when the icon is purely decorative. */
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-cross-mark-circle-in {
    0% {
      opacity: 0;
      transform: scale(.72);
    }

    50% {
      opacity: 1;
      transform: scale(1.07);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes neup-cross-mark-slash-one {
    0%, 50% {
      opacity: 0;
      transform: rotate(45deg) scaleX(0);
    }

    100% {
      opacity: 1;
      transform: rotate(45deg) scaleX(1);
    }
  }

  @keyframes neup-cross-mark-slash-two {
    0%, 50% {
      opacity: 0;
      transform: rotate(-45deg) scaleX(0);
    }

    100% {
      opacity: 1;
      transform: rotate(-45deg) scaleX(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-cross-mark],
    [data-neup-cross-mark-slash] {
      animation-duration: .01ms !important;
    }
  }
`;

export const CrossMark = React.forwardRef<HTMLDivElement, CrossMarkProps>(
  (
    {
      size = 32,
      label = 'Cancelled',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const scale = size / 40;
    const strokeWidth = Math.max(1.5, 2 * scale);
    const slashHeight = Math.max(2, 2.5 * scale);
    const color = 'var(--neup-cross-mark-color, #ff3b30)';
    const accessibleProps = label === null
      ? { 'aria-hidden': true as const }
      : { role: 'img' as const, 'aria-label': label };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          width: size,
          height: size,
          display: 'grid',
          placeItems: 'center',
        }}
        {...accessibleProps}
        {...props}
      >
        <style>{animationStyles}</style>

        <span
          data-neup-cross-mark
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            border: `${strokeWidth}px solid ${color}`,
            borderRadius: '50%',
            background: 'var(--neup-cross-mark-background, rgba(255, 59, 48, .12))',
            opacity: 0,
            transform: 'scale(.72)',
            animation: 'neup-cross-mark-circle-in 420ms cubic-bezier(.34, 1.56, .64, 1) forwards',
          }}
        >
          <span
            data-neup-cross-mark-slash
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 18 * scale,
              height: slashHeight,
              background: color,
              borderRadius: 999,
              opacity: 0,
              transform: 'rotate(45deg) scaleX(0)',
              animation: 'neup-cross-mark-slash-one 260ms cubic-bezier(.65, 0, .35, 1) 260ms forwards',
            }}
          />
          <span
            data-neup-cross-mark-slash
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 18 * scale,
              height: slashHeight,
              background: color,
              borderRadius: 999,
              opacity: 0,
              transform: 'rotate(-45deg) scaleX(0)',
              animation: 'neup-cross-mark-slash-two 260ms cubic-bezier(.65, 0, .35, 1) 360ms forwards',
            }}
          />
        </span>
      </div>
    );
  },
);

CrossMark.displayName = 'CrossMark';

export default CrossMark;
