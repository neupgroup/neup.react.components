'use client';
import * as React from 'react';

/*
::neup.documentation::deploy-animation
::title Deploy Animation

::public

Displays a blue rocket with a blue revolving outline circle. It can transition
to `TickMark` when deployment succeeds.

::public end

::end
*/
export interface DeployProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles = `
  @keyframes neup-deploy-revolve { to { transform: rotate(360deg); } }
  @keyframes neup-deploy-lift { 0%, 100% { transform: translateY(1px); } 50% { transform: translateY(-2px); } }
  @media (prefers-reduced-motion: reduce) { [data-neup-deploy-revolve], [data-neup-deploy-icon] { animation-duration: .01ms !important; } }
`;
export const Deploy = React.forwardRef<HTMLDivElement, DeployProps>(({ size = 32, duration = 900, paused = false, label = 'Deploy', className, style, ...props }, ref) => {
  const color = 'var(--neup-deploy-color, #007aff)'; const strokeWidth = Math.max(1.5, size * .06);
  const accessibleProps = label === null ? { 'aria-hidden': true as const } : { role: 'img' as const, 'aria-label': label };
  return <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'grid', placeItems: 'center', position: 'relative' }} {...accessibleProps} {...props}><style>{animationStyles}</style><span data-neup-deploy-revolve aria-hidden="true" style={{ position: 'absolute', inset: 1, border: `${strokeWidth}px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `neup-deploy-revolve ${duration}ms linear infinite`, animationPlayState: paused ? 'paused' : 'running' }} /><svg data-neup-deploy-icon aria-hidden="true" viewBox="0 0 24 24" style={{ width: '58%', height: '58%', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', animation: `neup-deploy-lift ${duration * 1.6}ms ease-in-out infinite`, animationPlayState: paused ? 'paused' : 'running' }}><path d="M12 3c3 1 5.5 4.5 5.5 8.5 0 3-2 5.5-5.5 8.5-3.5-3-5.5-5.5-5.5-8.5C6.5 7.5 9 4 12 3Z" /><path d="m6.8 13.5-3.3 1.4 3.4 1.5M17.2 13.5l3.3 1.4-3.4 1.5M10 19.2l2 2.3 2-2.3" /><circle cx="12" cy="9" r="1.5" /></svg></div>;
});
Deploy.displayName = 'Deploy';
export default Deploy;
