'use client';

import { useState } from 'react';
import { InputUnderlined } from '@/@neup/components/ui/input_underlined';
import { Popover, PopoverContent, PopoverTrigger } from '@neup/components/ui/popover';

export type CurrencyUnderlinedOption = { value: string; label: string };

export type CurrencyUnderlinedProps = {
  amount: string;
  currency: string;
  currencies: CurrencyUnderlinedOption[];
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  amountLabel?: string;
  currencyLabel?: string;
  className?: string;
};

// Render a numeric amount with a selectable currency code.
export function CurrencyUnderlined({
  amount,
  currency,
  currencies,
  onAmountChange,
  onCurrencyChange,
  amountLabel = 'Amount',
  currencyLabel = 'Currency',
  className = '',
}: CurrencyUnderlinedProps) {
  const selectedCurrency = currencies.find((option) => option.value === currency);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState(false);

  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex min-w-0 items-center justify-end gap-2 border-b border-dashed border-muted-foreground/50">
        <InputUnderlined
          aria-label={`${amountLabel} in ${selectedCurrency?.label ?? currency}`}
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
            event.preventDefault();
            const current = Number(amount) || 0;
            const next = current + (event.key === 'ArrowUp' ? 0.01 : -0.01);
            onAmountChange(Math.max(0, next).toFixed(2));
          }}
          className="underlined-stepper w-24 flex-none border-0 px-0 text-right focus-visible:border-0 focus-visible:ring-0"
        />
        <Popover open={isCurrencyPickerOpen} onOpenChange={setIsCurrencyPickerOpen}>
          <PopoverTrigger asChild>
            <button type="button" aria-label={`Change ${currencyLabel}`} className="shrink-0 pr-1 text-sm font-medium text-foreground hover:text-primary">
              {selectedCurrency?.label ?? currency}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="grid gap-1">
              {currencies.map((option) => (
                <button key={option.value} type="button" onClick={() => {
                  onCurrencyChange(option.value);
                  setIsCurrencyPickerOpen(false);
                }} className="rounded px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground">
                  {option.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
