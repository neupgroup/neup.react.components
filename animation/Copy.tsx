'use client';

import * as React from 'react';

/*
::neup.documentation::copy-animation
::title Copy Animation

::public

Displays overlapping grey document sheets, styled like a word-processing copy
action, with a grey revolving outline circle.

::public end

::end
*/

export interface CopyProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-copy-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-copy-pulse { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-1px, -1px); } }
  @media (prefers-reduced-motion: reduce) {
    [data-neup-copy-revolve], [data-neup-copy-icon] { animation-duration: .01ms !important; }
  }
`;

export const Copy = React.forwardRef<HTMLDivElement, CopyProps>(
  ({ size = 32, duration = 900, paused = false, label = 'Copy', className, style, ...props }, ref) => {
    const color = 'var(--neup-copy-color, #3a3a3c)';
    const strokeWidth = Math.max(1.5, size * 0.06);
    const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
    return (
      <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}>
        <style>{animationStyles}</style>
        <span data-neup-copy-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-copy-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running', pointerEvents: 'none' }} />
        <svg data-neup-copy-icon aria-hidden="true" viewBox="0 0 24 24" style={{ width: '57%', height: '57%', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', animation: `neup-copy-pulse ${duration * 1.6}ms ease-in-out infinite`, animationPlayState: paused ? 'paused' : 'running' }}>
          <rect x="8" y="8" width="11" height="12" rx="1.5" />
          <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v10A1.5 1.5 0 0 0 5.5 17H8" />
        </svg>
      </div>
    );
  },
);

Copy.displayName = 'Copy';
export default Copy;
