import Link from "next/link";

const MODULES = [
  {
    href: "/ports",
    title: "本地端口监控",
    desc: "实时展示本机所有监听端口、占用进程，并解释每个常见端口的用途。",
    badge: "01",
  },
  {
    href: "/journey",
    title: "一个网络包的旅行",
    desc: "动画演示一次 HTTP 请求从浏览器到服务器的完整路径，OSI 七层逐层拆解。",
    badge: "02",
  },
  {
    href: "/sniff",
    title: "抓包实验室",
    desc: "实时抓取本机数据包，按协议分层展示，让网络传输不再神秘。",
    badge: "03",
  },
  {
    href: "/proxy",
    title: "代理 / VPN / 翻墙原理",
    desc: "交互式图解 HTTP 代理、SOCKS5、Shadowsocks、V2Ray、WireGuard 的工作原理。",
    badge: "04",
  },
  {
    href: "/docs",
    title: "架构文档",
    desc: "项目架构、技术选型、各模块实现原理。",
    badge: "05",
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <section className="mb-16">
        <p className="text-accent font-mono text-sm mb-3">// my-network atlas</p>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          把<span className="text-accent glow">网络</span>变成
          <br />
          可以<span className="text-accent2">看见</span>的东西
        </h1>
        <p className="text-muted max-w-2xl leading-relaxed">
          这是一台正在运行的机器的网络解剖图。每一个端口、每一个数据包、每一条代理链路，都在这里被拆开、解释、可视化。
          从此，网络不再神秘。
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href} className="card p-5 group hover:border-accent transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="font-mono text-xs text-muted">{m.badge}</span>
              <span className="text-muted group-hover:text-accent transition-colors">→</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">{m.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
