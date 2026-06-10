import {
  AlertTriangle,
  CheckCircle2,
  FileUp,
  Headphones,
  RefreshCw,
  ShieldCheck,
  TicketCheck,
} from 'lucide-react'
import type React from 'react'
import type {
  A2uiAction,
  A2uiComponent,
  A2uiSurfaceState,
  JsonValue,
} from '../types/a2ui'
import { resolveValue } from '../lib/a2ui-runtime'

interface A2uiRendererProps {
  surface: A2uiSurfaceState
  onAction: (action: A2uiAction) => void
}

interface TimelineItem {
  time: string
  title: string
  detail: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
}

const actionIcons = {
  refresh: RefreshCw,
  ticket: TicketCheck,
  upload: FileUp,
  escalate: Headphones,
  shield: ShieldCheck,
}

function asTimelineItems(value: JsonValue | undefined): TimelineItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return []
    }

    const candidate = item as Record<string, JsonValue>
    if (
      typeof candidate.time !== 'string' ||
      typeof candidate.title !== 'string' ||
      typeof candidate.detail !== 'string' ||
      typeof candidate.status !== 'string'
    ) {
      return []
    }

    return [
      {
        time: candidate.time,
        title: candidate.title,
        detail: candidate.detail,
        status: candidate.status as TimelineItem['status'],
      },
    ]
  })
}

function asStringList(value: JsonValue | undefined): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}

function statusText(status: string): string {
  if (status === 'ok') return '正常'
  if (status === 'warning') return '关注'
  if (status === 'danger') return '高危'
  return '信息'
}

export function A2uiRenderer({ surface, onAction }: A2uiRendererProps) {
  return renderComponent(surface.root, surface, onAction)
}

function renderComponent(
  id: string,
  surface: A2uiSurfaceState,
  onAction: (action: A2uiAction) => void,
): React.ReactNode {
  const component = surface.components[id]
  if (!component) {
    return null
  }

  return renderByType(component, surface, onAction)
}

function renderByType(
  component: A2uiComponent,
  surface: A2uiSurfaceState,
  onAction: (action: A2uiAction) => void,
): React.ReactNode {
  const { dataModel } = surface

  switch (component.component) {
    case 'Surface': {
      const title = resolveValue(component.title, dataModel, '')
      const subtitle = component.subtitle
        ? resolveValue(component.subtitle, dataModel, '')
        : ''

      return (
        <article className="surface">
          <header className="surface-header">
            <div>
              <p className="eyebrow">{surface.catalogId}</p>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <span className="surface-id">{surface.surfaceId}</span>
          </header>
          {renderComponent(component.child, surface, onAction)}
        </article>
      )
    }

    case 'Stack':
      return (
        <div className="stack">
          {component.children.map((child) => (
            <div key={child}>{renderComponent(child, surface, onAction)}</div>
          ))}
        </div>
      )

    case 'Section':
      return (
        <section className="panel">
          <h2>{resolveValue(component.title, dataModel, '')}</h2>
          {component.children.map((child) => (
            <div key={child}>{renderComponent(child, surface, onAction)}</div>
          ))}
        </section>
      )

    case 'Text':
      return (
        <p className={`text-line ${component.tone ?? 'default'}`}>
          {resolveValue(component.text, dataModel, '')}
        </p>
      )

    case 'StatusPill': {
      const status = resolveValue(component.status, dataModel, 'neutral')
      return (
        <div className={`status-strip ${status}`}>
          <span>{resolveValue(component.label, dataModel, '')}</span>
          <strong>{statusText(status)}</strong>
        </div>
      )
    }

    case 'MetricStrip':
      return (
        <section className="metric-grid" aria-label="case metrics">
          {component.items.map((item) => {
            const status = item.status
              ? resolveValue(item.status, dataModel, 'neutral')
              : 'neutral'

            return (
              <div className={`metric ${status}`} key={item.label}>
                <span>{item.label}</span>
                <strong>{resolveValue(item.value, dataModel, '-')}</strong>
              </div>
            )
          })}
        </section>
      )

    case 'Timeline': {
      const items = asTimelineItems(resolveValue(component.items, dataModel, []))
      return (
        <section className="panel">
          <h2>状态时间线</h2>
          <ol className="timeline">
            {items.map((item) => (
              <li className={item.status} key={`${item.time}-${item.title}`}>
                <time>{item.time}</time>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )
    }

    case 'RiskSummary': {
      const level = String(resolveValue(component.level, dataModel, '未知'))
      const reasons = asStringList(resolveValue(component.reasons, dataModel, []))
      return (
        <section className="panel risk-panel">
          <h2>风险原因摘要</h2>
          <div className="risk-heading">
            <ShieldCheck aria-hidden="true" size={18} />
            <strong>{level}</strong>
          </div>
          <ul>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
      )
    }

    case 'DetailList':
      return (
        <section className="panel">
          <h2>Case 上下文</h2>
          <dl className="detail-list">
            {component.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{resolveValue(item.value, dataModel, '-')}</dd>
              </div>
            ))}
          </dl>
        </section>
      )

    case 'EvidenceForm':
      return (
        <section className="panel">
          <h2>补充材料</h2>
          <form className="evidence-form">
            {component.fields.map((field) => (
              <label key={field.id}>
                <span>{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea placeholder={field.placeholder} rows={3} />
                ) : (
                  <input
                    type={field.type === 'file' ? 'file' : 'text'}
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}
          </form>
        </section>
      )

    case 'ActionBar':
      return (
        <section className="action-bar" aria-label="case actions">
          {component.actions.map((action) => {
            const Icon = action.icon ? actionIcons[action.icon] : CheckCircle2
            return (
              <button
                className={`action-button ${action.intent ?? 'secondary'}`}
                key={action.id}
                onClick={() => onAction(action)}
                type="button"
              >
                <Icon aria-hidden="true" size={16} />
                <span>{action.label}</span>
              </button>
            )
          })}
        </section>
      )

    default:
      return (
        <div className="unsupported-component">
          <AlertTriangle aria-hidden="true" size={16} />
          Unsupported component
        </div>
      )
  }
}
