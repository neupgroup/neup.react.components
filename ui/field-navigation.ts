import type * as React from "react";

export function navigateAdjacentField(event: React.KeyboardEvent<HTMLElement>) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

  const movingPrevious = event.key === "ArrowLeft" || event.key === "ArrowUp";
  const movingNext = event.key === "ArrowRight" || event.key === "ArrowDown";
  if (!movingPrevious && !movingNext) return;

  const current = event.currentTarget as HTMLInputElement | HTMLTextAreaElement;
  if (current.disabled || current.readOnly) return;

  let selectionStart: number | null;
  let selectionEnd: number | null;
  try {
    selectionStart = current.selectionStart;
    selectionEnd = current.selectionEnd;
  } catch {
    return;
  }

  if (selectionStart === null || selectionEnd === null || selectionStart !== selectionEnd) {
    return;
  }

  const atStart = selectionStart === 0;
  const atEnd = selectionEnd === current.value.length;
  if ((movingPrevious && !atStart) || (movingNext && !atEnd)) return;

  const scope: ParentNode = current.form ?? document;
  const allFields = Array.from(
    scope.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")
  ).filter((field) => {
    const isHiddenInput = field instanceof HTMLInputElement && field.type === "hidden";
    return (
      !field.disabled &&
      !field.readOnly &&
      !isHiddenInput &&
      field.tabIndex >= 0 &&
      field.getClientRects().length > 0
    );
  });
  const currentIndex = allFields.indexOf(current);
  const target = movingPrevious
    ? allFields[currentIndex - 1]
    : allFields[currentIndex + 1];
  if (!target) return;

  event.preventDefault();
  target.focus();
  try {
    const caret = movingPrevious ? target.value.length : 0;
    target.setSelectionRange(caret, caret);
  } catch {
    // Native date and time controls do not expose text selection.
  }
}
