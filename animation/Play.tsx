'use client';

import * as React from 'react';

/*
::neup.documentation::play-animation
::title Play Animation

::public

Displays a blue play icon inside a continuously revolving outline circle.

::public end

::end
*/

export interface PlayProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-play-revolve {
    to { transform: rotate(360deg); }
  }

  @keyframes neup-play-pulse {
    0%, 100% { transform: scale(.94); opacity: .9; }
    50% { transform: scale(1); opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-play-revolve],
    [data-neup-play-icon] {
      animation-duration: .01ms !important;
    }
  }
`;

export const Play = React.forwardRef<HTMLDivElement, PlayProps>(
  (
    {
      size = 32,
      duration = 900,
      paused = false,
      label = 'Play',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const strokeWidth = Math.max(1.5, size * 0.0625);
    const color = 'var(--neup-play-color, #007aff)';
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
          data-neup-play-revolve
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 1,
            border: `${strokeWidth}px solid ${color}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: `neup-play-revolve ${duration}ms linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            pointerEvents: 'none',
          }}
        />
        <svg
          data-neup-play-icon
          aria-hidden="true"
          viewBox="0 0 24 24"
          style={{
            width: '52%',
            height: '52%',
            fill: color,
            animation: `neup-play-pulse ${duration * 1.6}ms ease-in-out infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <path d="M8 5.5a1 1 0 0 1 1.52-.86l9.2 6.5a1.05 1.05 0 0 1 0 1.72l-9.2 6.5A1 1 0 0 1 8 18.5v-13Z" />
        </svg>
      </div>
    );
  },
);

Play.displayName = 'Play';

export default Play;
