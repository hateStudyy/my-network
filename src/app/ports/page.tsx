"use client";

import { useEffect, useMemo, useState } from "react";
import { explainPort, CATEGORY_LABEL, CATEGORY_COLOR, type PortInfo } from "@/lib/port-info";

type PortRow = {
  protocol: string;
  port: number;
  address: string;
  pid: number;
  process: string;
  user: string;
};

export default function PortsPage() {
  const [rows, setRows] = useState<PortRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<PortRow | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/ports", { cache: "no-store" });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error);
      setRows(data.ports);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return rows;
    const f = filter.toLowerCase();
    return rows.filter(
      (r) =>
        r.port.toString().includes(f) ||
        r.process.toLowerCase().includes(f) ||
        r.protocol.toLowerCase().includes(f) ||
        r.address.toLowerCase().includes(f),
    );
  }, [rows, filter]);

  const stats = useMemo(() => {
    const cats: Record<string, number> = {};
    for (const r of rows) {
      const info = explainPort(r.port);
      const c = info?.category ?? "other";
      cats[c] = (cats[c] ?? 0) + 1;
    }
    return cats;
  }, [rows]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-accent font-mono text-sm mb-2">// module 01</p>
        <h1 className="text-3xl font-bold mb-2">本地端口监控</h1>
        <p className="text-muted text-sm">
          实时读取本机所有正在监听的端口，并解释每个端口的用途。每 5 秒自动刷新。
        </p>
      </div>

      {/* 统计 */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm text-muted mr-2">共 <span className="text-accent font-mono">{rows.length}</span> 个监听端口</span>
          {Object.entries(stats).map(([cat, n]) => (
            <span key={cat} className="chip" style={{ borderColor: CATEGORY_COLOR[cat as PortInfo["category"]] }}>
              <span className="w-2 h-2 rounded-full mr-1.5" style={{ background: CATEGORY_COLOR[cat as PortInfo["category"]] }} />
              {CATEGORY_LABEL[cat as PortInfo["category"]]} {n}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="按端口、进程、协议、地址过滤..."
          className="flex-1 bg-panel border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button onClick={load} className="px-4 py-2 bg-panel border border-border rounded-md text-sm hover:border-accent hover:text-accent">
          刷新
        </button>
      </div>

      {error && <div className="card p-4 mb-4 border-red-500/50 text-red-400 text-sm">错误: {error}</div>}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead className="bg-panel border-b border-border text-xs text-muted">
              <tr>
                <th className="text-left px-3 py-2">协议</th>
                <th className="text-left px-3 py-2">端口</th>
                <th className="text-left px-3 py-2">监听地址</th>
                <th className="text-left px-3 py-2">进程</th>
                <th className="text-left px-3 py-2">PID</th>
                <th className="text-left px-3 py-2">用途</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">加载中...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">没有匹配的端口</td></tr>
              ) : (
                filtered.map((r) => {
                  const info = explainPort(r.port);
                  const color = CATEGORY_COLOR[info?.category ?? "other"];
                  const active = selected?.pid === r.pid && selected?.port === r.port && selected?.protocol === r.protocol;
                  return (
                    <tr
                      key={`${r.protocol}-${r.port}-${r.pid}`}
                      onClick={() => setSelected(r)}
                      className={`border-b border-border hover:bg-panel cursor-pointer ${active ? "bg-panel" : ""}`}
                    >
                      <td className="px-3 py-2"><span className="chip">{r.protocol}</span></td>
                      <td className="px-3 py-2 text-accent">{r.port}</td>
                      <td className="px-3 py-2 text-muted">{r.address}</td>
                      <td className="px-3 py-2">{r.process}</td>
                      <td className="px-3 py-2 text-muted">{r.pid}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                          {info?.name ?? "未知"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 详情面板 */}
        <div className="card p-5 h-fit sticky top-20">
          {selected ? (
            <PortDetail row={selected} />
          ) : (
            <div className="text-sm text-muted">点击左侧任意一行查看详情。</div>
          )}
        </div>
      </div>

      <div className="mt-8 card p-5 text-sm text-muted leading-relaxed">
        <h3 className="text-white font-semibold mb-2">关于端口的小知识</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><b>0–1023 知名端口（Well-Known）</b>：HTTP/SSH 等核心服务，监听需 root 权限。</li>
          <li><b>1024–49151 注册端口（Registered）</b>：第三方应用申请使用，比如 MySQL 3306。</li>
          <li><b>49152–65535 临时端口（Ephemeral）</b>：操作系统分配给客户端发起连接时使用。</li>
          <li>一个端口本身没有"功能"——是监听它的进程决定了它的用途。常见端口的用途只是约定俗成。</li>
        </ul>
      </div>
    </div>
  );
}

function PortDetail({ row }: { row: PortRow }) {
  const info = explainPort(row.port);
  const color = CATEGORY_COLOR[info?.category ?? "other"];
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-3 h-3 rounded-full" style={{ background: color }} />
        <span className="font-mono text-2xl text-accent">{row.port}</span>
        <span className="chip">{row.protocol}</span>
      </div>
      <div className="text-xs text-muted mb-1">服务</div>
      <div className="text-base font-semibold mb-3">{info?.name ?? "未知服务"}</div>

      <div className="text-xs text-muted mb-1">说明</div>
      <p className="text-sm leading-relaxed mb-4">{info?.desc ?? "未在知识库中收录的端口。"}</p>

      <div className="border-t border-border pt-3 space-y-2 text-xs">
        <div className="flex justify-between"><span className="text-muted">监听地址</span><span className="font-mono">{row.address}</span></div>
        <div className="flex justify-between"><span className="text-muted">进程</span><span className="font-mono">{row.process}</span></div>
        <div className="flex justify-between"><span className="text-muted">PID</span><span className="font-mono">{row.pid}</span></div>
        <div className="flex justify-between"><span className="text-muted">用户</span><span className="font-mono">{row.user}</span></div>
      </div>

      <div className="mt-4 pt-3 border-t border-border text-xs text-muted">
        监听地址 <code className="text-accent">*</code> 或 <code className="text-accent">0.0.0.0</code> 表示对所有网卡开放（外部可访问）；
        <code className="text-accent">127.0.0.1</code> 仅本机可访问。
      </div>
    </div>
  );
}
