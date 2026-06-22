import { useEffect, useCallback } from 'react'
import { DecisionLogger } from './components/DecisionLogger'
import { DecisionList } from './components/DecisionList'
import { useDecisions } from './hooks/useDecisions'

function trackEvent(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.aif?.track) {
    window.aif.track(event, props)
  }
}

export default function App() {
  const { decisions, addDecision, resolveDecision } = useDecisions()

  useEffect(() => {
    trackEvent('page_view')
  }, [])

  const handleLog = useCallback(
    (payload: { text: string; confidence: number; timestamp: number }) => {
      addDecision(payload.text, payload.confidence)
      trackEvent('decision_logged', {
        confidence: payload.confidence,
        text_length: payload.text.length,
      })
    },
    [addDecision]
  )

  const handleResolve = useCallback(
    (id: string, outcome: 'right' | 'wrong') => {
      resolveDecision(id, outcome)
      trackEvent('outcome_marked', { outcome })
    },
    [resolveDecision]
  )

  const resolvedCount = decisions.filter(
    (d) => d.outcome === 'right' || d.outcome === 'wrong'
  ).length

  useEffect(() => {
    if (resolvedCount >= 3) {
      trackEvent('calibration_viewed', { resolved_count: resolvedCount })
    }
  }, [resolvedCount])

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: 'var(--surface-secondary)' }}>
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-wide text-gray-400 uppercase">Founder Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Gut Check
          </h1>
          <p className="mt-2 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Calibrate your founder judgment — one decision at a time.
          </p>
        </header>

        {/* Hero: Decision Logger */}
        <section
          aria-label="Log a decision"
          className="rounded-2xl shadow-card border border-gray-200 p-5 sm:p-7 mb-8 transition-shadow duration-300 animate-fade-in-up"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            animationDelay: '0.05s'
          }}
        >
          <DecisionLogger onLog={handleLog} />
        </section>

        {/* Decision History */}
        <section aria-label="Decision history" className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              History
            </h2>
            {decisions.length > 0 && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500" style={{ backgroundColor: 'var(--surface-tertiary)', color: 'var(--text-tertiary)' }}>
                {decisions.length} {decisions.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>
          <DecisionList decisions={decisions} onResolve={handleResolve} />
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-gray-200 text-center" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            Your decisions are stored locally on this device.
          </p>
        </footer>
      </div>
    </div>
  )
}
