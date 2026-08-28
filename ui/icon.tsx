'use client';

import * as React from 'react';

import Bell from '#/components/animation/Bell';
import CloudSync from '#/components/animation/CloudSync';
import CodeRevolve from '#/components/animation/CodeRevolve';
import Connecting from '#/components/animation/Connecting';
import Copy from '#/components/animation/Copy';
import CrossMark from '#/components/animation/CrossMark';
import CreateFile from '#/components/animation/CreateFile';
import Deploy from '#/components/animation/Deploy';
import Disconnected from '#/components/animation/Disconnected';
import Download from '#/components/animation/Download';
import Hide from '#/components/animation/Hide';
import Info from '#/components/animation/Info';
import Loading from '#/components/animation/Loading';
import Lock from '#/components/animation/Lock';
import Pending from '#/components/animation/Pending';
import Play from '#/components/animation/Play';
import Save from '#/components/animation/Save';
import Send from '#/components/animation/Send';
import Search from '#/components/animation/Search';
import Show from '#/components/animation/Show';
import Stop from '#/components/animation/Stop';
import TickMark from '#/components/animation/TickMark';
import Trash from '#/components/animation/Trash';
import Unlock from '#/components/animation/Unlock';
import Upload from '#/components/animation/Upload';
import Warning from '#/components/animation/Warning';

/*
::neup.documentation::icon-block
::title Icon Block

::public

Renders a static image, an external GIF, or a named animation. Animated icons
accept a required `from` animation and an optional `to` animation. The
animation registry is intentionally local so new animation files can be
registered without changing the block's public API.

Examples:

`<Icon type="animated" from="CodeRevolve" />`
`<Icon type="animated" from="CodeRevolve" to="Tick" />`
`<Icon type="gif" source="https://example.com/loading.gif" repeats />`
`<Icon type="static" source="/icons/cloud.svg" />`

::public end

::end
*/

type AnimationComponent = React.ComponentType<{
  size?: number;
  duration?: number;
  label?: string | null;
}>;

type IconBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color'> & {
  /** Width and height of the rendered icon in pixels. */
  size?: number;
};

export type AnimatedIconProps = IconBaseProps & {
  type: 'animated';
  from: string;
  to?: string;
};

export type GifIconProps = IconBaseProps & {
  type: 'gif';
  source: string;
  repeats?: boolean;
};

export type StaticIconProps = IconBaseProps & {
  type: 'static';
  source: string;
};

export type IconProps = AnimatedIconProps | GifIconProps | StaticIconProps;

const animations: Record<string, AnimationComponent> = {
  bell: Bell,
  cloudsync: CloudSync,
  coderevolve: CodeRevolve,
  connecting: Connecting,
  copy: Copy,
  crossmark: CrossMark,
  createfile: CreateFile,
  deploy: Deploy,
  disconnected: Disconnected,
  download: Download,
  hide: Hide,
  info: Info,
  loading: Loading,
  lock: Lock,
  pending: Pending,
  play: Play,
  save: Save,
  send: Send,
  search: Search,
  show: Show,
  stop: Stop,
  tickmark: TickMark,
  trash: Trash,
  unlock: Unlock,
  upload: Upload,
  warning: Warning,
};

function normalizeAnimationName(name: string) {
  return name
    .trim()
    .replace(/\.(?:tsx?|jsx?)$/, '')
    .split('/')
    .pop()
    ?.toLowerCase() ?? '';
}

function getAnimation(name: string) {
  return animations[normalizeAnimationName(name)];
}

function UnknownAnimation({ name }: { name: string }) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Icon: animation "${name}" is not registered.`);
  }

  return null;
}

function AnimatedIcon({
  from,
  to,
  size,
}: Pick<AnimatedIconProps, 'from' | 'to' | 'size'>) {
  const FromAnimation = getAnimation(from);
  const ToAnimation = to ? getAnimation(to) : undefined;

  if (!FromAnimation) {
    return <UnknownAnimation name={from} />;
  }

  // Until a target animation is registered, keep the source animation active.
  // This makes a standalone `from="CodeRevolve"` safe to use while the
  // animation set grows.
  if (!to || !ToAnimation) {
    return <FromAnimation size={size} label="Animated icon" />;
  }

  return (
    <span
      aria-label="Animated icon transition"
      style={{
        display: 'inline-grid',
        width: size,
        height: size,
        placeItems: 'center',
        position: 'relative',
      }}
    >
      <span
        style={{
          gridArea: '1 / 1',
          animation: 'neup-icon-source-disappear 420ms ease-in forwards',
        }}
      >
        <FromAnimation size={size} label={null} />
      </span>
      <span
        style={{
          gridArea: '1 / 1',
          opacity: 0,
          animation: 'neup-icon-target-appear 420ms cubic-bezier(.34, 1.56, .64, 1) forwards',
        }}
      >
        <ToAnimation size={size} label={null} />
      </span>
      <style>{`
        @keyframes neup-icon-target-appear {
          0% { opacity: 0; transform: scale(.72); }
          50% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes neup-icon-source-disappear {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0; transform: scale(.72); }
          100% { opacity: 0; transform: scale(.72); }
        }
      `}</style>
    </span>
  );
}

export function Icon(props: IconProps) {
  const { type, size = 32, className, style, ...rest } = props;
  const {
    from: _from,
    to: _to,
    source: _source,
    repeats: _repeats,
    ...htmlProps
  } = rest as React.HTMLAttributes<HTMLDivElement> & {
    from?: string;
    to?: string;
    source?: string;
    repeats?: boolean;
  };
  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  return (
    <div className={className} style={wrapperStyle} {...htmlProps}>
      {type === 'animated' ? (
        <AnimatedIcon from={props.from} to={props.to} size={size} />
      ) : (
        <img
          src={props.source}
          alt=""
          width={size}
          height={size}
          data-icon-type={type}
          data-icon-repeats={type === 'gif' ? String(props.repeats ?? true) : undefined}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
}

export default Icon;
