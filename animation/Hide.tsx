'use client';
import * as React from 'react';

/*
::neup.documentation::hide-animation
::title Hide Animation

::public

Transitions a grey open eye to a closed eye inside a grey outline circle.

::public end

::end
*/
export interface HideProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles=`@keyframes neup-hide-revolve{to{transform:rotate(360deg)}} @keyframes neup-hide-eye{0%,35%{transform:scaleY(1)}65%,100%{transform:scaleY(.12)}} @media(prefers-reduced-motion:reduce){[data-neup-hide-revolve],[data-neup-hide-icon]{animation-duration:.01ms!important}}`;
export const Hide=React.forwardRef<HTMLDivElement,HideProps>(({size=32,duration=1000,paused=false,label='Hide',className,style,...props},ref)=>{const color='var(--neup-hide-color, #3a3a3c)',sw=Math.max(1.5,size*.06);const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label};return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-hide-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-hide-revolve ${duration}ms linear infinite`}}/><svg data-neup-hide-icon aria-hidden="true" viewBox="0 0 24 24" style={{width:'62%',height:'62%',fill:'none',stroke:color,strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round',transformOrigin:'center',animation:`neup-hide-eye ${duration}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}><path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2"/><path d="m4 4 16 16"/></svg></div>});
Hide.displayName='Hide';export default Hide;
