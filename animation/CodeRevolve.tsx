'use client';

import * as React from 'react';

/*
::neup.documentation::code-revolve
::title Code Revolve

::public

An Apple-style code activity icon. The `</>` mark remains centered while its
surrounding ring rotates continuously. The animation loops forever by default
so it can be used as a standalone `from` state before a future `to` animation.

::public end

::end
*/

export interface CodeRevolveProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width and height of the animation in pixels. */
  size?: number;
  /** Duration of one rotation. Lower values rotate faster. */
  duration?: number;
  /** Pauses the animation while preserving its current position. */
  paused?: boolean;
  /** Accessible label. Set to `null` when the icon is purely decorative. */
  label?: string | null;
}

const animationStyles = `
  @keyframes neup-code-revolve-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes neup-code-revolve-pulse {
    0%, 100% { opacity: .82; }
    50% { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-neup-code-revolve-ring],
    [data-neup-code-revolve-icon] {
      animation-duration: .01ms !important;
    }
  }
`;

/**
 * Continuously revolving code activity icon.
 *
 * The animation is intentionally self-contained so consumers only need to
 * import this component and do not need to add global CSS.
 */
export const CodeRevolve = React.forwardRef<HTMLDivElement, CodeRevolveProps>(
  (
    {
      size = 32,
      duration = 700,
      paused = false,
      label = 'Code is running',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const accessibleProps = label === null
      ? { 'aria-hidden': true as const }
      : { role: 'img' as const, 'aria-label': label };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          width: size,
          height: size,
          display: 'inline-grid',
          placeItems: 'center',
          position: 'relative',
          flex: `0 0 ${size}px`,
          color: 'var(--neup-code-revolve-color, #3a3a3c)',
        }}
        {...accessibleProps}
        {...props}
      >
        <style>{animationStyles}</style>

        <span
          data-neup-code-revolve-ring
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: Math.max(1, size * 0.03),
            border: `${Math.max(1.5, size * 0.0625)}px solid var(--neup-code-revolve-color, #3a3a3c)`,
            borderTopColor: 'var(--neup-code-revolve-accent, var(--neup-code-revolve-color, #3a3a3c))',
            borderRadius: '50%',
            animation: `neup-code-revolve-spin ${duration}ms linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />

        <span
          data-neup-code-revolve-icon
          aria-hidden="true"
          style={{
            position: 'relative',
            zIndex: 1,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: size * 0.34,
            fontWeight: 700,
            letterSpacing: size * -0.025,
            lineHeight: 1,
            animation: `neup-code-revolve-pulse ${duration * 2.86}ms ease-in-out infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          &lt;/&gt;
        </span>
      </div>
    );
  },
);

CodeRevolve.displayName = 'CodeRevolve';

export default CodeRevolve;
