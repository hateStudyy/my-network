"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  id: number;
  title: string;
  layer: string;
  detail: string;
  hex?: string;
};

const STEPS: Step[] = [
  {
    id: 0,
    title: "你在浏览器输入 https://example.com",
    layer: "应用层 / 用户",
    detail: "浏览器需要向 example.com 的服务器请求一个 HTML 页面。但它现在还不知道 example.com 在哪里，也没有连接。",
  },
  {
    id: 1,
    title: "DNS 查询：example.com 是哪个 IP？",
    layer: "应用层 (DNS, UDP/53)",
    detail: "浏览器先查本地缓存 → 操作系统缓存 → 路由器 → ISP 的 DNS 服务器。最终拿到 IP，比如 93.184.216.34。",
    hex: "Q: example.com IN A?  →  A: example.com = 93.184.216.34",
  },
  {
    id: 2,
    title: "TCP 三次握手：建立连接",
    layer: "传输层 (TCP)",
    detail: "客户端 SYN → 服务端 SYN+ACK → 客户端 ACK。三步之后双方都确认对方在线、可以收发数据。",
    hex: "→ SYN seq=1000\n← SYN+ACK seq=2000 ack=1001\n→ ACK ack=2001",
  },
  {
    id: 3,
    title: "TLS 握手：协商加密",
    layer: "表示层 (TLS 1.3)",
    detail: "客户端发 ClientHello（支持的加密套件） → 服务端发 ServerHello + 证书 → 双方派生出会话密钥。从此通信全部加密。",
    hex: "→ ClientHello (ciphers, key share)\n← ServerHello + Certificate + Finished\n→ Finished",
  },
  {
    id: 4,
    title: "发送 HTTP 请求",
    layer: "应用层 (HTTP/2 over TLS)",
    detail: "终于可以发真正的请求了。但其实它被 TLS 加密、被 TCP 分段、被 IP 包裹、被以太网帧封装一层一层往下送。",
    hex: "GET / HTTP/2\nHost: example.com\nUser-Agent: ...",
  },
  {
    id: 5,
    title: "数据包逐跳穿越互联网",
    layer: "网络层 (IP) + 数据链路层",
    detail: "包从你的电脑 → 路由器 → ISP → 骨干网 → 目标 ISP → 目标服务器。每经过一跳，TTL 减 1，MAC 地址会变，但源/目标 IP 不变。",
  },
  {
    id: 6,
    title: "服务器响应 HTML",
    layer: "应用层 (HTTP)",
    detail: "服务器收到请求，回 200 OK + HTML 内容。响应也走相同的反向路径。",
    hex: "HTTP/2 200 OK\nContent-Type: text/html\n\n<!doctype html>...",
  },
  {
    id: 7,
    title: "浏览器渲染页面",
    layer: "应用层 / 用户",
    detail: "解析 HTML、加载 CSS/JS/图片（每一个又是一次类似的请求）、构建 DOM、布局、绘制。你看到了网页。",
  },
];

const LAYERS = [
  { name: "应用层", desc: "HTTP / DNS / WebSocket", color: "#00ffd1" },
  { name: "表示层", desc: "TLS 加密", color: "#ff5dcd" },
  { name: "传输层", desc: "TCP / UDP", color: "#bd93f9" },
  { name: "网络层", desc: "IP / 路由", color: "#8be9fd" },
  { name: "数据链路层", desc: "Ethernet / WiFi 帧", color: "#50fa7b" },
  { name: "物理层", desc: "电信号 / 光信号 / 无线电", color: "#ffb86c" },
];

