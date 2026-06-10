import { describe, expect, it } from 'vitest'
import { scenarios } from '../data/scenarios'
import { buildSurfaceState, readJsonPointer, resolveValue } from './a2ui-runtime'

describe('a2ui-runtime', () => {
  it('reads JSON pointer values from nested objects and arrays', () => {
    const value = readJsonPointer(
      {
        user: { name: 'Max' },
        timeline: [{ title: 'created' }],
      },
      '/timeline/0/title',
    )

    expect(value).toBe('created')
  })

  it('resolves bindings with a fallback', () => {
    const dataModel = { case: { title: 'Withdrawal delay' } }

    expect(resolveValue({ path: '/case/title' }, dataModel, '')).toBe(
      'Withdrawal delay',
    )
    expect(resolveValue({ path: '/missing' }, dataModel, 'fallback')).toBe(
      'fallback',
    )
  })

  it('builds a renderable surface from an envelope stream', () => {
    const surface = buildSurfaceState(scenarios[0].envelopes)

    expect(surface.surfaceId).toBe('withdrawal')
    expect(surface.root).toBe('root')
    expect(surface.components.root?.component).toBe('Surface')
    expect(surface.dataModel.case).toBeTruthy()
  })
})
