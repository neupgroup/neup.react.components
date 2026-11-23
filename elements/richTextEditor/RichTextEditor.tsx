'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '@neup/components/ui/button';
import { ComposeMediaBlocks, createImageBlock } from './ComposeImageBlocks';
import { EditorMenu } from './editorMenu';
import type { EditorMenuAction, EditorMenuOption } from './editorMenu';
import { EditorSurface } from './EditorSurface';
import { snapSelectionRange } from './SmartSelectionBehavior';
import styles from './editor.module.css';

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
  /** Optional title line rendered above the body as part of the editor. */
  title?: string;
  /** Called when the normalized title changes. */
  onTitleChange?: (title: string) => void;
  titlePlaceholder?: string;
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
  /** Extend the `/` command menu with app-specific block commands. */
  slashOptions?: RichTextEditorSlashOption[];
  /** Create the DOM block for a custom slash command. */
  onSlashAction?: (action: string, insertBlock: (block: HTMLElement) => void) => void;
  /** Optional app-specific controls or editor extensions. */
  children?: ReactNode;
}

export interface RichTextEditorSlashOption {
  id: string;
  label: string;
  searchText?: string;
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

// Create an empty paragraph block for slash command insertion.
function createParagraph(): HTMLParagraphElement {
  const paragraph = document.createElement('p');
  paragraph.append(document.createElement('br'));
  return paragraph;
}

// Find the active slash command and its range in the editor.
function getSlashContext(editor: HTMLDivElement): { range: Range; query: string; top: number; left: number } | null {
  const selection = window.getSelection();
  const node = selection?.anchorNode;
  if (!node || !selection?.isCollapsed || !selection.rangeCount || !editor.contains(node) || node.nodeType !== Node.TEXT_NODE) return null;
  const text = node.textContent ?? '';
  const beforeCaret = text.slice(0, selection.anchorOffset);
  const slashIndex = beforeCaret.lastIndexOf('/');
  if (slashIndex < 0) return null;
  const query = beforeCaret.slice(slashIndex + 1);
  if (/\s/.test(query)) return null;
  const range = document.createRange();
  range.setStart(node, slashIndex);
  range.setEnd(node, selection.anchorOffset);
  const rect = range.getBoundingClientRect();
  return { range, query, top: rect.bottom + 8, left: rect.left };
}

// Render a ready-to-use rich text editor with formatting and media controls.
export function RichTextEditor({
  title,
  onTitleChange,
  titlePlaceholder = 'Title',
  value,
  onChange,
  height = '55vh',
  placeholder = 'Start writing…',
  ariaLabel = 'Rich text editor',
  className = '',
  menuOptions = defaultMenuOptions,
  slashOptions = [],
  onSlashAction,
  children,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const slashRangeRef = useRef<Range | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [internalHtml, setInternalHtml] = useState(value ?? '');
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [activeActions, setActiveActions] = useState<EditorMenuAction[]>([]);
  const [slashMenu, setSlashMenu] = useState<{ top: number; left: number; query: string } | null>(null);
  const [activeSlashIndex, setActiveSlashIndex] = useState(0);
  const [videoMenu, setVideoMenu] = useState(false);
  const [videoProvider, setVideoProvider] = useState<'youtube' | 'vimeo'>('youtube');
  const [videoUrl, setVideoUrl] = useState('');
  const builtinSlashOptions: RichTextEditorSlashOption[] = [
    { id: 'image', label: 'Add an image block' },
    { id: 'audio', label: 'Add an audio block' },
    { id: 'video', label: 'Add a video block' },
    { id: 'carousel', label: 'Add a carousel block' },
    { id: 'numbered-list', label: 'Add a numbered list' },
    { id: 'unnumbered-list', label: 'Add an unnumbered list' },
    { id: 'table', label: 'Add a table' },
    ...slashOptions,
  ];
  const filteredSlashOptions = builtinSlashOptions.filter((option) =>
    `${option.label} ${option.searchText ?? ''} ${option.id}`.toLowerCase().includes((slashMenu?.query ?? '').toLowerCase())
  );
  const html = value ?? internalHtml;

  // Synchronize external HTML changes into the editable DOM.
  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== html) {
      editor.innerHTML = html;
    }
  }, [html]);

  // Synchronize an optional title with the editable title line.
  useLayoutEffect(() => {
    if (titleRef.current && title !== undefined && titleRef.current.innerText !== title) {
      titleRef.current.textContent = title;
    }
  }, [title]);

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

  // Track slash commands whenever the caret or editor content changes.
  const updateSlashMenu = useCallback(() => {
    const editor = editorRef.current;
    const context = editor ? getSlashContext(editor) : null;
    if (!context) {
      slashRangeRef.current = null;
      setSlashMenu(null);
      return;
    }
    slashRangeRef.current = context.range;
    setSlashMenu({ top: context.top, left: context.left, query: context.query });
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

  useEffect(() => {
    document.addEventListener('selectionchange', updateSlashMenu);
    return () => document.removeEventListener('selectionchange', updateSlashMenu);
  }, [updateSlashMenu]);

  // Insert a slash command block at the command text and move the caret after it.
  const insertSlashBlock = (block: HTMLElement) => {
    const editor = editorRef.current;
    const range = slashRangeRef.current;
    if (!editor) return;
    const selection = window.getSelection();
    const commandBlock = range?.startContainer.parentElement?.closest('p, h2, h3, div');
    const replaceCommandBlock = commandBlock instanceof HTMLElement && commandBlock.textContent?.trim() === range?.toString().trim();
    editor.focus();
    if (replaceCommandBlock) {
      commandBlock.replaceWith(block);
    } else if (range) {
      selection?.removeAllRanges();
      selection?.addRange(range);
      range.deleteContents();
      range.insertNode(block);
    } else {
      editor.append(block);
    }
    const paragraph = createParagraph();
    block.after(paragraph);
    const caretRange = document.createRange();
    caretRange.selectNodeContents(paragraph);
    caretRange.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(caretRange);
    slashRangeRef.current = null;
    setSlashMenu(null);
    publishChange(readEditorHtml(editor));
  };

  // Create built-in blocks or delegate app-specific slash actions.
  const handleSlashAction = (action: string) => {
    if (!['image', 'audio', 'video', 'carousel', 'numbered-list', 'unnumbered-list', 'table'].includes(action)) {
      onSlashAction?.(action, insertSlashBlock);
      setSlashMenu(null);
      return;
    }
    if (action === 'image') {
      insertSlashBlock(createImageBlock());
    } else if (action === 'audio') {
      const src = window.prompt('Audio URL');
      if (src?.trim()) {
        const figure = document.createElement('figure');
        figure.dataset.editorBlock = 'audio';
        figure.dataset.mediaKind = 'audio';
        figure.contentEditable = 'false';
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = src.trim();
        figure.append(audio);
        insertSlashBlock(figure);
      }
    } else if (action === 'video') {
      setVideoMenu(true);
      setSlashMenu(null);
      return;
    } else if (action === 'carousel') {
      const sources = window.prompt('Image URLs, separated by commas')?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
      if (sources.length) {
        const figure = document.createElement('figure');
        figure.dataset.editorBlock = 'carousel';
        figure.dataset.mediaKind = 'carousel';
        figure.contentEditable = 'false';
        const track = document.createElement('div');
        track.dataset.carouselTrack = 'true';
        sources.forEach((src) => {
          const image = document.createElement('img');
          image.src = src;
          image.alt = '';
          track.append(image);
        });
        figure.append(track);
        insertSlashBlock(figure);
      }
    } else if (action === 'numbered-list' || action === 'unnumbered-list') {
      const list = document.createElement(action === 'numbered-list' ? 'ol' : 'ul');
      const item = document.createElement('li');
      item.append(document.createElement('br'));
      list.append(item);
      insertSlashBlock(list);
    } else {
      const table = document.createElement('table');
      const body = document.createElement('tbody');
      for (let row = 0; row < 2; row += 1) {
        const tr = document.createElement('tr');
        for (let column = 0; column < 2; column += 1) {
          const cell = document.createElement(row === 0 ? 'th' : 'td');
          cell.append(document.createElement('br'));
          tr.append(cell);
        }
        body.append(tr);
      }
      table.append(body);
      insertSlashBlock(table);
    }
  };

  // Handle keyboard navigation and selection of slash command suggestions.
  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (slashMenu && (event.key === 'Escape' || event.key === 'Tab')) {
      event.preventDefault();
      setSlashMenu(null);
      return;
    }
    if (slashMenu && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      setActiveSlashIndex((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + filteredSlashOptions.length) % Math.max(1, filteredSlashOptions.length));
    }
    if (slashMenu && event.key === 'Enter' && filteredSlashOptions[activeSlashIndex]) {
      event.preventDefault();
      handleSlashAction(filteredSlashOptions[activeSlashIndex].id);
      return;
    }

    const editor = event.currentTarget;
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const block = range?.startContainer instanceof HTMLElement
      ? range.startContainer.closest('p, h2, h3, li, blockquote, div')
      : range?.startContainer.parentElement?.closest('p, h2, h3, li, blockquote, div');

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      document.execCommand('insertParagraph');
      publishChange(readEditorHtml(editor));
      requestAnimationFrame(updateSlashMenu);
      return;
    }

    if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp') && range?.collapsed && block instanceof HTMLElement) {
      const blockRange = document.createRange();
      blockRange.selectNodeContents(block);
      blockRange.setEnd(range.startContainer, range.startOffset);
      if (!blockRange.toString().length) {
        const previous = block.previousElementSibling;
        if (previous instanceof HTMLElement) {
          event.preventDefault();
          const caret = document.createRange();
          caret.selectNodeContents(previous);
          caret.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(caret);
        } else if (titleRef.current) {
          event.preventDefault();
          titleRef.current.focus();
          const caret = document.createRange();
          caret.selectNodeContents(titleRef.current);
          caret.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(caret);
        }
      }
    }

    if ((event.key === 'ArrowRight' || event.key === 'ArrowDown') && range?.collapsed && block instanceof HTMLElement) {
      const blockRange = document.createRange();
      blockRange.selectNodeContents(block);
      blockRange.setStart(range.startContainer, range.startOffset);
      if (!blockRange.toString().length) {
        const next = block.nextElementSibling;
        if (next instanceof HTMLElement) {
          event.preventDefault();
          const caret = document.createRange();
          caret.selectNodeContents(next);
          caret.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(caret);
        }
      }
    }
  };

  // Normalize title whitespace and keep title/body navigation consistent.
  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLHeadingElement>) => {
    const element = event.currentTarget;
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (event.key === 'Enter' || event.key === 'ArrowDown' && range?.collapsed) {
      event.preventDefault();
      editorRef.current?.focus();
      const firstBlock = editorRef.current?.firstElementChild;
      const caret = document.createRange();
      if (firstBlock) caret.selectNodeContents(firstBlock);
      else if (editorRef.current) caret.selectNodeContents(editorRef.current);
      caret.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(caret);
    }
    if (event.key === 'ArrowRight' && range?.collapsed) {
      const titleRange = document.createRange();
      titleRange.selectNodeContents(element);
      titleRange.setStart(range.startContainer, range.startOffset);
      if (!titleRange.toString().length && editorRef.current) {
        event.preventDefault();
        editorRef.current.focus();
        const caret = document.createRange();
        const firstBlock = editorRef.current.firstElementChild ?? editorRef.current;
        caret.selectNodeContents(firstBlock);
        caret.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(caret);
      }
    }
  };

  // Normalize title text to a single line and notify the caller.
  const handleTitleInput = (event: React.FormEvent<HTMLHeadingElement>) => {
    const normalized = event.currentTarget.innerText.replace(/\s+/g, ' ').trimStart();
    if (event.currentTarget.innerText !== normalized) {
      event.currentTarget.textContent = normalized;
    }
    onTitleChange?.(normalized);
  };

  // Submit a YouTube or Vimeo URL as a playable embed.
  const addVideoEmbed = () => {
    let embedUrl = '';
    if (videoProvider === 'youtube') {
      const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
      if (match) embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
    } else {
      const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) embedUrl = `https://player.vimeo.com/video/${match[1]}`;
    }
    if (!embedUrl) return;
    const figure = document.createElement('figure');
    figure.dataset.editorBlock = 'video';
    figure.dataset.mediaKind = 'video';
    figure.contentEditable = 'false';
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = `${videoProvider} video`;
    iframe.allowFullscreen = true;
    figure.append(iframe);
    insertSlashBlock(figure);
    setVideoMenu(false);
    setVideoUrl('');
  };

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
      {title !== undefined && (
        <h3
          ref={titleRef}
          role="textbox"
          aria-label={titlePlaceholder}
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          data-placeholder={titlePlaceholder}
          onInput={handleTitleInput}
          onKeyDown={handleTitleKeyDown}
          onPaste={(event) => {
            event.preventDefault();
            const text = event.clipboardData.getData('text/plain').replace(/\s+/g, ' ').trim();
            document.execCommand('insertText', false, text);
          }}
          className="mb-5 min-h-12 w-full border-0 bg-transparent px-0 font-serif text-4xl font-medium leading-tight tracking-tight text-slate-700 outline-none empty:before:text-slate-300 empty:before:content-[attr(data-placeholder)]"
        />
      )}
      <EditorSurface
        editorRef={editorRef}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
        empty={!html.trim()}
        style={editorStyle}
        className={`${styles.editor} min-h-0 w-full border-0 bg-transparent px-0 font-serif text-[20px] font-medium leading-8 text-slate-600 outline-none empty:before:text-slate-300 empty:before:content-[attr(data-placeholder)] ${className}`}
        onInput={(event) => {
          publishChange(readEditorHtml(event.currentTarget));
          requestAnimationFrame(updateSlashMenu);
        }}
        onKeyDown={handleEditorKeyDown}
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
      {slashMenu && (
        <div data-slash-menu style={{ position: 'fixed', top: slashMenu.top, left: slashMenu.left }} className="z-50 w-56 border border-slate-200 bg-white p-1 shadow-lg">
          {filteredSlashOptions.map((option, index) => (
            <Button key={option.id} variant="text" size="sm" type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleSlashAction(option.id)} className={`block w-full rounded px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 ${index === activeSlashIndex ? 'bg-slate-100' : ''}`}>
              {option.label}
            </Button>
          ))}
          {!filteredSlashOptions.length && <div className="px-3 py-2 text-sm text-slate-500">No blocks found</div>}
        </div>
      )}
      {videoMenu && (
        <div className="absolute right-0 top-2 z-50 w-80 border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-3 flex gap-2">
            {(['youtube', 'vimeo'] as const).map((provider) => (
              <Button key={provider} variant="text" size="sm" type="button" onClick={() => setVideoProvider(provider)} className={videoProvider === provider ? 'bg-blue-50 text-blue-700' : ''}>{provider}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={videoUrl} onChange={(event) => setVideoUrl(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') addVideoEmbed(); }} placeholder={`Paste ${videoProvider} URL`} className="min-w-0 flex-1 border px-3 text-sm" />
            <Button variant="text" size="sm" type="button" onClick={addVideoEmbed}>Add</Button>
          </div>
          <Button variant="text" size="sm" type="button" onClick={() => videoInputRef.current?.click()} className="mt-3 w-full">Add local video</Button>
        </div>
      )}
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(event) => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = '';
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const figure = document.createElement('figure');
          figure.dataset.editorBlock = 'video';
          figure.dataset.mediaKind = 'video';
          figure.contentEditable = 'false';
          const video = document.createElement('video');
          video.controls = true;
          video.src = String(reader.result ?? '');
          figure.append(video);
          insertSlashBlock(figure);
          setVideoMenu(false);
        };
        reader.readAsDataURL(file);
      }} />
      {children}
    </div>
  );
}

export default RichTextEditor;
