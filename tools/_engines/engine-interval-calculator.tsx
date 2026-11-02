"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { Btn, Chip, Field, Note, NumberIn, Stat, fmtNum, pick } from "./music-ui";
import { freqToNote, intervalName, noteToFreq, semitoneDistance } from "../_lib/tempo";

/**
 * 音程计算器引擎:两个频率 → 半音距离(12·log2(f2/f1))、音程名、
 * 频率比与两个频率各自的最近音。纯数学,不出声——逻辑全部在 tools/_lib/tempo.ts。
 */

type Side = "a" | "b";

const EXAMPLES: { label: Record<string, string>; a: string; b: string }[] = [
  { label: { en: "Octave: 440 → 880", zh: "八度:440 → 880", ja: "オクターブ:440 → 880", es: "Octava: 440 → 880", pt: "Oitava: 440 → 880" }, a: "440", b: "880" },
  { label: { en: "Perfect 5th: 440 → E5", zh: "纯五度:440 → E5", ja: "完全五度:440 → E5", es: "Quinta justa: 440 → E5", pt: "Quinta justa: 440 → E5" }, a: "440", b: String(Math.round(noteToFreq("E5") * 10000) / 10000) },
  { label: { en: "Minor 2nd: 440 → 466.16", zh: "小二度:440 → 466.16", ja: "短二度:440 → 466.16", es: "Segunda menor: 440 → 466.16", pt: "Segunda menor: 440 → 466.16" }, a: "440", b: "466.16" },
];

const S = {
  freqA: { en: "Frequency 1 (lower)", zh: "频率 1(低)", ja: "周波数 1(低い方)", es: "Frecuencia 1 (grave)", pt: "Frequência 1 (grave)" },
  freqB: { en: "Frequency 2 (higher)", zh: "频率 2(高)", ja: "周波数 2(高い方)", es: "Frecuencia 2 (aguda)", pt: "Frequência 2 (aguda)" },
  swap: { en: "Swap", zh: "交换", ja: "入替", es: "Invertir", pt: "Inverter" },
  semitones: { en: "Semitones", zh: "半音数", ja: "半音数", es: "Semitonos", pt: "Semitons" },
  interval: { en: "Interval", zh: "音程", ja: "音程", es: "Intervalo", pt: "Intervalo" },
  direction: { en: "Direction", zh: "方向", ja: "方向", es: "Dirección", pt: "Direção" },
  up: { en: "up", zh: "向上", ja: "上へ", es: "ascendente", pt: "ascendente" },
  down: { en: "down", zh: "向下", ja: "下へ", es: "descendente", pt: "descendente" },
  same: { en: "unison", zh: "同度", ja: "同度", es: "unísono", pt: "uníssono" },
  ratio: { en: "Frequency ratio f2 ÷ f1", zh: "频率比 f2 ÷ f1", ja: "周波数比 f2 ÷ f1", es: "Relación f2 ÷ f1", pt: "Razão f2 ÷ f1" },
  notes: { en: "Nearest notes", zh: "最近的音", ja: "最も近い音", es: "Notas más cercanas", pt: "Notas mais próximas" },
  invalid: {
    en: "Enter two frequencies above 0 Hz — for example 440 and 880.",
    zh: "请输入两个大于 0 Hz 的频率,例如 440 和 880。",
    ja: "0 Hz を超える 2 つの周波数を入力してください。例:440 と 880。",
    es: "Introduzca dos frecuencias mayores de 0 Hz, por ejemplo 440 y 880.",
    pt: "Informe duas frequências acima de 0 Hz — por exemplo 440 e 880.",
  },
  note: {
    en: "Semitone distance = 12 × log2(f2 ÷ f1), the exact equal-temperament measure: one semitone means the top frequency is 2^(1/12) ≈ 1.0595 times the lower one. Names cover 0–12 semitones; larger distances are shown as a compound interval (13 semitones = Minor 2nd + 1 octave). The note names come from the nearest-key lookup with a cents deviation, so 442 Hz still reads as A4, 8 cents sharp.",
    zh: "半音距离 = 12 × log2(f2 ÷ f1),是十二平均律的精确度量:一个半音意味着高频率是低频率的 2^(1/12) ≈ 1.0595 倍。音程名覆盖 0–12 半音;更大的距离按复音程呈现(13 半音 = 小二度 + 1 个八度)。音名来自最近键位查找并附音分偏差,所以 442 Hz 仍读作 A4、偏高 8 音分。",
    ja: "半音距離 = 12 × log2(f2 ÷ f1)。十二平均律の正確な尺度で、1 半音は高い周波数が低い方の 2^(1/12) ≈ 1.0595 倍であることを意味します。音程名は 0–12 半音をカバーし、それ以上は複音程で示します(13 半音 = 短二度 + 1 オクターブ)。音名は最近傍キーの検索にセント偏差を付けて表示するため、442 Hz は A4(+8 セント)と読みます。",
    es: "La distancia en semitonos = 12 × log2(f2 ÷ f1), la medida exacta del temperamento igual: un semitono significa que la frecuencia alta es 2^(1/12) ≈ 1,0595 veces la baja. Los nombres cubren 0–12 semitonos; las distancias mayores se muestran como intervalo compuesto (13 semitonos = Segunda menor + 1 octava). Los nombres de nota vienen de la tecla más cercana con su desviación en cents, así que 442 Hz se lee A4, 8 cents agudo.",
    pt: "A distância em semitons = 12 × log2(f2 ÷ f1), a medida exata do temperamento igual: um semitom significa que a frequência aguda é 2^(1/12) ≈ 1,0595 vezes a grave. Os nomes cobrem 0–12 semitons; distâncias maiores aparecem como intervalo composto (13 semitons = Segunda menor + 1 oitava). Os nomes das notas vêm da tecla mais próxima com o desvio em cents, então 442 Hz ainda lê A4, 8 cents agudo.",
  },
};

