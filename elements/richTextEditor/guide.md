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
    />
  );
}
```

The editor includes the existing design, a selection formatting toolbar, image/audio/video/carousel media controls, and clipboard support for formatted HTML and pasted images. HTML is the editor's value format.

## Props

- `value`: optional HTML value. When supplied, the editor is controlled; update it from `onChange`.
- `onChange(html)`: receives the editor HTML after typing, formatting, paste, or media edits.
- `height`: adjustable minimum height as a CSS length or number of pixels. Defaults to `55vh`.
- `placeholder`: placeholder text. Defaults to `Start writing…`.
- `ariaLabel`: accessible name. Defaults to `Rich text editor`.
- `className`: extra classes for the editable text surface.
- `menuOptions`: replace the default formatting toolbar actions.
- `children`: optional app-specific UI rendered inside the editor frame, such as additional controls.

For an uncontrolled editor, omit `value` and use `onChange` to observe edits. The default toolbar includes headings, paragraphs, lists, bold, italic, underline, highlight, and link actions. To add or remove toolbar actions, pass your own `EditorMenuOption[]` as `menuOptions`.

## Extending the editor

Use `children` for developer- or app-specific components that should sit within the editor frame. For deeper integrations, the package also exports lower-level building blocks: `EditorSurface`, `EditorMenu`, `ComposeMediaBlocks`, `createImageBlock`, and `snapSelectionRange`. These are optional; a normal consumer only needs `RichTextEditor`.

The component handles editor presentation and editing controls. The consuming app remains responsible for storing the HTML and applying any application-specific validation or sanitization before saving or rendering it.
