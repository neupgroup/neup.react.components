'use client';
import * as React from 'react';

/*
::neup.documentation::create-file-animation
::title Create File Animation

::public

Displays a blue file with a plus sign and a blue revolving outline circle.

::public end

::end
*/
export interface CreateFileProps extends React.HTMLAttributes<HTMLDivElement> { size?: number; duration?: number; paused?: boolean; label?: string | null; }
const animationStyles = `@keyframes neup-create-file-revolve { to { transform: rotate(360deg); } } @keyframes neup-create-file-pulse { 0%,100% { transform: scale(.94); } 50% { transform: scale(1); } } @media (prefers-reduced-motion: reduce) { [data-neup-create-file-revolve],[data-neup-create-file-icon] { animation-duration:.01ms!important; } }`;
export const CreateFile = React.forwardRef<HTMLDivElement, CreateFileProps>(({ size=32,duration=900,paused=false,label='Create file',className,style,...props },ref) => { const color='var(--neup-create-file-color, #007aff)', sw=Math.max(1.5,size*.06); const a=label===null?{'aria-hidden':true as const}:{role:'img' as const,'aria-label':label}; return <div ref={ref} className={className} style={{...style,width:size,height:size,display:'grid',placeItems:'center',position:'relative'}} {...a} {...props}><style>{animationStyles}</style><span data-neup-create-file-revolve aria-hidden="true" style={{position:'absolute',inset:1,border:`${sw}px solid ${color}`,borderTopColor:'transparent',borderRadius:'50%',animation:`neup-create-file-revolve ${duration}ms linear infinite`,animationPlayState:paused?'paused':'running'}}/><svg data-neup-create-file-icon aria-hidden="true" viewBox="0 0 24 24" style={{width:'58%',height:'58%',fill:'none',stroke:color,strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round',animation:`neup-create-file-pulse ${duration*1.6}ms ease-in-out infinite`,animationPlayState:paused?'paused':'running'}}><path d="M5 3h9l5 5v13H5V3Z"/><path d="M14 3v6h5M12 12v6M9 15h6"/></svg></div>; });
CreateFile.displayName='CreateFile'; export default CreateFile;
