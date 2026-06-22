export type Outcome = 'pending' | 'right' | 'wrong'

export interface Decision {
  id: string
  text: string
  confidence: number
  timestamp: number
  outcome: Outcome
}

export interface NewDecision {
  text: string
  confidence: number
  timestamp: number
}
