import type {
  A2uiEnvelope,
  A2uiSurfaceState,
  Binding,
  JsonValue,
} from '../types/a2ui'

export function isBinding<T>(value: T | Binding): value is Binding {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'path' in value &&
    typeof (value as Binding).path === 'string'
  )
}

export function readJsonPointer(
  dataModel: Record<string, JsonValue>,
  path: string,
): JsonValue | undefined {
  if (path === '' || path === '/') {
    return dataModel
  }

  const segments = path
    .replace(/^\//, '')
    .split('/')
    .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))

  let current: JsonValue | undefined = dataModel
  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = Number(segment)
      current = Number.isInteger(index) ? current[index] : undefined
      continue
    }

    if (current && typeof current === 'object') {
      current = (current as Record<string, JsonValue>)[segment]
      continue
    }

    return undefined
  }

  return current
}

export function resolveValue<T>(
  value: T | Binding,
  dataModel: Record<string, JsonValue>,
  fallback: T,
): T {
  if (!isBinding(value)) {
    return value
  }

  const resolved = readJsonPointer(dataModel, value.path)
  return resolved === undefined ? fallback : (resolved as T)
}

export function buildSurfaceState(envelopes: A2uiEnvelope[]): A2uiSurfaceState {
  const createSurface = envelopes.find((envelope) => 'createSurface' in envelope)
  if (!createSurface || !('createSurface' in createSurface)) {
    throw new Error('A2UI stream must start with createSurface.')
  }

  const state: A2uiSurfaceState = {
    surfaceId: createSurface.createSurface.surfaceId,
    catalogId: createSurface.createSurface.catalogId,
    root: createSurface.createSurface.root,
    sendDataModel: Boolean(createSurface.createSurface.sendDataModel),
    components: {},
    dataModel: {},
  }

  for (const envelope of envelopes) {
    if ('updateComponents' in envelope) {
      for (const component of envelope.updateComponents.components) {
        state.components[component.id] = component
      }
    }

    if ('updateDataModel' in envelope) {
      state.dataModel = {
        ...state.dataModel,
        ...envelope.updateDataModel.value,
      }
    }
  }

  return state
}
