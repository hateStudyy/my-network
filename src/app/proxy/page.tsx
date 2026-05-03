"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Tab = "http" | "socks" | "ss" | "v2ray" | "wg" | "tor";

const TABS: { id: Tab; label: string; subtitle: string }[] = [
  { id: "http", label: "HTTP 代理", subtitle: "最简单的代理" },
  { id: "socks", label: "SOCKS5", subtitle: "通用协议代理" },
  { id: "ss", label: "Shadowsocks", subtitle: "加密混淆" },
  { id: "v2ray", label: "V2Ray / VMess", subtitle: "动态多协议" },
  { id: "wg", label: "WireGuard VPN", subtitle: "全流量隧道" },
  { id: "tor", label: "Tor", subtitle: "三层洋葱路由" },
];

export default function ProxyPage() {
  const [tab, setTab] = useState<Tab>("http");
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/proxy-status").then((r) => r.json()).then(setStatus).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-accent font-mono text-sm mb-2">// module 04</p>
        <h1 className="text-3xl font-bold mb-2">代理 · VPN · 翻墙原理</h1>
        <p className="text-muted text-sm">从最朴素的 HTTP 代理到对抗 DPI 的 V2Ray，逐个看清楚翻墙工具到底做了什么。</p>
      </div>

      {/* 当前系统代理状态 */}
      <SystemProxyCard status={status?.summary} env={status?.env} />

      {/* Tab 切换 */}
      <div className="flex flex-wrap gap-2 mt-6 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm border transition-colors ${
              tab === t.id ? "bg-accent text-bg border-accent" : "bg-panel border-border hover:border-accent"
            }`}
          >
            <div className="font-medium">{t.label}</div>
            <div className={`text-xs mt-0.5 ${tab === t.id ? "text-bg/70" : "text-muted"}`}>{t.subtitle}</div>
          </button>
        ))}
      </div>

      <div className="card p-6">
        {tab === "http" && <HttpProxy />}
        {tab === "socks" && <SocksProxy />}
        {tab === "ss" && <Shadowsocks />}
        {tab === "v2ray" && <V2Ray />}
        {tab === "wg" && <WireGuard />}
        {tab === "tor" && <Tor />}
      </div>

      <div className="mt-8 card p-5 text-sm leading-relaxed">
        <h3 className="font-semibold mb-3">🧠 翻墙的本质</h3>
        <p className="text-muted mb-2">所有翻墙工具的共同点都是：<span className="text-accent">"借一个能访问目标的服务器作为中转"</span>。区别只在于：</p>
        <ul className="text-muted list-disc list-inside space-y-1">
          <li><b className="text-white">流量走在第几层</b>：HTTP（应用层）/ SOCKS（会话层）/ VPN（网络层）</li>
          <li><b className="text-white">是否加密</b>：HTTP/SOCKS 默认不加密，SS/V2Ray/VPN 加密</li>
          <li><b className="text-white">是否伪装</b>：能不能让 DPI 误以为是普通 HTTPS 流量（V2Ray 的 WS+TLS）</li>
          <li><b className="text-white">协议是否动态</b>：能不能频繁换密码/端口（VMess / Trojan）</li>
        </ul>
      </div>
    </div>
  );
}

function SystemProxyCard({ status, env }: any) {
  if (!status) return null;
  const anyOn = status.httpEnabled || status.httpsEnabled || status.socksEnabled;
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${anyOn ? "bg-accent animate-pulse" : "bg-muted"}`} />
        <span className="font-semibold">当前系统代理</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <ProxyCell on={status.httpEnabled} label="HTTP" host={status.httpHost} port={status.httpPort} />
        <ProxyCell on={status.httpsEnabled} label="HTTPS" host={status.httpsHost} port={status.httpsPort} />
        <ProxyCell on={status.socksEnabled} label="SOCKS" host={status.socksHost} port={status.socksPort} />
      </div>
      {env && Object.keys(env).length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-muted mb-2">环境变量代理</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(env).map(([k, v]) => (
              <span key={k} className="chip font-mono text-[10px]">{k}=<span className="text-accent ml-0.5">{String(v)}</span></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProxyCell({ on, label, host, port }: any) {
  return (
    <div className={`p-3 rounded-md border ${on ? "border-accent bg-accent/5" : "border-border bg-panel"}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm">{label}</span>
        <span className={`text-xs ${on ? "text-accent" : "text-muted"}`}>{on ? "开启" : "关闭"}</span>
      </div>
      <div className="font-mono text-xs text-muted">{on ? `${host}:${port}` : "—"}</div>
    </div>
  );
}

/* ============ 各个图解 ============ */

function FlowDiagram({ nodes, color = "#00ffd1" }: { nodes: { label: string; sub?: string; icon?: string }[]; color?: string }) {
  const W = 920;
  const stepX = (W - 120) / (nodes.length - 1);
  return (
    <svg viewBox={`0 0 ${W} 200`} className="w-full h-[200px] mb-4">
      {nodes.slice(0, -1).map((_, i) => (
        <line key={i} x1={60 + i * stepX} y1={100} x2={60 + (i + 1) * stepX} y2={100} stroke="#1f2a3a" strokeWidth={2} />
      ))}

      {/* 流动的小球 */}
      {nodes.slice(0, -1).map((_, i) => (
        <motion.circle
          key={`d-${i}`}
          r={5}
          fill={color}
          animate={{ cx: [60 + i * stepX, 60 + (i + 1) * stepX], cy: 100 }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
        />
      ))}

      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={60 + i * stepX} cy={100} r={28} fill="#0f1520" stroke={color} strokeWidth={1.5} />
          <text x={60 + i * stepX} y={107} textAnchor="middle" fontSize="22">{n.icon ?? "▮"}</text>
          <text x={60 + i * stepX} y={150} textAnchor="middle" fill="#e6edf6" fontSize="12" fontFamily="ui-monospace" fontWeight="bold">
            {n.label}
          </text>
          {n.sub && (
            <text x={60 + i * stepX} y={166} textAnchor="middle" fill="#7a8aa3" fontSize="10" fontFamily="ui-monospace">
              {n.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function HttpProxy() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">HTTP 代理</h2>
      <p className="text-muted text-sm mb-4">最古老最简单的代理：客户端把"我要访问 X"明文告诉代理，代理替你访问。</p>
      <FlowDiagram nodes={[
        { label: "你的浏览器", sub: "GET http://x.com", icon: "💻" },
        { label: "HTTP 代理", sub: ":8080", icon: "📨" },
        { label: "目标网站", sub: "x.com:80", icon: "🌍" },
      ]} />
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="card p-4 bg-bg">
          <div className="text-accent font-semibold mb-2">特点</div>
          <ul className="text-muted space-y-1 list-disc list-inside">
            <li>只能代理 HTTP / HTTPS（不能代理任意 TCP）</li>
            <li>不加密，代理服务器能看到所有内容（HTTPS 仅看到 SNI）</li>
            <li>配置简单，浏览器原生支持</li>
          </ul>
        </div>
        <div className="card p-4 bg-bg">
          <div className="text-accent2 font-semibold mb-2">为什么不能翻墙</div>
          <p className="text-muted">代理本身明文可识别，特征明显，会被防火墙直接掐掉。只在企业内网过滤等场景使用。</p>
        </div>
      </div>
    </div>
  );
}

function SocksProxy() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">SOCKS5 代理</h2>
      <p className="text-muted text-sm mb-4">不关心应用层协议，把任意 TCP/UDP 流量原样转发。是 Shadowsocks/V2Ray 的客户端入口。</p>
      <FlowDiagram nodes={[
        { label: "任意应用", sub: "TCP / UDP", icon: "📱" },
        { label: "SOCKS5 代理", sub: ":1080", icon: "🔁" },
        { label: "目标服务器", icon: "🌍" },
      ]} color="#bd93f9" />
      <div className="card p-4 bg-bg text-sm">
        <div className="text-accent font-semibold mb-2">vs HTTP 代理</div>
        <p className="text-muted">SOCKS 是"协议无关"的——SSH、游戏、SMTP 都能走。但同样不加密。它的真正威力在于：本地的 SS/V2Ray 客户端会监听一个 SOCKS5 端口给系统用，再把流量加密后发到远程。</p>
      </div>
    </div>
  );
}

function Shadowsocks() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Shadowsocks</h2>
      <p className="text-muted text-sm mb-4">出生于 2012 年的中国，把 SOCKS5 + 一层对称加密做成"看起来像随机字节流"的协议。</p>
      <FlowDiagram nodes={[
        { label: "应用", icon: "📱" },
        { label: "SS 客户端", sub: "本地 :1080", icon: "🔐" },
        { label: "GFW", sub: "看到加密流", icon: "🧱" },
        { label: "SS 服务器", sub: "海外", icon: "🛰️" },
        { label: "Google", icon: "🌍" },
      ]} color="#ff5dcd" />
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="card p-4 bg-bg">
          <div className="text-accent font-semibold mb-2">关键创新</div>
          <ul className="text-muted space-y-1 list-disc list-inside">
            <li>对称密钥加密，没有 TLS 握手特征</li>
            <li>整个连接看起来是"无规律的字节流"</li>
            <li>客户端在本地起 SOCKS5，让所有 App 透明使用</li>
          </ul>
        </div>
        <div className="card p-4 bg-bg">
          <div className="text-accent2 font-semibold mb-2">为什么后来不够用</div>
          <p className="text-muted">DPI 后来学会了"主动探测"——向疑似 SS 端口发探测包看响应行为。SS 端口被频繁封禁，于是有了 SS 的各种插件（v2ray-plugin、obfs）和 V2Ray。</p>
        </div>
      </div>
    </div>
  );
}

function V2Ray() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">V2Ray (VMess / VLESS / Trojan)</h2>
      <p className="text-muted text-sm mb-4">不是单一协议，而是一个代理框架。常用配置: VMess + WebSocket + TLS + CDN，让流量看起来"和访问任何 https 网站一样"。</p>
      <FlowDiagram nodes={[
        { label: "应用", icon: "📱" },
        { label: "V2Ray 客户端", sub: "封装+加密", icon: "🧬" },
        { label: "GFW", sub: "看到 HTTPS", icon: "🧱" },
        { label: "Cloudflare CDN", sub: "443 中转", icon: "☁️" },
        { label: "V2Ray 服务器", icon: "🛰️" },
        { label: "目标", icon: "🌍" },
      ]} color="#50fa7b" />
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="card p-4 bg-bg">
          <div className="text-accent font-semibold mb-2">伪装层叠加</div>
          <ol className="text-muted space-y-1 list-decimal list-inside">
            <li>VMess 加密（动态 ID、抗重放）</li>
            <li>外面套 WebSocket 协议（看起来像 WS 长连接）</li>
            <li>外面套 TLS（看起来像 https 网站）</li>
            <li>走 CDN（IP 是 Cloudflare 的，封不胜封）</li>
          </ol>
        </div>
        <div className="card p-4 bg-bg">
          <div className="text-accent2 font-semibold mb-2">DPI 视角</div>
          <p className="text-muted">防火墙只能看到："你和 cloudflare.com 建立了一个 HTTPS 长连接，发了一些加密字节"。这和访问任何 SaaS 应用没有区别。</p>
        </div>
      </div>
    </div>
  );
}

function WireGuard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">WireGuard VPN</h2>
      <p className="text-muted text-sm mb-4">VPN 工作在网络层（L3），创建一个虚拟网卡，所有 IP 包都被加密后发到对端服务器。</p>
      <FlowDiagram nodes={[
        { label: "整个系统", sub: "所有应用", icon: "🖥️" },
        { label: "wg0 虚拟网卡", sub: "10.0.0.2", icon: "🛜" },
        { label: "WG 隧道", sub: "UDP/51820", icon: "🚇" },
        { label: "VPN 服务器", sub: "海外", icon: "🛰️" },
        { label: "互联网", icon: "🌍" },
      ]} color="#8be9fd" />
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="card p-4 bg-bg">
          <div className="text-accent font-semibold mb-2">VPN vs 代理</div>
          <ul className="text-muted space-y-1 list-disc list-inside">
            <li>VPN 接管整个系统的网络（哪怕是 ping）</li>
            <li>代理只代理特定协议或被配置的应用</li>
            <li>VPN 在 L3，代理在 L5+</li>
          </ul>
        </div>
        <div className="card p-4 bg-bg">
          <div className="text-accent2 font-semibold mb-2">为什么 WG 不太适合翻墙</div>
          <p className="text-muted">WireGuard 是定长 UDP 包，特征非常明显——GFW 一眼就能识别并封锁。WG 在企业 VPN、个人异地组网（Tailscale）场景大放异彩，但在审查环境下需要额外混淆层。</p>
        </div>
      </div>
    </div>
  );
}

function Tor() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Tor 洋葱路由</h2>
      <p className="text-muted text-sm mb-4">为隐私而生，不为速度而生。流量经过三个志愿者节点逐层解密，没有任何一个节点同时知道"你是谁"和"你访问了什么"。</p>
      <FlowDiagram nodes={[
        { label: "你", icon: "💻" },
        { label: "Guard 入口节点", sub: "知道你的 IP", icon: "🧅" },
        { label: "中继节点", sub: "什么都不知道", icon: "🧅" },
        { label: "Exit 出口节点", sub: "知道目标", icon: "🧅" },
        { label: "目标网站", icon: "🌍" },
      ]} color="#ffb86c" />
      <div className="card p-4 bg-bg text-sm">
        <div className="text-accent font-semibold mb-2">三层加密的精妙</div>
        <p className="text-muted">客户端用 3 层公钥逐层加密：最外层只 Guard 能解，中间只 Relay 能解，最内层只 Exit 能解。每个节点只能解开自己那一层，知道"上一跳"和"下一跳"，但不知道完整链路。这就是匿名的来源。</p>
      </div>
    </div>
  );
}
