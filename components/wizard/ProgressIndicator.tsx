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
  const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full">
      {/* Main track container */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-5 left-0 right-0 h-[3px] bg-gray-200 rounded-full" />

        {/* Filled track */}
        <div
          className="absolute top-5 left-0 h-[3px] rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPct}%`,
            background: "linear-gradient(90deg, #0d9488, #0891b2)",
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
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
                style={{ width: `${100 / totalSteps}%` }}
              >
                {/* Step dot/marker */}
                <div className="relative">
                  {/* Pulse ring for active step */}
                  {isActive && (
                    <div
                      className="absolute -inset-2 rounded-full opacity-30"
                      style={{
                        background: "radial-gradient(circle, #0d9488 0%, transparent 70%)",
                        animation: "pulse-ring 2s ease-in-out infinite",
                      }}
                    />
                  )}

                  <div
                    className={`
                      relative w-[42px] h-[42px] rounded-full flex items-center justify-center
                      text-xs font-bold transition-all duration-300 ease-out
                      ${isActive
                        ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30 scale-110"
                        : isCompleted
                          ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                          : "bg-white text-gray-400 border-2 border-gray-200 group-hover:border-teal-300 group-hover:text-teal-500"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className={isActive ? "tracking-wide" : ""}>{stepNumber}</span>
                    )}
                  </div>
                </div>

                {/* Step label */}
                <span
                  className={`
                    mt-2.5 text-[11px] leading-tight text-center max-w-[90px] transition-colors duration-200
                    ${isActive
                      ? "font-semibold text-teal-700"
                      : isCompleted || isPast
                        ? "font-medium text-gray-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  `}
                >
                  {step}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 0.1; }
        }
      `}</style>
    </div>
  )
}
