# 模块 6：翻墙客户端 & 自建之路

本篇讲三件事：①三大主流客户端的架构区别；②回答几个高频疑问；③如何完全自建翻墙工具。

## 一、三大客户端的本质区别

| 维度 | Shadowrocket | Clash Verge Rev | v2rayN |
|---|---|---|---|
| 平台 | iOS | macOS / Win / Linux | Win（新版跨平台） |
| 内核 | 自研闭源 | Mihomo (Go) | xray-core / v2ray-core |
| 接管方式 | iOS NetworkExtension（系统级 VPN） | 本地端口 + TUN 可选 | 本地端口 + TUN 可选 |
| 开源 | ❌ | ✅ | ✅ |
| 强项 | 全 App 自动走代理（包括微信抖音） | 桌面端最强规则引擎 | v2ray/xray 系协议生态最好 |

### Shadowrocket：iOS 系统级 VPN 的伪装

iOS 严格禁止普通 App 监听端口给其他 App 用。所以 Shadowrocket 走的是苹果给 VPN 类 App 的 `NEPacketTunnelProvider` 接口：

1. 系统创建虚拟网卡 `utun0`
2. 所有 IP 包流入 Shadowrocket 的 Tunnel Provider 进程
3. Provider 解协议 → 加密 → 通过真实网卡发到节点
4. 你打开 SR 时通知栏会显示 VPN 标志——它实际上就是个 VPN

代价：Tunnel Provider 进程**内存只能用 24MB**，节点配置过多会被系统 OOM 杀掉。

### Clash Verge Rev：桌面端最佳

GUI 是 Tauri（Rust）写的壳，内核是 Mihomo（社区维护的 clash-meta，Go 写的）。

它同时监听三种端口：
- HTTP 代理（默认 7890）
- SOCKS5（默认 7891）
- 混合端口（自动识别 HTTP/SOCKS5）

也可以开 TUN 模式接管全系统流量。规则引擎是它的招牌——按域名、IP、GEOIP、进程名分流，比谁都灵活。

### v2rayN：v2ray 生态原住民

老牌 Windows 客户端。底层调用 xray-core 子进程，对 VLESS+Reality 等新协议支持最好。新版用 Avalonia 重写后跨平台了。

## 二、几个高频疑问

### Q：为什么"网络代理只能占用一个端口"？

**这是误解。** 代理软件可以同时监听任意多个端口。Clash 默认就开 3 个（HTTP 7890、SOCKS 7891、混合 7890）。所谓"一个端口"是用户视角的简化。

之所以**默认就一个**：因为应用层代理协议（HTTP/SOCKS5）一个端口就能处理无数个连接，多开没必要。

### Q：为什么 Shadowrocket "没有"端口？

因为 iOS 上它走 NetworkExtension，不靠监听端口工作。它直接接管整个系统的 IP 包，是 VPN 模式而非代理模式。

### Q：为什么粘贴一个 URL 就能导入几十个节点？

那个 URL 是"订阅链接"，本质是个 HTTP API。客户端 GET 这个 URL，服务器根据 User-Agent 返回对应格式的节点列表（Clash YAML / Base64 SS / VMess 链接）。客户端解析后存到本地。

订阅 URL 里的 token **就是密码**，等同于你订阅的所有访问权——绝对不要泄露。

## 三、自建翻墙完全指南

### 路线总览

```
买 VPS → SSH 初始化 → 装 Xray → VLESS+Reality 配置 → 客户端连入 → 自由
```

### Step 1：买一台海外 VPS

- 推荐厂商：Vultr / Linode / DigitalOcean / Hetzner / 搬瓦工
- 推荐区域：日本、新加坡、美国西海岸（亚洲延迟低）
- 配置：1 核 1G 月 5 美金即可
- **避坑**：不要为了"国内优化线路"买 CN2 GIA 跑 V2Ray，太贵且封后心痛

### Step 2：SSH 登录 + 系统初始化

```bash
ssh root@your-vps-ip
apt update && apt install -y curl wget vim ufw
ufw allow 22/tcp
ufw allow 443/tcp
ufw enable
```

### Step 3：一键安装 Xray

```bash
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
systemctl enable --now xray
```

### Step 4：选 VLESS + Reality（2026 当前最强方案）

Reality 的核心创新：**劫持别人的 TLS 证书**。客户端假装去访问 microsoft.com，TLS 握手时偷偷塞入认证标识。服务端识别后让你的流量过去，没识别的真去访问 microsoft.com。

**好处**：
- 不需要域名（IP 直连）
- 不需要证书（借别人的）
- DPI 看到的是"普通 HTTPS 访问 microsoft.com"，无法识别

```json
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
}
```

### Step 5：客户端配置

Clash Verge Rev 配置片段：

```yaml
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
    servername: www.microsoft.com
```

测试连通：

```bash
curl --proxy socks5://127.0.0.1:7891 https://www.google.com
```

### Step 6（可选）：自建订阅服务

如果你有多台 VPS 想同步到多设备：

- **最简方案**：把节点列表写成文件托管到 Cloudflare Pages / Vercel / GitHub Raw
- **进阶方案**：自建 V2Board / Xboard 面板（含用户/流量管理 + 完整订阅 API）

订阅服务本质就是按 User-Agent 返回不同格式的节点列表，没什么神秘的：

```ts
export async function GET(req) {
  const ua = req.headers.get('user-agent') ?? '';
  const nodes = [/* ... */];
  if (ua.includes('clash')) return new Response(toClashYaml(nodes));
  if (ua.includes('shadowrocket')) return new Response(toBase64SS(nodes));
  return new Response(toVmessLinks(nodes));
}
```

## 四、降低 AI 服务封号风险（针对真实诉求）

机场共享 IP 越来越多被 AI 服务（Claude / Codex / OpenAI）标记为风险。自建独享 IP 显著好于机场，但仍要注意：

| 维度 | 建议 |
|---|---|
| IP 类型 | 优先选住宅 IP / 原生 IP（Vultr 部分东京机房有原生） |
| IP 稳定性 | **不要频繁换 IP**——长期固定使用反而风险更低 |
| 出口共享 | 自建独享，避免和别人共用出口 |
| 流量类型 | 不要用普通 4G 流量代理（可能被识别为 CGNAT 共享） |
| 时区/语言 | 系统时区、浏览器语言与 IP 国家保持一致 |
| 流量伪装 | Reality 协议优于 SS、VMess（DPI 几乎无法识别） |

## 五、机场 vs 自建的成本对照

| 维度 | 机场（5刀/月） | 自建（5刀/月 VPS） |
|---|---|---|
| 节点数量 | 数十~上百 | 1（你的 VPS） |
| IP 独享 | ❌ 多人共用 | ✅ 完全独享 |
| 流量 | 通常 100GB+ | 通常 1TB+ |
| 多区域切换 | ✅ | ❌ 要多买 VPS |
| 维护成本 | 0 | 偶尔（升级、防火墙） |
| 被封风险 | 节点 IP 频繁被封 | IP 长期稳定 |
| AI 服务友好度 | 中等偏低 | 高 |
| 学到的东西 | 0 | 网络/Linux/安全 |

**结论**：
- 日常翻墙 + 多区域需求 → 机场
- 高强度访问 AI 服务 / 想学习底层 → 自建
- 最佳实践：**机场 + 自建并存**，AI 走自建，普通浏览走机场
