'use client';

import * as React from 'react';

/*
::neup.documentation::deleted-animation
::title Deleted Animation

::public

Starts with a trash icon and finishes by drawing an outline around it.

::public end

::end
*/

export interface DeletedProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-deleted-trash {
    0%, 55% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    68% {
      opacity: .78;
      transform: scale(.94) rotate(-4deg);
    }

    100% {
      opacity: .78;
      transform: scale(.94) rotate(0deg);
    }
  }

  @keyframes neup-deleted-outline {
    0%, 55% {
      opacity: 0;
      transform: scale(.58);
    }

    78% {
      opacity: 1;
      transform: scale(1.08);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-deleted-trash],
    [data-neup-deleted-outline] {
      animation-duration: .01ms !important;
    }
  }
`;

export const Deleted = React.forwardRef<HTMLDivElement, DeletedProps>(
  (
    {
      size = 32,
      duration = 900,
      paused = false,
      label = 'Deleted',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const color = 'var(--neup-deleted-color, #ff3b30)';
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
          data-neup-deleted-outline
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            border: `${strokeWidth}px solid ${color}`,
            borderRadius: '50%',
            animation: `neup-deleted-outline ${duration}ms cubic-bezier(.34, 1.56, .64, 1) forwards`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />

        <svg
          data-neup-deleted-trash
          aria-hidden="true"
          viewBox="0 0 24 24"
          style={{
            width: '57%',
            height: '57%',
            fill: 'none',
            stroke: color,
            strokeWidth: 1.8,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            animation: `neup-deleted-trash ${duration}ms ease-in-out forwards`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <path d="M4 7h16M10 3h4l1 4H9l1-4ZM6 7l1 14h10l1-14M10 11v6M14 11v6" />
        </svg>
      </div>
    );
  },
);

Deleted.displayName = 'Deleted';

export default Deleted;
