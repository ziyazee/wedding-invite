const STEPS = ['Event Type', 'Details', 'Template', 'Builder'];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < currentStep
                  ? 'bg-green-600 text-white'
                  : i === currentStep
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-sm hidden md:inline ${
                i === currentStep ? 'font-medium text-gray-900' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 md:w-12 h-0.5 ${
                i < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
