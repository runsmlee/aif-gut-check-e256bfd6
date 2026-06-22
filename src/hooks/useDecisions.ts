import { useState, useCallback } from 'react'
import type { Decision, Outcome } from '../types'

const STORAGE_KEY = 'gutcheck-decisions'

function loadDecisions(): Decision[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Decision[]
  } catch {
    return []
  }
}

function saveDecisions(decisions: Decision[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>(() => loadDecisions())

  const addDecision = useCallback((text: string, confidence: number) => {
    setDecisions((prev) => {
      const newDecision: Decision = {
        id: generateId(),
        text,
        confidence,
        timestamp: Date.now(),
        outcome: 'pending',
      }
      const updated = [newDecision, ...prev]
      saveDecisions(updated)
      return updated
    })
  }, [])

  const resolveDecision = useCallback((id: string, outcome: Outcome) => {
    setDecisions((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, outcome } : d
      )
      saveDecisions(updated)
      return updated
    })
  }, [])

  return { decisions, addDecision, resolveDecision }
}
