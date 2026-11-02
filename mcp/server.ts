import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MCP_TOOLS } from "./tools";

/**
 * TempoBeat MCP server(stdio):把站上节拍/音高/音程工具背后的纯函数逻辑
 * 暴露为 AI 可执行工具。人和 AI 用同一份经过测试的实现。
 *
 * 构建后运行:npx tempobeat-mcp(或 node mcp/dist/server.mjs)
 */

export function createServer() {
  const server = new McpServer(
    { name: "tempobeat", version: "1.0.0" },
    {
      instructions:
        "TempoBeat: browser metronome and music tools (https://tempobeat.app). These executable tools run the same tested math as the website. Pitch uses equal temperament f = 440 × 2^((n−49)/12) with n the piano key number (A0 = 1, C4 = 40, A4 = 49); note names are spelled with sharps, Bb input is accepted. Semitone distance = 12 × log2(f2/f1) and 100 cents = 1 semitone. Tap tempo averages the intervals between timestamps and refuses pauses over 3 s (a new phrase is a new tempo). Frequencies are in Hz; the site metronome covers 30–300 BPM.",
    },
  );

  for (const tool of MCP_TOOLS) {
    server.registerTool(tool.name, {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.schema,
    }, async (args) => {
      try {
        return tool.run(args ?? {});
      } catch (e) {
        return {
          content: [{ type: "text" as const, text: `error: ${(e as Error).message}` }],
          isError: true,
        };
      }
    });
  }
  return server;
}

export async function runStdio() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  // stdio 模式下保持进程存活;stderr 可写日志(stdout 是协议通道)
  console.error(`tempobeat MCP server: ${MCP_TOOLS.length} tools ready`);
}

if (process.argv[1] && process.argv[1].includes("server")) {
  void runStdio();
}
