"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/site";

/**
 * TempoBeat 引擎共用的轻量 UI 原语与取词助手(全部客户端组件)。
 * 引擎内的短文案按 locale 取,缺省回退英文;扩展语言(10 语)也走英文回退。
 */

export const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
  it: "it-IT",
  tr: "tr-TR",
  ko: "ko-KR",
  ar: "ar-SA",
  hi: "hi-IN",
  id: "id-ID",
  vi: "vi-VN",
};

/** 引擎内的每语言短文案:按 locale 取,缺省回退英文。 */
export function pick(locale: Locale, rec: Record<string, string>): string {
  return rec[locale] ?? rec.en;
}

export function fmtNum(n: number, locale: Locale, maxFrac = 0): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(INTL_LOCALES[locale] ?? "en-US", { maximumFractionDigits: maxFrac }).format(n);
}

/** 频率显示:≥1 kHz 取整,≥100 Hz 保留 1 位,其余保留 2 位 */
export function fmtHz(hz: number, locale: Locale): string {
  if (!Number.isFinite(hz)) return "—";
  const frac = hz >= 1000 ? 0 : hz >= 100 ? 1 : 2;
  return `${fmtNum(hz, locale, frac)} Hz`;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="block text-[13px] font-medium text-[var(--color-sub)]">{label}</span>
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  active = false,
  disabled = false,
  ariaLabel,
  ariaPressed,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "ghost";
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const look =
    variant === "primary"
      ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]"
      : active
        ? "bg-[var(--color-accent)] text-white"
        : "border hairline hover:bg-[var(--color-surface)]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={`${base} ${look} ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({ children, onClick, active, ariaLabel }: { children: ReactNode; onClick: () => void; active?: boolean; ariaLabel?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`rounded-full px-3 py-1 text-[13px] font-medium transition-colors ${
        active ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-chip)] text-[var(--color-sub)] hover:text-[var(--color-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

export function SelectIn({
  value,
  onChange,
  options,
  aria,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  aria: string;
}) {
  return (
    <select className="field" value={value} onChange={(e) => onChange(e.target.value)} aria-label={aria}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function NumberIn({
  value,
  onChange,
  min,
  max,
  step = "any",
  aria,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number | "any";
  aria: string;
}) {
  return (
    <input
      type="number"
      className="field mono bare"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      aria-label={aria}
      inputMode="decimal"
    />
  );
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  aria,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  aria: string;
}) {
  return (
    <input
      type="range"
      className="w-full"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      aria-label={aria}
    />
  );
}

/** 开关:label + 视觉开关,原生 checkbox 语义 */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 select-none">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--color-accent)]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-[14px] text-[var(--color-ink)]">{label}</span>
    </label>
  );
}

export function Stat({ label, value, tone = "ink" }: { label: string; value: string; tone?: "ink" | "accent" }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] px-4 py-3">
      <span className="block text-[12.5px] font-medium text-[var(--color-sub)]">{label}</span>
      <span className={`mono mt-0.5 block text-[18px] font-semibold ${tone === "accent" ? "text-[var(--color-accent-strong)]" : "text-[var(--color-ink)]"}`}>
        {value}
      </span>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13.5px] leading-6 text-[var(--color-sub)]">
      {children}
    </p>
  );
}
