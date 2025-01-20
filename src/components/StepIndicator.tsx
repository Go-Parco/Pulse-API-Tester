import type { ExtractionState } from "@/hooks/usePulseAsyncExtract"

const extractionSteps = [
	{ state: "pending", label: "Initializing" },
	{ state: "processing", label: "Extracting Content" },
	{ state: "completed", label: "Completed" },
] as const

const StepIndicator = ({ currentState }: { currentState: ExtractionState }) => {
	return (
		<div className="flex items-center justify-center space-x-2 mb-4">
			{extractionSteps.map((step, index) => {
				const isActive = currentState === step.state
				const isCompleted =
					extractionSteps.findIndex((s) => s.state === currentState) >
					extractionSteps.findIndex((s) => s.state === step.state)

				return (
					<div key={step.state} className="flex items-center">
						<div
							className={`w-4 h-4 rounded-full ${
								isActive
									? "bg-blue-500 animate-pulse"
									: isCompleted
									? "bg-green-500"
									: "bg-gray-300"
							}`}
						/>
						{isActive && (
							<span className="ml-2 text-sm text-gray-600">
								{step.label}
							</span>
						)}
						{index < extractionSteps.length - 1 && (
							<div
								className={`w-8 h-0.5 mx-1 ${
									isCompleted ? "bg-green-500" : "bg-gray-300"
								}`}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default StepIndicator
