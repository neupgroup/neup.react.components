"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnalogueClock, type AnalogueClockProps } from "@neup/components/ui/clock.analogue.tsx";
import { Button } from "@neup/components/ui/button.tsx";

export type DateTimePickerKind = "deadline" | "when";

export type DateTimePickerProps = {
  kind: DateTimePickerKind;
  initialDate?: string;
  initialTime?: string;
  renderClock?: (props: AnalogueClockProps) => ReactNode;
  onClose: () => void;
  onComplete: (date: string, time: string) => void;
  onRemoveDate?: (time: string) => void;
  onRemoveTime?: (date: string) => void;
};

function toDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function DateTimePicker({
  kind,
  initialDate = "",
  initialTime = "",
  renderClock,
  onClose,
  onComplete,
  onRemoveDate,
  onRemoveTime,
}: DateTimePickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"date" | "time">("date");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [clockMode, setClockMode] = useState<"hour" | "minute">("hour");
  const [selectedHour, setSelectedHour] = useState<number | null>(() => initialTime ? Number(initialTime.slice(0, 2)) % 12 || 12 : null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(() => initialTime ? Number(initialTime.slice(3, 5)) : null);
  const [period, setPeriod] = useState<"AM" | "PM" | null>(() => initialTime ? Number(initialTime.slice(0, 2)) >= 12 ? "PM" : "AM" : null);
  const [month, setMonth] = useState(() =>
    initialDate
      ? new Date(`${initialDate}T00:00:00`)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthDayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const monthCells = [
    ...Array.from({ length: monthStart.getDay() }, () => null),
    ...Array.from({ length: monthDayCount }, (_, index) => index + 1),
  ];

  const updateTime = (hour: number | null, minute: number | null, nextPeriod: "AM" | "PM" | null) => {
    if (hour === null || minute === null || nextPeriod === null) {
      setTime("");
      return;
    }
    const hour24 = (hour % 12) + (nextPeriod === "PM" ? 12 : 0);
    setTime(`${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  };

  const chooseHour = (hour: number) => {
    setSelectedHour(hour);
    updateTime(hour, selectedMinute, period);
  };

  const chooseMinute = (minute: number) => {
    setSelectedMinute(minute);
    updateTime(selectedHour, minute, period);
  };

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    pickerRef.current
      ?.querySelector<HTMLElement>("button:not([disabled]), input:not([disabled])")
      ?.focus();
  }, [mounted, step]);

  if (!mounted) return null;

  const clockProps: AnalogueClockProps = {
    mode: clockMode,
    hour: selectedHour,
    minute: selectedMinute,
    onHourChange: chooseHour,
    onMinuteChange: chooseMinute,
    onSelectionEnd: () => {
      if (clockMode === "hour") setClockMode("minute");
    },
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        padding: 16,
        backgroundColor: "rgba(2, 6, 23, 0.42)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={pickerRef}
        role="dialog"
        aria-modal="true"
        aria-label={step === "date" ? "Choose a date" : "Choose a time"}
        style={{
          position: "relative",
          flex: "0 1 384px",
          width: "min(384px, 100%)",
          maxWidth: 384,
          maxHeight: "calc(100dvh - 32px)",
          overflowY: "auto",
          margin: "auto",
          boxSizing: "border-box",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          padding: 24,
          boxShadow: "0 24px 64px rgba(15, 23, 42, 0.28)",
        }}
      >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-[#111827]">
            {kind === "deadline" ? "Deadline" : "When"}
          </p>
          <p className="mt-1 text-sm text-[#64748B]">
            {step === "date" ? "Choose a date from the calendar" : "Choose a time"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close picker"
          className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#111827]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {step === "date" ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
              className="rounded-xl p-2.5 text-[#475569] transition-colors hover:bg-[#F1F5F9]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="text-base font-semibold text-[#111827]">
              {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
              className="rounded-xl p-2.5 text-[#475569] transition-colors hover:bg-[#F1F5F9]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <span key={`${day}-${index}`} className="py-1.5 text-xs font-semibold text-[#94A3B8]">
                {day}
              </span>
            ))}
            {monthCells.map((day, index) => {
              if (day === null) return <span key={`empty-${index}`} />;
              const dateValue = toDateValue(new Date(month.getFullYear(), month.getMonth(), day));
              return (
                <button
                  key={dateValue}
                  type="button"
                  aria-pressed={date === dateValue}
                  onClick={() => {
                    if (date !== dateValue) {
                      setTime("");
                      setSelectedHour(null);
                      setSelectedMinute(null);
                      setPeriod(null);
                      setClockMode("hour");
                    }
                    setDate(dateValue);
                    setStep("time");
                  }}
                  className={`h-10 rounded-lg text-sm transition-colors hover:bg-[#EFF6FF] ${date === dateValue ? "bg-[#4F9CF9] font-semibold text-white hover:bg-[#3B82F6]" : "text-[#334155]"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-5">
            <button
              type="button"
              disabled={!date}
              onClick={() => {
                setDate("");
                if (onRemoveDate) onRemoveDate(time);
                else onComplete("", time);
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove date
            </button>
            <button
              type="button"
              onClick={() => setStep("time")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#4F9CF9] hover:bg-[#EFF6FF] hover:text-[#3B82F6]"
            >
              Choose time
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {date && (
            <p className="rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#475569]">
              {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 rounded-2xl py-3">
            <button
              type="button"
              onClick={() => setClockMode("hour")}
              aria-label="Choose hour"
              aria-pressed={clockMode === "hour"}
              className={`rounded-xl px-3 py-3 text-4xl font-medium tabular-nums transition-colors ${clockMode === "hour" ? "bg-[#4F9CF9] text-white ring-2 ring-[#BFDBFE]" : "bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]"}`}
            >
              {selectedHour === null ? "--" : String(selectedHour).padStart(2, "0")}
            </button>
            <span className="text-4xl font-medium text-[#64748B]">:</span>
            <button
              type="button"
              onClick={() => setClockMode("minute")}
              aria-label="Choose minute"
              aria-pressed={clockMode === "minute"}
              className={`rounded-xl px-3 py-3 text-4xl font-medium tabular-nums transition-colors ${clockMode === "minute" ? "bg-[#4F9CF9] text-white ring-2 ring-[#BFDBFE]" : "bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]"}`}
            >
              {selectedMinute === null ? "--" : String(selectedMinute).padStart(2, "0")}
            </button>
            <div className="ml-1 flex flex-col overflow-hidden rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold">
              {(["AM", "PM"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={period === value}
                  onClick={() => {
                    setPeriod(value);
                    updateTime(selectedHour, selectedMinute, value);
                  }}
                  className={`px-2.5 py-2 transition-colors ${period === value ? "bg-[#4F9CF9] text-white" : "text-[#475569] hover:bg-[#F1F5F9]"}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {renderClock ? renderClock(clockProps) : <AnalogueClock {...clockProps} />}
          <p className="text-center text-xs font-medium text-[#64748B]">
            {clockMode === "hour" ? "Select hour" : "Select minutes"}
          </p>
          <button
            type="button"
            disabled={!time}
            onClick={() => {
              setTime("");
              setSelectedHour(null);
              setSelectedMinute(null);
              setPeriod(null);
              setClockMode("hour");
              if (onRemoveTime) onRemoveTime(date);
              else onComplete(date, "");
              setStep("date");
            }}
            className="mx-auto block rounded-lg px-3 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove time
          </button>
          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-5">
            <button
              type="button"
              onClick={() => setStep("date")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#4F9CF9] hover:bg-[#EFF6FF] hover:text-[#3B82F6]"
            >
              Back to calendar
            </button>
            <Button
              variant="plain"
              type="button"
              disabled={!date && !time}
              onClick={() => onComplete(date, time)}
              className="inline-flex h-11 items-center rounded-xl bg-[#4F9CF9] px-6 text-sm font-semibold text-white hover:bg-[#3B82F6] disabled:opacity-50"
            >
              Done
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>,
    document.body
  );
}
