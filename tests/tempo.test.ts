import { describe, expect, it } from "vitest";
import {
  bpmToInterval, subdivisionInterval, subdivisionMult, clampBpm,
  tapTempoBpm, TAP_TIMEOUT_MS,
  semitoneDistance, intervalName, INTERVAL_NAMES,
  beatsPerBar, TIME_SIGNATURES,
  noteToKeyNumber, keyNumberToNote, noteToFreq, freqToNote,
} from "@/tools/_lib/tempo";

/**
 * 全部基准手算自十二平均律封闭公式 f = 440 × 2^((n−49)/12),n 为钢琴键号
 * (A0 = 1,C4 = 40,A4 = 49;midi = n + 20)。关键锚点:
 *   A4 = 440 精确;A3 = 440 × 2^(-1) = 220;A5 = 880;
 *   C4 = 440 × 2^(-9/12) = 261.6256;
 *   半音距离 = 12 × log2(f2/f1);音分 = 距离 × 100。
 */

// ── 节拍 ────────────────────────────────────────────────────────────────

describe("bpmToInterval: ms per beat = 60000/bpm", () => {
  it("computes exact hand-checked intervals", () => {
    expect(bpmToInterval(120)).toBe(500); // 120 BPM → 500 ms/beat
    expect(bpmToInterval(100)).toBe(600);
    expect(bpmToInterval(300)).toBe(200);
    expect(bpmToInterval(30)).toBe(2000);
    expect(bpmToInterval(60)).toBe(1000);
  });

  it("is the exact inverse of the tempo formula", () => {
    for (const bpm of [33, 72, 96, 144, 240]) {
      expect(60000 / bpmToInterval(bpm)).toBeCloseTo(bpm, 9);
    }
  });

  it("returns NaN for zero, negative and non-finite input (documented)", () => {
    for (const bad of [0, -120, NaN, Infinity, -Infinity]) {
      expect(Number.isNaN(bpmToInterval(bad))).toBe(true);
    }
  });
});

describe("subdivision helpers", () => {
  it("multiplies pulses per beat 1/2/3/4×", () => {
    expect(subdivisionMult("quarter")).toBe(1);
    expect(subdivisionMult("eighth")).toBe(2);
    expect(subdivisionMult("triplet")).toBe(3);
    expect(subdivisionMult("sixteenth")).toBe(4);
  });

  it("splits one beat into equal pulses at 120 BPM", () => {
    expect(subdivisionInterval(120, "quarter")).toBe(500);
    expect(subdivisionInterval(120, "eighth")).toBe(250);
    expect(subdivisionInterval(120, "triplet")).toBeCloseTo(500 / 3, 9);
    expect(subdivisionInterval(120, "sixteenth")).toBe(125);
  });

  it("propagates NaN from an invalid bpm", () => {
    expect(Number.isNaN(subdivisionInterval(0, "eighth"))).toBe(true);
  });

  it("parses beats per bar for every supported signature", () => {
    expect(beatsPerBar("2/4")).toBe(2);
    expect(beatsPerBar("3/4")).toBe(3);
    expect(beatsPerBar("4/4")).toBe(4);
    expect(beatsPerBar("6/8")).toBe(6);
    expect(beatsPerBar("7/8")).toBe(7);
    expect(TIME_SIGNATURES).toHaveLength(5);
  });
});

describe("clampBpm", () => {
  it("clamps into 30–300 and rounds", () => {
    expect(clampBpm(500)).toBe(300);
    expect(clampBpm(0)).toBe(30);
    expect(clampBpm(-10)).toBe(30);
    expect(clampBpm(120.4)).toBe(120);
    expect(clampBpm(119.6)).toBe(120);
    expect(clampBpm(299.6)).toBe(300);
  });

  it("falls back to 120 for non-finite input", () => {
    expect(clampBpm(NaN)).toBe(120);
    expect(clampBpm(Infinity)).toBe(120);
  });
});

