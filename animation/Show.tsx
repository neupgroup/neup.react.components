'use client';
import * as React from 'react';

/*
::neup.documentation::show-animation
::title Show Animation

::public

Transitions a grey closed eye to an open eye inside a grey outline circle.

::public end

::end
*/
export interface ShowProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles=`@keyframes neup-show-revolve{to{transform:rotate(360deg)}} @keyframes neup-show-eye{0%,35%{transform:scaleY(.12)}65%,100%{transform:scaleY(1)}} @media(prefers-reduced-motion:reduce){[data-neup-show-revolve],[data-neup-show-icon]{animation-duration:.01ms!important}}`;
export const Show=React.forwardRef<HTMLDivElement,ShowProps>(({size=32,duration=1000,paused=false,label='Show',className,style,...props},ref)=>{const color='var(--neup-show-color, #3a3a3c)',sw=Math.max(1.5,size*.06);const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label};return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-show-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-show-revolve ${duration}ms linear infinite`}}/><svg data-neup-show-icon aria-hidden="true" viewBox="0 0 24 24" style={{width:'62%',height:'62%',fill:'none',stroke:color,strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round',transformOrigin:'center',animation:`neup-show-eye ${duration}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}><path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2"/></svg></div>});
Show.displayName='Show';export default Show;
