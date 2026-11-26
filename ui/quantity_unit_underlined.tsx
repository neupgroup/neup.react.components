'use client';

import { useState } from 'react';
import { InputUnderlined } from '@/@neup/components/ui/input_underlined';
import { Popover, PopoverContent, PopoverTrigger } from '@neup/components/ui/popover';

const commonUnits = ['pcs', 'piece', 'kg', 'g', 'l', 'ml', 'hour', 'day', 'month', 'box', 'set', 'service'];

export type QuantityUnitUnderlinedProps = {
  quantity: string;
  unit: string;
  onQuantityChange: (quantity: string) => void;
  onUnitChange: (unit: string) => void;
};

// Render quantity and its clickable unit label as one underlined field.
export function QuantityUnitUnderlined({ quantity, unit, onQuantityChange, onUnitChange }: QuantityUnitUnderlinedProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-w-0 items-center gap-2 border-b border-dashed border-muted-foreground/50">
      <InputUnderlined
        aria-label="Quantity"
        type="text"
        inputMode="decimal"
        value={quantity}
        onChange={(event) => onQuantityChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
          event.preventDefault();
          const current = Number(quantity) || 0;
          onQuantityChange(String(Math.max(0, current + (event.key === 'ArrowUp' ? 1 : -1))));
        }}
        className="underlined-stepper flex-1 border-0 px-0 text-right focus-visible:border-0 focus-visible:ring-0"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" aria-label="Change unit" className="shrink-0 px-0 text-sm font-medium text-foreground hover:text-primary">
            {unit || 'unit'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="grid gap-1">
            {commonUnits.map((option) => (
              <button key={option} type="button" onClick={() => {
                onUnitChange(option);
                setOpen(false);
              }} className="rounded px-2 py-1.5 text-left text-sm capitalize hover:bg-accent hover:text-accent-foreground">
                {option}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
