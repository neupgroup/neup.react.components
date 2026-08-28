'use client';

import * as React from 'react';

/*
::neup.documentation::send-animation
::title Send Animation

::public

Displays a grey paper-plane send icon with a grey revolving outline circle.

::public end

::end
*/

export interface SendProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  paused?: boolean;
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-send-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-send-float { 0%, 100% { transform: translate(0, 1px); } 50% { transform: translate(1px, -1px); } }
  @media (prefers-reduced-motion: reduce) {
    [data-neup-send-revolve], [data-neup-send-icon] { animation-duration: .01ms !important; }
  }
`;

export const Send = React.forwardRef<HTMLDivElement, SendProps>(
  ({ size = 32, duration = 900, paused = false, label = 'Send', className, style, ...props }, ref) => {
    const color = 'var(--neup-send-color, #3a3a3c)';
    const strokeWidth = Math.max(1.5, size * 0.06);
    const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
    return (
      <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}>
        <style>{animationStyles}</style>
        <span data-neup-send-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-send-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running', pointerEvents: 'none' }} />
        <svg data-neup-send-icon aria-hidden="true" viewBox="0 0 24 24" style={{ width: '58%', height: '58%', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', animation: `neup-send-float ${duration * 1.6}ms ease-in-out infinite`, animationPlayState: paused ? 'paused' : 'running' }}>
          <path d="m21 3-7.5 18-3.8-7.7L2 9.5 21 3Z" />
          <path d="M9.7 13.3 21 3" />
        </svg>
      </div>
    );
  },
);

Send.displayName = 'Send';
export default Send;
