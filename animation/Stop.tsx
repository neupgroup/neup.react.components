'use client';

import * as React from 'react';

/*
::neup.documentation::stop-animation
::title Stop Animation

::public

Displays an orange stop icon inside a continuously revolving outline circle.

::public end

::end
*/

export interface StopProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-stop-revolve {
    to { transform: rotate(360deg); }
  }

  @keyframes neup-stop-pulse {
    0%, 100% { transform: scale(.92); opacity: .9; }
    50% { transform: scale(1); opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-stop-revolve],
    [data-neup-stop-icon] {
      animation-duration: .01ms !important;
    }
  }
`;

export const Stop = React.forwardRef<HTMLDivElement, StopProps>(
  (
    {
      size = 32,
      duration = 900,
      paused = false,
      label = 'Stop',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const strokeWidth = Math.max(1.5, size * 0.0625);
    const color = 'var(--neup-stop-color, #ff9500)';
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
          position: 'relative',
        }}
        {...accessibleProps}
        {...props}
      >
        <style>{animationStyles}</style>
        <span
          data-neup-stop-revolve
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 1,
            border: `${strokeWidth}px solid ${color}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: `neup-stop-revolve ${duration}ms linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            pointerEvents: 'none',
          }}
        />
        <span
          data-neup-stop-icon
          aria-hidden="true"
          style={{
            width: '42%',
            height: '42%',
            borderRadius: Math.max(2, size * 0.05),
            background: color,
            animation: `neup-stop-pulse ${duration * 1.6}ms ease-in-out infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>
    );
  },
);

Stop.displayName = 'Stop';

export default Stop;
