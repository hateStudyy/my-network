"use client";

import { useEffect, useMemo, useState } from "react";
import { explainPort } from "@/lib/port-info";

type Conn = {
  protocol: string;
  localAddr: string;
  localPort: number;
  remoteAddr: string;
  remotePort: number;
  state: string;
  pid: number;
  process: string;
};

export default function SniffPage() {
  const [conns, setConns] = useState<Conn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Conn | null>(null);

  async function load() {
    try {
      const r = await fetch("/api/connections", { cache: "no-store" });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error);
      setConns(d.connections);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return conns;
    const f = filter.toLowerCase();
    return conns.filter(
      (c) =>
        c.process.toLowerCase().includes(f) ||
        c.remoteAddr.includes(f) ||
        c.remotePort.toString().includes(f) ||
        c.localPort.toString().includes(f),
    );
  }, [conns, filter]);

  const procStats = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of conns) m[c.process] = (m[c.process] ?? 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [conns]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-accent font-mono text-sm mb-2">// module 03</p>
        <h1 className="text-3xl font-bold mb-2">抓包实验室</h1>
        <p className="text-muted text-sm">
          实时显示本机所有已建立的 TCP 连接（每 2 秒刷新）。
          展示了"谁在和谁通信"——你的每一个进程正在和互联网上的哪些 IP:Port 维持连接。
        </p>
      </div>

      <div className="card p-4 mb-4 bg-yellow-500/5 border-yellow-500/30">
        <div className="text-sm">
          <span className="text-yellow-400 font-semibold">📌 关于"完全抓包"</span>
          <p className="text-muted mt-1 leading-relaxed">
            完整的字节级抓包（解析 HTTP 头、TLS、DNS 报文）需要 root 权限调用 <code className="text-accent">tcpdump</code> /
            <code className="text-accent">pcap</code>。这是 MVP 的基础版，展示了当前所有"活的连接"以及它们的进程归属。
            完整抓包将作为 v2 功能。
          </p>
        </div>
      </div>

      {/* 进程统计 */}
      <div className="card p-4 mb-4">
        <div className="text-xs text-muted mb-2">活跃连接最多的进程 TOP 8</div>
        <div className="flex flex-wrap gap-2">
          {procStats.map(([proc, n]) => (
            <span key={proc} className="chip" style={{ borderColor: "#00ffd1" }}>
              {proc} <span className="text-accent ml-1">{n}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="按进程、远程 IP、端口过滤..."
          className="flex-1 bg-panel border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button onClick={load} className="px-4 py-2 bg-panel border border-border rounded-md text-sm hover:border-accent hover:text-accent">
          手动刷新
        </button>
      </div>

      {error && <div className="card p-4 mb-4 border-red-500/50 text-red-400 text-sm">错误: {error}</div>}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead className="bg-panel border-b border-border text-muted">
              <tr>
                <th className="text-left px-3 py-2">进程</th>
                <th className="text-left px-3 py-2">本地</th>
                <th className="text-left px-3 py-2"></th>
                <th className="text-left px-3 py-2">远程</th>
                <th className="text-left px-3 py-2">服务</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-muted">暂无活动连接</td></tr>
              ) : (
                filtered.map((c, i) => {
                  const info = explainPort(c.remotePort);
                  const active = selected === c;
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelected(c)}
                      className={`border-b border-border hover:bg-panel cursor-pointer ${active ? "bg-panel" : ""}`}
                    >
                      <td className="px-3 py-2">{c.process}<span className="text-muted ml-1">({c.pid})</span></td>
                      <td className="px-3 py-2 text-muted">:{c.localPort}</td>
                      <td className="px-3 py-2 text-accent">→</td>
                      <td className="px-3 py-2">{c.remoteAddr}:<span className="text-accent">{c.remotePort}</span></td>
                      <td className="px-3 py-2 text-muted">{info?.name ?? "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="card p-5 h-fit sticky top-20">
          {selected ? <ConnDetail c={selected} /> : <div className="text-sm text-muted">点击一行查看连接详情。</div>}
        </div>
      </div>

      <div className="mt-8 card p-5 text-sm leading-relaxed">
        <h3 className="font-semibold mb-2">📚 一个 TCP 连接的"四元组"</h3>
        <p className="text-muted mb-2">每一条 TCP 连接由 4 个值唯一标识:</p>
        <pre className="bg-bg border border-border rounded-md p-3 font-mono text-accent">
{`(本地IP, 本地端口, 远程IP, 远程端口)`}
        </pre>
        <p className="text-muted mt-3">
          这就是为什么你可以同时打开 100 个浏览器标签页——每个连接的"本地端口"不同，操作系统能区分开。
          你看到的每一行，就是一个独立的"对话通道"。
        </p>
      </div>
    </div>
  );
}

function ConnDetail({ c }: { c: Conn }) {
  const info = explainPort(c.remotePort);
  return (
    <div>
      <div className="text-xs text-muted mb-1">进程</div>
      <div className="font-semibold mb-3">{c.process} <span className="text-muted text-xs">PID {c.pid}</span></div>

      <div className="bg-bg border border-border rounded-md p-3 font-mono text-xs space-y-2">
        <div>
          <span className="text-muted">本地</span>{"  "}
          <span className="text-accent">{c.localAddr}:{c.localPort}</span>
        </div>
        <div className="text-accent2">↓</div>
        <div>
          <span className="text-muted">远程</span>{"  "}
          <span className="text-accent">{c.remoteAddr}:{c.remotePort}</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted">远程端口推测</div>
      <div className="text-sm font-medium mb-1">{info?.name ?? "未知服务"}</div>
      <p className="text-xs text-muted leading-relaxed">{info?.desc ?? "—"}</p>

      <div className="mt-4 pt-3 border-t border-border text-xs flex justify-between">
        <span className="text-muted">状态</span>
        <span className="font-mono text-accent">{c.state}</span>
      </div>
    </div>
  );
}
