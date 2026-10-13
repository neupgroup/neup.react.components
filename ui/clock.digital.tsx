"use client";

export type DigitalClockProps = {
  hour: number;
  minute: number;
  period?: "AM" | "PM";
  onHourClick?: () => void;
  onMinuteClick?: () => void;
  onPeriodChange?: (period: "AM" | "PM") => void;
  className?: string;
};

/** A digital time readout with optional hour, minute, and AM/PM controls. */
export function DigitalClock({
  hour,
  minute,
  period,
  onHourClick,
  onMinuteClick,
  onPeriodChange,
  className = "",
}: DigitalClockProps) {
  const displayHour = String(hour).padStart(2, "0");
  const displayMinute = String(minute).padStart(2, "0");

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={onHourClick}
        aria-label={`Hour ${displayHour}`}
        className={`rounded-lg px-3 py-1 text-4xl font-medium tabular-nums transition-colors ${onHourClick ? "cursor-pointer" : "cursor-default"}`}
      >
        {displayHour}
      </button>
      <span aria-hidden="true" className="text-4xl font-medium text-slate-500">:</span>
      <button
        type="button"
        onClick={onMinuteClick}
        aria-label={`Minute ${displayMinute}`}
        className={`rounded-lg px-3 py-1 text-4xl font-medium tabular-nums transition-colors ${onMinuteClick ? "cursor-pointer" : "cursor-default"}`}
      >
        {displayMinute}
      </button>
      {period && (
        <div className="ml-1 flex flex-col overflow-hidden rounded-lg border border-slate-300 bg-white text-xs font-semibold">
          {(["AM", "PM"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={period === value}
              onClick={() => onPeriodChange?.(value)}
              className={`px-2.5 py-2 transition-colors ${period === value ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
