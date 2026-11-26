import { Button } from "@neup/components/ui/button";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export interface BaseMenuPosition {
  top: number;
  left: number;
  transform?: string;
}

interface BaseMenuProps {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  dataAttribute?: string;
  orientation?: 'horizontal' | 'vertical';
  position: BaseMenuPosition;
}

interface BaseMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

// Render a positioned menu toolbar.
export function BaseMenu({
  ariaLabel,
  children,
  className = '',
  dataAttribute,
  orientation = 'horizontal',
  position,
}: BaseMenuProps) {
  const style: CSSProperties = {
    top: position.top,
    left: position.left,
    transform: position.transform,
  };
  const dataProps = dataAttribute ? { [dataAttribute]: true } : {};

  return (
    <div
      {...dataProps}
      role="toolbar"
      aria-label={ariaLabel}
      style={style}
      className={`absolute z-40 flex max-w-[calc(100vw-1rem)] rounded-md bg-muted text-foreground shadow-xl ${
        orientation === 'horizontal'
          ? 'h-11 items-center gap-1 overflow-x-auto px-2'
          : 'w-72 flex-col gap-1 p-2'
      } ${className}`}
    >
      {children}
      <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-muted" />
    </div>
  );
}

// Render a menu toolbar button.
export function BaseMenuButton({
  active = false,
  children,
  className = '',
  onMouseDown,
  type = 'button',
  ...props
}: BaseMenuButtonProps) {
  return (
    <Button variant="text" size="sm"
      {...props}
      type={type}
      aria-pressed={active}
      data-active={active ? 'true' : undefined}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
      className={`grid size-8 place-items-center rounded leading-none transition-colors duration-200 ${
        active
          ? 'bg-background text-foreground shadow-sm hover:bg-muted'
          : 'text-foreground hover:bg-accent'
      } ${className}`}
    >
      {children}
    </Button>
  );
}

// Render a separator between menu groups.
export function BaseMenuSeparator() {
  return <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />;
}

interface BaseMenuOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  description: string;
  icon: string;
  title: string;
}

// Render a descriptive menu option.
export function BaseMenuOption({
  active = false,
  description,
  icon,
  onMouseDown,
  title,
  type = 'button',
  ...props
}: BaseMenuOptionProps) {
  return (
    <Button variant="text" size="sm"
      {...props}
      type={type}
      aria-pressed={active}
      data-active={active ? 'true' : undefined}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
      className={`flex w-full items-start gap-3 rounded px-3 py-2 text-left transition-colors duration-200 ${
        active
          ? 'bg-background text-foreground shadow-sm hover:bg-muted'
          : 'text-foreground hover:bg-accent'
      }`}
    >
      <span className="grid size-7 shrink-0 place-items-center rounded bg-accent text-sm font-bold">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-5">{title}</span>
        <span className="block text-xs leading-4 text-muted-foreground">
          {description}
        </span>
      </span>
    </Button>
  );
}
