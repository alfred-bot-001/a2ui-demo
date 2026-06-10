export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface Binding {
  path: string
}

export type BoundValue<T> = T | Binding

export interface A2uiAction {
  id: string
  label: string
  intent?: 'primary' | 'secondary' | 'danger'
  icon?: 'refresh' | 'ticket' | 'upload' | 'escalate' | 'shield'
}

interface BaseComponent {
  id: string
  component: string
}

export interface SurfaceComponent extends BaseComponent {
  component: 'Surface'
  title: BoundValue<string>
  subtitle?: BoundValue<string>
  child: string
}

export interface SectionComponent extends BaseComponent {
  component: 'Section'
  title: BoundValue<string>
  children: string[]
}

export interface TextComponent extends BaseComponent {
  component: 'Text'
  text: BoundValue<string>
  tone?: 'default' | 'muted' | 'warning' | 'danger' | 'success'
}

export interface StatusPillComponent extends BaseComponent {
  component: 'StatusPill'
  label: BoundValue<string>
  status: BoundValue<'ok' | 'warning' | 'danger' | 'neutral'>
}

export interface MetricStripComponent extends BaseComponent {
  component: 'MetricStrip'
  items: Array<{
    label: string
    value: BoundValue<string>
    status?: BoundValue<'ok' | 'warning' | 'danger' | 'neutral'>
  }>
}

export interface TimelineComponent extends BaseComponent {
  component: 'Timeline'
  items: Binding
}

export interface RiskSummaryComponent extends BaseComponent {
  component: 'RiskSummary'
  title?: BoundValue<string>
  level: Binding
  reasons: Binding
}

export interface ChecklistComponent extends BaseComponent {
  component: 'Checklist'
  title: BoundValue<string>
  items: Binding
}

export interface DocumentGuideComponent extends BaseComponent {
  component: 'DocumentGuide'
  title: BoundValue<string>
  items: Binding
}

export interface DetailListComponent extends BaseComponent {
  component: 'DetailList'
  items: Array<{
    label: string
    value: BoundValue<string>
  }>
}

export interface EvidenceFormComponent extends BaseComponent {
  component: 'EvidenceForm'
  fields: Array<{
    id: string
    label: string
    placeholder?: string
    type: 'text' | 'textarea' | 'file' | 'select'
    options?: string[]
  }>
}

export interface ActionBarComponent extends BaseComponent {
  component: 'ActionBar'
  actions: A2uiAction[]
}

export interface StackComponent extends BaseComponent {
  component: 'Stack'
  children: string[]
}

export type A2uiComponent =
  | SurfaceComponent
  | SectionComponent
  | TextComponent
  | StatusPillComponent
  | MetricStripComponent
  | TimelineComponent
  | RiskSummaryComponent
  | ChecklistComponent
  | DocumentGuideComponent
  | DetailListComponent
  | EvidenceFormComponent
  | ActionBarComponent
  | StackComponent

export interface CreateSurfaceEnvelope {
  version: 'v0.9'
  createSurface: {
    surfaceId: string
    catalogId: string
    root: string
    sendDataModel?: boolean
  }
}

export interface UpdateComponentsEnvelope {
  version: 'v0.9'
  updateComponents: {
    surfaceId: string
    components: A2uiComponent[]
  }
}

export interface UpdateDataModelEnvelope {
  version: 'v0.9'
  updateDataModel: {
    surfaceId: string
    value: Record<string, JsonValue>
  }
}

export type A2uiEnvelope =
  | CreateSurfaceEnvelope
  | UpdateComponentsEnvelope
  | UpdateDataModelEnvelope

export interface A2uiSurfaceState {
  surfaceId: string
  catalogId: string
  root: string
  sendDataModel: boolean
  components: Record<string, A2uiComponent>
  dataModel: Record<string, JsonValue>
}

export interface SupportScenario {
  id: string
  title: string
  customerMessage: string
  category: string
  severity: 'low' | 'medium' | 'high'
  envelopes: A2uiEnvelope[]
}