describe("tapTempoBpm: average interval between taps", () => {
  it("turns 4 taps at 600 ms into 100 BPM", () => {
    expect(tapTempoBpm([0, 600, 1200, 1800])).toBe(100);
  });

  it("is order-independent and keeps 1 decimal", () => {
    expect(tapTempoBpm([1200, 0, 1800, 600])).toBe(100);
    expect(tapTempoBpm([0, 500, 1000, 1500])).toBe(120);
    expect(tapTempoBpm([0, 700, 1400, 2100, 2800])).toBeCloseTo(85.7, 1);
  });

  it("needs at least 2 valid timestamps", () => {
    expect(tapTempoBpm([])).toBeNull();
    expect(tapTempoBpm([1234])).toBeNull();
    expect(tapTempoBpm([NaN, NaN])).toBeNull();
  });

  it("rejects a pause longer than 3 s (new phrase, not one tempo)", () => {
    expect(TAP_TIMEOUT_MS).toBe(3000);
    expect(tapTempoBpm([0, 4000])).toBeNull();
    expect(tapTempoBpm([0, 500, 10000, 10500])).toBeNull();
  });

  it("treats exactly 3000 ms as still one phrase: 3000 ms → 20 BPM", () => {
    expect(tapTempoBpm([0, 3000])).toBe(20);
  });

  it("ignores non-finite entries instead of throwing", () => {
    expect(tapTempoBpm([0, NaN, 600])).toBe(100);
    expect(tapTempoBpm([Infinity, 0, 600])).toBe(100);
  });
});

// ── 音程 ────────────────────────────────────────────────────────────────

describe("semitoneDistance: 12 × log2(f2/f1), 1 decimal", () => {
  it("reads the octave as exactly 12, both directions", () => {
    expect(semitoneDistance(440, 880)).toBe(12);
    expect(semitoneDistance(880, 440)).toBe(-12);
    expect(semitoneDistance(440, 440)).toBe(0);
  });

  it("reads one semitone at the equal-temperament ratio", () => {
    expect(semitoneDistance(440, 466.16)).toBe(1);
    expect(semitoneDistance(440, 440 * Math.pow(2, 1 / 12))).toBe(1);
  });

  it("hand-checks a perfect fifth (440 → E5 659.2551)", () => {
    expect(semitoneDistance(440, 659.2551)).toBe(7);
  });

  it("returns NaN for non-positive or non-finite frequencies", () => {
    for (const bad of [0, -440, NaN, Infinity]) {
      expect(Number.isNaN(semitoneDistance(bad, 880))).toBe(true);
      expect(Number.isNaN(semitoneDistance(440, bad))).toBe(true);
    }
  });
});

describe("intervalName: 0–12 per the table, compound beyond", () => {
  it("names every semitone 0–12", () => {
    const expected = [
      "Unison", "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd", "Perfect 4th",
      "Tritone", "Perfect 5th", "Minor 6th", "Major 6th", "Minor 7th", "Major 7th", "Octave",
    ];
    expect([...INTERVAL_NAMES]).toEqual(expected);
    expected.forEach((name, st) => expect(intervalName(st)).toBe(name));
  });

  it("expresses compound intervals as base + octaves", () => {
    expect(intervalName(13)).toBe("Minor 2nd + 1 octave");
    expect(intervalName(19)).toBe("Perfect 5th + 1 octave");
    expect(intervalName(24)).toBe("2 octaves");
    expect(intervalName(25)).toBe("Minor 2nd + 2 octaves");
  });

  it("rounds fractional input and uses absolute distance", () => {
    expect(intervalName(0.4)).toBe("Unison");
    expect(intervalName(6.4)).toBe("Tritone"); // rounds to 6
    expect(intervalName(6.6)).toBe("Perfect 5th"); // rounds to 7
    expect(intervalName(-7)).toBe("Perfect 5th"); // direction is the caller's concern
  });

  it("returns an empty string for non-finite input", () => {
    expect(intervalName(NaN)).toBe("");
    expect(intervalName(Infinity)).toBe("");
  });
});

// ── 音高 ────────────────────────────────────────────────────────────────

describe("noteToKeyNumber: scientific pitch → piano key (A0 = 1)", () => {
  it("maps the anchors A0 = 1, C4 = 40, A4 = 49", () => {
    expect(noteToKeyNumber("A0")).toBe(1);
    expect(noteToKeyNumber("C4")).toBe(40);
    expect(noteToKeyNumber("A4")).toBe(49);
  });

  it("handles sharps, flats, lowercase and negative octaves", () => {
    expect(noteToKeyNumber("C#4")).toBe(41);
    expect(noteToKeyNumber("Bb3")).toBe(38); // midi 58
    expect(noteToKeyNumber("bb3")).toBe(38);
    expect(noteToKeyNumber("a4")).toBe(49);
    expect(noteToKeyNumber("C-1")).toBe(-20); // midi 0
    expect(noteToKeyNumber("Fb3")).toBe(noteToKeyNumber("E3")); // F♭3 ≡ E3, midi 52
  });

  it("rejects malformed spellings without throwing", () => {
    for (const bad of ["", "H4", "A", "4", "#4", "Ab", "Do4", "A4b", "Ａ4", "♪4", "A 4", "A#b4"]) {
      expect(Number.isNaN(noteToKeyNumber(bad)), JSON.stringify(bad)).toBe(true);
    }
  });
});

