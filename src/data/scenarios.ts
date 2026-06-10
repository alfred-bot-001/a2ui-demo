import type { A2uiComponent, SupportScenario } from '../types/a2ui'

const supportCatalog = 'com.binance.support-copilot/catalog.v0'

const baseComponents = (surfaceId: string): A2uiComponent[] => [
  {
    id: 'root',
    component: 'Surface',
    title: { path: '/case/title' },
    subtitle: { path: '/case/subtitle' },
    child: 'content',
  },
  {
    id: 'content',
    component: 'Stack',
    children: [
      'status',
      'metrics',
      'timeline',
      'risk',
      'details',
      'evidence',
      'actions',
    ],
  },
  {
    id: 'status',
    component: 'StatusPill',
    label: { path: '/case/statusLabel' },
    status: { path: '/case/status' },
  },
  {
    id: 'metrics',
    component: 'MetricStrip',
    items: [
      {
        label: '链上确认',
        value: { path: '/metrics/confirmations' },
        status: { path: '/metrics/confirmationStatus' },
      },
      {
        label: '内部状态',
        value: { path: '/metrics/internalState' },
        status: { path: '/metrics/internalStatus' },
      },
      {
        label: 'SLA',
        value: { path: '/metrics/sla' },
        status: { path: '/metrics/slaStatus' },
      },
    ],
  },
  {
    id: 'timeline',
    component: 'Timeline',
    items: { path: '/timeline' },
  },
  {
    id: 'risk',
    component: 'RiskSummary',
    level: { path: '/risk/level' },
    reasons: { path: '/risk/reasons' },
  },
  {
    id: 'details',
    component: 'DetailList',
    items: [
      { label: 'Case ID', value: { path: '/case/id' } },
      { label: '用户分层', value: { path: '/case/tier' } },
      { label: '资产 / 网络', value: { path: '/case/assetNetwork' } },
      { label: '最近动作', value: { path: '/case/latestAction' } },
    ],
  },
  {
    id: 'evidence',
    component: 'EvidenceForm',
    fields:
      surfaceId === 'kyc'
        ? [
            {
              id: 'documentId',
              label: '证件号码后四位',
              placeholder: '例如 9281',
              type: 'text',
            },
            {
              id: 'note',
              label: '用户补充说明',
              placeholder: '让用户说明证件有效期、姓名拼写或居住地变化',
              type: 'textarea',
            },
            { id: 'attachment', label: '材料截图', type: 'file' },
          ]
        : [
            {
              id: 'txid',
              label: 'TXID / Hash',
              placeholder: '0x... 或链上交易哈希',
              type: 'text',
            },
            {
              id: 'memo',
              label: 'Memo / Tag',
              placeholder: '需要时填写 memo、tag 或 reference id',
              type: 'text',
            },
            { id: 'attachment', label: '用户截图', type: 'file' },
          ],
  },
  {
    id: 'actions',
    component: 'ActionBar',
    actions: [
      {
        id: 'rescan',
        label: '重新触发扫描',
        intent: 'primary',
        icon: 'refresh',
      },
      {
        id: 'ticket',
        label: '提交工单',
        intent: 'secondary',
        icon: 'ticket',
      },
      {
        id: 'upload',
        label: '上传材料',
        intent: 'secondary',
        icon: 'upload',
      },
      {
        id: 'escalate',
        label: '升级人工',
        intent: surfaceId === 'risk' ? 'danger' : 'secondary',
        icon: 'escalate',
      },
    ],
  },
]

