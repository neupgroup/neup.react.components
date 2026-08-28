'use client';

import * as React from 'react';

/*
::neup.documentation::download-animation
::title Download Animation

::public

Displays a continuously looping download animation with a fading downward
arrow, a subtle receiving tray pulse, and a grey revolving outline circle.

::public end

::end
*/

export interface DownloadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width and height of the animation in pixels. */
  size?: number;
  /** Duration of one download cycle in milliseconds. */
  duration?: number;
  /** Pauses the animation while preserving its current position. */
  paused?: boolean;
  /** Accessible label. Set to `null` when the icon is purely decorative. */
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-download-arrow {
    0% {
      opacity: 0;
      transform: translateY(-5px);
    }

    18% {
      opacity: 1;
    }

    55% {
      opacity: 1;
      transform: translateY(3px);
    }

    70%, 100% {
      opacity: 0;
      transform: translateY(6px);
    }
  }

  @keyframes neup-download-tray-pulse {
    0%, 42%, 100% {
      transform: scale(1);
    }

    58% {
      transform: scaleX(1.08) scaleY(.92);
    }

    72% {
      transform: scale(1);
    }
  }

  @keyframes neup-download-revolve {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-download-arrow],
    [data-neup-download-tray],
    [data-neup-download-revolve] {
      animation-duration: .01ms !important;
    }
  }
`;

export const Download = React.forwardRef<HTMLDivElement, DownloadProps>(
  (
    {
      size = 28,
      duration = 1100,
      paused = false,
      label = 'Downloading',
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
    const color = 'var(--neup-download-color, #3a3a3c)';

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
          data-neup-download-revolve
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 1 * scale,
            border: `${strokeWidth}px solid ${color}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: `neup-download-revolve ${duration}ms linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            pointerEvents: 'none',
          }}
        />

        <span
          data-neup-download-arrow
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 2 * scale,
            width: 16 * scale,
            height: 17 * scale,
            animation: `neup-download-arrow ${duration}ms cubic-bezier(.4, 0, .2, 1) infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: strokeWidth,
              height: 11 * scale,
              transform: 'translateX(-50%)',
              background: color,
              borderRadius: 99,
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 2 * scale,
              bottom: 3 * scale,
              width: 8 * scale,
              height: strokeWidth,
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              background: color,
              borderRadius: 99,
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: 2 * scale,
              bottom: 3 * scale,
              width: 8 * scale,
              height: strokeWidth,
              transform: 'rotate(-45deg)',
              transformOrigin: 'center',
              background: color,
              borderRadius: 99,
            }}
          />
        </span>

        <span
          data-neup-download-tray
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 2 * scale,
            width: 20 * scale,
            height: 7 * scale,
            borderLeft: `${strokeWidth}px solid ${color}`,
            borderRight: `${strokeWidth}px solid ${color}`,
            borderBottom: `${strokeWidth}px solid ${color}`,
            borderRadius: `0 0 ${5 * scale}px ${5 * scale}px`,
            animation: `neup-download-tray-pulse ${duration}ms cubic-bezier(.4, 0, .2, 1) infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>
    );
  },
);

Download.displayName = 'Download';

export default Download;
