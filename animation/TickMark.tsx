'use client';

import * as React from 'react';

/*
::neup.documentation::tick-mark
::title Tick Mark

::public

Displays a spring-in success mark with a softly tinted green circle and a
drawn check. The animation runs once when the component mounts.

::public end

::end
*/

export interface TickMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width and height of the animation in pixels. */
  size?: number;
  /** Accessible label. Set to `null` when the icon is purely decorative. */
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-tick-mark-appear {
    0% { opacity: 0; transform: scale(.55); }
    50% { opacity: 1; transform: scale(1.12); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes neup-tick-mark-draw {
    0% { stroke-dashoffset: 24; }
    50% { stroke-dashoffset: 10; }
    100% { stroke-dashoffset: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-tick-mark] {
      animation-duration: .01ms !important;
    }

    [data-neup-tick-mark-check] {
      animation-duration: .01ms !important;
      stroke-dashoffset: 0 !important;
    }
  }
`;

export const TickMark = React.forwardRef<HTMLDivElement, TickMarkProps>(
  (
    {
      size = 40,
      label = 'Complete',
      className,
      style,
      ...props
    },
    ref,
  ) => {
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
          data-neup-tick-mark
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            background: 'var(--neup-tick-mark-background, rgba(52, 199, 89, .12))',
            animation: 'neup-tick-mark-appear 620ms cubic-bezier(.34, 1.56, .64, 1) forwards',
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            style={{ width: '72%', height: '72%' }}
          >
            <path
              data-neup-tick-mark-check
              d="M4.5 10.3 L8.3 14 L15.7 6.4"
              fill="none"
              stroke="var(--neup-tick-mark-color, #28a745)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="24"
              strokeDasharray="24"
              strokeDashoffset="24"
              style={{
                animation: 'neup-tick-mark-draw 620ms cubic-bezier(.65, 0, .35, 1) 180ms forwards',
              }}
            />
          </svg>
        </span>
      </div>
    );
  },
);

TickMark.displayName = 'TickMark';

export default TickMark;
