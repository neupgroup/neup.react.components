'use client';
import * as React from 'react';

/*
::neup.documentation::trash-animation
::title Trash Animation

::public

Displays a red trash icon with a red revolving outline circle.

::public end

::end
*/
export interface TrashProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles = `
  @keyframes neup-trash-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-trash-shake { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(-4deg); } 60% { transform: rotate(4deg); } }
  @media (prefers-reduced-motion: reduce) { [data-neup-trash-revolve], [data-neup-trash-icon] { animation-duration: .01ms !important; } }
`;
export const Trash = React.forwardRef<HTMLDivElement, TrashProps>(({ size = 32, duration = 900, paused = false, label = 'Trash', className, style, ...props }, ref) => {
  const color = 'var(--neup-trash-color, #ff3b30)'; const strokeWidth = Math.max(1.5, size * .06);
  const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
  return <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}><style>{animationStyles}</style><span data-neup-trash-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-trash-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running' }} /><svg data-neup-trash-icon aria-hidden="true" viewBox="0 0 24 24" style={{ width: '57%', height: '57%', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', animation: `neup-trash-shake ${duration * 1.6}ms ease-in-out infinite`, animationPlayState: paused ? 'paused' : 'running' }}><path d="M4 7h16M10 3h4l1 4H9l1-4ZM6 7l1 14h10l1-14M10 11v6M14 11v6" /></svg></div>;
});
Trash.displayName = 'Trash';
export default Trash;
