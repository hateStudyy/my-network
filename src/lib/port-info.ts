// 常见端口知识库 —— 教学用
export type PortInfo = {
  port: number;
  name: string;
  protocol: "TCP" | "UDP" | "TCP/UDP";
  desc: string;
  category: "web" | "mail" | "db" | "transfer" | "remote" | "system" | "dev" | "other";
};

export const WELL_KNOWN_PORTS: Record<number, PortInfo> = {
  20: { port: 20, name: "FTP-DATA", protocol: "TCP", desc: "FTP 协议的数据传输通道。", category: "transfer" },
  21: { port: 21, name: "FTP", protocol: "TCP", desc: "文件传输协议控制端口，明文传输已不安全。", category: "transfer" },
  22: { port: 22, name: "SSH", protocol: "TCP", desc: "安全 Shell，远程加密登录的事实标准。", category: "remote" },
  23: { port: 23, name: "Telnet", protocol: "TCP", desc: "古老的远程登录协议，明文传输，已被 SSH 取代。", category: "remote" },
  25: { port: 25, name: "SMTP", protocol: "TCP", desc: "邮件发送（服务器之间）。", category: "mail" },
  53: { port: 53, name: "DNS", protocol: "TCP/UDP", desc: "域名解析。把 google.com 翻译成 IP 地址的服务。", category: "system" },
  67: { port: 67, name: "DHCP Server", protocol: "UDP", desc: "DHCP 服务端，自动分配 IP 地址。", category: "system" },
  68: { port: 68, name: "DHCP Client", protocol: "UDP", desc: "DHCP 客户端，向服务器请求 IP。", category: "system" },
  80: { port: 80, name: "HTTP", protocol: "TCP", desc: "明文 Web 流量。访问 http:// 网站走这里。", category: "web" },
  110: { port: 110, name: "POP3", protocol: "TCP", desc: "邮件接收协议（旧式，单设备）。", category: "mail" },
  123: { port: 123, name: "NTP", protocol: "UDP", desc: "网络时间同步协议。", category: "system" },
  143: { port: 143, name: "IMAP", protocol: "TCP", desc: "邮件接收协议，多设备同步。", category: "mail" },
  443: { port: 443, name: "HTTPS", protocol: "TCP", desc: "加密 Web 流量。访问 https:// 网站走这里，绝大多数互联网流量。", category: "web" },
  445: { port: 445, name: "SMB", protocol: "TCP", desc: "Windows 文件共享，历史上多次成为蠕虫攻击入口。", category: "transfer" },
  465: { port: 465, name: "SMTPS", protocol: "TCP", desc: "加密的 SMTP（隐式 TLS）。", category: "mail" },
  587: { port: 587, name: "SMTP Submission", protocol: "TCP", desc: "邮件客户端提交邮件给服务器（STARTTLS）。", category: "mail" },
  631: { port: 631, name: "IPP / CUPS", protocol: "TCP", desc: "macOS/Linux 打印服务。", category: "system" },
  993: { port: 993, name: "IMAPS", protocol: "TCP", desc: "加密的 IMAP。", category: "mail" },
  995: { port: 995, name: "POP3S", protocol: "TCP", desc: "加密的 POP3。", category: "mail" },
  1080: { port: 1080, name: "SOCKS Proxy", protocol: "TCP", desc: "SOCKS5 代理常用端口。Shadowsocks 客户端默认监听这里。", category: "other" },
  1433: { port: 1433, name: "MSSQL", protocol: "TCP", desc: "Microsoft SQL Server 数据库。", category: "db" },
  1521: { port: 1521, name: "Oracle DB", protocol: "TCP", desc: "Oracle 数据库默认端口。", category: "db" },
  2049: { port: 2049, name: "NFS", protocol: "TCP", desc: "网络文件系统，Unix 系文件共享。", category: "transfer" },
  3000: { port: 3000, name: "Dev Server", protocol: "TCP", desc: "Node.js / Next.js / React 开发服务器的常用端口。", category: "dev" },
  3306: { port: 3306, name: "MySQL", protocol: "TCP", desc: "MySQL / MariaDB 数据库默认端口。", category: "db" },
  3389: { port: 3389, name: "RDP", protocol: "TCP", desc: "Windows 远程桌面协议。", category: "remote" },
  4000: { port: 4000, name: "Dev Server", protocol: "TCP", desc: "常见开发服务器端口（Phoenix/Elixir 等）。", category: "dev" },
  5000: { port: 5000, name: "Dev Server", protocol: "TCP", desc: "Flask / macOS AirPlay 的常用端口。", category: "dev" },
  5173: { port: 5173, name: "Vite Dev", protocol: "TCP", desc: "Vite 开发服务器默认端口。", category: "dev" },
  5432: { port: 5432, name: "PostgreSQL", protocol: "TCP", desc: "PostgreSQL 数据库默认端口。", category: "db" },
  5900: { port: 5900, name: "VNC", protocol: "TCP", desc: "远程桌面协议（VNC）。", category: "remote" },
  6379: { port: 6379, name: "Redis", protocol: "TCP", desc: "Redis 内存数据库。", category: "db" },
  7890: { port: 7890, name: "Clash Mixed", protocol: "TCP", desc: "Clash 代理工具默认混合代理端口。", category: "other" },
  8080: { port: 8080, name: "HTTP Alt", protocol: "TCP", desc: "HTTP 备用端口，常用于代理或开发服务。", category: "web" },
  8443: { port: 8443, name: "HTTPS Alt", protocol: "TCP", desc: "HTTPS 备用端口。", category: "web" },
  8888: { port: 8888, name: "HTTP Proxy", protocol: "TCP", desc: "Charles / Fiddler 等抓包代理常用端口。", category: "other" },
  9000: { port: 9000, name: "PHP-FPM / Misc", protocol: "TCP", desc: "PHP-FPM、Portainer 等服务的常用端口。", category: "dev" },
  9090: { port: 9090, name: "Prometheus", protocol: "TCP", desc: "Prometheus 监控系统默认端口。", category: "dev" },
  11211: { port: 11211, name: "Memcached", protocol: "TCP", desc: "Memcached 缓存服务。", category: "db" },
  27017: { port: 27017, name: "MongoDB", protocol: "TCP", desc: "MongoDB 数据库默认端口。", category: "db" },
  6443: { port: 6443, name: "Kubernetes API", protocol: "TCP", desc: "Kubernetes API Server 默认端口。", category: "dev" },
};

