'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ComposeMediaBlocks } from './ComposeImageBlocks';
import { EditorMenu } from './editorMenu';
import type { EditorMenuAction, EditorMenuOption } from './editorMenu';
import { EditorSurface } from './EditorSurface';
import { snapSelectionRange } from './SmartSelectionBehavior';

const defaultMenuOptions: EditorMenuOption[] = [
  { action: 'h2', label: 'Heading 2', icon: 'H2' },
  { action: 'h3', label: 'Heading 3', icon: 'H3' },
  { action: 'paragraph', label: 'Paragraph', icon: 'P', separatorBefore: true },
  { action: 'numbered-list', label: 'Numbered list', icon: '1.' },
  { action: 'unnumbered-list', label: 'Unnumbered list', icon: '•' },
  { action: 'bold', label: 'Bold', icon: 'B', separatorBefore: true },
  { action: 'italic', label: 'Italic', icon: 'I' },
  { action: 'underline', label: 'Underline', icon: 'U' },
  { action: 'highlight', label: 'Highlight', icon: 'H' },
  { action: 'link', label: 'Add link', icon: '↗' },
];

export interface RichTextEditorProps {
  /** Initial/current editor HTML. When provided, the editor is controlled. */
  value?: string;
  /** Called with the editor's HTML after edits, paste, and media changes. */
  onChange?: (html: string) => void;
  /** Minimum editor height. Accepts CSS lengths such as `320px` or `50vh`. */
  height?: number | string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  /** Add, remove, or replace the default formatting toolbar options. */
  menuOptions?: EditorMenuOption[];
  /** Optional app-specific controls or editor extensions. */
  children?: ReactNode;
}

interface MenuPosition {
  top: number;
  left: number;
  transform: string;
}

// Read the contenteditable document as HTML.
function readEditorHtml(element: HTMLDivElement): string {
  return element.innerHTML;
}

// Keep the selection inside the editor while opening its formatting menu.
function getEditorSelection(editor: HTMLDivElement): Range | null {
  const selection = window.getSelection();

  if (!selection?.rangeCount || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);

  return editor.contains(range.commonAncestorContainer) ? range.cloneRange() : null;
}

// Compute a viewport-safe position above the current selection.
function getMenuPosition(range: Range): MenuPosition | null {
  const rect = range.getBoundingClientRect();

  if (!rect.width && !rect.height) {
    return null;
  }

  const left = Math.max(8, Math.min(rect.left + rect.width / 2, window.innerWidth - 8));
  const top = rect.top < 64 ? rect.bottom + 8 : rect.top - 52;

  return { top, left, transform: 'translateX(-50%)' };
}

// Read the browser selection's active inline formatting actions.
function getActiveActions(editor: HTMLDivElement): EditorMenuAction[] {
  const selection = window.getSelection();
  const node = selection?.anchorNode;
  const element = node instanceof HTMLElement ? node : node?.parentElement;

  if (!element || !editor.contains(element)) {
    return [];
  }

  const actions: EditorMenuAction[] = [];
  if (element.closest('strong, b')) actions.push('bold');
  if (element.closest('em, i')) actions.push('italic');
  if (element.closest('u')) actions.push('underline');
  if (element.closest('mark')) actions.push('highlight');
  if (element.closest('a')) actions.push('link');
  return actions;
}

