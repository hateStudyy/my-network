# 模块 1：端口监控原理

## 它在做什么

每 5 秒调用一次 `lsof`，把所有"正在监听某个端口"的进程列出来。

## 关键命令

```bash
lsof -nP -iTCP -sTCP:LISTEN
lsof -nP -iUDP
```

- `-n`：不要把 IP 反向解析成 hostname（更快）
- `-P`：保留数字端口（不要把 80 转成 "http"）
- `-iTCP -sTCP:LISTEN`：只看 TCP 处于 LISTEN 状态的
- `-iUDP`：UDP 没有"状态"，全列出来

## 输出示例

```
COMMAND     PID   USER   FD   TYPE    DEVICE  NODE  NAME
node      12345   yumi   23u  IPv6    ...     TCP   *:3000 (LISTEN)
postgres   5678   yumi    7u  IPv4    ...     TCP   127.0.0.1:5432 (LISTEN)
```

NAME 字段是关键，按正则提取 `IP:PORT` 形式。

## 端口分级（IANA 标准）

| 范围 | 名称 | 用途 |
|---|---|---|
| 0–1023 | Well-Known | 系统/权威服务（HTTP, SSH, DNS...）。监听需要 root |
| 1024–49151 | Registered | 应用程序申请使用（MySQL 3306, Redis 6379） |
| 49152–65535 | Ephemeral | 操作系统给客户端连接动态分配的临时端口 |

## 监听地址解读

- `*` 或 `0.0.0.0`：所有网卡，**任何能访问你机器的设备都能连**
- `127.0.0.1`：仅本机回环，**只有你自己的电脑能连**
- `192.168.x.x`：仅本机的某个具体网卡

如果你看到一个数据库（比如 PostgreSQL）监听在 `*:5432`，要警惕——它对局域网甚至公网开放了。

## 知识库

`src/lib/port-info.ts` 里维护了一份常见端口字典，给每个端口配上：

```ts
{ name, protocol, desc, category }
```

未在字典里的端口，按所在区段给出一个通用解释。
