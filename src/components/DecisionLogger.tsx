import { useState, useRef, useEffect } from 'react'
import { ConfidenceSlider } from './ConfidenceSlider'

interface DecisionLoggerProps {
  onLog: (payload: { text: string; confidence: number; timestamp: number }) => void
}

export function DecisionLogger({ onLog }: DecisionLoggerProps) {
  const [text, setText] = useState('')
  const [confidence, setConfidence] = useState(5)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      setError(true)
      return
    }
    setError(false)
    onLog({ text: trimmed, confidence, timestamp: Date.now() })
    setText('')
    setConfidence(5)
    // Re-focus after submit
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="space-y-5">
        <div>
          <label htmlFor="decision" className="sr-only">
            What did you decide?
          </label>
          <input
            ref={inputRef}
            id="decision"
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (error) setError(false)
            }}
            placeholder="What did you just decide?"
            className={`w-full px-4 py-3.5 text-base rounded-xl transition-all duration-200 placeholder:text-gray-400 ${
              error
                ? 'border-2 border-brand-500 bg-brand-50'
                : 'border border-gray-300 hover:border-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
            } focus:outline-none`}
            style={{
              backgroundColor: 'var(--surface-primary)',
              color: 'var(--text-primary)'
            }}
            aria-invalid={error}
            aria-describedby={error ? 'decision-error' : undefined}
            autoComplete="off"
          />
          {error && (
            <p id="decision-error" className="mt-2 text-sm text-brand-600 flex items-center gap-1.5 animate-fade-in" role="alert">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Enter a decision before logging it.
            </p>
          )}
        </div>

        <ConfidenceSlider value={confidence} onChange={setConfidence} />

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-brand-500 text-white font-semibold rounded-xl shadow-brand hover:bg-brand-600 hover:shadow-brand-hover active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 min-h-[48px] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Log It
          <span className="opacity-75 font-normal">— {confidence}/10 gut</span>
        </button>
      </div>
    </form>
  )
}
