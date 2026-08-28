'use client';
import * as React from 'react';

/*
::neup.documentation::info-animation
::title Info Animation

::public

Displays a blue information icon with a blue revolving outline circle.

::public end

::end
*/
export interface InfoProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles = `
  @keyframes neup-info-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-info-pulse { 0%, 100% { opacity: .85; } 50% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { [data-neup-info-revolve], [data-neup-info-icon] { animation-duration: .01ms !important; } }
`;
export const Info = React.forwardRef<HTMLDivElement, InfoProps>(({ size = 32, duration = 900, paused = false, label = 'Information', className, style, ...props }, ref) => {
  const color = 'var(--neup-info-color, #007aff)'; const strokeWidth = Math.max(1.5, size * .06);
  const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
  return <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}><style>{animationStyles}</style><span data-neup-info-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-info-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running' }} /><svg data-neup-info-icon aria-hidden="true" viewBox="0 0 24 24" style={{ width: '53%', height: '53%', fill: color, animation: `neup-info-pulse ${duration * 1.6}ms ease-in-out infinite`, animationPlayState: paused ? 'paused' : 'running' }}><circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.8" /><circle cx="12" cy="8" r="1.1" /><path d="M11 11h2v6h-2z" /></svg></div>;
});
Info.displayName = 'Info';
export default Info;
