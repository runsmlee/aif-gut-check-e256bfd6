interface ConfidenceSliderProps {
  value: number
  onChange: (value: number) => void
}

export function ConfidenceSlider({ value, onChange }: ConfidenceSliderProps) {
  const fillPercent = ((value - 1) / 9) * 100
  const label =
    value <= 2 ? 'Very uncertain' :
    value <= 4 ? 'Leaning uncertain' :
    value <= 6 ? 'Balanced' :
    value <= 8 ? 'Fairly confident' :
    'All in'

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="confidence" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Gut Confidence
        </label>
        <div className="flex items-baseline gap-2">
          <span
            className="text-xl font-bold tabular-nums transition-colors duration-200"
            style={{ color: value >= 7 ? '#EF4444' : value <= 3 ? '#9CA3AF' : '#F59E0B' }}
            aria-live="polite"
          >
            {value}
          </span>
          <span className="text-sm font-medium text-gray-400">/10</span>
        </div>
      </div>
      <input
        id="confidence"
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ ['--slider-fill' as string]: `${fillPercent}%` }}
        aria-label="Gut confidence level from 1 to 10"
        aria-valuetext={`${value} out of 10 — ${label}`}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Uncertain</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 transition-colors duration-200" style={{ color: value >= 7 ? '#EF4444' : 'var(--text-tertiary)', backgroundColor: 'var(--surface-tertiary)' }}>
          {label}
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Certain</span>
      </div>
    </div>
  )
}
