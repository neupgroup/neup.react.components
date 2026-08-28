'use client';

import * as React from 'react';

/*
::neup.documentation::pending-animation
::title Pending Animation

::public

Displays a grey pending clock with a grey revolving outline circle.

::public end

::end
*/

export interface PendingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-pending-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-pending-hand { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    [data-neup-pending-revolve], [data-neup-pending-hand] { animation-duration: .01ms !important; }
  }
`;

export const Pending = React.forwardRef<HTMLDivElement, PendingProps>(
  ({ size = 32, duration = 1100, paused = false, label = 'Pending', className, style, ...props }, ref) => {
    const color = 'var(--neup-pending-color, #3a3a3c)';
    const strokeWidth = Math.max(1.5, size * 0.06);
    const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
    return (
      <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}>
        <style>{animationStyles}</style>
        <span data-neup-pending-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-pending-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running', pointerEvents: 'none' }} />
        <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: '56%', height: '56%', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
          <circle cx="12" cy="12" r="7.5" />
          <path data-neup-pending-hand d="M12 8v4l2.5 2" style={{ transformOrigin: '12px 12px', animation: `neup-pending-hand ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running' }} />
        </svg>
      </div>
    );
  },
);

Pending.displayName = 'Pending';
export default Pending;
