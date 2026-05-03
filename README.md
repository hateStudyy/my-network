# my-network · 我的网络大全

把抽象的网络知识变成可以"看见、点击、理解"的本地工具。

> 不只是监控工具，也不只是教学演示。把这台机器的真实网络活动当作教材，每一行数据都告诉你它是什么、为什么、怎么来的。

## 五大模块

| # | 模块 | 做什么 |
|---|---|---|
| 01 | **端口监控** | 实时列出本机所有监听端口、占用进程，并解释每个常见端口的用途 |
| 02 | **网络包之旅** | 动画演示一次 HTTP 请求从浏览器到服务器的完整路径，OSI 七层逐层联动 |
| 03 | **抓包实验室** | 实时显示当前所有 TCP 连接（四元组），看清"谁在和谁通信" |
| 04 | **代理/VPN/翻墙原理** | 交互式图解 HTTP / SOCKS5 / Shadowsocks / V2Ray / WireGuard / Tor，并实时检测系统代理状态 |
| 05 | **架构文档** | 项目原理与设计取舍 |

## 快速开始

```bash
npm install
npm run dev
# 打开 http://localhost:4567
```

## 技术栈

Next.js 14 (App Router) · React 18 · TailwindCSS · Framer Motion · marked

## 数据来源

所有数据都是实时从本机系统命令读取的快照，不持久化、不联网：

- `lsof -nP -iTCP -sTCP:LISTEN` —— 监听端口
- `lsof -nP -iTCP -sTCP:ESTABLISHED` —— 活动连接
- `scutil --proxy` —— macOS 系统代理状态

## 平台支持

- ✅ macOS（已测试）
- 🟡 Linux（lsof 通用，应该可以跑）
- ❌ Windows（需要替换为 `netstat -ano`）

## 局限 & v2 计划

- MVP 抓包模块只展示连接级元数据，**字节级 pcap 抓包** 需要 sudo + libpcap，留给 v2
- 当前为"观测工具"，**只读不改**任何系统状态

## 文档

详见 [`docs/`](./docs) 或运行后访问 `/docs` 路径。
