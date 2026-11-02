'use client';

import * as React from 'react';

import { Textarea } from '@neup/components/ui/textarea';

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export const RichTextEditor = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<typeof Textarea>>(
  function RichTextEditor(props, ref) {
    return <Textarea {...props} ref={ref} rows={14} className="min-h-64 font-mono" />;
  },
);

RichTextEditor.displayName = 'RichTextEditor';