// Render a ready-to-use rich text editor with formatting and media controls.
export function RichTextEditor({
  value,
  onChange,
  height = '55vh',
  placeholder = 'Start writing…',
  ariaLabel = 'Rich text editor',
  className = '',
  menuOptions = defaultMenuOptions,
  children,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [internalHtml, setInternalHtml] = useState(value ?? '');
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [activeActions, setActiveActions] = useState<EditorMenuAction[]>([]);
  const html = value ?? internalHtml;

  // Synchronize external HTML changes into the editable DOM.
  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== html) {
      editor.innerHTML = html;
    }
  }, [html]);

  // Publish HTML updates to both controlled and uncontrolled consumers.
  const publishChange = useCallback((nextHtml: string) => {
    if (value === undefined) {
      setInternalHtml(nextHtml);
    }
    onChange?.(nextHtml);
  }, [onChange, value]);

  // Update the toolbar position when a non-empty editor selection changes.
  const updateSelectionMenu = useCallback(() => {
    const editor = editorRef.current;
    const range = editor ? getEditorSelection(editor) : null;

    if (!editor || !range) {
      selectionRef.current = null;
      setMenuPosition(null);
      setActiveActions([]);
      return;
    }

    const snappedRange = snapSelectionRange(editor, range) ?? range;
    selectionRef.current = snappedRange;
    setMenuPosition(getMenuPosition(snappedRange));
    setActiveActions(getActiveActions(editor));
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', updateSelectionMenu);
    window.addEventListener('resize', updateSelectionMenu);
    window.addEventListener('scroll', updateSelectionMenu, true);
    return () => {
      document.removeEventListener('selectionchange', updateSelectionMenu);
      window.removeEventListener('resize', updateSelectionMenu);
      window.removeEventListener('scroll', updateSelectionMenu, true);
    };
  }, [updateSelectionMenu]);

  // Apply an inline format or replace the selected block with a semantic block.
  const applyAction = (action: EditorMenuAction) => {
    const editor = editorRef.current;
    const range = selectionRef.current;
    if (!editor || !range) return;

    editor.focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    if (['h2', 'h3', 'paragraph', 'numbered-list', 'unnumbered-list'].includes(action)) {
      const blockTag = action === 'paragraph' ? 'p'
        : action === 'numbered-list' ? 'ol'
          : action === 'unnumbered-list' ? 'ul' : action;
      document.execCommand('formatBlock', false, blockTag);
    } else if (action === 'link') {
      const rawUrl = window.prompt('Link URL');
      if (rawUrl) {
        try {
          const url = new URL(rawUrl, window.location.href);
          if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
            document.execCommand('createLink', false, url.href);
          }
        } catch {
          // Ignore malformed link input.
        }
      }
    } else if (action === 'highlight') {
      document.execCommand('hiliteColor', false, '#fef08a');
    } else {
      const command = action === 'bold' ? 'bold' : action === 'italic' ? 'italic'
        : action === 'underline' ? 'underline' : null;
      if (command) document.execCommand(command);
    }

    publishChange(readEditorHtml(editor));
    requestAnimationFrame(updateSelectionMenu);
  };

  // Insert pasted HTML or plain text at the current editor selection.
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const editor = event.currentTarget;
    const htmlContent = event.clipboardData.getData('text/html');
    const plainText = event.clipboardData.getData('text/plain');
    const clipboardFiles = Array.from(event.clipboardData.files);
    const imageFiles = clipboardFiles.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length) {
      event.preventDefault();
      for (const file of imageFiles) {
        const reader = new FileReader();
        reader.onload = () => {
          const image = document.createElement('img');
          image.src = String(reader.result ?? '');
          image.alt = file.name;
          document.execCommand('insertHTML', false, image.outerHTML);
          publishChange(readEditorHtml(editor));
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    if (htmlContent.trim()) {
      event.preventDefault();
      const template = document.createElement('template');
      template.innerHTML = htmlContent;
      template.content.querySelectorAll('script, style, meta, link').forEach((node) => node.remove());
      template.content.querySelectorAll('*').forEach((node) => {
        for (const attribute of Array.from(node.attributes)) {
          if (/^on/i.test(attribute.name) || (attribute.name === 'href' || attribute.name === 'src') && /^\s*javascript:/i.test(attribute.value)) {
            node.removeAttribute(attribute.name);
          }
        }
      });
      document.execCommand('insertHTML', false, template.innerHTML);
      publishChange(readEditorHtml(editor));
      return;
    }

    if (plainText) {
      event.preventDefault();
      document.execCommand('insertText', false, plainText);
      publishChange(readEditorHtml(editor));
    }
  };

  // Convert the public height prop into the editor's minimum height style.
  const editorStyle: CSSProperties = {
    minHeight: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div ref={frameRef} className="relative">
      <EditorSurface
        editorRef={editorRef}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
        empty={!html.trim()}
        style={editorStyle}
        className={`w-full border-0 bg-transparent px-0 font-serif text-[20px] font-medium leading-8 text-slate-600 outline-none empty:before:text-slate-300 empty:before:content-[attr(data-placeholder)] ${className}`}
        onInput={(event) => publishChange(readEditorHtml(event.currentTarget))}
        onPaste={handlePaste}
      />
      <ComposeMediaBlocks
        contentRef={editorRef}
        editorFrameRef={frameRef}
        getContent={readEditorHtml}
        onContentChange={publishChange}
      />
      {menuPosition && (
        <EditorMenu
          options={menuOptions}
          activeActions={activeActions}
          position={menuPosition}
          onAction={applyAction}
        />
      )}
      {children}
    </div>
  );
}

export default RichTextEditor;
