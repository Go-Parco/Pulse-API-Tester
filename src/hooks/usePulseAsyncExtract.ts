import { useState, useEffect } from "react"
import type { PulseExtractResponse } from "@/app/api/pulse/config"

export type ExtractionState =
	| "idle"
	| "pending"
	| "processing"
	| "completed"
	| "failed"

const STATE_PROGRESSION: ExtractionState[] = [
	"idle",
	"pending",
	"processing",
	"completed",
]

export const usePulseAsyncExtract = () => {
	const [extractionStatus, setExtractionStatus] = useState<string>("")
	const [extractedData, setExtractedData] =
		useState<PulseExtractResponse | null>(null)
	const [extractionState, setExtractionState] =
		useState<ExtractionState>("idle")
	const [jobId, setJobId] = useState<string | null>(null)
	const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(
		null
	)

	useEffect(() => {
		return () => {
			if (pollInterval) {
				clearInterval(pollInterval)
			}
		}
	}, [pollInterval])

	const getNextState = (currentState: ExtractionState): ExtractionState => {
		const currentIndex = STATE_PROGRESSION.indexOf(currentState)
		if (
			currentIndex === -1 ||
			currentIndex === STATE_PROGRESSION.length - 1
		) {
			return currentState
		}
		return STATE_PROGRESSION[currentIndex + 1]
	}

	const pollStatus = async (currentJobId: string) => {
		try {
			const response = await fetch(
				`/api/pulse/poll?jobId=${currentJobId}`
			)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(
					data.error ||
						`Failed to poll status: ${response.statusText}`
				)
			}

			// Update state based on API response
			if (data.status === "completed" && data.result) {
				setExtractedData(data.result)
				setExtractionStatus("Extraction completed!")
				setExtractionState("completed")
				setJobId(null)
				if (pollInterval) {
					clearInterval(pollInterval)
					setPollInterval(null)
				}
			} else if (data.status === "failed") {
				throw new Error(data.error || "Extraction failed")
			} else {
				// Only progress forward in states, never backward
				if (
					data.status === "processing" &&
					extractionState === "pending"
				) {
					setExtractionState("processing")
				}
				// console.log(
				// 	"Polling status:",
				// 	data.status,
				// 	"Current state:",
				// 	extractionState
				// )
			}
		} catch (error: any) {
			console.error("Poll error:", error)
			setExtractionStatus(
				`Failed to check status: ${
					error.message || "Unknown error occurred"
				}`
			)
			setExtractionState("failed")
			setExtractedData(null)
			setJobId(null)
			if (pollInterval) {
				clearInterval(pollInterval)
				setPollInterval(null)
			}
		}
	}

	const startAsyncExtraction = async (fileUrl: string) => {
		try {
			setExtractionStatus("Starting async extraction...")
			setExtractionState("pending")
			setExtractedData(null)

			const response = await fetch("/api/pulse/extract_async", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fileUrl }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(
					data.error ||
						`Failed to start extraction: ${response.statusText}`
				)
			}

			if (!data.job_id) {
				throw new Error("No job ID returned from API")
			}

			setJobId(data.job_id)
			setExtractionStatus("Processing document...")
			setExtractionState("processing")

			// Start polling
			const interval = setInterval(() => {
				if (data.job_id) {
					pollStatus(data.job_id)
				}
			}, 2000)

			setPollInterval(interval)
		} catch (error: any) {
			console.error("Extraction error:", error)
			setExtractionStatus(
				`Failed to extract: ${
					error.message || "Unknown error occurred"
				}`
			)
			setExtractionState("failed")
			setExtractedData(null)
		}
	}

	const resetExtraction = () => {
		setExtractionStatus("")
		setExtractedData(null)
		setExtractionState("idle")
		setJobId(null)
		if (pollInterval) {
			clearInterval(pollInterval)
			setPollInterval(null)
		}
	}

	return {
		extractionStatus,
		extractedData,
		startAsyncExtraction,
		extractionState,
		resetExtraction,
		isProcessing:
			extractionState === "pending" || extractionState === "processing",
	}
}
