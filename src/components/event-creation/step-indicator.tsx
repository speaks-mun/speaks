import { Progress } from "@/components/ui/progress"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-heading-text">
          Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
        </h2>
        <span className="text-sm text-body-text">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
