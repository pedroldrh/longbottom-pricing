"use client"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  onStepClick: (step: number) => void
}

export default function ProgressIndicator({ currentStep, totalSteps, steps, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <button type="button" onClick={() => onStepClick(stepNumber)} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <div className="mt-2 text-xs text-center max-w-[120px]">
                  <span className={`${isActive ? "font-semibold text-gray-900" : "text-gray-600"}`}>{step}</span>
                </div>
              </button>
              {stepNumber < totalSteps && (
                <div
                  className={`h-1 flex-1 mx-2 ${isCompleted ? "bg-green-600" : "bg-gray-200"}`}
                  style={{ marginBottom: "3rem" }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
