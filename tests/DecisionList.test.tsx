import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DecisionList } from '../src/components/DecisionList'
import type { Decision } from '../src/types'

const baseDecision = (overrides: Partial<Decision> = {}): Decision => ({
  id: 'test-id-1',
  text: 'Hire a senior engineer over a junior one',
  confidence: 8,
  timestamp: Date.now(),
  outcome: 'pending',
  ...overrides,
})

describe('DecisionList', () => {
  it('renders without crash', () => {
    render(<DecisionList decisions={[]} onResolve={() => {}} />)
    expect(screen.getByText(/no decisions yet/i)).toBeInTheDocument()
  })

  it('displays "No decisions yet" when list is empty', () => {
    render(<DecisionList decisions={[]} onResolve={() => {}} />)
    expect(screen.getByText(/no decisions yet/i)).toBeInTheDocument()
  })

  it('renders each decision with text, confidence badge, and timestamp', () => {
    const decisions: Decision[] = [
      baseDecision({ id: '1', text: 'Pivot to B2B SaaS', confidence: 9 }),
      baseDecision({ id: '2', text: 'Raise prices 20%', confidence: 4 }),
    ]

    render(<DecisionList decisions={decisions} onResolve={() => {}} />)

    expect(screen.getByText('Pivot to B2B SaaS')).toBeInTheDocument()
    expect(screen.getByText('Raise prices 20%')).toBeInTheDocument()
    expect(screen.getByText('9/10')).toBeInTheDocument()
    expect(screen.getByText('4/10')).toBeInTheDocument()
  })

  it('clicking "Right" on a pending decision marks it resolved-correct', async () => {
    const user = userEvent.setup()
    const onResolve = vi.fn()
    const decisions: Decision[] = [baseDecision({ id: '1' })]

    render(<DecisionList decisions={decisions} onResolve={onResolve} />)

    const rightButton = screen.getByRole('button', { name: /right/i })
    await user.click(rightButton)

    expect(onResolve).toHaveBeenCalledWith('1', 'right')
  })

  it('clicking "Wrong" on a pending decision marks it resolved-incorrect', async () => {
    const user = userEvent.setup()
    const onResolve = vi.fn()
    const decisions: Decision[] = [baseDecision({ id: '1' })]

    render(<DecisionList decisions={decisions} onResolve={onResolve} />)

    const wrongButton = screen.getByRole('button', { name: /wrong/i })
    await user.click(wrongButton)

    expect(onResolve).toHaveBeenCalledWith('1', 'wrong')
  })

  it('shows calibration score (Gut Accuracy: X%) when 3+ decisions have outcomes', () => {
    const decisions: Decision[] = [
      baseDecision({ id: '1', confidence: 8, outcome: 'right' }),
      baseDecision({ id: '2', confidence: 9, outcome: 'right' }),
      baseDecision({ id: '3', confidence: 2, outcome: 'wrong' }),
    ]

    render(<DecisionList decisions={decisions} onResolve={() => {}} />)

    expect(screen.getByText(/gut accuracy/i)).toBeInTheDocument()
    expect(screen.getByTestId('calibration-percentage')).toHaveTextContent('67%')
  })

  it('calibration score correctly computes: (high-confidence decisions that were right) / (total resolved decisions)', () => {
    // 4 resolved: 2 high-conf right (7+), 1 high-conf wrong, 1 low-conf wrong
    // Gut accuracy = 2/4 = 50%
    const decisions: Decision[] = [
      baseDecision({ id: '1', confidence: 8, outcome: 'right' }),
      baseDecision({ id: '2', confidence: 9, outcome: 'right' }),
      baseDecision({ id: '3', confidence: 7, outcome: 'wrong' }),
      baseDecision({ id: '4', confidence: 2, outcome: 'wrong' }),
    ]

    render(<DecisionList decisions={decisions} onResolve={() => {}} />)

    expect(screen.getByTestId('calibration-percentage')).toHaveTextContent('50%')
  })
})
