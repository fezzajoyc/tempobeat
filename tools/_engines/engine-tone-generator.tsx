"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { Btn, Chip, Field, Note, NumberIn, Slider, Toggle, fmtHz, fmtNum, pick } from "./music-ui";
import { freqToNote, noteToFreq } from "../_lib/tempo";

/**
 * 音调发生器引擎:20 Hz–20 kHz 纯音(sine/square/sawtooth/triangle)、
 * 音量、预设音高与双耳模式(左右声道两个频率)。
 * 频率滑杆走对数刻度(3 个十倍程);预设频率一律由 tools/_lib/tempo.ts 的
 * noteToFreq(十二平均律)计算,单一来源。
 */

const FREQ_MIN = 20;
const FREQ_MAX = 20000;
const SLIDER_STEPS = 1000;

const WAVES = ["sine", "square", "sawtooth", "triangle"] as const;
type Wave = (typeof WAVES)[number];

const PRESET_NOTES = ["A2", "A3", "C4", "E4", "A4", "C5", "A5"] as const;

const S = {
  freq: { en: "Frequency", zh: "频率", ja: "周波数", es: "Frecuencia", pt: "Frequência" },
  wave: { en: "Waveform", zh: "波形", ja: "波形", es: "Forma de onda", pt: "Forma de onda" },
  volume: { en: "Volume", zh: "音量", ja: "音量", es: "Volumen", pt: "Volume" },
  play: { en: "Play", zh: "播放", ja: "再生", es: "Reproducir", pt: "Reproduzir" },
  stop: { en: "Stop", zh: "停止", ja: "停止", es: "Detener", pt: "Parar" },
  presets: { en: "Preset notes", zh: "预设音高", ja: "プリセット音", es: "Notas predefinidas", pt: "Notas predefinidas" },
  nearest: { en: "Nearest note", zh: "最近的音", ja: "最も近い音", es: "Nota más cercana", pt: "Nota mais próxima" },
  binaural: { en: "Binaural mode (left / right)", zh: "双耳模式(左 / 右声道)", ja: "バイノーラルモード(左 / 右)", es: "Modo binaural (izq. / der.)", pt: "Modo binaural (esq. / dir.)" },
  beatHz: { en: "Beat frequency (left − right)", zh: "拍频(左 − 右)", ja: "うなり周波数(左 − 右)", es: "Frecuencia de batido (izq. − der.)", pt: "Frequência de batimento (esq. − dir.)" },
  binauralNote: {
    en: "Binaural mode plays your frequency in the left ear and a slightly lower or higher tone in the right; the difference is the beat frequency. Use headphones — through speakers the two channels mix into one tone.",
    zh: "双耳模式在左耳播放当前频率,右耳播放略有偏差的音,差值即拍频。请戴耳机——用外放时两个声道会混成一个音。",
    ja: "バイノーラルモードは左耳に設定周波数を、右耳にわずかに異なる周波数を再生します。その差がうなり周波数です。ヘッドフォンをご使用ください——スピーカーでは 2 チャンネルが 1 つの音に混ざります。",
    es: "El modo binaural reproduce su frecuencia en el oído izquierdo y un tono ligeramente distinto en el derecho; la diferencia es la frecuencia de batido. Use auriculares: por altavoces ambos canales se mezclan en un solo tono.",
    pt: "O modo binaural toca a sua frequência no ouvido esquerdo e um tom ligeiramente diferente no direito; a diferença é a frequência de batimento. Use fones de ouvido — por alto-falantes os dois canais se misturam num só tom.",
  },
  safety: {
    en: "Pure tones concentrate energy at a single frequency — keep the volume moderate and never listen through headphones at full level for long. 20 Hz–20 kHz is the nominal range of human hearing; many adults stop hearing the top of it.",
    zh: "纯音把能量集中在一个频率上——音量请保持适中,不要长时间用耳机大音量收听。20 Hz–20 kHz 是人耳的名义听域,许多成年人听不到高端部分。",
    ja: "純音はエネルギーを単一周波数に集中させます——音量は控えめにし、ヘッドフォンでの大音量の長時間使用は避けてください。20 Hz–20 kHz は人間の可聴域の目安で、高域は聞こえなくなる人も多くいます。",
    es: "Los tonos puros concentran la energía en una sola frecuencia: mantenga el volumen moderado y no escuche nunca largos ratos a todo volumen con auriculares. 20 Hz–20 kHz es el rango nominal del oído humano; muchos adultos dejan de oír su parte alta.",
    pt: "Tons puros concentram a energia numa única frequência — mantenha o volume moderado e nunca ouça por muito tempo no volume máximo com fones. 20 Hz–20 kHz é a faixa nominal da audição humana; muitos adultos param de ouvir o topo dela.",
  },
  error: {
    en: "This browser does not support the Web Audio API, so the tone generator cannot play here.",
    zh: "此浏览器不支持 Web Audio API,音调发生器无法在这里发声。",
    ja: "このブラウザは Web Audio API に対応していないため、トーンジェネレーターを鳴らせません。",
    es: "Este navegador no admite la Web Audio API, así que el generador de tonos no puede sonar aquí.",
    pt: "Este navegador não suporta a Web Audio API, então o gerador de tons não pode tocar aqui.",
  },
};

