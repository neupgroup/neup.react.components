"use client";

import { useRef } from "react";

export type AnalogueClockMode = "hour" | "minute";

export type AnalogueClockProps = {
  mode: AnalogueClockMode;
  hour: number | null;
  minute: number | null;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onSelectionEnd?: () => void;
  className?: string;
};

function clockPosition(angle: number) {
  const radians = angle * Math.PI / 180;
  const x = Math.sin(radians);
  const y = -Math.cos(radians);
  const radius = 36 / Math.max(Math.abs(x), Math.abs(y));
  return { x: 50 + x * radius, y: 50 + y * radius };
}

/** An interactive, twelve-position rectangular clock face for choosing an hour or minute. */
export function AnalogueClock({
  mode,
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  onSelectionEnd,
  className = "",
}: AnalogueClockProps) {
  const faceRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const choosePosition = (clientX: number, clientY: number) => {
    const face = faceRef.current;
    if (!face) return;

    const bounds = face.getBoundingClientRect();
    const dx = (clientX - (bounds.left + bounds.width / 2)) / bounds.width;
    const dy = (bounds.top + bounds.height / 2 - clientY) / bounds.height;
    if (Math.abs(dx) + Math.abs(dy) < 0.02) return;
    const degrees = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

    if (mode === "minute") onMinuteChange(Math.round(degrees / 6) % 60);
    else onHourChange(Math.round(degrees / 30) % 12 || 12);
  };

  const handAngle = mode === "hour" ? ((hour ?? 12) % 12) * 30 : (minute ?? 0) * 6;
  const { x: handX, y: handY } = clockPosition(handAngle);
  const hasSelection = mode === "hour" ? hour !== null : minute !== null;

  return (
    <div className={`mx-auto w-full max-w-80 rounded-2xl bg-white ${className}`}>
      <div
        ref={faceRef}
        className="relative aspect-[1.18/1] w-full touch-none select-none rounded-2xl bg-[#F1F5F9]"
        role="group"
        aria-label={mode === "hour" ? "Clock hours" : "Clock minutes"}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          choosePosition(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (dragging.current) choosePosition(event.clientX, event.clientY);
        }}
        onPointerUp={() => {
          if (!dragging.current) return;
          dragging.current = false;
          onSelectionEnd?.();
        }}
        onPointerCancel={() => { dragging.current = false; }}
        onLostPointerCapture={() => { dragging.current = false; }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {hasSelection && <line x1="50" y1="50" x2={handX} y2={handY} stroke="#4F9CF9" strokeWidth="1" />}
          <circle cx="50" cy="50" r="2.5" fill="#4F9CF9" />
        </svg>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#4F9CF9] ${hasSelection ? "" : "hidden"}`}
          style={{ left: `${handX}%`, top: `${handY}%` }}
        />
        {Array.from({ length: 12 }, (_, index) => {
          const value = mode === "hour" ? (index === 0 ? 12 : index) : index * 5;
          const { x, y } = clockPosition(index * 30);
          const selected = mode === "hour" ? hour !== null && hour % 12 === value % 12 : minute === value;
          const label = mode === "hour" ? String(value) : String(value).padStart(2, "0");

          return (
            <button
              key={index}
              type="button"
              aria-label={mode === "hour" ? `${value} o'clock` : `${label} minutes`}
              aria-pressed={selected}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => {
                if (mode === "hour") onHourChange(value);
                else onMinuteChange(value);
                onSelectionEnd?.();
              }}
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              className={`absolute z-10 flex h-9 min-w-9 items-center justify-center rounded-xl px-1 text-base font-medium tabular-nums transition-colors ${selected ? "bg-[#4F9CF9] text-white" : "text-[#334155] hover:bg-[#E2E8F0]"}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
