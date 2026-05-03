import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execp = promisify(exec);

export const dynamic = "force-dynamic";

export type Connection = {
  protocol: string;
  localAddr: string;
  localPort: number;
  remoteAddr: string;
  remotePort: number;
  state: string;
  pid: number;
  process: string;
};

/**
 * 列出本机当前已建立的 TCP 连接（不需要 sudo）
 * lsof -nP -iTCP -sTCP:ESTABLISHED
 */
export async function GET() {
  try {
    const { stdout } = await execp("lsof -nP -iTCP -sTCP:ESTABLISHED", { maxBuffer: 4 * 1024 * 1024 });
    const lines = stdout.split("\n").slice(1).filter(Boolean);
    const conns: Connection[] = [];
    for (const line of lines) {
      const cols = line.trim().split(/\s+/);
      if (cols.length < 9) continue;
      const command = cols[0];
      const pid = Number(cols[1]);
      const name = cols.slice(8).join(" ");
      // NAME e.g. 192.168.1.5:54321->142.250.80.46:443 (ESTABLISHED)
      const m = name.match(/(.+):(\d+)->(.+):(\d+)\s*\(([^)]+)\)/);
      if (!m) continue;
      conns.push({
        protocol: "TCP",
        localAddr: m[1],
        localPort: Number(m[2]),
        remoteAddr: m[3],
        remotePort: Number(m[4]),
        state: m[5],
        pid,
        process: command,
      });
    }
    return NextResponse.json({ ok: true, count: conns.length, connections: conns });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
