import type { HTMLAttributes } from 'react';
import { LetterImage } from '@neup/components/ui/letterImage';

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export interface UserbarProps extends HTMLAttributes<HTMLDivElement> {
  displayName: string;
  displayImage?: string | null;
  neupid: string;
}

function normalizeDisplayImage(displayImage?: string | null): string | undefined {
  const image = displayImage?.trim();
  if (!image || image.includes('/_plain_')) return undefined;

  if (/^(https?:|data:|blob:|\/\/)/i.test(image) || image.startsWith('/')) {
    return image;
  }

  return `/${image}`;
}

export function Userbar({
  displayName,
  displayImage,
  neupid,
  className,
  ...props
}: UserbarProps) {
  const name = displayName.trim() || 'User';
  const imageSrc = normalizeDisplayImage(displayImage);

  return (
    <div
      className={`group flex w-fit items-center gap-1.5 rounded-full border border-transparent py-1 pl-4 pr-0.5 transition-all duration-200 ease-out hover:border-foreground/5 hover:bg-muted/90 hover:shadow-sm ${className ?? ''}`}
      {...props}
    >
      <div className="hidden min-w-0 text-right sm:block">
        <p className="max-w-40 truncate text-sm font-medium leading-none transition-colors group-hover:text-foreground">
          {name}
        </p>
        <p className="mt-0.5 max-w-40 truncate text-xs font-normal leading-tight text-muted-foreground">
          {neupid ? `@${neupid}` : null}
        </p>
      </div>
      <LetterImage
        src={imageSrc}
        initials={name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('')}
        alt={name}
        className="h-8 w-8 rounded-full transition-shadow duration-200 group-hover:ring-1 group-hover:ring-foreground/10"
        fontSize="0.75rem"
      />
    </div>
  );
}
