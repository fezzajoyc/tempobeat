"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { Btn, Chip, Field, Note, SelectIn, Slider, Toggle, fmtNum, pick } from "./music-ui";
import {
  BPM_MAX, BPM_MIN, TAP_TIMEOUT_MS, TIME_SIGNATURES, SUBDIVISIONS,
  beatsPerBar, subdivisionMult, subdivisionInterval, tapTempoBpm, clampBpm,
  type Subdivision, type TimeSignature,
} from "../_lib/tempo";

/**
 * 节拍器引擎:Web Audio lookahead 调度(Chris Wilson "A Tale of Two Clocks" 模式)。
 * setInterval 只负责把未来 ~120 ms 的点击按 AudioContext 时钟精确排程,
 * 视觉节拍点用 rAF 对齐音频时间——数学全部在 tools/_lib/tempo.ts,组件只做编排。
 *
 * x/8 拍号(6/8、7/8)的一「拍」是八分音符;细分相对该拍等分(1/2/3/4×)。
 */

const TIMER_MS = 25; // 排程器轮询间隔
const SCHEDULE_AHEAD_S = 0.12; // 提前排程时长(秒)
const CLICK_ACCENT_HZ = 1760;
const CLICK_BEAT_HZ = 1175;
const CLICK_SUB_HZ = 784;

const TEMPO_PRESETS = [60, 90, 120, 180];

const S = {
  bpm: { en: "Tempo (BPM)", zh: "速度(BPM)", ja: "テンポ(BPM)", es: "Tempo (BPM)", pt: "Tempo (BPM)" },
  timeSig: { en: "Time signature", zh: "拍号", ja: "拍子", es: "Compás", pt: "Compasso" },
  subdiv: { en: "Subdivision", zh: "细分", ja: "细分", es: "Subdivisión", pt: "Subdivisão" },
  accent: { en: "Accent the first beat", zh: "重音落在第一拍", ja: "第一拍にアクセント", es: "Acentuar el primer tiempo", pt: "Acentuar o primeiro tempo" },
  start: { en: "Start", zh: "开始", ja: "スタート", es: "Iniciar", pt: "Iniciar" },
  stop: { en: "Stop", zh: "停止", ja: "ストップ", es: "Detener", pt: "Parar" },
  tap: { en: "Tap tempo", zh: "手动打拍", ja: "タップテンポ", es: "Pulsar tempo", pt: "Marcar tempo" },
  tapHint: {
    en: "Tap 4+ times in rhythm — the average becomes your BPM.",
    zh: "按节奏点 4 次以上,取平均得到 BPM。",
    ja: "リズムに合わせて 4 回以上タップ——平均が BPM になります。",
    es: "Pulse 4 veces o más siguiendo el ritmo — la media da el BPM.",
    pt: "Toque 4 vezes ou mais no ritmo — a média dá o BPM.",
  },
  tapCount: { en: "taps", zh: "次", ja: "回", es: "pulsos", pt: "toques" },
  presets: { en: "Presets", zh: "常用速度", ja: "プリセット", es: "Presets", pt: "Presets" },
  subQuarter: { en: "Quarter", zh: "四分音符", ja: "四分音符", es: "Negra", pt: "Semínima" },
  subEighth: { en: "Eighth", zh: "八分音符", ja: "八分音符", es: "Corchea", pt: "Colcheia" },
  subTriplet: { en: "Triplet", zh: "三连音", ja: "三連符", es: "Tresillo", pt: "Tercina" },
  subSixteenth: { en: "Sixteenth", zh: "十六分音符", ja: "十六分音符", es: "Semicorchea", pt: "Semicolcheia" },
  error: {
    en: "This browser does not support the Web Audio API, so the metronome cannot play here.",
    zh: "此浏览器不支持 Web Audio API,节拍器无法在这里发声。",
    ja: "このブラウザは Web Audio API に対応していないため、メトロノームを鳴らせません。",
    es: "Este navegador no admite la Web Audio API, así que el metrónomo no puede sonar aquí.",
    pt: "Este navegador não suporta a Web Audio API, então o metrônomo não pode tocar aqui.",
  },
  note: {
    en: "Beats are scheduled on the Web Audio clock with a 120 ms lookahead, so the tempo never drifts the way timer-based metronomes do. For 6/8 and 7/8 the beat is an eighth note; subdivisions divide that beat into 1, 2, 3 or 4 equal pulses.",
    zh: "节拍基于 Web Audio 时钟、提前 120 ms 排程,不会像基于定时器的节拍器那样漂移。6/8 与 7/8 的一拍是八分音符,细分把这一拍等分为 1、2、3 或 4 份。",
    ja: "ビートは Web Audio クロック上で 120 ms 先までスケジュールされるため、タイマー式のメトロノームのようなズレが起きません。6/8・7/8 の一拍は八分音符で、拍の細分はその一拍を 1・2・3・4 等分します。",
    es: "Los tiempos se programan en el reloj de Web Audio con 120 ms de antelación, así que el tempo no se desvía como en los metrónomos basados en temporizadores. En 6/8 y 7/8 el tiempo es una corchea; la subdivisión la divide en 1, 2, 3 o 4 pulsos iguales.",
    pt: "Os tempos são agendados no relógio da Web Audio com 120 ms de antecedência, então o tempo não desvia como nos metrônomos baseados em timer. Em 6/8 e 7/8 o tempo é uma colcheia; a subdivisão a divide em 1, 2, 3 ou 4 pulsos iguais.",
  },
};

