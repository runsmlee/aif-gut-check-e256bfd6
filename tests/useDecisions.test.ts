import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDecisions } from '../src/hooks/useDecisions'

describe('useDecisions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty array when localStorage is empty', () => {
    const { result } = renderHook(() => useDecisions())
    expect(result.current.decisions).toEqual([])
  })

  it('addDecision persists to localStorage and returns updated list', () => {
    const { result } = renderHook(() => useDecisions())

    act(() => {
      result.current.addDecision('Test decision', 7)
    })

    expect(result.current.decisions).toHaveLength(1)
    expect(result.current.decisions[0].text).toBe('Test decision')
    expect(result.current.decisions[0].confidence).toBe(7)
    expect(result.current.decisions[0].outcome).toBe('pending')

    const stored = JSON.parse(localStorage.getItem('gutcheck-decisions') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Test decision')
  })

  it('resolveDecision updates outcome and persists', () => {
    const { result } = renderHook(() => useDecisions())

    act(() => {
      result.current.addDecision('Test decision', 7)
    })

    const decisionId = result.current.decisions[0].id

    act(() => {
      result.current.resolveDecision(decisionId, 'right')
    })

    expect(result.current.decisions[0].outcome).toBe('right')

    const stored = JSON.parse(localStorage.getItem('gutcheck-decisions') || '[]')
    expect(stored[0].outcome).toBe('right')
  })

  it('survives page reload (reads from localStorage on init)', () => {
    const { result: first } = renderHook(() => useDecisions())

    act(() => {
      first.current.addDecision('Persisted decision', 6)
    })

    // Simulate page reload by rendering a new hook instance
    const { result: second } = renderHook(() => useDecisions())

    expect(second.current.decisions).toHaveLength(1)
    expect(second.current.decisions[0].text).toBe('Persisted decision')
    expect(second.current.decisions[0].confidence).toBe(6)
  })

  it('does not duplicate entries when called with same decision text', () => {
    const { result } = renderHook(() => useDecisions())

    act(() => {
      result.current.addDecision('Same decision', 7)
    })
    act(() => {
      result.current.addDecision('Same decision', 5)
    })

    expect(result.current.decisions).toHaveLength(2)
    expect(result.current.decisions[0].id).not.toBe(result.current.decisions[1].id)
  })
})
