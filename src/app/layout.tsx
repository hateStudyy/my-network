import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "我的网络大全 · My Network Atlas",
  description: "把抽象的网络知识变成可以看见的实时工具",
};

const NAV = [
  { href: "/", label: "首页" },
  { href: "/ports", label: "端口监控" },
  { href: "/journey", label: "网络包之旅" },
  { href: "/sniff", label: "抓包" },
  { href: "/proxy", label: "代理与翻墙" },
  { href: "/clients", label: "客户端 / 自建" },
  { href: "/docs", label: "架构文档" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-border sticky top-0 bg-bg/80 backdrop-blur z-10">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
              <Link href="/" className="font-mono text-accent glow font-bold">
                ⚡ my-network
              </Link>
              <nav className="flex gap-1 text-sm">
                {NAV.slice(1).map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="px-3 py-1.5 rounded-md hover:bg-panel hover:text-accent transition-colors text-muted"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border text-xs text-muted py-4 text-center">
            my-network · 一个网络世界的解剖图谱
          </footer>
        </div>
      </body>
    </html>
  );
}
