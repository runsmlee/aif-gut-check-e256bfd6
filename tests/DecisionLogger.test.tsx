import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DecisionLogger } from '../src/components/DecisionLogger'

describe('DecisionLogger', () => {
  it('renders without crash', () => {
    render(<DecisionLogger onLog={() => {}} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('text input is auto-focused on mount', () => {
    render(<DecisionLogger onLog={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveFocus()
  })

  it('confidence slider defaults to 5', () => {
    render(<DecisionLogger onLog={() => {}} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveValue('5')
  })

  it('typing a decision and clicking "Log It" calls onLog with correct payload', async () => {
    const user = userEvent.setup()
    const onLog = vi.fn()
    render(<DecisionLogger onLog={onLog} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Cut the freemium tier, go paid-only')

    const button = screen.getByRole('button', { name: /log it/i })
    await user.click(button)

    expect(onLog).toHaveBeenCalledTimes(1)
    const payload = onLog.mock.calls[0][0]
    expect(payload.text).toBe('Cut the freemium tier, go paid-only')
    expect(payload.confidence).toBe(5)
    expect(typeof payload.timestamp).toBe('number')
  })

  it('empty decision text shows inline validation message and does not submit', async () => {
    const user = userEvent.setup()
    const onLog = vi.fn()
    render(<DecisionLogger onLog={onLog} />)

    const button = screen.getByRole('button', { name: /log it/i })
    await user.click(button)

    expect(onLog).not.toHaveBeenCalled()
    expect(screen.getByText(/enter a decision/i)).toBeInTheDocument()
  })

  it('confidence slider value updates as user drags', () => {
    render(<DecisionLogger onLog={() => {}} />)

    const slider = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '9' } })

    expect(slider).toHaveValue('9')
  })

  it('submit button shows the current confidence number (e.g. "Log It — 7/10 gut")', () => {
    render(<DecisionLogger onLog={() => {}} />)

    const slider = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '7' } })

    const button = screen.getByRole('button', { name: /log it/i })
    expect(button).toHaveTextContent('7')
    expect(button).toHaveTextContent('/10')
  })
})
