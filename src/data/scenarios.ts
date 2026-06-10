import type { A2uiComponent, SupportScenario } from '../types/a2ui'

const supportCatalog = 'com.binance.support-copilot/catalog.v0'

const baseComponents = (surfaceId: string): A2uiComponent[] => [
  {
    id: 'root',
    component: 'Surface',
    eyebrow: { path: '/case/contextLabel' },
    title: { path: '/case/title' },
    subtitle: { path: '/case/subtitle' },
    child: 'content',
  },
  {
    id: 'content',
    component: 'Stack',
    children:
      surfaceId === 'kyc'
        ? [
            'status',
            'metrics',
            'timeline',
            'risk',
            'checklist',
            'examples',
            'details',
            'evidence',
            'actions',
          ]
        : [
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
    items:
      surfaceId === 'kyc'
        ? [
            {
              label: '当前步骤',
              value: { path: '/metrics/currentStep' },
              status: { path: '/metrics/currentStepStatus' },
            },
            {
              label: '重新审核',
              value: { path: '/metrics/reviewEta' },
              status: { path: '/metrics/reviewEtaStatus' },
            },
            {
              label: '下一动作',
              value: { path: '/metrics/nextAction' },
              status: { path: '/metrics/nextActionStatus' },
            },
          ]
        : [
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
    title: surfaceId === 'kyc' ? '认证进度' : '状态时间线',
    items: { path: '/timeline' },
  },
  {
    id: 'risk',
    component: 'RiskSummary',
    title: surfaceId === 'kyc' ? '需要调整的地方' : '风险原因摘要',
    level: { path: '/risk/level' },
    reasons: { path: '/risk/reasons' },
  },
  ...(surfaceId === 'kyc'
    ? [
        {
          id: 'checklist',
          component: 'Checklist',
          title: '重新上传前检查',
          items: { path: '/checklist' },
        } satisfies A2uiComponent,
        {
          id: 'examples',
          component: 'DocumentGuide',
          title: '可接受的材料示例',
          items: { path: '/documentExamples' },
        } satisfies A2uiComponent,
      ]
    : []),
  {
    id: 'details',
    component: 'DetailList',
    title: surfaceId === 'kyc' ? '认证概况' : 'Case 上下文',
    items:
      surfaceId === 'kyc'
        ? [
            { label: '认证等级', value: { path: '/case/tier' } },
            { label: '需要补充', value: { path: '/case/assetNetwork' } },
            { label: '预计重新审核', value: { path: '/metrics/reviewEta' } },
            { label: '下一步', value: { path: '/case/latestAction' } },
          ]
        : [
            { label: 'Case ID', value: { path: '/case/id' } },
            { label: '用户分层', value: { path: '/case/tier' } },
            { label: '资产 / 网络', value: { path: '/case/assetNetwork' } },
            { label: '最近动作', value: { path: '/case/latestAction' } },
          ],
  },
  {
    id: 'evidence',
    component: 'EvidenceForm',
    title: surfaceId === 'kyc' ? '提交补充材料' : '补充材料',
    fields:
      surfaceId === 'kyc'
        ? [
            {
              id: 'documentType',
              label: '证件类型',
              type: 'select',
              options: ['护照', '身份证', '驾照'],
            },
            {
              id: 'proofType',
              label: '地址证明类型',
              type: 'select',
              options: ['银行账单', '水电账单', '政府信件'],
            },
            {
              id: 'legalName',
              label: '姓名拼写确认',
              placeholder: '和证件保持完全一致',
              type: 'text',
            },
            {
              id: 'note',
              label: '用户补充说明',
              placeholder: '例如近期更换地址、姓名拼写差异或证件更新',
              type: 'textarea',
            },
            { id: 'attachment', label: '上传补充材料', type: 'file' },
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
    actions:
      surfaceId === 'kyc'
        ? [
            {
              id: 'kyc.upload_document',
              label: '重新上传材料',
              intent: 'primary',
              icon: 'upload',
            },
            {
              id: 'kyc.update_profile',
              label: '更新个人资料',
              intent: 'secondary',
              icon: 'shield',
            },
            {
              id: 'kyc.view_document_examples',
              label: '查看材料示例',
              intent: 'secondary',
              icon: 'ticket',
            },
            {
              id: 'kyc.request_manual_review',
              label: '联系人工客服',
              intent: 'secondary',
              icon: 'escalate',
            },
          ]
        : [
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
    title: 'KYC 补件助手',
    customerMessage:
      '我身份认证一直失败，为什么？我已经上传过证件了，下一步该怎么做？',
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
              contextLabel: '身份认证帮助',
              title: '身份认证需要补充材料',
              subtitle:
                '你的证件和人脸验证已经通过，只需要重新提交一份符合要求的地址证明。',
              statusLabel: '需要补充地址证明',
              status: 'warning',
              tier: 'Level 2 身份认证',
              assetNetwork: '地址证明',
              latestAction: '上传一份 90 天内、姓名和地址清晰可见的文件',
            },
            metrics: {
              currentStep: '地址验证',
              currentStepStatus: 'warning',
              reviewEta: '10-30 分钟',
              reviewEtaStatus: 'ok',
              nextAction: '重新上传',
              nextActionStatus: 'warning',
            },
            timeline: [
              {
                time: '10:12',
                title: '提交身份材料',
                detail: '护照、人脸验证和地址证明已提交。',
                status: 'ok',
              },
              {
                time: '10:14',
                title: '证件读取完成',
                detail: '证件号码和姓名已成功识别。',
                status: 'ok',
              },
              {
                time: '10:16',
                title: '人脸验证通过',
                detail: '自拍与证件照片匹配，当前无需重新做人脸验证。',
                status: 'ok',
              },
              {
                time: '10:18',
                title: '地址证明需要补充',
                detail: '文件日期超过 90 天，且姓名拼写与账户资料不完全一致。',
                status: 'neutral',
              },
            ],
            risk: {
              level: '请重新提交地址证明',
              reasons: [
                '当前文件日期超过 90 天，不能用于本次认证',
                '图片边缘被裁切，地址没有完整显示',
                '姓名拼写需要和账户资料保持一致',
              ],
            },
            checklist: [
              {
                title: '文件日期在 90 天内',
                detail: '银行账单、水电账单或政府信件需要显示近期日期。',
                status: 'warning',
              },
              {
                title: '姓名和账户资料一致',
                detail: '大小写、空格、中间名需要和证件或资料保持一致。',
                status: 'warning',
              },
              {
                title: '图片四角完整',
                detail: '不要裁切边缘，避免反光、遮挡和二次压缩。',
                status: 'neutral',
              },
            ],
            documentExamples: [
              {
                title: '银行账单',
                detail: '需包含姓名、完整地址、银行名称和 90 天内日期。',
              },
              {
                title: '水电账单',
                detail: '电费、水费、燃气账单均可，截图需完整显示页眉和地址。',
              },
              {
                title: '政府信件',
                detail: '税务、居住证明或官方机构信件，需显示签发机构。',
              },
            ],
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