const SUB_LABELS: Record<Subdivision, Record<string, string>> = {
  quarter: S.subQuarter,
  eighth: S.subEighth,
  triplet: S.subTriplet,
  sixteenth: S.subSixteenth,
};

export function MetronomeEngine() {
  const { locale } = useI18n();
  const [bpm, setBpm] = useState(120);
  const [sig, setSig] = useState<TimeSignature>("4/4");
  const [subdiv, setSubdiv] = useState<Subdivision>("quarter");
  const [accent, setAccent] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [tapCount, setTapCount] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const nextTimeRef = useRef(0);
  const eventRef = useRef(0);
  const queueRef = useRef<{ time: number; beat: number }[]>([]);
  const tapsRef = useRef<number[]>([]);
  // 排程回调只读这个 ref,改速度/拍号即时生效,无 stale closure
  const cfgRef = useRef({ bpm, sig, subdiv, accent });
  cfgRef.current = { bpm, sig, subdiv, accent };

  const beats = beatsPerBar(sig);

  // 拍号或细分变化:从小节头重新数
  useEffect(() => {
    eventRef.current = 0;
    setActiveBeat(-1);
  }, [sig, subdiv]);

  const scheduleClick = useCallback((time: number, freq: number, gain: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
  }, []);

  const tick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const cfg = cfgRef.current;
    const mult = subdivisionMult(cfg.subdiv);
    const perBar = beatsPerBar(cfg.sig) * mult;
    while (nextTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_S) {
      const i = eventRef.current;
      const beatInBar = Math.floor(i / mult) % beatsPerBar(cfg.sig);
      const isBeatPulse = i % mult === 0;
      const isAccent = cfg.accent && beatInBar === 0 && isBeatPulse;
      scheduleClick(
        nextTimeRef.current,
        isAccent ? CLICK_ACCENT_HZ : isBeatPulse ? CLICK_BEAT_HZ : CLICK_SUB_HZ,
        isAccent ? 0.5 : isBeatPulse ? 0.38 : 0.2,
      );
      queueRef.current.push({ time: nextTimeRef.current, beat: isBeatPulse ? beatInBar : -1 });
      eventRef.current = (i + 1) % perBar;
      nextTimeRef.current += subdivisionInterval(cfg.bpm, cfg.subdiv) / 1000;
    }
  }, [scheduleClick]);

  // 视觉:rAF 把已排程的拍点对齐到当前音频时间
  const rafLoop = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const q = queueRef.current;
    while (q.length && ctx.currentTime >= q[0].time - 0.015) {
      const ev = q.shift()!;
      if (ev.beat >= 0) setActiveBeat(ev.beat);
    }
    rafRef.current = requestAnimationFrame(rafLoop);
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    queueRef.current = [];
    setPlaying(false);
    setActiveBeat(-1);
  }, []);

  const start = useCallback(async () => {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      setAudioError(true);
      return;
    }
    try {
      if (!ctxRef.current) ctxRef.current = new Ctor();
      const ctx = ctxRef.current;
      await ctx.resume();
      eventRef.current = 0;
      queueRef.current = [];
      nextTimeRef.current = ctx.currentTime + 0.1;
      timerRef.current = window.setInterval(tick, TIMER_MS);
      tick();
      rafRef.current = requestAnimationFrame(rafLoop);
      setPlaying(true);
      setAudioError(false);
    } catch {
      setAudioError(true);
    }
  }, [tick, rafLoop]);

  // 卸载清理:停排程、关 AudioContext
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  const onTap = useCallback(() => {
    const now = performance.now();
    const taps = tapsRef.current;
    if (taps.length && now - taps[taps.length - 1] > TAP_TIMEOUT_MS) taps.length = 0;
    taps.push(now);
    if (taps.length > 8) taps.shift();
    setTapCount(taps.length);
    const measured = tapTempoBpm(taps);
    if (measured !== null && taps.length >= 4) setBpm(clampBpm(measured));
  }, []);

  const step = (delta: number) => setBpm((b) => clampBpm(b + delta));

  return (
    <ToolPanel>
      {/* 节拍点 */}
      <div className="flex items-center justify-center gap-2.5 py-2" aria-hidden="true">
        {Array.from({ length: beats }, (_, i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-full transition-all duration-75 ${
              playing && activeBeat === i
                ? i === 0 && accent
                  ? "scale-125 bg-[var(--color-accent)] ring-4 ring-[var(--color-ring)]"
                  : "scale-125 bg-[var(--color-ink)]"
                : i === 0 && accent
                  ? "bg-[var(--color-accent)] opacity-40"
                  : "bg-[var(--color-ink)] opacity-20"
            }`}
          />
        ))}
      </div>

      {/* 大号 BPM 读数 + 开始/停止 */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <span className="mono text-6xl font-bold tabular-nums text-[var(--color-ink)]">{fmtNum(bpm, locale)}</span>
        <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-sub)]">BPM</span>
        <Btn variant="primary" onClick={() => (playing ? stop() : void start())} ariaPressed={playing}>
          {playing ? pick(locale, S.stop) : pick(locale, S.start)}
        </Btn>
      </div>

      {/* 速度滑杆 */}
      <div className="mt-5">
        <Field label={pick(locale, S.bpm)}>
          <Slider value={bpm} onChange={(v) => setBpm(clampBpm(v))} min={BPM_MIN} max={BPM_MAX} aria={pick(locale, S.bpm)} />
          <div className="mono mt-1 flex justify-between text-[11.5px] text-[var(--color-sub)]">
            <span>{BPM_MIN}</span>
            <span>{BPM_MAX}</span>
          </div>
        </Field>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Btn onClick={() => step(-1)} ariaLabel={`-1 BPM`}>−1</Btn>
          <Btn onClick={() => step(1)} ariaLabel={`+1 BPM`}>+1</Btn>
          <span className="mx-1 text-[12.5px] font-medium text-[var(--color-sub)]">{pick(locale, S.presets)}</span>
          {TEMPO_PRESETS.map((p) => (
            <Chip key={p} onClick={() => setBpm(p)} active={bpm === p}>
              {p}
            </Chip>
          ))}
        </div>
      </div>

      {/* Tap tempo */}
      <div className="mt-5 rounded-xl border hairline px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <Btn onClick={onTap} active={tapCount >= 4} ariaLabel={pick(locale, S.tap)}>
            {pick(locale, S.tap)}
          </Btn>
          {tapCount > 0 ? (
            <span className="mono text-[13px] text-[var(--color-sub)]">
              {fmtNum(tapCount, locale)} {pick(locale, S.tapCount)}
            </span>
          ) : null}
          <span className="text-[12.5px] text-[var(--color-sub)]">{pick(locale, S.tapHint)}</span>
        </div>
      </div>

      {/* 拍号 / 细分 / 重音 */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={pick(locale, S.timeSig)}>
          <SelectIn
            value={sig}
            onChange={(v) => setSig(v as TimeSignature)}
            options={TIME_SIGNATURES.map((s) => ({ value: s, label: s }))}
            aria={pick(locale, S.timeSig)}
          />
        </Field>
        <Field label={pick(locale, S.subdiv)}>
          <SelectIn
            value={subdiv}
            onChange={(v) => setSubdiv(v as Subdivision)}
            options={SUBDIVISIONS.map((s) => ({ value: s, label: pick(locale, SUB_LABELS[s]) }))}
            aria={pick(locale, S.subdiv)}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Toggle checked={accent} onChange={setAccent} label={pick(locale, S.accent)} />
      </div>

      {audioError ? (
        <div className="mt-4 rounded-xl border hairline bg-[var(--color-surface)] px-4 py-3">
          <Note>{pick(locale, S.error)}</Note>
        </div>
      ) : null}

      <div className="mt-4">
        <Note>{pick(locale, S.note)}</Note>
      </div>
    </ToolPanel>
  );
}
