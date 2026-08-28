import type { HTMLAttributes } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';

export interface UserbarProps extends HTMLAttributes<HTMLDivElement> {
  displayName: string;
  displayImage?: string | null;
  neupid: string;
}

function normalizeDisplayImage(displayImage?: string | null): string | undefined {
  const image = displayImage?.trim();
  if (!image) return undefined;

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
      <Avatar
        className="h-8 w-8 transition-shadow duration-200 group-hover:ring-1 group-hover:ring-foreground/10"
        displayName={displayName}
        neupid={neupid}
      >
        {imageSrc ? (
          <AvatarImage className="visible" src={imageSrc} alt={name} />
        ) : (
          <AvatarFallback />
        )}
      </Avatar>
    </div>
  );
}
