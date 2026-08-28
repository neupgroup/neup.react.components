'use client';
import * as React from 'react';

/*
::neup.documentation::unlock-animation
::title Unlock Animation

::public

Transitions a blue locked lock to open while a blue outline circle revolves.

::public end

::end
*/
export interface UnlockProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles=`@keyframes neup-unlock-revolve{to{transform:rotate(360deg)}} @keyframes neup-unlock-open{0%,35%{transform:rotate(0deg)}65%,100%{transform:rotate(-28deg)}} @media(prefers-reduced-motion:reduce){[data-neup-unlock-revolve],[data-neup-unlock-shackle]{animation-duration:.01ms!important}}`;
export const Unlock=React.forwardRef<HTMLDivElement,UnlockProps>(({size=32,duration=1100,paused=false,label='Unlocking',className,style,...props},ref)=>{const color='var(--neup-unlock-color, #007aff)',sw=Math.max(1.5,size*.06);const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label};return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-unlock-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-unlock-revolve ${duration}ms linear infinite`,animationPlayState:paused?'paused':'running'}}/><svg aria-hidden="true" viewBox="0 0 24 24" style={{width:'58%',height:'58%',fill:'none',stroke:color,strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}><rect x="5" y="10" width="14" height="10" rx="2"/><path data-neup-unlock-shackle d="M8 10V7a4 4 0 0 1 8 0" style={{transformOrigin:'8px 10px',animation:`neup-unlock-open ${duration}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}/><path d="M12 14v3"/></svg></div>});
Unlock.displayName='Unlock';export default Unlock;
