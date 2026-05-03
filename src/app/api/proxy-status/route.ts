import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execp = promisify(exec);

export const dynamic = "force-dynamic";

/**
 * 读取 macOS 系统代理设置 (scutil --proxy)
 */
async function getMacProxy() {
  try {
    const { stdout } = await execp("scutil --proxy");
    const lines = stdout.split("\n");
    const obj: Record<string, string> = {};
    for (const line of lines) {
      const m = line.match(/^\s*(\w+)\s*:\s*(.+)$/);
      if (m) obj[m[1]] = m[2].trim();
    }
    return obj;
  } catch {
    return null;
  }
}

function readEnv() {
  const keys = ["http_proxy", "https_proxy", "all_proxy", "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "NO_PROXY", "no_proxy"];
  const env: Record<string, string> = {};
  for (const k of keys) if (process.env[k]) env[k] = process.env[k]!;
  return env;
}

export async function GET() {
  const sys = await getMacProxy();
  const env = readEnv();

  // 简单提取摘要
  const summary = {
    httpEnabled: sys?.HTTPEnable === "1",
    httpHost: sys?.HTTPProxy ?? null,
    httpPort: sys?.HTTPPort ?? null,
    httpsEnabled: sys?.HTTPSEnable === "1",
    httpsHost: sys?.HTTPSProxy ?? null,
    httpsPort: sys?.HTTPSPort ?? null,
    socksEnabled: sys?.SOCKSEnable === "1",
    socksHost: sys?.SOCKSProxy ?? null,
    socksPort: sys?.SOCKSPort ?? null,
  };

  return NextResponse.json({ ok: true, summary, raw: sys, env });
}
