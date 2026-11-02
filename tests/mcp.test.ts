import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@/mcp/server";

async function connect() {
  const server = createServer();
  const client = new Client({ name: "test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

/**
 * 与 tests/tempo.test.ts 同一套手算基准(十二平均律 f = 440 × 2^((n−49)/12)):
 * A4 = 440 精确;442 Hz = A4 +8 音分;440→880 = 12 半音 = Octave;
 * 4 taps @600ms = 100 BPM;间隔 > 3 s → 无法测出单一速度。
 */
describe("tempobeat MCP server", () => {
  it("exposes exactly the four TempoBeat tools", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.length).toBe(4);
    expect(new Set(tools.map((t) => t.name))).toEqual(
      new Set(["note_to_freq", "freq_to_note", "semitone_distance", "tap_tempo"]),
    );
    // 每个工具都有 schema 与说明,AI 客户端靠它们路由
    for (const tool of tools) {
      expect(tool.description?.length ?? 0).toBeGreaterThan(20);
      expect(tool.inputSchema).toBeTruthy();
    }
    await client.close();
  });

  it("converts note names to equal-temperament frequencies", async () => {
    const client = await connect();
    const a4 = await client.callTool({ name: "note_to_freq", arguments: { note: "A4" } });
    const parsed = JSON.parse((a4.content as any)[0].text);
    expect(parsed.hz).toBe(440);
    expect(parsed.key_number).toBe(49);

    const c4 = await client.callTool({ name: "note_to_freq", arguments: { note: "C4" } });
    const c4p = JSON.parse((c4.content as any)[0].text);
    expect(c4p.hz).toBeCloseTo(261.626, 2);
    expect(c4p.key_number).toBe(40);

    const bb3 = await client.callTool({ name: "note_to_freq", arguments: { note: "Bb3" } });
    expect(JSON.parse((bb3.content as any)[0].text).hz).toBeCloseTo(233.082, 2);
    await client.close();
  });

  it("reads frequencies as nearest note + cents (442 → A4 +8)", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "freq_to_note", arguments: { freq: 442 } });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.note).toBe("A4");
    expect(parsed.cents).toBe(8);

    const zero = await client.callTool({ name: "freq_to_note", arguments: { freq: 440 } });
    expect(JSON.parse((zero.content as any)[0].text)).toEqual({ freq: 440, note: "A4", cents: 0 });
    await client.close();
  });

  it("measures semitone distance with interval name and ratio", async () => {
    const client = await connect();
    const oct = await client.callTool({ name: "semitone_distance", arguments: { f1: 440, f2: 880 } });
    const octP = JSON.parse((oct.content as any)[0].text);
    expect(octP.semitones).toBe(12);
    expect(octP.interval).toBe("Octave");
    expect(octP.direction).toBe("up");
    expect(octP.ratio).toBe(2);

    const semi = await client.callTool({ name: "semitone_distance", arguments: { f1: 440, f2: 466.16 } });
    const semiP = JSON.parse((semi.content as any)[0].text);
    expect(semiP.semitones).toBe(1);
    expect(semiP.interval).toBe("Minor 2nd");

    // 反向 = 负距离,方向 down
    const down = await client.callTool({ name: "semitone_distance", arguments: { f1: 880, f2: 440 } });
    const downP = JSON.parse((down.content as any)[0].text);
    expect(downP.semitones).toBe(-12);
    expect(downP.direction).toBe("down");
    await client.close();
  });

  it("averages tap timestamps into BPM (4 taps @600ms → 100)", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "tap_tempo", arguments: { taps: [0, 600, 1200, 1800] } });
    expect((r.content as any)[0].text).toBe("100 BPM");
    // 乱序时间戳同样有效
    const unordered = await client.callTool({ name: "tap_tempo", arguments: { taps: [1200, 0, 1800, 600] } });
    expect((unordered.content as any)[0].text).toBe("100 BPM");
    await client.close();
  });

  it("guards both layers: schema violations and invalid logic input", async () => {
    const client = await connect();
    // 逻辑层:间隔 > 3 s → 不猜测,isError
    const gap = await client.callTool({ name: "tap_tempo", arguments: { taps: [0, 4000] } });
    expect((gap as any).isError).toBe(true);
    expect((gap.content as any)[0].text).toContain("3000");
    // 逻辑层:假音名 → isError(而不是 JSON 里静默变 null)
    const badNote = await client.callTool({ name: "note_to_freq", arguments: { note: "H4" } });
    expect((badNote as any).isError).toBe(true);
    expect((badNote.content as any)[0].text).toContain("scientific pitch");
    // 逻辑层:非正频率 → isError
    const badFreq = await client.callTool({ name: "semitone_distance", arguments: { f1: 0, f2: 880 } });
    expect((badFreq as any).isError).toBe(true);
    // 逻辑层:低于 C-1 无法命名 → isError
    const subsonic = await client.callTool({ name: "freq_to_note", arguments: { freq: 4.5 } });
    expect((subsonic as any).isError).toBe(true);
    // schema 层:freq 为负被 zod 拒绝 → SDK 返回 isError(-32602)
    const schemaBad = await client.callTool({ name: "freq_to_note", arguments: { freq: -440 } });
    expect((schemaBad as any).isError).toBe(true);
    expect((schemaBad.content as any)[0].text).toContain("-32602");
    // schema 层:taps 少于 2 个被 zod 拒绝
    const fewTaps = await client.callTool({ name: "tap_tempo", arguments: { taps: [500] } });
    expect((fewTaps as any).isError).toBe(true);
    // schema 层:错误类型(字符串频率)被 zod 拒绝
    const wrongType = await client.callTool({ name: "semitone_distance", arguments: { f1: "440", f2: 880 } });
    expect((wrongType as any).isError).toBe(true);
    await client.close();
  });
});
