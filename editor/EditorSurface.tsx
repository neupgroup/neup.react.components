'use client';

import type { HTMLAttributes, RefObject } from 'react';

export type EditorBehaviorHooks = Pick<
  HTMLAttributes<HTMLDivElement>,
  'onFocus' | 'onInput' | 'onKeyDown' | 'onPaste'
>;

export type EditorSurfaceProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'contentEditable' | 'role' | 'aria-label' | 'aria-multiline'
> & EditorBehaviorHooks & {
  ariaLabel: string;
  className?: string;
  empty: boolean;
  editorRef: RefObject<HTMLDivElement | null>;
  placeholder: string;
};

// Provide the shared contenteditable surface while applications supply editor behavior hooks.
export function EditorSurface({
  ariaLabel,
  className,
  editorRef,
  empty,
  placeholder,
  ...behaviorHooks
}: EditorSurfaceProps) {
  return (
    <div
      ref={editorRef}
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline="true"
      contentEditable
      suppressContentEditableWarning
      data-editor-root
      data-placeholder={placeholder}
      data-empty={empty}
      className={className}
      {...behaviorHooks}
    />
  );
}
