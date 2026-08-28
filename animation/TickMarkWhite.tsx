'use client';

import * as React from 'react';

import TickMark, { type TickMarkProps } from './TickMark';

/*
::neup.documentation::tick-mark-white
::title White Tick Mark

::public

Displays the success tick animation using a white outline and check mark for
use on dark or danger-colored controls.

::public end

::end
*/

export const TickMarkWhite = React.forwardRef<HTMLDivElement, TickMarkProps>(
  ({ style, ...props }, ref) => (
    <TickMark
      ref={ref}
      {...props}
      style={{
        ...style,
        '--neup-tick-mark-color': '#ffffff',
      } as React.CSSProperties}
    />
  ),
);

TickMarkWhite.displayName = 'TickMarkWhite';

export default TickMarkWhite;
