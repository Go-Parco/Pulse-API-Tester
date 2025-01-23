import type { ExtractionState } from "@/hooks/usePulseAsyncExtract"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

export type Step = {
	id: string
	label: string
}

export type StepState = {
	currentStepId: string
	completedStepIds: string[]
}

interface StepIndicatorProps {
	steps: Step[]
	currentState: StepState
}

const StepIndicator = ({ steps, currentState }: StepIndicatorProps) => {
	const activeSteps = steps.filter(
		(step) => step.id !== "error" && step.id !== "complete"
	)
	const errorStep = steps.find((step) => step.id === "error")
	const completeStep = steps.find((step) => step.id === "complete")
	const isComplete = currentState.currentStepId === "complete"

	return (
		<TooltipProvider>
			<div className="flex items-center justify-center space-x-2 mb-4">
				{activeSteps.map((step, index) => {
					const isActive = currentState.currentStepId === step.id
					const isCompleted = currentState.completedStepIds.includes(
						step.id
					)

					return (
						<div key={step.id} className="flex items-center">
							<Tooltip>
								<TooltipTrigger>
									<div
										className={`w-4 h-4 rounded-full ${
											isActive
												? "bg-blue-500 animate-pulse"
												: isCompleted
												? "bg-green-500"
												: "bg-gray-300"
										}`}
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>{step.label}</p>
								</TooltipContent>
							</Tooltip>
							{isActive && (
								<span className="ml-2 text-sm text-gray-600">
									{step.label}
								</span>
							)}
							<div
								className={`w-8 h-0.5 mx-2 ${
									isCompleted ? "bg-green-500" : "bg-gray-300"
								}`}
							/>
						</div>
					)
				})}
				{currentState.currentStepId === "error" && errorStep ? (
					<div className="flex items-center">
						<Tooltip>
							<TooltipTrigger>
								<div className="w-4 h-4 rounded-full bg-red-500" />
							</TooltipTrigger>
							<TooltipContent>
								<p>{errorStep.label}</p>
							</TooltipContent>
						</Tooltip>
						<span className="ml-2 text-sm text-red-600">
							{errorStep.label}
						</span>
					</div>
				) : (
					<div className="flex items-center">
						<Tooltip>
							<TooltipTrigger>
								<div
									className={`w-4 h-4 rounded-full ${
										isComplete
											? "bg-green-500"
											: "bg-gray-300"
									}`}
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p>{completeStep?.label || "Complete"}</p>
							</TooltipContent>
						</Tooltip>
						{isComplete && (
							<span className="ml-2 text-sm text-gray-600">
								{completeStep?.label || "Complete"}
							</span>
						)}
					</div>
				)}
			</div>
		</TooltipProvider>
	)
}

export default StepIndicator
