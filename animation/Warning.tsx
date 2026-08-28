'use client';
import * as React from 'react';

/*
::neup.documentation::warning-animation
::title Warning Animation

::public

Displays an orange warning triangle with an orange revolving outline circle.

::public end

::end
*/
export interface WarningProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles = `
  @keyframes neup-warning-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-warning-pulse { 0%, 100% { transform: scale(.94); } 50% { transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { [data-neup-warning-revolve], [data-neup-warning-icon] { animation-duration: .01ms !important; } }
`;
export const Warning = React.forwardRef<HTMLDivElement, WarningProps>(({ size = 32, duration = 900, paused = false, label = 'Warning', className, style, ...props }, ref) => {
  const color = 'var(--neup-warning-color, #ff9500)'; const strokeWidth = Math.max(1.5, size * .06);
  const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
  return <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}>
    <style>{animationStyles}</style>
    <span data-neup-warning-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-warning-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running', pointerEvents: 'none' }} />
    <svg data-neup-warning-icon aria-hidden="true" viewBox="0 0 24 24" style={{ width: '60%', height: '60%', fill: 'none', stroke: color, strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', animation: `neup-warning-pulse ${duration * 1.6}ms ease-in-out infinite`, animationPlayState: paused ? 'paused' : 'running' }}><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5M12 17h.01" /></svg>
  </div>;
});
Warning.displayName = 'Warning';
export default Warning;