export const scenarios: SupportScenario[] = [
  {
    id: 'withdrawal',
    title: '提现卡住',
    customerMessage: '我的 USDT 提现 40 分钟了还没到账，页面一直显示处理中。',
    category: 'Wallet Ops',
    severity: 'high',
    envelopes: [
      {
        version: 'v0.9',
        createSurface: {
          surfaceId: 'withdrawal',
          catalogId: supportCatalog,
          root: 'root',
          sendDataModel: true,
        },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'withdrawal',
          components: baseComponents('withdrawal'),
        },
      },
      {
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'withdrawal',
          value: {
            case: {
              id: 'SUP-984312',
              title: 'USDT 提现延迟排查',
              subtitle: 'Agent 识别为链上广播后确认延迟，建议先重扫再升级钱包队列。',
              statusLabel: '处理中',
              status: 'warning',
              tier: 'VIP 2',
              assetNetwork: 'USDT / TRON',
              latestAction: '提现广播成功，内部回调未完成',
            },
            metrics: {
              confirmations: '12 / 20',
              confirmationStatus: 'warning',
              internalState: 'broadcasted',
              internalStatus: 'warning',
              sla: '18m left',
              slaStatus: 'ok',
            },
            timeline: [
              {
                time: '09:17',
                title: '用户创建提现',
                detail: '地址格式校验通过，风控预检通过。',
                status: 'ok',
              },
              {
                time: '09:21',
                title: '热钱包广播',
                detail: '链上交易已广播，等待足够确认数。',
                status: 'ok',
              },
              {
                time: '09:42',
                title: '内部回调等待',
                detail: 'callback queue 延迟，建议触发 scanner replay。',
                status: 'warning',
              },
            ],
            risk: {
              level: '低风险',
              reasons: ['地址非新地址', '账户近期无异常登录', '金额低于人工复核阈值'],
            },
          },
        },
      },
    ],
  },
  {
    id: 'kyc',
    title: 'KYC 失败',
    customerMessage: '我提交了身份认证，但是系统一直说审核失败，为什么？',
    category: 'KYC',
    severity: 'medium',
    envelopes: [
      {
        version: 'v0.9',
        createSurface: {
          surfaceId: 'kyc',
          catalogId: supportCatalog,
          root: 'root',
          sendDataModel: true,
        },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'kyc',
          components: baseComponents('kyc'),
        },
      },
      {
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'kyc',
          value: {
            case: {
              id: 'SUP-984401',
              title: 'KYC 失败说明与补件',
              subtitle: 'Agent 返回可解释原因，不暴露具体审核规则。',
              statusLabel: '需要用户补件',
              status: 'warning',
              tier: 'Retail',
              assetNetwork: 'Identity / Level 2',
              latestAction: '证件图片质量不足，地址信息不完整',
            },
            metrics: {
              confirmations: 'N/A',
              confirmationStatus: 'neutral',
              internalState: 'manual-review',
              internalStatus: 'warning',
              sla: '6h',
              slaStatus: 'ok',
            },
            timeline: [
              {
                time: '08:13',
                title: '用户提交认证',
                detail: '证件正反面、自拍、地址证明上传完成。',
                status: 'ok',
              },
              {
                time: '08:18',
                title: '自动审核未通过',
                detail: '可解释层提示为图片清晰度和地址字段不完整。',
                status: 'warning',
              },
              {
                time: '08:20',
                title: '等待补充材料',
                detail: '建议请求用户重传清晰证件与地址证明。',
                status: 'neutral',
              },
            ],
            risk: {
              level: '中风险',
              reasons: ['文档信息不完整', '图片质量低', '没有命中制裁或高危地区规则'],
            },
          },
        },
      },
    ],
  },
  {
    id: 'deposit',
    title: '充值没到账',
    customerMessage: '我从钱包转了 BNB 到交易所，链上显示成功，但是账户没有余额。',
    category: 'Deposit',
    severity: 'high',
    envelopes: [
      {
        version: 'v0.9',
        createSurface: {
          surfaceId: 'deposit',
          catalogId: supportCatalog,
          root: 'root',
          sendDataModel: true,
        },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'deposit',
          components: baseComponents('deposit'),
        },
      },
      {
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'deposit',
          value: {
            case: {
              id: 'SUP-984588',
              title: 'BNB 充值未入账',
              subtitle: 'Agent 判断为 memo/tag 缺失或网络选择不一致，需要用户补 TXID。',
              statusLabel: '待定位',
              status: 'warning',
              tier: 'VIP 1',
              assetNetwork: 'BNB / BSC',
              latestAction: '链上成功，内部 deposit matcher 未匹配',
            },
            metrics: {
              confirmations: '58 / 15',
              confirmationStatus: 'ok',
              internalState: 'unmatched',
              internalStatus: 'danger',
              sla: 'breached',
              slaStatus: 'danger',
            },
            timeline: [
              {
                time: '07:31',
                title: '链上交易成功',
                detail: '确认数已满足入账要求。',
                status: 'ok',
              },
              {
                time: '07:34',
                title: '内部 matcher 未匹配',
                detail: '地址命中，但 memo/tag 字段缺失。',
                status: 'danger',
              },
              {
                time: '07:58',
                title: '建议创建人工入账工单',
                detail: '需要用户提交 TXID、来源地址、截图。',
                status: 'warning',
              },
            ],
            risk: {
              level: '中风险',
              reasons: ['memo/tag 缺失', '金额与历史行为一致', '无制裁地址命中'],
            },
          },
        },
      },
    ],
  },
  {
    id: 'risk',
    title: '账户被风控',
    customerMessage: '我的账户突然被限制提现，客服说是风险控制，可以帮我解除吗？',
    category: 'Risk Control',
    severity: 'high',
    envelopes: [
      {
        version: 'v0.9',
        createSurface: {
          surfaceId: 'risk',
          catalogId: supportCatalog,
          root: 'root',
          sendDataModel: true,
        },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'risk',
          components: baseComponents('risk'),
        },
      },
      {
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'risk',
          value: {
            case: {
              id: 'SUP-984612',
              title: '账户提现限制解释',
              subtitle: 'Agent 只能提供可解释摘要和材料入口，解除限制必须人工审核。',
              statusLabel: '受限',
              status: 'danger',
              tier: 'Retail',
              assetNetwork: 'Account / Withdrawal',
              latestAction: '触发账户安全复核',
            },
            metrics: {
              confirmations: 'N/A',
              confirmationStatus: 'neutral',
              internalState: 'restricted',
              internalStatus: 'danger',
              sla: '24h',
              slaStatus: 'warning',
            },
            timeline: [
              {
                time: '01:12',
                title: '异常登录提醒',
                detail: '新设备、新地区登录，用户已完成 2FA。',
                status: 'warning',
              },
              {
                time: '01:16',
                title: '提现风控限制',
                detail: '限制原因仅返回可解释层，细粒度规则不展示。',
                status: 'danger',
              },
              {
                time: '09:00',
                title: '等待人工复核',
                detail: '需要用户补充设备、身份和资金来源材料。',
                status: 'neutral',
              },
            ],
            risk: {
              level: '高风险',
              reasons: ['新设备登录', '提现行为变化', '需要人工复核后才能解除'],
            },
          },
        },
      },
    ],
  },
]
