'use client';
import * as React from 'react';

/*
::neup.documentation::connecting-animation
::title Connecting Animation

::public

Displays a grey link icon with a grey revolving outline circle.

::public end

::end
*/
export interface ConnectingProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles=`@keyframes neup-connecting-revolve{to{transform:rotate(360deg)}} @keyframes neup-connecting-pulse{0%,100%{opacity:.8}50%{opacity:1}} @media(prefers-reduced-motion:reduce){[data-neup-connecting-revolve],[data-neup-connecting-icon]{animation-duration:.01ms!important}}`;
export const Connecting=React.forwardRef<HTMLDivElement,ConnectingProps>(({size=32,duration=900,paused=false,label='Connecting',className,style,...props},ref)=>{const color='var(--neup-connecting-color, #3a3a3c)',sw=Math.max(1.5,size*.06);const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label};return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-connecting-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-connecting-revolve ${duration}ms linear infinite`,animationPlayState:paused?'paused':'running'}}/><svg data-neup-connecting-icon aria-hidden="true" viewBox="0 0 24 24" style={{width:'58%',height:'58%',fill:'none',stroke:color,strokeWidth:1.9,strokeLinecap:'round',strokeLinejoin:'round',animation:`neup-connecting-pulse ${duration*1.6}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}><path d="M10 13.5a4 4 0 0 0 5.7.2l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1"/><path d="M14 10.5a4 4 0 0 0-5.7-.2l-2 2A4 4 0 0 0 12 18l1.1-1.1"/></svg></div>});
Connecting.displayName='Connecting';export default Connecting;
