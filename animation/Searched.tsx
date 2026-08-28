'use client';

import * as React from 'react';

/*
::neup.documentation::searched-animation
::title Searched Animation

::public

Displays a search icon with a blue outline circle held in its completed state.

::public end

::end
*/

export interface SearchedProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-searched-icon {
    0%, 55% { opacity: 1; transform: scale(1); }
    100% { opacity: .82; transform: scale(.94); }
  }

  @keyframes neup-searched-outline {
    0%, 45% { opacity: 0; transform: scale(.58); }
    78% { opacity: 1; transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-searched-icon], [data-neup-searched-outline] {
      animation-duration: .01ms !important;
    }
  }
`;

export const Searched = React.forwardRef<HTMLDivElement, SearchedProps>(
  (
    {
      size = 32,
      duration = 900,
      paused = false,
      label = 'Searched',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const color = 'var(--neup-searched-color, #007aff)';
    const strokeWidth = Math.max(1.5, size * .06);
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
          data-neup-searched-outline
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            border: `${strokeWidth}px solid ${color}`,
            borderRadius: '50%',
            opacity: 0,
            transform: 'scale(.58)',
            animation: `neup-searched-outline ${duration}ms cubic-bezier(.34, 1.56, .64, 1) forwards`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
        <svg
          data-neup-searched-icon
          aria-hidden="true"
          viewBox="0 0 24 24"
          style={{
            width: '58%',
            height: '58%',
            fill: 'none',
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            animation: `neup-searched-icon ${duration}ms ease-in-out forwards`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <circle cx="10.8" cy="10.8" r="5.8" />
          <path d="m15.2 15.2 5 5" />
        </svg>
      </div>
    );
  },
);

Searched.displayName = 'Searched';

export default Searched;