export default function JourneyPage() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 3500);
    return () => clearInterval(id);
  }, [auto]);

  const cur = STEPS[step];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-accent font-mono text-sm mb-2">// module 02</p>
        <h1 className="text-3xl font-bold mb-2">一个网络包的旅行</h1>
        <p className="text-muted text-sm">从你按下回车，到网页出现在屏幕上，发生了什么？跟着包走一遍。</p>
      </div>

      {/* 动画区域 */}
      <div className="card p-8 mb-6 relative overflow-hidden" style={{ minHeight: 280 }}>
        <Stage step={step} />
      </div>

      {/* 步骤详情 */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={cur.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-accent">step {String(step + 1).padStart(2, "0")} / {STEPS.length}</span>
                <span className="chip">{cur.layer}</span>
              </div>
              <h2 className="text-xl font-bold mb-3">{cur.title}</h2>
              <p className="text-muted leading-relaxed mb-3">{cur.detail}</p>
              {cur.hex && (
                <pre className="bg-bg border border-border rounded-md p-3 text-xs font-mono text-accent whitespace-pre-wrap">
                  {cur.hex}
                </pre>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-3 text-muted">OSI 七层模型</h3>
          <div className="space-y-1.5">
            {LAYERS.map((l) => {
              const active = cur.layer.includes(l.name);
              return (
                <div
                  key={l.name}
                  className="flex items-center justify-between text-xs px-2 py-1.5 rounded transition-all"
                  style={{
                    background: active ? `${l.color}15` : "transparent",
                    border: `1px solid ${active ? l.color : "transparent"}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className={active ? "text-white font-medium" : "text-muted"}>{l.name}</span>
                  </div>
                  <span className="text-muted font-mono text-[10px]">{l.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 控制 */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-panel border border-border rounded-md text-sm hover:border-accent disabled:opacity-30"
        >
          ← 上一步
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="px-4 py-2 bg-panel border border-border rounded-md text-sm hover:border-accent disabled:opacity-30"
        >
          下一步 →
        </button>
        <button
          onClick={() => setAuto((a) => !a)}
          className={`px-4 py-2 rounded-md text-sm border ${auto ? "bg-accent text-bg border-accent" : "bg-panel border-border hover:border-accent"}`}
        >
          {auto ? "■ 暂停自动播放" : "▶ 自动播放"}
        </button>
        <div className="ml-auto flex gap-1">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="w-7 h-7 rounded-md text-xs font-mono transition-colors"
              style={{
                background: i === step ? "#00ffd1" : "#0f1520",
                color: i === step ? "#0a0e14" : "#7a8aa3",
                border: `1px solid ${i === step ? "#00ffd1" : "#1f2a3a"}`,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stage({ step }: { step: number }) {
  // 5 个节点：你的电脑、家用路由器、ISP、骨干网、目标服务器
  const nodes = [
    { x: 60, label: "你", icon: "💻" },
    { x: 260, label: "家用路由", icon: "🛜" },
    { x: 460, label: "ISP", icon: "🏢" },
    { x: 660, label: "骨干网", icon: "🌐" },
    { x: 860, label: "服务器", icon: "🖥️" },
  ];

  // 包的位置由 step 决定
  // 0=DNS@you, 1=DNS往返, 2=TCP三次握手, 3=TLS, 4=req, 5=穿越, 6=resp, 7=arrived
  const pktPos: Record<number, number> = {
    0: 0,
    1: 0.2,
    2: 0.5,
    3: 0.55,
    4: 0.6,
    5: 0.85,
    6: 0.4,
    7: 0,
  };
  const x = 60 + (860 - 60) * (pktPos[step] ?? 0);

  return (
    <svg viewBox="0 0 920 240" className="w-full h-[240px]">
      {/* 连线 */}
      <line x1={60} y1={120} x2={860} y2={120} stroke="#1f2a3a" strokeWidth={2} strokeDasharray="4 4" />

      {/* 节点 */}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={120} r={24} fill="#0f1520" stroke="#1f2a3a" strokeWidth={2} />
          <text x={n.x} y={127} textAnchor="middle" fontSize="20">{n.icon}</text>
          <text x={n.x} y={170} textAnchor="middle" fill="#7a8aa3" fontSize="11" fontFamily="ui-monospace">
            {n.label}
          </text>
        </g>
      ))}

      {/* 数据包 */}
      <motion.g
        animate={{ x, y: step === 5 ? [120, 100, 120, 140, 120] : 120 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <circle r={10} fill="#00ffd1" />
        <circle r={18} fill="#00ffd1" opacity={0.2} />
        <text y={-22} textAnchor="middle" fill="#00ffd1" fontSize="11" fontFamily="ui-monospace">
          PACKET
        </text>
      </motion.g>

      {/* 阶段标签 */}
      <text x={460} y={30} textAnchor="middle" fill="#ff5dcd" fontSize="13" fontFamily="ui-monospace">
        {step === 0 && "等待发送..."}
        {step === 1 && "DNS 查询 → 拿到 IP"}
        {step === 2 && "TCP 三次握手"}
        {step === 3 && "TLS 加密握手"}
        {step === 4 && "发送 HTTP 请求"}
        {step === 5 && "穿越多跳路由..."}
        {step === 6 && "服务器响应 HTML"}
        {step === 7 && "页面已渲染 ✓"}
      </text>
    </svg>
  );
}
