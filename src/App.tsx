import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  ChevronRight,
  ClipboardList,
  MessageSquareText,
  UserRound,
} from 'lucide-react'
import './App.css'
import { A2uiRenderer } from './components/a2ui-renderer'
import { scenarios } from './data/scenarios'
import { buildSurfaceState } from './lib/a2ui-runtime'
import type { A2uiAction } from './types/a2ui'

interface AuditEvent {
  id: string
  actionId: string
  label: string
  timestamp: string
}

function severityLabel(severity: 'low' | 'medium' | 'high') {
  if (severity === 'high') return 'High'
  if (severity === 'medium') return 'Medium'
  return 'Low'
}

function App() {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id)
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])

  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) ??
    scenarios[0]

  const surface = useMemo(
    () => buildSurfaceState(activeScenario.envelopes),
    [activeScenario],
  )

  function handleScenarioChange(scenarioId: string) {
    setActiveScenarioId(scenarioId)
    setAuditEvents([])
  }

  function handleAction(action: A2uiAction) {
    setAuditEvents((events) => [
      {
        id: crypto.randomUUID(),
        actionId: action.id,
        label: action.label,
        timestamp: new Intl.DateTimeFormat('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date()),
      },
      ...events,
    ])
  }

  return (
    <main className="app-shell">
      <aside className="case-rail" aria-label="support scenarios">
        <header className="brand-bar">
          <div className="brand-mark">A2</div>
          <div>
            <strong>Support Copilot</strong>
            <span>A2UI protocol demo</span>
          </div>
        </header>

        <section className="rail-section">
          <div className="section-title">
            <MessageSquareText aria-hidden="true" size={16} />
            <span>用户问题</span>
          </div>
          <div className="scenario-list">
            {scenarios.map((scenario) => (
              <button
                className={
                  scenario.id === activeScenario.id
                    ? 'scenario-card active'
                    : 'scenario-card'
                }
                key={scenario.id}
                onClick={() => handleScenarioChange(scenario.id)}
                type="button"
              >
                <div>
                  <strong>{scenario.title}</strong>
                  <span>{scenario.category}</span>
                </div>
                <span className={`severity ${scenario.severity}`}>
                  {severityLabel(scenario.severity)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="conversation">
          <div className="chat-bubble user">
            <UserRound aria-hidden="true" size={16} />
            <p>{activeScenario.customerMessage}</p>
          </div>
          <div className="chat-bubble agent">
            <Bot aria-hidden="true" size={16} />
            <p>已生成 case-specific A2UI surface，包含状态、风险摘要、补件表单和可审计操作。</p>
          </div>
        </section>
      </aside>

      <section className="workspace" aria-label="A2UI rendered surface">
        <A2uiRenderer surface={surface} onAction={handleAction} />
      </section>

      <aside className="protocol-panel" aria-label="protocol inspector">
        <section className="inspector-card">
          <div className="section-title">
            <ClipboardList aria-hidden="true" size={16} />
            <span>Envelope Stream</span>
          </div>
          <pre>{JSON.stringify(activeScenario.envelopes, null, 2)}</pre>
        </section>

        <section className="inspector-card audit-card" aria-label="action audit">
          <div className="section-title">
            <Activity aria-hidden="true" size={16} />
            <span>Action Audit</span>
          </div>
          {auditEvents.length === 0 ? (
            <p className="empty-state">点击 surface 里的操作按钮，查看回传事件。</p>
          ) : (
            <ul className="audit-list">
              {auditEvents.map((event) => (
                <li key={event.id}>
                  <ChevronRight aria-hidden="true" size={14} />
                  <div>
                    <strong>{event.label}</strong>
                    <span>
                      {event.actionId} · {event.timestamp}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </main>
  )
}

export default App
