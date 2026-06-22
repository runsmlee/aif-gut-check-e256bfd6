import type { Decision } from '../types'

interface CalibrationScoreProps {
  decisions: Decision[]
}

/**
 * Gut Accuracy = (high-confidence decisions that were right) / (total resolved decisions)
 * High-confidence = confidence >= 7
 */
export function computeGutAccuracy(decisions: Decision[]): number | null {
  const resolved = decisions.filter((d) => d.outcome === 'right' || d.outcome === 'wrong')
  if (resolved.length < 3) return null

  const highConfRight = resolved.filter(
    (d) => d.confidence >= 7 && d.outcome === 'right'
  ).length

  return Math.round((highConfRight / resolved.length) * 100)
}

export function CalibrationScore({ decisions }: CalibrationScoreProps) {
  const accuracy = computeGutAccuracy(decisions)

  if (accuracy === null) return null

  const resolved = decisions.filter((d) => d.outcome === 'right' || d.outcome === 'wrong')
  const highConfRight = resolved.filter(
    (d) => d.confidence >= 7 && d.outcome === 'right'
  ).length

  const statusColor =
    accuracy >= 70 ? { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50', ring: 'ring-green-200' } :
    accuracy >= 50 ? { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', ring: 'ring-amber-200' } :
    { bg: 'bg-brand-500', text: 'text-brand-600', light: 'bg-brand-50', ring: 'ring-brand-200' }

  const statusLabel =
    accuracy >= 70 ? 'Well-calibrated' :
    accuracy >= 50 ? 'Moderately reliable' :
    'Needs more data'

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-card relative overflow-hidden"
      role="region"
      aria-label="Gut calibration score"
    >
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.03] -mr-12 -mt-12 pointer-events-none" style={{ background: 'radial-gradient(circle, #EF4444 0%, transparent 70%)' }} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Gut Accuracy</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor.light} ${statusColor.text} ring-1 ${statusColor.ring}`}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }} data-testid="calibration-percentage">
              {accuracy}<span className="text-xl font-semibold text-gray-400">%</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>High-conf calls right</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            {highConfRight} / {resolved.length} resolved
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
        <div
          className={`h-full rounded-full ${statusColor.bg} transition-all duration-500 ease-out-expo`}
          style={{ width: `${accuracy}%` }}
        />
      </div>

      <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
        Of your resolved decisions, <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{accuracy}%</span> were high-confidence calls that turned out right.
        {accuracy >= 70
          ? ' Your gut is well-calibrated.'
          : accuracy >= 50
            ? ' Your gut is moderately reliable — keep tracking.'
            : ' Your gut may need more data points before you trust it fully.'}
      </p>
    </div>
  )
}