export function IntervalCalculatorEngine() {
  const { locale } = useI18n();
  const [fa, setFa] = useState("440");
  const [fb, setFb] = useState("880");

  const numA = Number(fa);
  const numB = Number(fb);
  const valid = fa.trim() !== "" && fb.trim() !== "" && Number.isFinite(numA) && Number.isFinite(numB) && numA > 0 && numB > 0;

  const swap = () => {
    setFa(fb);
    setFb(fa);
  };

  const setSide = (side: Side, v: string) => (side === "a" ? setFa(v) : setFb(v));

  const st = valid ? semitoneDistance(numA, numB) : NaN;
  const direction = !valid ? "" : st > 0.05 ? pick(locale, S.up) : st < -0.05 ? pick(locale, S.down) : pick(locale, S.same);
  const noteA = valid ? freqToNote(numA) : null;
  const noteB = valid ? freqToNote(numB) : null;

  return (
    <ToolPanel>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <Field label={pick(locale, S.freqA)}>
          <NumberIn value={fa} onChange={(v) => setSide("a", v)} min={0} aria={pick(locale, S.freqA)} />
        </Field>
        <div className="pb-1 sm:pb-2">
          <Btn onClick={swap} ariaLabel={pick(locale, S.swap)}>
            ⇄ {pick(locale, S.swap)}
          </Btn>
        </div>
        <Field label={pick(locale, S.freqB)}>
          <NumberIn value={fb} onChange={(v) => setSide("b", v)} min={0} aria={pick(locale, S.freqB)} />
        </Field>
      </div>

      {/* 示例 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, i) => (
          <Chip key={i} onClick={() => { setFa(ex.a); setFb(ex.b); }} ariaLabel={pick(locale, ex.label)}>
            {pick(locale, ex.label)}
          </Chip>
        ))}
      </div>

      {valid ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label={pick(locale, S.semitones)} value={fmtNum(st, locale, 1)} tone="accent" />
          <Stat label={pick(locale, S.interval)} value={intervalName(st)} tone="accent" />
          <Stat label={pick(locale, S.direction)} value={`${direction} · ${fmtNum(numB / numA, locale, 4)}×`} />
        </div>
      ) : (
        <div className="mt-5">
          <Note>{pick(locale, S.invalid)}</Note>
        </div>
      )}

      {valid && noteA && noteB ? (
        <div className="mt-5 rounded-xl border hairline px-4 py-3.5">
          <span className="block text-[12.5px] font-medium text-[var(--color-sub)]">{pick(locale, S.notes)}</span>
          <p className="mono mt-1 text-[15px] text-[var(--color-ink)]">
            {fmtNum(numA, locale, 2)} Hz ≈ {noteA.note} ({noteA.cents >= 0 ? "+" : "−"}
            {fmtNum(Math.abs(noteA.cents), locale)}¢) → {fmtNum(numB, locale, 2)} Hz ≈ {noteB.note} ({noteB.cents >= 0 ? "+" : "−"}
            {fmtNum(Math.abs(noteB.cents), locale)}¢)
          </p>
        </div>
      ) : null}

      <div className="mt-4">
        <Note>{pick(locale, S.note)}</Note>
      </div>
    </ToolPanel>
  );
}