describe("keyNumberToNote: sharp spelling", () => {
  it("inverts noteToKeyNumber", () => {
    expect(keyNumberToNote(49)).toBe("A4");
    expect(keyNumberToNote(40)).toBe("C4");
    expect(keyNumberToNote(1)).toBe("A0");
    expect(keyNumberToNote(38)).toBe("A#3"); // Bb3 spelled with a sharp
    expect(keyNumberToNote(-20)).toBe("C-1");
  });

  it("returns an empty string below C-1 or for non-integers", () => {
    expect(keyNumberToNote(-21)).toBe("");
    expect(keyNumberToNote(49.5)).toBe("");
    expect(keyNumberToNote(NaN)).toBe("");
  });
});

describe("noteToFreq: f = 440 × 2^((n−49)/12)", () => {
  it("hits the equal-temperament anchors exactly", () => {
    expect(noteToFreq("A4")).toBe(440);
    expect(noteToFreq("A3")).toBe(220);
    expect(noteToFreq("A5")).toBe(880);
    expect(noteToFreq("A2")).toBe(110);
  });

  it("matches hand-computed values for other notes", () => {
    expect(noteToFreq("C4")).toBeCloseTo(261.63, 1); // 440 × 2^(-9/12) = 261.6256
    expect(noteToFreq("C5")).toBeCloseTo(523.25, 1); // 440 × 2^(3/12) = 523.2511
    expect(noteToFreq("E4")).toBeCloseTo(329.63, 1); // 440 × 2^(-5/12) = 329.6276
    expect(noteToFreq("G4")).toBeCloseTo(392.0, 1); // 440 × 2^(-2/12) = 391.9954
    expect(noteToFreq("C#4")).toBeCloseTo(277.18, 1); // 440 × 2^(-8/12) = 277.1826
    expect(noteToFreq("C-1")).toBeCloseTo(8.18, 1); // 440 × 2^(-69/12) = 8.1758
  });

  it("returns NaN for malformed notes (incl. CJK and emoji)", () => {
    for (const bad of ["", "H4", "A", "音乐", "A4!", "A#b4"]) {
      expect(Number.isNaN(noteToFreq(bad)), JSON.stringify(bad)).toBe(true);
    }
  });
});

describe("freqToNote: nearest note + cents deviation", () => {
  it("reads concert A with zero cents", () => {
    expect(freqToNote(440)).toEqual({ note: "A4", cents: 0 });
    expect(freqToNote(880)).toEqual({ note: "A5", cents: 0 });
    expect(freqToNote(220)).toEqual({ note: "A3", cents: 0 });
  });

  it("reads 442 Hz as A4 +8 cents (1200·log2(442/440) = 7.85)", () => {
    expect(freqToNote(442)).toEqual({ note: "A4", cents: 8 });
  });

  it("reads 415 Hz as G#4 about −2 cents (exact −1.27)", () => {
    const r = freqToNote(415);
    expect(r.note).toBe("G#4");
    expect(Math.abs(r.cents - -2)).toBeLessThanOrEqual(2); // task vector ≈ −2
    expect(r.cents).toBe(-1); // rounded from −1.27
  });

  it("snaps A#4 at 466.16 Hz with ~0 cents", () => {
    const r = freqToNote(466.16);
    expect(r.note).toBe("A#4");
    expect(Math.abs(r.cents)).toBeLessThanOrEqual(1);
  });

  it("round-trips every sharp-spelled note with zero cents", () => {
    for (const note of ["C3", "E3", "G#2", "A4", "F#4", "B5", "C-1", "C8"]) {
      const r = freqToNote(noteToFreq(note));
      expect(r.note).toBe(note === "Bb3" ? "A#3" : note);
      expect(r.cents).toBe(0);
    }
  });

  it("spells B♭ enharmonically as A# (documented convention)", () => {
    const r = freqToNote(noteToFreq("Bb3"));
    expect(r.note).toBe("A#3");
    expect(r.cents).toBe(0);
  });

  it("returns the documented invalid marker for non-positive or subsonic input", () => {
    for (const bad of [0, -440, NaN, Infinity, 4.5 /* below C-1 ≈ 8.18 Hz */]) {
      const r = freqToNote(bad);
      expect(r.note).toBe("");
      expect(Number.isNaN(r.cents)).toBe(true);
    }
  });
});
