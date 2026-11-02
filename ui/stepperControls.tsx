import { Minus, Plus } from 'lucide-react';
import { Button } from '@neup/components/ui/button';

// External packages required by this component or page.
const requiredPackages = [
  'lucide-react',
  'react:^19.2.4',
] as const;

export type StepperControlsProps = {
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onValueClick?: () => void;
  className?: string;
};

// Render themed increment and decrement controls that adapt to light and dark themes.
export function StepperControls({
  label,
  value,
  onDecrease,
  onIncrease,
  onValueClick,
  className = '',
}: StepperControlsProps) {
  return (
    <div className={`flex h-10 items-center justify-between rounded-md border border-border bg-background p-0 text-foreground ${className}`}>
      <Button
        htmlType="button"
        variant="plain"
        size="icon"
        onClick={onDecrease}
        aria-label={`Decrease ${label}`}
        className="text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Minus aria-hidden="true" className="h-3.5 w-3.5" />
      </Button>
      <Button
        htmlType="button"
        variant="plain"
        onClick={onValueClick}
        aria-label={`${label}: ${value}`}
        className="h-10 min-w-0 flex-1 truncate px-2 text-center text-sm font-medium tabular-nums text-foreground hover:bg-muted"
      >
        {value}
      </Button>
      <Button
        htmlType="button"
        variant="plain"
        size="icon"
        onClick={onIncrease}
        aria-label={`Increase ${label}`}
        className="text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
