/**
 * TempoBeat 核心纯逻辑:节拍、音高与音程的数学。
 * 全部为纯函数,Node 可测,零 Web Audio 依赖(浏览器引擎只做 UI 编排与音频调度)。
 *
 * 音高基准:十二平均律 f = 440 × 2^((n−49)/12),n 为钢琴键号(A0 = 1,C4 = 40,A4 = 49)。
 * 键号与 MIDI 号的关系:midi = n + 20;音名取升号拼写(C, C#, D, … B)。
 */

// ── 节拍 ────────────────────────────────────────────────────────────────

export const BPM_MIN = 30;
export const BPM_MAX = 300;
/** 两次拍打间隔超过 3 秒视为重新开始计拍 */
export const TAP_TIMEOUT_MS = 3000;

export const TIME_SIGNATURES = ["2/4", "3/4", "4/4", "6/8", "7/8"] as const;
export type TimeSignature = (typeof TIME_SIGNATURES)[number];

/** 每小节拍数(拍 = 分母音符:x/4 的拍是四分音符,x/8 的拍是八分音符) */
export function beatsPerBar(sig: TimeSignature): number {
  const num = Number.parseInt(sig.split("/")[0], 10);
  return Number.isFinite(num) && num > 0 ? num : 4;
}

export const SUBDIVISIONS = ["quarter", "eighth", "triplet", "sixteenth"] as const;
export type Subdivision = (typeof SUBDIVISIONS)[number];

/** 一拍内的脉冲数:四分 1×、八分 2×、三连音 3×、十六分 4× */
export function subdivisionMult(s: Subdivision): number {
  return s === "quarter" ? 1 : s === "eighth" ? 2 : s === "triplet" ? 3 : s === "sixteenth" ? 4 : 1;
}

/** 每拍毫秒数 = 60000 / bpm;非正数或非有限输入返回 NaN(调用方守卫) */
export function bpmToInterval(bpm: number): number {
  if (!Number.isFinite(bpm) || bpm <= 0) return NaN;
  return 60000 / bpm;
}

/** 一拍内细分脉冲的毫秒间隔(四分 = 每拍 1 个脉冲,十六分 = 每拍 4 个) */
export function subdivisionInterval(bpm: number, s: Subdivision): number {
  const base = bpmToInterval(bpm);
  if (!Number.isFinite(base)) return NaN;
  return base / subdivisionMult(s);
}

/** 把任意数值收敛为合法 BPM:四舍五入取整并夹在 30–300;非法输入返回默认 120 */
export function clampBpm(bpm: number): number {
  if (!Number.isFinite(bpm)) return 120;
  return Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(bpm)));
}

/**
 * Tap tempo:一串拍打时间戳(ms)→ 平均 BPM,保留 1 位小数。
 * 任意相邻间隔超过 TAP_TIMEOUT_MS(3s)说明不是同一段节奏 → null;
 * 有效时间戳不足 2 个或平均间隔非正 → null。输入顺序无关(内部排序)。
 */
export function tapTempoBpm(taps: number[]): number | null {
  const ts = taps.filter((t) => Number.isFinite(t)).sort((a, b) => a - b);
  if (ts.length < 2) return null;
  for (let i = 1; i < ts.length; i++) {
    if (ts[i] - ts[i - 1] > TAP_TIMEOUT_MS) return null;
  }
  const avg = (ts[ts.length - 1] - ts[0]) / (ts.length - 1);
  if (!(avg > 0)) return null;
  const bpm = 60000 / avg;
  return Math.round(bpm * 10) / 10;
}

// ── 音程 ────────────────────────────────────────────────────────────────

/** 0–12 半音的音程名(6 = 三全音,音乐界通称) */
export const INTERVAL_NAMES = [
  "Unison", "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd", "Perfect 4th",
  "Tritone", "Perfect 5th", "Minor 6th", "Major 6th", "Minor 7th", "Major 7th", "Octave",
] as const;

/** 半音距离 = 12 × log2(f2/f1),保留 1 位小数;非正数或非有限输入返回 NaN */
export function semitoneDistance(f1: number, f2: number): number {
  if (!Number.isFinite(f1) || !Number.isFinite(f2) || f1 <= 0 || f2 <= 0) return NaN;
  const st = 12 * Math.log2(f2 / f1);
  return Math.round(st * 10) / 10;
}

/**
 * 音程名:输入先四舍五入取整。0–12 按表;超过 12 为复音程,
 * 以「基础音程 + n octave(s)」表示(13 半音 = Minor 2nd + 1 octave);
 * 方向(负数 = 向下)由调用方呈现,这里按距离的绝对值取名。非有限输入返回空串。
 */
export function intervalName(semiTones: number): string {
  if (!Number.isFinite(semiTones)) return "";
  const total = Math.abs(Math.round(semiTones));
  const octaves = Math.floor(total / 12);
  const rem = total % 12;
  const base = INTERVAL_NAMES[rem];
  if (octaves === 0) return base;
  if (rem === 0) return octaves === 1 ? "Octave" : `${octaves} octaves`;
  return `${base} + ${octaves} octave${octaves > 1 ? "s" : ""}`;
}

// ── 音高 ────────────────────────────────────────────────────────────────

const LETTER_SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** 升号拼写:freqToNote 的唯一命名约定(Bb 报成 A#) */
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

/** 最低可命名的音:C-1 ≈ 8.18 Hz(midi 0);再低返回无效 */
const MIN_MIDI = 0;

/**
 * 科学音高记号 → 钢琴键号:"A4" → 49,"C4" → 40,"Bb3" → 38,"C-1" → −20。
 * 接受大小写字母、# / b 升降号、任意整数八度(含负)。非法拼写 → NaN。
 */
export function noteToKeyNumber(note: string): number {
  const m = /^\s*([A-Ga-g])([#b]?)(-?\d+)\s*$/.exec(note);
  if (!m) return NaN;
  const letter = LETTER_SEMITONE[m[1].toUpperCase()];
  const accidental = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
  const octave = Number.parseInt(m[3], 10);
  if (!Number.isFinite(octave)) return NaN;
  const midi = (octave + 1) * 12 + letter + accidental;
  return midi - 20;
}

/** 钢琴键号 → 音名(升号拼写):49 → "A4",40 → "C4" */
export function keyNumberToNote(n: number): string {
  const midi = n + 20;
  if (!Number.isInteger(midi) || midi < MIN_MIDI) return "";
  return `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

/**
 * 科学音高记号 → 频率(Hz),等程律 f = 440 × 2^((n−49)/12):
 * "A4" = 440,"C4" ≈ 261.63,"A3" = 220,"A5" = 880。非法拼写 → NaN。
 */
export function noteToFreq(note: string): number {
  const n = noteToKeyNumber(note);
  if (!Number.isFinite(n)) return NaN;
  return 440 * Math.pow(2, (n - 49) / 12);
}

/**
 * 频率 → 最近的音名 + 音分偏差(100 音分 = 1 半音,正 = 偏高):
 * 440 → { note: "A4", cents: 0 },442 → { note: "A4", cents: 8 }。
 * 频率非正、非有限或低于 C-1(≈8.18 Hz)→ { note: "", cents: NaN }。
 */
export function freqToNote(freq: number): { note: string; cents: number } {
  if (!Number.isFinite(freq) || freq <= 0) return { note: "", cents: NaN };
  const exact = 49 + 12 * Math.log2(freq / 440);
  const key = Math.round(exact);
  const midi = key + 20;
  if (midi < MIN_MIDI) return { note: "", cents: NaN };
  const cents = Math.round((exact - key) * 100);
  return { note: keyNumberToNote(key), cents };
}
