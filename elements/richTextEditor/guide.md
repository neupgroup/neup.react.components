# Rich text editor

Import one component for the ready-to-use rich text editor:

```tsx
import { RichTextEditor } from '@neup/components/elements/richTextEditor';

export function ArticleEditor() {
  const [html, setHtml] = useState('<p></p>');

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      height="55vh"
      placeholder="Tell your story…"
      title={title}
      onTitleChange={setTitle}
    />
  );
}
```

The editor includes the existing design, a selection formatting toolbar, a `/` command menu for image/audio/video/carousel blocks, lists, and tables, media controls, and clipboard support for formatted HTML and pasted images. HTML is the editor's value format.

## Props

- `value`: optional HTML value. When supplied, the editor is controlled; update it from `onChange`.
- `onChange(html)`: receives the editor HTML after typing, formatting, paste, or media edits.
- `title` and `onTitleChange(title)`: optionally render and control the title line as part of the editor. The title is normalized to one line.
- `titlePlaceholder`: title line placeholder; defaults to `Title`.
- `height`: adjustable minimum height as a CSS length or number of pixels. Defaults to `55vh`.
- `placeholder`: placeholder text. Defaults to `Start writing…`.
- `ariaLabel`: accessible name. Defaults to `Rich text editor`.
- `className`: extra classes for the editable text surface.
- `menuOptions`: replace the default formatting toolbar actions.
- `slashOptions`: add app-specific choices to the `/` menu. Each option has an `id`, `label`, and optional `searchText`.
- `onSlashAction(action, insertBlock)`: handle an app-specific slash action. Call `insertBlock(element)` to insert the custom DOM block at the command location.
- `children`: optional app-specific UI rendered inside the editor frame, such as additional controls.

For an uncontrolled editor, omit `value` and use `onChange` to observe edits. The default toolbar includes headings, paragraphs, lists, bold, italic, underline, highlight, and link actions. To add or remove toolbar actions, pass your own `EditorMenuOption[]` as `menuOptions`.

The editor handles Enter as a paragraph break and moves the caret between neighboring body blocks. With `title` enabled, Enter in the title moves into the body, and arrow navigation at the title/body boundary moves between them. The formatting toolbar follows the current text selection.

## Extending the editor

Use `slashOptions` and `onSlashAction` for custom `/` commands, and `children` for developer- or app-specific components that should sit inside the editor frame. For deeper integrations, the package also exports lower-level building blocks: `EditorSurface`, `EditorMenu`, `ComposeMediaBlocks`, `createImageBlock`, and `snapSelectionRange`. These are optional; a normal consumer only needs `RichTextEditor`.

Business block definitions and callout helpers are available from the same entry point: `businessBlockOptions`, `createBusinessBlock`, `BusinessBlockType`, `calloutBlockTypes`, `calloutBlockMetadata`, `createCalloutBlock`, `setCalloutBlockType`, `isCalloutBlockType`, and `CalloutBlockType`.

The component handles editor presentation and editing controls. The consuming app remains responsible for storing the HTML and applying any application-specific validation or sanitization before saving or rendering it.
