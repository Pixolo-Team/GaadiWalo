interface StepsProgressBarPropsData {
  activeStep: number;
  totalSteps: number;
}

/** Steps Progress Bar Component */
export default function StepsProgressBar({
  activeStep,
  totalSteps,
}: StepsProgressBarPropsData) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: totalSteps }).map((_, stepItemIndex) => {
        const isActiveStep = stepItemIndex + 1 <= activeStep;

        return (
          <span
            key={`step-progress-${stepItemIndex + 1}`}
            className={`h-1 w-[22px] rounded-sm ${isActiveStep ? "bg-blue-600" : "bg-n-200"}`}
          />
        );
      })}
    </div>
  );
}
