'use client';

import * as React from 'react';

/*
::neup.documentation::save-animation
::title Save Animation

::public

Displays a grey floppy-disk save icon with a grey revolving outline circle.

::public end

::end
*/

export interface SaveProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-save-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-save-pulse { 0%, 100% { transform: scale(.94); } 50% { transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) {
    [data-neup-save-revolve], [data-neup-save-icon] { animation-duration: .01ms !important; }
  }
`;

export const Save = React.forwardRef<HTMLDivElement, SaveProps>(
  ({ size = 32, duration = 900, paused = false, label = 'Save', className, style, ...props }, ref) => {
    const color = 'var(--neup-save-color, #3a3a3c)';
    const strokeWidth = Math.max(1.5, size * 0.06);
    const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
    return (
      <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}>
        <style>{animationStyles}</style>
        <span data-neup-save-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-save-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running', pointerEvents: 'none' }} />
        <svg data-neup-save-icon aria-hidden="true" viewBox="0 0 24 24" style={{ width: '57%', height: '57%', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', animation: `neup-save-pulse ${duration * 1.6}ms ease-in-out infinite`, animationPlayState: paused ? 'paused' : 'running' }}>
          <path d="M5 3h11l3 3v15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M7 3v6h8V3M8 21v-7h8v7" />
        </svg>
      </div>
    );
  },
);

Save.displayName = 'Save';
export default Save;
