'use client';
import * as React from 'react';

/*
::neup.documentation::cloud-sync-animation
::title Cloud Sync Animation

::public

Displays a blue cloud with an upload arrow and a blue revolving outline circle.

::public end

::end
*/
export interface CloudSyncProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles=`@keyframes neup-cloud-sync-revolve{to{transform:rotate(360deg)}} @keyframes neup-cloud-sync-upload{0%,100%{transform:translateY(1px)}50%{transform:translateY(-2px)}} @media(prefers-reduced-motion:reduce){[data-neup-cloud-sync-revolve],[data-neup-cloud-sync-icon]{animation-duration:.01ms!important}}`;
export const CloudSync=React.forwardRef<HTMLDivElement,CloudSyncProps>(({size=32,duration=900,paused=false,label='Cloud sync',className,style,...props},ref)=>{const color='var(--neup-cloud-sync-color, #007aff)',sw=Math.max(1.5,size*.06);const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label};return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-cloud-sync-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-cloud-sync-revolve ${duration}ms linear infinite`,animationPlayState:paused?'paused':'running'}}/><svg data-neup-cloud-sync-icon aria-hidden="true" viewBox="0 0 24 24" style={{width:'64%',height:'64%',fill:'none',stroke:color,strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round',animation:`neup-cloud-sync-upload ${duration*1.6}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}><path d="M6.5 18.5h11a3.5 3.5 0 0 0 .6-6.95A6 6 0 0 0 6.5 9.5a4.5 4.5 0 0 0 0 9Z"/><path d="M12 11v6M9.5 13.5 12 11l2.5 2.5"/></svg></div>});
CloudSync.displayName='CloudSync';export default CloudSync;
