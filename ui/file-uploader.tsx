'use client';

import * as React from 'react';

import { Button } from '#/components/ui/button';

type FileUploaderProps = {
  uploadPath?: string;
  acceptedFileTypes?: string;
  currentImageUrl?: string | null;
  onUploadSuccess: (url: string) => void;
};

export function FileUploader({
  acceptedFileTypes = 'image/*',
  currentImageUrl,
  onUploadSuccess,
}: FileUploaderProps) {
  const [isReading, setIsReading] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onUploadSuccess(reader.result);
      setIsReading(false);
    };
    reader.onerror = () => setIsReading(false);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="Current upload" className="max-h-32 max-w-full rounded-md object-contain" />
      ) : null}
      <input type="file" accept={acceptedFileTypes} onChange={handleChange} disabled={isReading} />
      {isReading ? <Button disabled>Reading file...</Button> : null}
    </div>
  );
}
