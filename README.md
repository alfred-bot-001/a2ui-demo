# A2UI Support Copilot Demo

客服 / 用户问题处理 Copilot 演示项目。场景模拟用户询问提现卡住、KYC 失败、充值没到账、账户被风控时，Agent 返回一段 A2UI-style JSON envelope stream，前端 renderer 将其渲染成可操作的 case surface。

## 演示内容

- 用户问题列表和对话上下文
- A2UI envelope stream：`createSurface`、`updateComponents`、`updateDataModel`
- 动态 surface：状态时间线、链上/内部指标、风险原因摘要、case 上下文、补件表单
- 操作按钮：重新触发扫描、提交工单、上传材料、升级人工
- Action audit：点击按钮后记录 action id、label、时间

所有数据都是合成 mock 数据，不包含真实 Binance 用户、交易、风控规则或密钥。

## 本地运行

```bash
npm install
npm run dev
```

## GitHub Pages

项目已配置 GitHub Actions 自动部署。推送到 `main` 后会执行 lint、test、build，并把 `dist/` 发布到 GitHub Pages。

发布地址：

```text
https://<github-username>.github.io/a2ui-support-copilot-demo/
```

## 验证

```bash
npm run lint
npm test
npm run build
```

## 结构

```text
src/
├── components/a2ui-renderer.tsx  # A2UI component renderer
├── data/scenarios.ts             # mock support scenarios and envelope streams
├── lib/a2ui-runtime.ts           # JSON Pointer and envelope state builder
├── types/a2ui.ts                 # protocol-ish types
└── App.tsx                       # demo shell
```

## 生产化方向

- 用 JSON Schema 校验模型输出
- 每个 action 绑定 server-side capability，不信任前端 payload
- 高危 action 增加二次确认 surface
- 审计日志落服务端：operator、caseId、surfaceId、action、before/after、model trace
- 将 catalog 拆成正式版本，例如 `com.company.support-copilot/catalog.v1`
