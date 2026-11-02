import { z } from "zod";
import {
  BPM_MIN, BPM_MAX,
  noteToFreq, noteToKeyNumber, freqToNote, semitoneDistance, intervalName, tapTempoBpm, TAP_TIMEOUT_MS,
} from "../tools/_lib/tempo";

/**
 * TempoBeat MCP 工具注册表:把 tools/_lib/tempo.ts 的纯函数暴露为 AI 可执行工具。
 * 站上的同名工具在浏览器里跑(交互式,带 Web Audio),这里跑同一份经过测试的
 * 纯数学实现——人和 AI 用同一套逻辑,而不是两套各写各的。
 */

const json = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const bad = (t: string) => ({ content: [{ type: "text" as const, text: t }], isError: true as const });

/** 数字序列化为安全文本(JSON.stringify 会把 NaN 变 null,客户端判定失效) */
const num = (n: number) => (Number.isFinite(n) ? String(n) : "invalid input — see tool description for accepted ranges");

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  schema: Record<string, any>;
  run: (args: any) => { content: { type: "text"; text: string }[]; isError?: boolean };
};

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: "note_to_freq",
    title: "Note name to frequency",
    description:
      "Convert a scientific pitch notation note (e.g. 'A4', 'C#4', 'Bb3', 'C-1') to its frequency in Hz under equal temperament, f = 440 × 2^((n−49)/12) where n is the piano key number (A0 = 1, C4 = 40, A4 = 49). Bb is accepted; output note naming elsewhere uses sharps.",
    schema: {
      note: z.string().describe("note in scientific pitch notation, e.g. 'A4', 'C#4', 'Bb3', 'C-1'"),
    },
    run: (a) => {
      const f = noteToFreq(a.note ?? "");
      if (!Number.isFinite(f)) {
        return bad(`invalid note: '${a.note}' — use scientific pitch notation like A4, C#4, Bb3 or C-1 (letter A–G, optional # or b, octave number)`);
      }
      return json({ note: (a.note as string).trim(), hz: Math.round(f * 1000) / 1000, key_number: noteToKeyNumber(a.note) });
    },
  },
  {
    name: "freq_to_note",
    title: "Frequency to nearest note",
    description:
      "Find the nearest equal-temperament note for a frequency in Hz and its cents deviation (100 cents = 1 semitone, positive = sharp). 440 Hz → A4 +0 cents; 442 Hz → A4 +8 cents. Valid from C-1 (≈8.18 Hz) upward.",
    schema: {
      freq: z.number().positive().describe("frequency in Hz, must be ≥ 8.18 Hz (below C-1 nothing can be named)"),
    },
    run: (a) => {
      const r = freqToNote(a.freq);
      if (!r.note) {
        return bad("invalid frequency — must be a positive number of at least 8.18 Hz (C-1), the lowest nameable note");
      }
      return json({ freq: a.freq, note: r.note, cents: r.cents });
    },
  },
  {
    name: "semitone_distance",
    title: "Semitone distance and interval",
    description:
      "Exact interval between two frequencies: semitones = 12 × log2(f2 ÷ f1), rounded to 1 decimal, plus the interval name (0–12 semitones per the standard table, wider distances as compound intervals like 'Minor 2nd + 1 octave') and the frequency ratio. Negative result means f2 is below f1.",
    schema: {
      f1: z.number().positive().describe("first frequency in Hz"),
      f2: z.number().positive().describe("second frequency in Hz"),
    },
    run: (a) => {
      const st = semitoneDistance(a.f1, a.f2);
      if (!Number.isFinite(st)) {
        return bad("invalid input — both frequencies must be positive finite numbers in Hz");
      }
      return json({
        semitones: st,
        interval: intervalName(st),
        direction: st > 0.05 ? "up" : st < -0.05 ? "down" : "unison",
        ratio: Math.round((a.f2 / a.f1) * 1000000) / 1000000,
      });
    },
  },
  {
    name: "tap_tempo",
    title: "Tap tempo → BPM",
    description:
      "Convert a series of tap timestamps (in milliseconds, any clock, order does not matter) into a tempo: the average interval between consecutive taps becomes BPM at 1 decimal. Any gap over 3 seconds, or fewer than 2 valid timestamps, means the taps are not one phrase and the tool errors instead of guessing.",
    schema: {
      taps: z.array(z.number()).min(2).describe("tap timestamps in ms, e.g. [0, 600, 1200, 1800]; needs ≥ 2, gaps ≤ 3000 ms"),
    },
    run: (a) => {
      const bpm = tapTempoBpm(a.taps as number[]);
      if (bpm === null) {
        return bad(
          `cannot measure one tempo: need at least 2 valid timestamps with no gap over ${TAP_TIMEOUT_MS} ms — ` +
            "a longer pause means a new phrase, so measure each phrase separately",
        );
      }
      if (bpm < BPM_MIN || bpm > BPM_MAX) {
        return text(
          `${num(bpm)} BPM — outside the ${BPM_MIN}–${BPM_MAX} range the website metronome accepts, but mathematically correct for these taps`,
        );
      }
      return text(`${num(bpm)} BPM`);
    },
  },
];

