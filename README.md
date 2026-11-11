# LibreTV 点播源同步

把 [LunaTV-config 的 jin18.json](https://github.com/hafrey1/LunaTV-config/blob/main/jin18.json) 转换为 [LibreTV 数据源订阅格式](https://github.com/LibreSpark/LibreTV/wiki/Data-Sources#订阅格式libretv-sourcelist-json)。转换保留源名称、API 地址和详情页地址，输出 `sources.json`。

GitHub Actions 在北京时间每天 05:17 拉取上游。也可以在 `Actions → Sync LibreTV sources → Run workflow` 手动运行。只有输出内容变化时才提交。上游请求或校验失败时保留仓库中的上次结果。

本地更新需要 Node.js 20 或更新版本。在仓库目录运行 `node sync.mjs`。

## 在 LibreTV 中使用

订阅入口是「设置 → 源管理 → 数据源订阅」。填入 LibreTV 服务端能直接读取的 `sources.json` HTTPS 地址。私有 GitHub 仓库的文件页和需 GitHub 登录的下载地址无法作为长期订阅链接。仓库可保持私有，另由你管理的 HTTPS 服务读取并提供转换结果。

如果只需在 Docker 部署中预置点播源，可以取 `sources.json` 顶层的 `sources` 数组，作为 `DEFAULT_SOURCES` 环境变量的值，再重新创建容器。此方式无需另建订阅地址，每次更新后需要重新应用环境变量。
