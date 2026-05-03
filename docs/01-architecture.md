# 项目架构

## 一句话定位

**my-network** 是一个把"本机网络状态"变成可视化教学材料的本地工具。监控 + 教学 + 解释三位一体。

## 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | Next.js 14 (App Router) | 一份代码同时是前端和后端；API Routes 直接调用 shell 命令 |
| UI | React 18 + TailwindCSS | 主流且足够快 |
| 动画 | Framer Motion | 声明式动画，适合"包之旅"这种状态机式的演示 |
| 样式风格 | 自定义深色极客风 | 黑底 + 霓虹绿/粉色，让数据感更强 |
| 数据来源 | 本机 `lsof` / `scutil` 命令 | macOS/Linux 自带，无需安装额外工具 |
| 文档渲染 | marked | 极简 markdown → html |

## 目录结构

```
my-network/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页
│   │   ├── layout.tsx            # 全局布局
│   │   ├── globals.css
│   │   ├── ports/page.tsx        # 模块1: 端口监控
│   │   ├── journey/page.tsx      # 模块2: 网络包之旅
│   │   ├── sniff/page.tsx        # 模块3: 抓包/连接
│   │   ├── proxy/page.tsx        # 模块4: 代理原理
│   │   ├── docs/                 # 模块5: 文档
│   │   └── api/
│   │       ├── ports/            # 监听端口列表
│   │       ├── connections/      # 已建立连接
│   │       └── proxy-status/     # 系统代理状态
│   └── lib/
│       ├── port-info.ts          # 端口知识库
│       └── cn.ts
├── docs/                         # 架构与原理文档
│   ├── 01-architecture.md
│   ├── 02-port-monitor.md
│   ├── 03-packet-journey.md
│   ├── 04-sniffing.md
│   └── 05-proxy-vpn.md
└── package.json
```

## 数据流总览

```
浏览器 (React 页面)
    │
    │ fetch /api/xxx
    ▼
Next.js API Route (Node.js 进程内)
    │
    │ child_process.exec('lsof / scutil ...')
    ▼
操作系统命令
    │
    └─► 返回文本 → 解析为 JSON → 返回给前端
```

整个项目**没有任何持久化存储**——所有数据都是实时从系统读取的快照。每 2~5 秒轮询一次。

## 设计取舍

### 为什么不用 WebSocket？

抓包模块的 v2 会用 WebSocket 推 tcpdump 流。MVP 阶段所有数据都是低频轮询，REST + 轮询足够简单可靠。

### 为什么不用 Electron？

Web 形态的好处：①开发更快 ②跨平台 ③可以远程访问（虽然要小心权限）。代价：抓包需要 sudo 启动 Node.js，但这是一次性的。

### 为什么 lsof 而不是 netstat？

macOS 自带的 `netstat` 不显示进程信息。`lsof` 输出更结构化、有 PID 和进程名，是 macOS 上的最佳选择。Linux 上未来可以切到 `ss -tlnp`。

## 局限

- **平台**: 当前只在 macOS 测试。Linux 应该也能跑（`lsof` 通用），Windows 需要替换为 `netstat -ano`。
- **抓包**: MVP 只展示连接元数据（四元组），真正的字节级 pcap 解析在 v2。
- **历史**: 不保留历史，关掉就没了——观测当下，不做时序数据库。
