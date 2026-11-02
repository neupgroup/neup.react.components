import type { ReactNode } from 'react';

export type FooterProps = {
  children?: ReactNode;
  className?: string;
};

// Provide a non-sticky footer surface with a responsive content container.
export function Footer({ children, className = '' }: FooterProps) {
  return (
    <footer className={`mt-auto w-full shrink-0 border-t bg-secondary text-secondary-foreground ${className}`}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:px-8">
        {children}
      </div>
    </footer>
  );
}
