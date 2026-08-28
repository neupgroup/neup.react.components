'use client';

import * as React from 'react';

/*
::neup.documentation::upload-animation
::title Upload Animation

::public

Displays a continuously looping upload animation with a fading upward arrow
and a subtle tray pulse.

::public end

::end
*/

export interface UploadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width and height of the animation in pixels. */
  size?: number;
  /** Duration of one upload cycle in milliseconds. */
  duration?: number;
  /** Pauses the animation while preserving its current position. */
  paused?: boolean;
  /** Accessible label. Set to `null` when the icon is purely decorative. */
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-upload-arrow {
    0% {
      opacity: 0;
      transform: translateY(6px) scale(.92);
    }

    15% {
      opacity: 1;
    }

    25% {
      transform: translateY(3px) scale(1);
    }

    60% {
      opacity: 1;
      transform: translateY(-4px) scale(1);
    }

    75%, 100% {
      opacity: 0;
      transform: translateY(-8px) scale(.94);
    }
  }

  @keyframes neup-upload-tray-pulse {
    0%, 30%, 60%, 100% {
      transform: scale(1);
    }

    45% {
      transform: scaleX(1.08) scaleY(.92);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-upload-arrow],
    [data-neup-upload-tray] {
      animation-duration: .01ms !important;
    }
  }
`;

export const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      size = 28,
      duration = 1100,
      paused = false,
      label = 'Uploading',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const scale = size / 28;
    const accessibleProps = label === null
      ? { 'aria-hidden': true as const }
      : { role: 'img' as const, 'aria-label': label };
    const strokeWidth = Math.max(1.5, 2.4 * scale);
    const color = 'var(--neup-upload-color, #3a3a3c)';

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...accessibleProps}
        {...props}
      >
        <style>{animationStyles}</style>

        <span
          data-neup-upload-arrow
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 6 * scale,
            top: 5 * scale,
            width: 16 * scale,
            height: 18 * scale,
            animation: `neup-upload-arrow ${duration}ms cubic-bezier(.4, 0, .2, 1) infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 4 * scale,
              left: '50%',
              width: strokeWidth,
              height: 12 * scale,
              transform: 'translateX(-50%)',
              background: color,
              borderRadius: 99,
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 4 * scale,
              left: 2 * scale,
              width: 8 * scale,
              height: strokeWidth,
              transform: 'rotate(-45deg)',
              transformOrigin: 'center',
              background: color,
              borderRadius: 99,
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 4 * scale,
              right: 2 * scale,
              width: 8 * scale,
              height: strokeWidth,
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              background: color,
              borderRadius: 99,
            }}
          />
        </span>

        <span
          data-neup-upload-tray
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 4 * scale,
            bottom: 2 * scale,
            width: 20 * scale,
            height: 7 * scale,
            borderLeft: `${strokeWidth}px solid ${color}`,
            borderRight: `${strokeWidth}px solid ${color}`,
            borderBottom: `${strokeWidth}px solid ${color}`,
            borderRadius: `0 0 ${5 * scale}px ${5 * scale}px`,
            animation: `neup-upload-tray-pulse ${duration}ms cubic-bezier(.4, 0, .2, 1) infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>
    );
  },
);

Upload.displayName = 'Upload';

export default Upload;
