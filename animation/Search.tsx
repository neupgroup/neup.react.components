'use client';
import * as React from 'react';

/*
::neup.documentation::search-animation
::title Search Animation

::public

Displays a blue search icon with a blue revolving outline circle.

::public end

::end
*/
export interface SearchProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles=`@keyframes neup-search-revolve{to{transform:rotate(360deg)}} @keyframes neup-search-pulse{0%,100%{transform:scale(.94)}50%{transform:scale(1)}} @media(prefers-reduced-motion:reduce){[data-neup-search-revolve],[data-neup-search-icon]{animation-duration:.01ms!important}}`;
export const Search=React.forwardRef<HTMLDivElement,SearchProps>(({size=32,duration=900,paused=false,label='Search',className,style,...props},ref)=>{const color='var(--neup-search-color, #007aff)',sw=Math.max(1.5,size*.06);const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label};return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-search-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-search-revolve ${duration}ms linear infinite`,animationPlayState:paused?'paused':'running'}}/><svg data-neup-search-icon aria-hidden="true" viewBox="0 0 24 24" style={{width:'58%',height:'58%',fill:'none',stroke:color,strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',animation:`neup-search-pulse ${duration*1.6}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}><circle cx="10.8" cy="10.8" r="5.8"/><path d="m15.2 15.2 5 5"/></svg></div>});
Search.displayName='Search';export default Search;
