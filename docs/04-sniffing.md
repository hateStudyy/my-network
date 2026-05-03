# 模块 3：抓包实验室

## MVP 范围

MVP 不做字节级 pcap 抓包（要 sudo + libpcap 解析），先做**连接级抓包**：

> 谁（哪个进程）正在和谁（哪个 IP:Port）维持着 TCP 连接。

每 2 秒刷新一次，用 lsof 拿数据。

## 关键命令

```bash
lsof -nP -iTCP -sTCP:ESTABLISHED
```

输出每行包含:

```
NAME = 192.168.1.5:54321 -> 142.250.80.46:443 (ESTABLISHED)
```

正则切出本地 IP/Port、远程 IP/Port、状态、PID、进程名。

## TCP 四元组

每个 TCP 连接由 `(本地IP, 本地端口, 远程IP, 远程端口)` 唯一标识。这就是为什么:

- 你能同时打开 100 个 Chrome 标签连同一个 Google IP，因为本地端口不同
- 操作系统能精确把每个返回包路由给正确的应用

## v2 计划：真正的 pcap 抓包

```
[需要 sudo]

tcpdump -nn -i any -l -w - port 80 or port 443
   │
   ▼
Node child_process spawn
   │
   ▼
WebSocket 推流到前端
   │
   ▼
前端 pcap 解析（pcap-parser）
   │
   ▼
按协议分层渲染（Frame > Eth > IP > TCP > HTTP）
每个字段悬停显示解释
```

设计的关键是**字段级解释**——每个 TCP flag、每个 HTTP header 都有一句话告诉你它干啥的。这是和 Wireshark 的核心差异。

## 为什么要 sudo？

抓包需要把网卡设为"混杂模式"或调用 BPF (Berkeley Packet Filter)，这是内核能力，普通用户没权限。
启动方式：`sudo npm run dev`，启动后再降权运行 web server（v2 实现）。