export function explainPort(port: number): PortInfo | null {
  if (WELL_KNOWN_PORTS[port]) return WELL_KNOWN_PORTS[port];
  if (port >= 49152) {
    return {
      port,
      name: "Ephemeral",
      protocol: "TCP/UDP",
      desc: "临时端口（动态/私有范围 49152–65535），通常由操作系统分配给客户端连接使用。",
      category: "system",
    };
  }
  if (port >= 1024) {
    return {
      port,
      name: "Registered",
      protocol: "TCP/UDP",
      desc: "注册端口（1024–49151），由应用程序申请使用，一般是某个软件的服务端口。",
      category: "other",
    };
  }
  return {
    port,
    name: "Well-Known",
    protocol: "TCP/UDP",
    desc: "知名端口（0–1023），由系统或权威服务占用，需要管理员权限才能监听。",
    category: "system",
  };
}

export const CATEGORY_LABEL: Record<PortInfo["category"], string> = {
  web: "Web",
  mail: "邮件",
  db: "数据库",
  transfer: "文件传输",
  remote: "远程",
  system: "系统",
  dev: "开发",
  other: "其他",
};

export const CATEGORY_COLOR: Record<PortInfo["category"], string> = {
  web: "#00ffd1",
  mail: "#ffb86c",
  db: "#ff5dcd",
  transfer: "#8be9fd",
  remote: "#bd93f9",
  system: "#7a8aa3",
  dev: "#50fa7b",
  other: "#f1fa8c",
};
