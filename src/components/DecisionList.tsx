import type { Decision } from '../types'
import { CalibrationScore } from './CalibrationScore'

interface DecisionListProps {
  decisions: Decision[]
  onResolve: (id: string, outcome: 'right' | 'wrong') => void
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay === 1) return 'yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function confidenceColor(confidence: number): string {
  if (confidence >= 7) return 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
  if (confidence <= 3) return 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
  return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
}

function DecisionCard({
  decision,
  onResolve,
}: {
  decision: Decision
  onResolve: (id: string, outcome: 'right' | 'wrong') => void
}) {
  const isResolved = decision.outcome !== 'pending'

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:shadow-card-hover ${
        decision.outcome === 'right'
          ? 'border-green-200 bg-green-50/50'
          : decision.outcome === 'wrong'
            ? 'border-red-200 bg-red-50/50'
            : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      style={{
        backgroundColor: isResolved ? undefined : 'var(--surface-primary)',
        borderColor: isResolved ? undefined : 'var(--border-default)'
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium break-words leading-snug" style={{ color: 'var(--text-primary)' }}>
            {decision.text}
          </p>
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${confidenceColor(decision.confidence)}`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {decision.confidence}/10
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatTimestamp(decision.timestamp)}</span>
          </div>
        </div>
        {isResolved && (
          <div
            className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full ${
              decision.outcome === 'right' ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <svg
              className={`w-4 h-4 ${decision.outcome === 'right' ? 'text-green-600' : 'text-red-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              {decision.outcome === 'right' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        {isResolved ? (
          <span
            className={`text-sm font-medium ${
              decision.outcome === 'right' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {decision.outcome === 'right' ? 'Marked as right' : 'Marked as wrong'}
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onResolve(decision.id, 'right')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 active:scale-[0.97] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 min-h-[40px] ring-1 ring-green-200"
              aria-label={`Mark "${decision.text}" as right`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Right
            </button>
            <button
              type="button"
              onClick={() => onResolve(decision.id, 'wrong')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 active:scale-[0.97] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 min-h-[40px] ring-1 ring-red-200"
              aria-label={`Mark "${decision.text}" as wrong`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Wrong
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function DecisionList({ decisions, onResolve }: DecisionListProps) {
  if (decisions.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-gray-200" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
          <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>
        <p className="font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>No decisions yet</p>
        <p className="text-xs mt-1.5 leading-relaxed max-w-[280px] mx-auto" style={{ color: 'var(--text-tertiary)' }}>
          Log your first decision above to start building your calibration score.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <CalibrationScore decisions={decisions} />
      {decisions.map((decision) => (
        <DecisionCard key={decision.id} decision={decision} onResolve={onResolve} />
      ))}
    </div>
  )
}
