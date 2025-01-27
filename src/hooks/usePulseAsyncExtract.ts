import { useState, useEffect } from "react"
import type { PulseExtractResponse } from "@/app/api/pulse/config"
import { SafeLog } from "@/utils/SafeLog"

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

	const pollStatus = async (jobId: string): Promise<boolean> => {
		try {
			const response = await fetch(`/api/pulse/poll?jobId=${jobId}`)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Failed to poll status")
			}

			// Update status and progress regardless of state
			setExtractionStatus(
				`Processing document... ${Math.round(data.progress)}%`
			)

			// Handle completion
			if (data.status === "completed" && data.result) {
				SafeLog({
					display: false,
					log: { "Setting extracted data with schema": data.result },
				})
				setExtractedData({
					text: data.result.markdown || data.result.text,
					tables: data.result.tables || [],
					schema: data.result.schema || {},
				})
				setExtractionState("completed")
				setExtractionStatus("Extraction completed!")
				// Clear polling interval
				if (pollInterval) {
					clearInterval(pollInterval)
					setPollInterval(null)
				}
				return true // Signal completion
			}

			// Handle failure
			if (data.status === "failed") {
				setExtractionState("failed")
				setExtractionStatus("Extraction failed")
				setExtractedData(null)
				// Clear polling interval
				if (pollInterval) {
					clearInterval(pollInterval)
					setPollInterval(null)
				}
				return true // Signal completion
			}

			return false // Continue polling
		} catch (error: unknown) {
			SafeLog({ display: false, log: { "Polling error": error } })
			setExtractionState("failed")
			setExtractionStatus(
				`Polling failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			)
			setExtractedData(null)
			// Clear polling interval
			if (pollInterval) {
				clearInterval(pollInterval)
				setPollInterval(null)
			}
			return true // Signal completion
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

			// Start polling with async handling
			const interval = setInterval(async () => {
				if (data.job_id) {
					const shouldStop = await pollStatus(data.job_id)
					if (shouldStop) {
						clearInterval(interval)
						setPollInterval(null)
					}
				}
			}, 2000)

			setPollInterval(interval)
		} catch (error: unknown) {
			SafeLog({ display: false, log: { "Extraction error": error } })
			setExtractionStatus(
				`Failed to extract: ${
					error instanceof Error
						? error.message
						: "Unknown error occurred"
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
