import { Suspense } from 'react';
import { Toaster } from '#/components/ui/toast';
import { ProgressBar } from '#/components/element/progressbar';

/**
 * ::neup.documentation::root-layout
 *
 * Base layout shared by every route. It provides a full-page surface and the
 * application-wide toast viewport.
 *
 * ::end
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white text-foreground">
      <style dangerouslySetInnerHTML={{ __html: `
        #nprogress { pointer-events: none; }
        #nprogress .bar {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          width: 100%;
          height: 4px;
          background: hsl(var(--primary));
          box-shadow: 0 0 10px hsl(var(--primary) / 0.7);
        }
        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0;
          width: 100px;
          height: 100%;
          opacity: 1;
          transform: rotate(3deg) translate(0, -4px);
          box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
        }
      ` }} />
      <Suspense fallback={null}>
        <ProgressBar />
      </Suspense>
      {children}
      <Toaster />
    </div>
  );
}
