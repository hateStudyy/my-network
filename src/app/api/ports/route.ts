import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execp = promisify(exec);

export const dynamic = "force-dynamic";

export type PortRow = {
  protocol: string;     // TCP / UDP
  port: number;         // 本地监听端口
  address: string;      // 监听地址 (e.g. *, 127.0.0.1, ::1)
  pid: number;
  process: string;      // 进程命令名
  user: string;
};

/**
 * 调用 macOS / Linux 的 lsof 来获取所有监听端口。
 * 命令: lsof -nP -iTCP -sTCP:LISTEN  +  lsof -nP -iUDP
 *  -n 不解析 hostname；-P 不转换端口为服务名（保留数字）
 */
async function getListeningPorts(): Promise<PortRow[]> {
  const rows: PortRow[] = [];

  const runs = [
    { cmd: "lsof -nP -iTCP -sTCP:LISTEN", proto: "TCP" },
    { cmd: "lsof -nP -iUDP", proto: "UDP" },
  ];

  for (const { cmd, proto } of runs) {
    try {
      const { stdout } = await execp(cmd, { maxBuffer: 4 * 1024 * 1024 });
      const lines = stdout.split("\n").slice(1).filter(Boolean);
      for (const line of lines) {
        // lsof 列: COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
        const cols = line.trim().split(/\s+/);
        if (cols.length < 9) continue;
        const command = cols[0];
        const pid = Number(cols[1]);
        const user = cols[2];
        const name = cols.slice(8).join(" "); // NAME 字段可能含空格

        // NAME 形如: *:3000 (LISTEN), 127.0.0.1:6379, [::1]:5432
        const m = name.match(/(.+):(\d+)(?:\s|$)/);
        if (!m) continue;
        const address = m[1];
        const port = Number(m[2]);
        if (!port) continue;
        rows.push({ protocol: proto, port, address, pid, process: command, user });
      }
    } catch (err: any) {
      // 失败也继续，不阻塞
      console.error(`lsof error (${proto}):`, err?.message);
    }
  }

  // 去重: 同一 (proto, port, pid) 视为一条
  const seen = new Set<string>();
  return rows.filter((r) => {
    const k = `${r.protocol}:${r.port}:${r.pid}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export async function GET() {
  try {
    const ports = await getListeningPorts();
    ports.sort((a, b) => a.port - b.port);
    return NextResponse.json({ ok: true, count: ports.length, ports });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
