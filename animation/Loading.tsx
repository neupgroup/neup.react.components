'use client';
import * as React from 'react';

/*
::neup.documentation::loading-animation
::title Loading Animation

::public

Displays a blue spinning outline without a separate icon.

::public end

::end
*/
export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles = `
  @keyframes neup-loading-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { [data-neup-loading] { animation-duration: .01ms !important; } }
`;
export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(({ size = 32, duration = 800, paused = false, label = 'Loading', className, style, ...props }, ref) => {
  const color = 'var(--neup-loading-color, #007aff)'; const strokeWidth = Math.max(1.5, size * .07);
  const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
  return <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center' }} {...accessibleProps} {...props}><style>{animationStyles}</style><span data-neup-loading aria-hidden="true" style={{ width: '72%', height: '72%', border: `${strokeWidth}px solid ${color}`, borderRightColor: 'transparent', borderRadius: '50%', animation: `neup-loading-spin ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running' }} /></div>;
});
Loading.displayName = 'Loading';
export default Loading;
