'use client';

import * as React from 'react';

/*
::neup.documentation::bell-animation
::title Bell Animation

::public

Displays a grey notification bell with a continuously revolving outline
circle and a subtle ringing motion.

::public end

::end
*/

export interface BellProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-bell-revolve {
    to { transform: rotate(360deg); }
  }

  @keyframes neup-bell-ring {
    0%, 100% { transform: rotate(0deg); }
    12% { transform: rotate(8deg); }
    24% { transform: rotate(-8deg); }
    36% { transform: rotate(5deg); }
    48% { transform: rotate(-5deg); }
    60%, 100% { transform: rotate(0deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-bell-revolve],
    [data-neup-bell-icon] {
      animation-duration: .01ms !important;
    }
  }
`;

export const Bell = React.forwardRef<HTMLDivElement, BellProps>(
  (
    {
      size = 32,
      duration = 1200,
      paused = false,
      label = 'Notifications',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const strokeWidth = Math.max(1.5, size * 0.0625);
    const color = 'var(--neup-bell-color, #3a3a3c)';
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
          data-neup-bell-revolve
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 1,
            border: `${strokeWidth}px solid ${color}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: `neup-bell-revolve ${duration}ms linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            pointerEvents: 'none',
          }}
        />
        <svg
          data-neup-bell-icon
          aria-hidden="true"
          viewBox="0 0 24 24"
          style={{
            width: '55%',
            height: '55%',
            fill: 'none',
            stroke: color,
            strokeWidth: 1.9,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            animation: `neup-bell-ring ${duration}ms ease-in-out infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <path d="M18 8.5a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
          <path d="M10 21h4" />
        </svg>
      </div>
    );
  },
);

Bell.displayName = 'Bell';

export default Bell;
