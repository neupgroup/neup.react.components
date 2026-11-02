'use client';

import * as React from 'react';

import Download, { type DownloadProps } from './Download';

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

/*
::neup.documentation::download-animation-white
::title White Download Animation

::public

Displays the download animation in white for dark or danger-colored controls.

::public end

::end
*/

export const DownloadWhite = React.forwardRef<HTMLDivElement, DownloadProps>(
  ({ style, ...props }, ref) => (
    <Download
      ref={ref}
      {...props}
      style={{
        ...style,
        '--neup-download-color': '#ffffff',
      } as React.CSSProperties}
    />
  ),
);

DownloadWhite.displayName = 'DownloadWhite';

export default DownloadWhite;
