import type { ReactNode } from 'react';

// External packages required by this component or page.
const requiredPackages = [
  "react:^19.2.4"
] as const;

export type HeaderProps = {
  children?: ReactNode;
  className?: string;
};

// Provide the shared app header surface, shadow, and responsive container.
export function Header({ children, className = '' }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-40 flex h-16 w-full shrink-0 items-center border-b bg-primary-1000 shadow-[0_16px_40px_rgba(15,23,42,0.10)] ${className}`}>
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center px-4 sm:px-6 md:px-8">
        {children}
      </div>
    </header>
  );
}
