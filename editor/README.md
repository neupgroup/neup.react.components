# Shared editor building blocks

Import shared editor behavior and UI from `@neup/components/editor`.

- `EditorSurface` owns the contenteditable textbox and accepts app-provided focus, input, keyboard, paste, and other DOM event hooks through its props.
- `EditorMenu` receives an app-defined `EditorMenuOption[]`, active action IDs, callbacks, and optional callout choices.
- `ComposeMediaBlocks` receives editor refs, a content reader, and a content change callback.
- `snapSelectionRange` provides shared word-aware selection behavior.

Keep app-specific block types, menu choices, persistence, permissions, and submission logic in the consuming application.
