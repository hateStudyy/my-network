"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "compare" | "ports" | "subscription" | "selfhost";

const TABS: { id: Tab; label: string }[] = [
  { id: "compare", label: "三大客户端对比" },
  { id: "ports", label: "为什么只占一个端口" },
  { id: "subscription", label: "订阅链接的秘密" },
  { id: "selfhost", label: "自建翻墙完全指南" },
];

export default function ClientsPage() {
  const [tab, setTab] = useState<Tab>("compare");
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-accent font-mono text-sm mb-2">// module 06</p>
        <h1 className="text-3xl font-bold mb-2">翻墙客户端 · 自建之路</h1>
        <p className="text-muted text-sm">
          Shadowrocket / Clash Verge Rev / v2rayN 到底有什么区别？为什么一个 URL 就能导入几十个节点？
          如果你想完全摆脱机场——自己买 VPS、自己跑服务端，要走多少步？
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm border transition-colors ${
              tab === t.id ? "bg-accent text-bg border-accent" : "bg-panel border-border hover:border-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "compare" && <ClientCompare />}
      {tab === "ports" && <PortsExplain />}
      {tab === "subscription" && <SubscriptionExplain />}
      {tab === "selfhost" && <SelfHost />}
    </div>
  );
}

/* ============ Tab 1: 三大客户端对比 ============ */

const CLIENTS = [
  {
    name: "Shadowrocket",
    platform: "iOS / iPadOS",
    icon: "🚀",
    color: "#00ffd1",
    arch: "iOS NetworkExtension (NEPacketTunnelProvider)",
    architecture: [
      "App 本身只是配置面板 + 节点管理",
      "真正干活的是 iOS 的 NetworkExtension（系统级 VPN 接管）",
      "系统创建一块虚拟网卡 utun，所有 IP 包流入 Tunnel Provider",
      "Tunnel Provider 进程做协议解析（SS / VMess / Trojan / Hy2 / SOCKS5...）",
      "再把流量发到远程节点",
    ],
    pros: [
      "系统级接管，所有 App 都自动走代理（包括微信、抖音等强行不走代理的）",
      "省电、稳定（NEPacketTunnelProvider 由系统调度）",
      "支持几乎所有主流协议",
      "支持订阅、规则分流、按域名/IP 走不同节点",
    ],
    cons: [
      "只能买（区服 App Store），免费版功能受限",
      "Tunnel Provider 内存有上限（24MB），节点过多时会崩",
      "iOS 沙箱限制，不能像桌面那样做花式插件",
    ],
    suit: "你是 iPhone 用户，最稳的选择",
  },
  {
    name: "Clash Verge Rev",
    platform: "macOS / Windows / Linux",
    icon: "🐢",
    color: "#bd93f9",
    arch: "Tauri (Rust) GUI + Mihomo (clash-meta) 内核",
    architecture: [
      "GUI 是 Tauri（Rust）写的壳，体积小、内存占用低",
      "底层是 Mihomo（clash-meta，Go 编写）作为代理内核",
      "Mihomo 同时监听本地 SOCKS5/HTTP/混合 端口",
      "也支持 TUN 模式（创建虚拟网卡，接管全系统流量）",
      "强大的规则引擎：按域名、IP、GEOIP、进程名分流",
    ],
    pros: [
      "完全开源（Verge Rev 是社区维护的活跃 fork）",
      "桌面端最强生态，配置/订阅/规则非常灵活",
      "内置丰富的规则集（geosite、geoip）",
      "TUN 模式可接管全系统，普通模式按需走代理",
    ],
    cons: [
      "学习曲线相对陡，配置文件 YAML 复杂",
      "对小白不太友好（Verge Rev 已经简化很多了）",
    ],
    suit: "你是 macOS / Windows 用户，想要最强大灵活的代理",
  },
  {
    name: "v2rayN",
    platform: "Windows (主) / Linux",
    icon: "🅽",
    color: "#ff5dcd",
    arch: "WPF / Avalonia GUI + xray-core / v2ray-core 内核",
    architecture: [
      "GUI 是 .NET (WPF) 写的，所以传统上只 Windows",
      "新版 v2rayN 用 Avalonia 重写，支持 Linux/macOS",
      "底层调用 xray-core 或 v2ray-core 子进程",
      "也是监听本地端口（默认 SOCKS:10808 / HTTP:10809）",
      "需要配合系统代理或 TUN（v2rayN 的 TUN 模式）使用",
    ],
    pros: [
      "v2ray/xray 官方生态最成熟的客户端之一",
      "对 VMess / VLESS / Reality 等 v2ray 系协议支持最好",
      "免费开源，老牌可信",
    ],
    cons: [
      "界面比较工程师风（信息密度大，对新手不友好）",
      "传统 v2rayN（WPF 版）只有 Windows",
      "默认不接管系统，要手动开系统代理或 TUN",
    ],
    suit: "你是 Windows 用户，且偏好 v2ray/xray 系协议（VLESS+Reality 等）",
  },
];

