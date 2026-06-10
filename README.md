# A2UI Customer Help Demo

客户视角的账户帮助演示项目。场景模拟用户询问提现卡住、KYC 补件、充值没到账、账户被风控时，Agent 返回一段 A2UI-style JSON envelope stream，前端 renderer 将其渲染成用户可以直接操作的帮助界面。

## 演示内容

- 用户问题列表和对话上下文
- A2UI envelope stream：`createSurface`、`updateComponents`、`updateDataModel`
- 动态 surface：状态时间线、用户可理解的状态指标、友好原因摘要、补件表单
- KYC 客户端恢复流程：补件检查清单、可接受材料示例、重新上传、更新资料、联系人工客服
- 主界面隐藏内部 `catalogId`、`surfaceId`、`Case ID` 等字段
- 右侧保留 A2UI envelope 和 action events，方便演示协议层

所有数据都是合成 mock 数据，不包含真实 Binance 用户、交易、风控规则或密钥。

## 本地运行

```bash
npm install
npm run dev
```

## GitHub Pages

项目使用 `gh-pages` 分支发布。发布前执行：

```bash
npm run lint
npm test
npm run build
```

然后将 `dist/` 内容推送到 `gh-pages` 分支根目录。

发布地址：

```text
https://alfred-bot-001.github.io/a2ui-demo/
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
