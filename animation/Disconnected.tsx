'use client';
import * as React from 'react';

/*
::neup.documentation::disconnected-animation
::title Disconnected Animation

::public

Displays an orange broken-link icon with an orange revolving outline circle.

::public end

::end
*/
export interface DisconnectedProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles=`@keyframes neup-disconnected-revolve{to{transform:rotate(360deg)}} @keyframes neup-disconnected-pulse{0%,100%{transform:scale(.94)}50%{transform:scale(1)}} @media(prefers-reduced-motion:reduce){[data-neup-disconnected-revolve],[data-neup-disconnected-icon]{animation-duration:.01ms!important}}`;
export const Disconnected=React.forwardRef<HTMLDivElement,DisconnectedProps>(({size=32,duration=900,paused=false,label='Disconnected',className,style,...props},ref)=>{const color='var(--neup-disconnected-color, #ff9500)',sw=Math.max(1.5,size*.06);const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label};return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-disconnected-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-disconnected-revolve ${duration}ms linear infinite`,animationPlayState:paused?'paused':'running'}}/><svg data-neup-disconnected-icon aria-hidden="true" viewBox="0 0 24 24" style={{width:'60%',height:'60%',fill:'none',stroke:color,strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round',animation:`neup-disconnected-pulse ${duration*1.6}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}><path d="m9 15-2 2a4 4 0 0 1-5.7-5.7l2-2A4 4 0 0 1 9 9M15 9l2-2a4 4 0 0 1 5.7 5.7l-2 2A4 4 0 0 1 15 15M8 12h8"/><path d="m4 4 16 16"/></svg></div>});
Disconnected.displayName='Disconnected';export default Disconnected;