const WAVE_LABELS: Record<Wave, Record<string, string>> = {
  sine: { en: "Sine", zh: "正弦波", ja: "正弦波", es: "Senoidal", pt: "Senoidal" },
  square: { en: "Square", zh: "方波", ja: "矩形波", es: "Cuadrada", pt: "Quadrada" },
  sawtooth: { en: "Sawtooth", zh: "锯齿波", ja: "鋸歯状波", es: "Diente de sierra", pt: "Dente de serra" },
  triangle: { en: "Triangle", zh: "三角波", ja: "三角波", es: "Triangular", pt: "Triangular" },
};

/** 滑杆位置 t ∈ [0,1000] → 频率,20 Hz × 10^(3·t/1000):三个十倍程到 20 kHz */
function sliderToFreq(t: number): number {
  const f = FREQ_MIN * Math.pow(10, (3 * t) / SLIDER_STEPS);
  return Math.min(FREQ_MAX, Math.max(FREQ_MIN, f));
}

function freqToSlider(f: number): number {
  const clamped = Math.min(FREQ_MAX, Math.max(FREQ_MIN, f));
  return Math.round((Math.log10(clamped / FREQ_MIN) / 3) * SLIDER_STEPS);
}

export function ToneGeneratorEngine() {
  const { locale } = useI18n();
  const [freq, setFreq] = useState(440);
  const [wave, setWave] = useState<Wave>("sine");
  const [volume, setVolume] = useState(40);
  const [binaural, setBinaural] = useState(false);
  const [beatHz, setBeatHz] = useState(7);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode[]>([]);

  const nearest = freqToNote(freq);

  // 播放中实时调频率与音量(平滑过渡);波形/双耳切换走重启
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx || !playing) return;
    oscRef.current.forEach((osc, i) => {
      const target = binaural && i === 1 ? freq - beatHz : freq;
      osc.frequency.setTargetAtTime(Math.max(1, target), ctx.currentTime, 0.01);
    });
  }, [freq, beatHz, binaural, playing]);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx || !playing) return;
    const g = Math.pow(volume / 100, 2);
    gainRef.current.forEach((gn) => gn.gain.setTargetAtTime(g, ctx.currentTime, 0.02));
  }, [volume, playing]);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    if (ctx) {
      for (const gn of gainRef.current) gn.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.02);
      for (const osc of oscRef.current) {
        try {
          osc.stop(ctx.currentTime + 0.1);
        } catch {
          /* already stopped */
        }
      }
    }
    oscRef.current = [];
    gainRef.current = [];
    setPlaying(false);
  }, []);

  const start = useCallback(async () => {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      setAudioError(true);
      return;
    }
    try {
      stop();
      if (!ctxRef.current) ctxRef.current = new Ctor();
      const ctx = ctxRef.current;
      await ctx.resume();
      const g = Math.pow(volume / 100, 2);
      const targets = binaural ? [freq, freq - beatHz] : [freq];
      const pans = binaural ? [-1, 1] : [0];
      oscRef.current = [];
      gainRef.current = [];
      targets.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gn = ctx.createGain();
        osc.type = wave;
        osc.frequency.value = Math.max(1, f);
        gn.gain.setValueAtTime(0.0001, ctx.currentTime);
        gn.gain.exponentialRampToValueAtTime(Math.max(0.0001, g), ctx.currentTime + 0.05);
        if (pans[i] !== 0) {
          const pan = ctx.createStereoPanner();
          pan.pan.value = pans[i];
          osc.connect(gn);
          gn.connect(pan);
          pan.connect(ctx.destination);
        } else {
          osc.connect(gn);
          gn.connect(ctx.destination);
        }
        osc.start();
        oscRef.current.push(osc);
        gainRef.current.push(gn);
      });
      setPlaying(true);
      setAudioError(false);
    } catch {
      setAudioError(true);
    }
  }, [binaural, beatHz, freq, stop, volume, wave]);

  // 卸载清理
  useEffect(() => {
    return () => {
      for (const osc of oscRef.current) {
        try {
          osc.stop();
        } catch {
          /* noop */
        }
      }
      void ctxRef.current?.close();
      ctxRef.current = null;
      oscRef.current = [];
      gainRef.current = [];
    };
  }, []);

  const toggleWave = (w: Wave) => {
    setWave(w);
    if (playing) void start(); // 波形需重建振荡器
  };

  const toggleBinaural = (v: boolean) => {
    setBinaural(v);
    if (playing) void start();
  };

  return (
    <ToolPanel>
      {/* 频率读数 + 最近音 */}
      <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-1 py-1 text-center">
        <div>
          <span className="mono block text-5xl font-bold tabular-nums text-[var(--color-ink)]">{fmtNum(freq, locale, freq >= 100 ? 1 : 2)}</span>
          <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-sub)]">Hz</span>
        </div>
        {nearest.note ? (
          <div className="pb-1 text-left">
            <span className="block text-[12.5px] font-medium text-[var(--color-sub)]">{pick(locale, S.nearest)}</span>
            <span className="mono text-[18px] font-semibold text-[var(--color-accent-strong)]">
              {nearest.note} {nearest.cents >= 0 ? "+" : "−"}
              {fmtNum(Math.abs(nearest.cents), locale)}¢
            </span>
          </div>
        ) : null}
      </div>

      {/* 播放/停止 */}
      <div className="mt-3 flex justify-center">
        <Btn variant="primary" onClick={() => (playing ? stop() : void start())} ariaPressed={playing}>
          {playing ? pick(locale, S.stop) : pick(locale, S.play)}
        </Btn>
      </div>

      {/* 频率滑杆(对数)+ 精确输入 */}
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_170px]">
        <Field label={`${pick(locale, S.freq)} — ${FREQ_MIN}–${fmtNum(FREQ_MAX, locale)} Hz`}>
          <Slider value={freqToSlider(freq)} onChange={(t) => setFreq(sliderToFreq(t))} min={0} max={SLIDER_STEPS} aria={pick(locale, S.freq)} />
          <div className="mono mt-1 flex justify-between text-[11.5px] text-[var(--color-sub)]">
            <span>20</span>
            <span>100</span>
            <span>1k</span>
            <span>10k</span>
            <span>20k</span>
          </div>
        </Field>
        <Field label={pick(locale, S.freq)}>
          <NumberIn value={String(freq)} onChange={(v) => {
            const n = Number(v);
            if (Number.isFinite(n) && n > 0) setFreq(Math.min(FREQ_MAX, Math.max(FREQ_MIN, n)));
          }} min={FREQ_MIN} max={FREQ_MAX} aria={pick(locale, S.freq)} />
        </Field>
      </div>

      {/* 波形 */}
      <div className="mt-4">
        <Field label={pick(locale, S.wave)}>
          <div className="flex flex-wrap gap-2">
            {WAVES.map((w) => (
              <Chip key={w} onClick={() => toggleWave(w)} active={wave === w} ariaLabel={pick(locale, WAVE_LABELS[w])}>
                {pick(locale, WAVE_LABELS[w])}
              </Chip>
            ))}
          </div>
        </Field>
      </div>

      {/* 音量 */}
      <div className="mt-4">
        <Field label={pick(locale, S.volume)}>
          <div className="flex items-center gap-3">
            <Slider value={volume} onChange={setVolume} min={0} max={100} aria={pick(locale, S.volume)} />
            <span className="mono w-10 text-right text-[14px] tabular-nums text-[var(--color-ink)]">{fmtNum(volume, locale)}%</span>
          </div>
        </Field>
      </div>

      {/* 双耳模式 */}
      <div className="mt-5 rounded-xl border hairline px-4 py-3.5">
        <Toggle checked={binaural} onChange={toggleBinaural} label={pick(locale, S.binaural)} />
        {binaural ? (
          <div className="mt-3">
            <Field label={`${pick(locale, S.beatHz)} — 0.5–30 Hz`}>
              <div className="flex items-center gap-3">
                <Slider value={beatHz} onChange={setBeatHz} min={0.5} max={30} step={0.5} aria={pick(locale, S.beatHz)} />
                <span className="mono w-16 text-right text-[14px] tabular-nums text-[var(--color-ink)]">{fmtNum(beatHz, locale, 1)} Hz</span>
              </div>
            </Field>
            <div className="mono mt-2 text-[12.5px] text-[var(--color-sub)]">
              L {fmtHz(freq, locale)} · R {fmtHz(Math.max(1, freq - beatHz), locale)}
            </div>
            <div className="mt-2">
              <Note>{pick(locale, S.binauralNote)}</Note>
            </div>
          </div>
        ) : null}
      </div>

      {/* 预设音高:频率由 noteToFreq 计算,单一来源 */}
      <div className="mt-5">
        <Field label={pick(locale, S.presets)}>
          <div className="flex flex-wrap gap-2">
            {PRESET_NOTES.map((note) => {
              const f = noteToFreq(note);
              return (
                <Chip key={note} onClick={() => setFreq(Math.round(f * 100) / 100)} active={Math.abs(freq - f) < 0.01} ariaLabel={`${note} ${fmtHz(f, locale)}`}>
                  {note} · {fmtNum(f, locale, f >= 100 ? 1 : 2)}
                </Chip>
              );
            })}
          </div>
        </Field>
      </div>

      {audioError ? (
        <div className="mt-4 rounded-xl border hairline bg-[var(--color-surface)] px-4 py-3">
          <Note>{pick(locale, S.error)}</Note>
        </div>
      ) : null}

      <div className="mt-4">
        <Note>{pick(locale, S.safety)}</Note>
      </div>
    </ToolPanel>
  );
}