function ClientCompare() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {CLIENTS.map((c) => (
          <div key={c.name} className="card p-5" style={{ borderColor: c.color + "40" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <div className="font-bold text-lg" style={{ color: c.color }}>{c.name}</div>
                <div className="text-xs text-muted font-mono">{c.platform}</div>
              </div>
            </div>
            <div className="text-xs font-mono text-muted mb-3 pb-3 border-b border-border">{c.arch}</div>

            <div className="text-xs text-muted mb-1">架构 / 工作方式</div>
            <ol className="text-xs space-y-1 list-decimal list-inside mb-4 text-muted">
              {c.architecture.map((a, i) => <li key={i}>{a}</li>)}
            </ol>

            <div className="text-xs text-accent mb-1">优势</div>
            <ul className="text-xs space-y-0.5 list-disc list-inside mb-3">
              {c.pros.map((p, i) => <li key={i} className="text-muted">{p}</li>)}
            </ul>

            <div className="text-xs text-accent2 mb-1">局限</div>
            <ul className="text-xs space-y-0.5 list-disc list-inside mb-3">
              {c.cons.map((p, i) => <li key={i} className="text-muted">{p}</li>)}
            </ul>

            <div className="text-xs pt-3 border-t border-border">
              <span className="text-muted">适合：</span>
              <span className="text-white">{c.suit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3">⚡ 一图看懂三者的本质区别</h3>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted">
            <tr className="border-b border-border">
              <th className="text-left py-2">维度</th>
              <th className="text-left py-2">Shadowrocket</th>
              <th className="text-left py-2">Clash Verge Rev</th>
              <th className="text-left py-2">v2rayN</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            {[
              ["平台", "iOS only", "Mac/Win/Linux", "Win + Avalonia 后跨平台"],
              ["内核", "自研 (闭源)", "Mihomo (Go)", "xray-core / v2ray-core"],
              ["接管方式", "iOS NE (系统级)", "本地端口 + TUN 可选", "本地端口 + TUN 可选"],
              ["默认协议", "SS/VMess/Trojan/Hy2", "全部 + clash 系", "v2ray/xray 系最强"],
              ["开源", "❌", "✅", "✅"],
              ["对新手", "中（要付费）", "中", "工程师友好"],
              ["规则灵活度", "高", "极高", "中"],
            ].map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                {row.map((cell, j) => (
                  <td key={j} className={`py-2 ${j === 0 ? "text-muted" : "text-white"}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ Tab 2: 端口问题 ============ */

function PortsExplain() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-3">问：为什么"网络代理只能占用一个端口"？</h2>
        <p className="text-muted leading-relaxed mb-3">
          这其实是个**误解**。代理软件可以同时监听<span className="text-accent"> 任意多个 </span>本地端口——
          一个 SOCKS5 端口、一个 HTTP 端口、一个混合端口、甚至每个节点单独一个端口都行。
        </p>
        <p className="text-muted leading-relaxed">
          但实际配置上，<span className="text-white">大部分代理软件默认就开 1~2 个本地端口</span>，因为这就够用了：
        </p>
        <ul className="list-disc list-inside text-muted mt-2 space-y-1">
          <li>所有需要走代理的应用，都通过这一个 SOCKS5/HTTP 端口连进来</li>
          <li>代理内部再决定"这个连接要发到哪个节点"</li>
          <li>多开端口反而管理麻烦，没必要</li>
        </ul>
      </div>

      <div className="card p-6">
        <div className="text-xs text-accent font-mono mb-2">// the real picture</div>
        <h3 className="font-semibold mb-4">Clash 默认监听 3 个端口（你是不是没注意？）</h3>
        <pre className="bg-bg border border-border rounded-md p-3 text-xs font-mono text-accent overflow-x-auto mb-3">
{`port: 7890           # HTTP 代理端口
socks-port: 7891     # SOCKS5 端口
mixed-port: 7890     # 混合端口（HTTP + SOCKS5 自动识别）`}
        </pre>
        <p className="text-sm text-muted leading-relaxed">
          再加上 RESTful API（默认 9090）和 TUN 模式（不监听端口而是接管整个网卡），Clash 实际同时"占"了多个端口。
          所谓"一个端口"是<span className="text-accent">用户视角的简化</span>，不是技术限制。
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-3">问：那为什么 Shadowrocket 看起来"没有端口"？</h2>
        <PortFlowDiagram />
        <p className="text-sm text-muted leading-relaxed mt-4">
          因为 Shadowrocket 在 iOS 上根本<span className="text-accent">不靠端口工作</span>。它走的是
          <code className="chip mx-1">NEPacketTunnelProvider</code>
          —— 苹果给 VPN 类 App 的官方接口。
        </p>
        <ol className="list-decimal list-inside text-sm text-muted mt-3 space-y-1.5">
          <li>系统创建一块虚拟网卡（utun0）</li>
          <li>所有 IP 包都流到 Shadowrocket 的 Tunnel Provider 进程</li>
          <li>Provider 拿到原始 IP 包后，按你配的协议（SS/VMess/...）封装加密</li>
          <li>把加密后的数据通过真实网卡发到节点</li>
          <li>返回的数据反向走一遍</li>
        </ol>
        <p className="text-sm text-muted mt-3 leading-relaxed">
          所以你打开 Shadowrocket 时，<span className="text-white">系统通知栏会出现 VPN 标志</span>——
          它是用 VPN 的方式实现代理。这就是为什么所有 App 都自动走代理，包括那些"硬不走代理"的微信、抖音。
        </p>
      </div>

      <div className="card p-6 bg-accent/5 border-accent/30">
        <h3 className="font-semibold mb-2">🧠 终极对比：代理 vs VPN-style 接管</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-accent font-semibold mb-1">代理模式（监听端口）</div>
            <p className="text-muted text-xs leading-relaxed">
              代理软件起一个本地服务（如 :7890）。应用主动"知道用代理"才会走（比如配置浏览器代理、命令行 export http_proxy）。
              简单、轻量，但管不了硬不走代理的应用。
            </p>
          </div>
          <div>
            <div className="text-accent2 font-semibold mb-1">VPN 模式（系统级 / TUN）</div>
            <p className="text-muted text-xs leading-relaxed">
              代理软件创建虚拟网卡，接管所有 IP 包。所有应用"被迫"走代理，连它们自己都不知道。
              强大但需要更高权限（macOS 要 sudo，iOS 用系统 NE 框架）。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortFlowDiagram() {
  return (
    <svg viewBox="0 0 920 220" className="w-full h-[220px]">
      {/* 上方：Clash/v2rayN 模式 */}
      <text x={20} y={20} fill="#7a8aa3" fontSize="12" fontFamily="ui-monospace">[ 桌面端：监听端口模式 ]</text>
      <rect x={20} y={30} width="160" height="50" rx="6" fill="#0f1520" stroke="#bd93f9" />
      <text x={100} y={60} textAnchor="middle" fill="#fff" fontSize="11">浏览器/终端</text>
      <text x={100} y={75} textAnchor="middle" fill="#7a8aa3" fontSize="10">主动配代理</text>

      <motion.line x1={180} y1={55} x2={300} y2={55} stroke="#bd93f9" strokeWidth={1.5} strokeDasharray="4 3" animate={{ strokeDashoffset: [0, -7] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
      <text x={240} y={48} textAnchor="middle" fill="#bd93f9" fontSize="9" fontFamily="ui-monospace">:7890</text>

      <rect x={300} y={30} width="160" height="50" rx="6" fill="#0f1520" stroke="#bd93f9" />
      <text x={380} y={60} textAnchor="middle" fill="#fff" fontSize="11">Clash 监听端口</text>
      <text x={380} y={75} textAnchor="middle" fill="#7a8aa3" fontSize="10">localhost:7890</text>

      <motion.line x1={460} y1={55} x2={580} y2={55} stroke="#bd93f9" strokeWidth={1.5} strokeDasharray="4 3" animate={{ strokeDashoffset: [0, -7] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
      <rect x={580} y={30} width="160" height="50" rx="6" fill="#0f1520" stroke="#bd93f9" />
      <text x={660} y={60} textAnchor="middle" fill="#fff" fontSize="11">远程节点</text>
      <text x={660} y={75} textAnchor="middle" fill="#7a8aa3" fontSize="10">海外</text>

      {/* 下方：Shadowrocket / TUN 模式 */}
      <text x={20} y={120} fill="#7a8aa3" fontSize="12" fontFamily="ui-monospace">[ iOS Shadowrocket：系统级 NE 模式 ]</text>
      <rect x={20} y={130} width="160" height="50" rx="6" fill="#0f1520" stroke="#00ffd1" />
      <text x={100} y={160} textAnchor="middle" fill="#fff" fontSize="11">所有 App</text>
      <text x={100} y={175} textAnchor="middle" fill="#7a8aa3" fontSize="10">无需配置</text>

      <motion.line x1={180} y1={155} x2={300} y2={155} stroke="#00ffd1" strokeWidth={1.5} strokeDasharray="4 3" animate={{ strokeDashoffset: [0, -7] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
      <text x={240} y={148} textAnchor="middle" fill="#00ffd1" fontSize="9" fontFamily="ui-monospace">utun0 (虚拟网卡)</text>

      <rect x={300} y={130} width="160" height="50" rx="6" fill="#0f1520" stroke="#00ffd1" />
      <text x={380} y={160} textAnchor="middle" fill="#fff" fontSize="11">Tunnel Provider</text>
      <text x={380} y={175} textAnchor="middle" fill="#7a8aa3" fontSize="10">Shadowrocket 进程</text>

      <motion.line x1={460} y1={155} x2={580} y2={155} stroke="#00ffd1" strokeWidth={1.5} strokeDasharray="4 3" animate={{ strokeDashoffset: [0, -7] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
      <rect x={580} y={130} width="160" height="50" rx="6" fill="#0f1520" stroke="#00ffd1" />
      <text x={660} y={160} textAnchor="middle" fill="#fff" fontSize="11">远程节点</text>
      <text x={660} y={175} textAnchor="middle" fill="#7a8aa3" fontSize="10">海外</text>
    </svg>
  );
}

/* ============ Tab 3: 订阅链接 ============ */

function SubscriptionExplain() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-3">问：为什么粘贴一个 URL，就能导入几十个节点？</h2>
        <p className="text-muted leading-relaxed">
          那个 URL 是<span className="text-accent">"订阅链接"</span>——本质就是一个 HTTP GET 请求，
          访问后服务器返回一个<span className="text-white">"节点列表的文本文件"</span>，客户端把它解析出来就完成"导入"。
          没什么神奇的，就是 HTTP API。
        </p>
      </div>

      <div className="card p-6">
        <div className="text-xs text-accent font-mono mb-2">// dissecting a subscription URL</div>
        <h3 className="font-semibold mb-3">订阅链接的解剖</h3>
        <pre className="bg-bg border border-border rounded-md p-3 text-xs font-mono overflow-x-auto">
<span className="text-muted">https://</span>
<span className="text-accent">dash.example.com</span>
<span className="text-muted">/api/v1/client/</span>
<span className="text-accent2">subscribe</span>
<span className="text-muted">?token=</span>
<span className="text-accent">a1b2c3d4e5...</span>
        </pre>
        <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
          <div className="card p-3 bg-bg">
            <div className="text-accent font-mono text-xs mb-1">域名</div>
            <div className="text-muted text-xs">机场服务商的面板域名（俗称"机场"）。本质就是一个 SaaS。</div>
          </div>
          <div className="card p-3 bg-bg">
            <div className="text-accent font-mono text-xs mb-1">路径</div>
            <div className="text-muted text-xs">机场后端的订阅 API。常见的有 V2Board、Xboard、Xray-Panel 等开源面板。</div>
          </div>
          <div className="card p-3 bg-bg">
            <div className="text-accent font-mono text-xs mb-1">token</div>
            <div className="text-muted text-xs">⚠️ <span className="text-yellow-400">就是你的密码</span>。任何人拿到这个 token 都能用你的流量、看到你的所有节点。</div>
          </div>
          <div className="card p-3 bg-bg">
            <div className="text-accent font-mono text-xs mb-1">User-Agent</div>
            <div className="text-muted text-xs">客户端请求时带 UA（如 "ClashMeta/1.0"），后端按 UA 返回不同格式（Clash YAML / SS Base64 / V2Ray JSON）。</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-3">🔍 客户端拿到 URL 后做了什么？</h3>
        <ol className="space-y-3 text-sm text-muted">
          <li><span className="text-accent font-mono">[1]</span> 发起 HTTP GET 请求，带上自己的 User-Agent（声明"我是 Clash"或"我是 Shadowrocket"）</li>
          <li><span className="text-accent font-mono">[2]</span> 服务器根据 UA 返回对应格式：
            <ul className="list-disc list-inside ml-4 mt-1 text-xs">
              <li><b className="text-white">Clash UA</b> → 返回 YAML 配置（包含 proxies、proxy-groups、rules）</li>
              <li><b className="text-white">Shadowrocket UA</b> → 返回 base64 编码的 ss:// 列表</li>
              <li><b className="text-white">V2Ray UA</b> → 返回 vmess:// 列表</li>
            </ul>
          </li>
          <li><span className="text-accent font-mono">[3]</span> 客户端解析这些节点字符串，每行一个节点：
            <pre className="bg-bg border border-border rounded p-2 mt-1 text-xs font-mono text-accent overflow-x-auto">{`vmess://eyJ2IjoiMiIsInBzIjoi6aaZ5riv...`}</pre>
          </li>
          <li><span className="text-accent font-mono">[4]</span> 解码后就是一个 JSON：
            <pre className="bg-bg border border-border rounded p-2 mt-1 text-xs font-mono text-accent overflow-x-auto">{`{
  "v": "2",
  "ps": "香港-01",
  "add": "1.2.3.4",
  "port": "443",
  "id": "uuid-xxx",
  "net": "ws",
  "tls": "tls",
  "host": "example.com"
}`}</pre>
          </li>
          <li><span className="text-accent font-mono">[5]</span> 客户端把这些节点存到本地，就完成了"导入"。</li>
        </ol>
      </div>

      <div className="card p-6 bg-yellow-500/5 border-yellow-500/30">
        <div className="text-yellow-400 font-semibold mb-2">⚠️ 安全提醒</div>
        <ul className="text-sm text-muted space-y-1.5 list-disc list-inside">
          <li>订阅 URL 里的 token <b className="text-yellow-400">就是密码</b>，绝对不要发到群里、贴到截图里、提交到 git</li>
          <li>大部分机场支持"重置订阅"——一键作废旧 URL</li>
          <li>有些机场会记录订阅请求的 IP，从国内 IP 直接访问订阅链接是正常行为，不必担心</li>
          <li>但如果你的机场 token 出现在 GitHub 公开仓库的搜索结果里，立刻重置</li>
        </ul>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-3">🛠️ 自己起一个订阅服务（最小可用版）</h3>
        <p className="text-sm text-muted mb-3">订阅服务本质就是一个返回节点列表的 HTTP 接口：</p>
        <pre className="bg-bg border border-border rounded-md p-3 text-xs font-mono text-accent overflow-x-auto">
{`# Node.js / Next.js Route 示例（仅说明原理）
export async function GET(req) {
  const ua = req.headers.get('user-agent') ?? ''
  const nodes = [
    { name: '香港', server: '1.2.3.4', port: 443, uuid: '...' }
  ]

  if (ua.includes('clash')) return new Response(toClashYaml(nodes))
  if (ua.includes('shadowrocket')) return new Response(toBase64SS(nodes))
  return new Response(toVmessLinks(nodes))
}`}
        </pre>
        <p className="text-sm text-muted mt-3">
          所以"机场"在技术上就是：<span className="text-white">几个 V2Ray/Trojan 服务端 + 一个用户/流量管理 Web 面板（V2Board 等）+ 这种订阅 API</span>。
          有这三个东西，你就有了一个机场。
        </p>
      </div>
    </div>
  );
}

/* ============ Tab 4: 自建翻墙 ============ */

const STEPS = [
  {
    id: 1,
    title: "买一台海外 VPS",
    detail: "找一个不在 GFW 内的服务器。1 核 1G、月 5 美金的就够个人用。",
    sub: [
      { label: "推荐厂商", value: "Vultr / Linode / DigitalOcean / 搬瓦工 / Hetzner" },
      { label: "推荐区域", value: "日本 / 新加坡 / 美国西海岸（延迟低）" },
      { label: "避坑", value: "❌ 不要买所谓「中国优化」线路（如 CN2 GIA）跑 V2Ray，贵且封后心痛" },
      { label: "支付", value: "信用卡 / 支付宝 / USDT（看厂商）" },
    ],
    cmd: null,
  },
  {
    id: 2,
    title: "SSH 登录 + 系统初始化",
    detail: "拿到 IP 和 root 密码后，用 SSH 登录。装基础工具、关掉危险的端口、改 SSH 端口避免扫描。",
    sub: [
      { label: "登录", value: "ssh root@your-vps-ip" },
      { label: "更新", value: "apt update && apt upgrade -y" },
      { label: "防火墙", value: "ufw allow 22/tcp; ufw allow 443/tcp; ufw enable" },
    ],
    cmd: `ssh root@1.2.3.4
apt update && apt install -y curl wget vim ufw
ufw allow 22/tcp
ufw allow 443/tcp
ufw enable`,
  },
  {
    id: 3,
    title: "安装 V2Ray / Xray 服务端",
    detail: "推荐 Xray（v2ray 的活跃 fork）。一行脚本搞定。",
    sub: [
      { label: "官方一键脚本", value: `bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install` },
      { label: "配置文件位置", value: "/usr/local/etc/xray/config.json" },
      { label: "推荐协议", value: "VLESS + Reality（不需要域名和证书，伪装成访问 microsoft.com）" },
    ],
    cmd: `# 安装 Xray
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install

# 启动
systemctl enable --now xray`,
  },
  {
    id: 4,
    title: "选择协议：VLESS + Reality（2026 推荐）",
    detail: "Reality 是当前最强的反审查方案。它劫持别人的 TLS 证书（如 microsoft.com），不需要你买域名，DPI 完全识别为正常 HTTPS。",
    sub: [
      { label: "需要", value: "✅ 一台 VPS（任意 IP）" },
      { label: "不需要", value: "❌ 域名、❌ 证书、❌ CDN" },
      { label: "工作原理", value: "客户端假装去访问 microsoft.com，TLS 握手时偷偷塞入认证标识。服务端识别后让你过，没识别的真去访问 microsoft.com。" },
    ],
    cmd: `# /usr/local/etc/xray/config.json (片段)
{
  "inbounds": [{
    "port": 443,
    "protocol": "vless",
    "settings": {
      "clients": [{ "id": "your-uuid", "flow": "xtls-rprx-vision" }],
      "decryption": "none"
    },
    "streamSettings": {
      "network": "tcp",
      "security": "reality",
      "realitySettings": {
        "dest": "www.microsoft.com:443",
        "serverNames": ["www.microsoft.com"],
        "privateKey": "...",
        "shortIds": [""]
      }
    }
  }]
}`,
  },
  {
    id: 5,
    title: "客户端连接",
    detail: "在 Clash Verge Rev / v2rayN / Shadowrocket 里手动加一个节点，填入 VPS IP、端口、UUID、Reality 配置即可。",
    sub: [
      { label: "Clash 配置示例", value: "见右侧 YAML" },
      { label: "测试连通", value: "curl --proxy socks5://127.0.0.1:7891 https://www.google.com" },
    ],
    cmd: `# Clash Verge Rev 配置片段
proxies:
  - name: "我的VPS"
    type: vless
    server: 1.2.3.4
    port: 443
    uuid: your-uuid
    network: tcp
    tls: true
    flow: xtls-rprx-vision
    reality-opts:
      public-key: ...
      short-id: ""
    servername: www.microsoft.com`,
  },
  {
    id: 6,
    title: "（可选）做一个自己的订阅链接",
    detail: "如果你有多台 VPS 或想把节点同步到多设备，可以起一个最小订阅服务。",
    sub: [
      { label: "最简方案", value: "把节点列表写成一个文件，托管在 Cloudflare Pages / Vercel / GitHub Raw" },
      { label: "进阶方案", value: "用 V2Board / Xboard 自建机场面板（含用户/流量管理）" },
    ],
    cmd: `# 最简：放一个静态文件到 GitHub
# subscribe.txt
vless://uuid@1.2.3.4:443?security=reality&...#我的VPS

# 然后在客户端订阅 URL 填:
# https://raw.githubusercontent.com/yourname/repo/main/subscribe.txt`,
  },
  {
    id: 7,
    title: "降低被封 & 被风控的风险",
    detail: "针对你的真实目的（更稳定地访问 Claude/Codex 等 AI 服务），有几条具体建议。",
    sub: [
      { label: "用住宅/原生 IP", value: "AI 服务对数据中心 IP 风控严，能买「住宅 IP 的 VPS」或「原生 IP」最佳（如 Vultr 部分东京机房）" },
      { label: "避免共享出口", value: "机场流量会被多人共用一个出口 IP，AI 服务可能识别为异常。自建独享" },
      { label: "稳定的 IP", value: "频繁换 IP 反而会触发风控，自建后保持同一 IP 长期使用更好" },
      { label: "避免 CGNAT 嫌疑", value: "不要用普通家用 4G 流量代理（会被识别为可疑共享 NAT）" },
      { label: "时区/语言一致", value: "通过代理后保持系统时区、浏览器语言与 IP 国家一致（小细节但有用）" },
    ],
    cmd: null,
  },
];

function SelfHost() {
  const [active, setActive] = useState(1);
  const cur = STEPS.find((s) => s.id === active)!;

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-accent/5 border-accent/30">
        <h2 className="text-xl font-bold mb-2">🎯 为什么要自建？</h2>
        <ul className="text-sm text-muted space-y-1 list-disc list-inside">
          <li>机场节点是<span className="text-white">多人共享 IP</span>，AI 服务（Claude/Codex/OpenAI）越来越多地把这类 IP 标记为风险</li>
          <li>机场节点 IP 会被频繁封禁，体验不稳</li>
          <li>自建独享 IP，长期固定，对 AI 服务更友好</li>
          <li>了解原理后，遇到问题能自己排查</li>
        </ul>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* 步骤导航 */}
        <div className="lg:col-span-1 card p-3">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full text-left p-3 rounded-md mb-1 transition-colors ${
                active === s.id ? "bg-accent text-bg" : "hover:bg-panel"
              }`}
            >
              <div className={`text-xs font-mono ${active === s.id ? "text-bg/70" : "text-muted"}`}>STEP {s.id}</div>
              <div className={`text-sm font-medium ${active === s.id ? "text-bg" : "text-white"}`}>{s.title}</div>
            </button>
          ))}
        </div>

        {/* 步骤详情 */}
        <div className="lg:col-span-3 card p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-accent text-sm">STEP {cur.id} / {STEPS.length}</span>
          </div>
          <h3 className="text-xl font-bold mb-3">{cur.title}</h3>
          <p className="text-muted leading-relaxed mb-4">{cur.detail}</p>

          <div className="space-y-2 mb-4">
            {cur.sub.map((s, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm">
                <span className="text-muted text-xs sm:w-32 shrink-0">{s.label}</span>
                <span className="text-white">{s.value}</span>
              </div>
            ))}
          </div>

          {cur.cmd && (
            <pre className="bg-bg border border-border rounded-md p-3 text-xs font-mono text-accent overflow-x-auto">{cur.cmd}</pre>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setActive(Math.max(1, active - 1))}
              disabled={active === 1}
              className="px-4 py-2 bg-panel border border-border rounded-md text-sm hover:border-accent disabled:opacity-30"
            >
              ← 上一步
            </button>
            <button
              onClick={() => setActive(Math.min(STEPS.length, active + 1))}
              disabled={active === STEPS.length}
              className="px-4 py-2 bg-panel border border-border rounded-md text-sm hover:border-accent disabled:opacity-30"
            >
              下一步 →
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-3">📚 自建路线总览</h3>
        <SelfHostFlow />
      </div>
    </div>
  );
}

function SelfHostFlow() {
  const nodes = [
    { label: "买 VPS", icon: "💳" },
    { label: "SSH + 防火墙", icon: "🔐" },
    { label: "装 Xray", icon: "📦" },
    { label: "VLESS+Reality", icon: "🥷" },
    { label: "客户端连入", icon: "💻" },
    { label: "自由访问 AI", icon: "🤖" },
  ];
  const W = 920;
  const stepX = (W - 120) / (nodes.length - 1);
  return (
    <svg viewBox={`0 0 ${W} 160`} className="w-full h-[160px]">
      <line x1={60} y1={80} x2={60 + stepX * (nodes.length - 1)} y2={80} stroke="#1f2a3a" strokeWidth={2} />
      {nodes.map((_, i) => i < nodes.length - 1 && (
        <motion.circle
          key={i}
          r={4}
          fill="#00ffd1"
          animate={{ cx: [60 + i * stepX, 60 + (i + 1) * stepX], cy: 80 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={60 + i * stepX} cy={80} r={26} fill="#0f1520" stroke="#00ffd1" strokeWidth={1.5} />
          <text x={60 + i * stepX} y={87} textAnchor="middle" fontSize="20">{n.icon}</text>
          <text x={60 + i * stepX} y={130} textAnchor="middle" fill="#e6edf6" fontSize="11" fontFamily="ui-monospace">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
