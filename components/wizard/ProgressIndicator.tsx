"use client"

interface ProgressIndicatorProps {
  currentStep: number
  completedSteps: boolean[]
  totalSteps: number
  steps: string[]
  onStepClick: (step: number) => void
}

export default function ProgressIndicator({
  currentStep,
  completedSteps,
  totalSteps,
  steps,
  onStepClick,
}: ProgressIndicatorProps) {
  // Each step is centered in a column of width (100/totalSteps)%.
  // The center of step i is at: (i + 0.5) * (100/totalSteps) %.
  // Track should span from center of first dot to center of last dot.
  const stepWidth = 100 / totalSteps
  const trackLeft = stepWidth / 2
  const trackRight = 100 - stepWidth / 2
  const trackWidth = trackRight - trackLeft

  // Fill goes from the first dot center to the current dot center.
  const fillPct = totalSteps > 1
    ? ((currentStep - 1) / (totalSteps - 1)) * 100
    : 0

  return (
    <div className="w-full">
      <div className="relative">
        {/* Background track — thin gold line */}
        <div
          className="absolute top-[20px] h-[2px] rounded-full"
          style={{ left: `${trackLeft}%`, width: `${trackWidth}%`, background: 'var(--border-accent)' }}
        />

        {/* Filled track — gradient from gold to green */}
        <div
          className="absolute top-[20px] h-[2px] rounded-full transition-all duration-500 ease-out"
          style={{
            left: `${trackLeft}%`,
            width: `${trackWidth * fillPct / 100}%`,
            background: "linear-gradient(90deg, var(--lux-accent), var(--lux-primary))",
          }}
        />

        {/* Steps */}
        <div className="relative flex">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = completedSteps[index]
            const isPast = stepNumber < currentStep

            return (
              <button
                key={stepNumber}
                type="button"
                onClick={() => onStepClick(stepNumber)}
                className="group flex flex-col items-center relative"
                style={{ width: `${stepWidth}%` }}
              >
                {/* Step dot */}
                <div className="relative">
                  {isActive && (
                    <div
                      className="absolute -inset-2 rounded-full opacity-30"
                      style={{
                        background: "radial-gradient(circle, var(--lux-accent) 0%, transparent 70%)",
                        animation: "pulse-ring-gold 2s ease-in-out infinite",
                      }}
                    />
                  )}

                  <div
                    className="relative w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all duration-300 ease-out"
                    style={
                      isActive
                        ? {
                            background: 'var(--lux-primary)',
                            color: '#fff',
                            boxShadow: '0 4px 14px rgba(57, 48, 137, 0.25)',
                            transform: 'scale(1.1)',
                            fontFamily: 'Frank New, var(--font-heading), sans-serif',
                            fontSize: '13px',
                            fontWeight: 700,
                          }
                        : isCompleted
                          ? {
                              background: 'var(--lux-accent)',
                              color: '#fff',
                              boxShadow: '0 2px 8px rgba(111, 183, 242, 0.25)',
                              fontSize: '13px',
                              fontWeight: 700,
                            }
                          : {
                              background: 'var(--bg-cream)',
                              color: 'var(--text-muted)',
                              border: '2px solid var(--border-accent)',
                              fontFamily: 'Frank New, var(--font-heading), sans-serif',
                              fontSize: '13px',
                              fontWeight: 600,
                            }
                    }
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>
                </div>

                {/* Step label */}
                <span
                  className="mt-2.5 text-[11px] leading-tight text-center max-w-[90px] transition-colors duration-200"
                  style={{
                    fontFamily: 'Bilo, var(--font-body), sans-serif',
                    fontWeight: isActive ? 600 : (isCompleted || isPast) ? 500 : 400,
                    color: isActive
                      ? 'var(--lux-primary)'
                      : (isCompleted || isPast)
                        ? 'var(--text-secondary)'
                        : 'var(--text-muted)',
                  }}
                >
                  {step}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-ring-gold {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 0.1; }
        }
      `}</style>
    </div>
  )
}
