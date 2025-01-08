import { useState, useEffect } from "react"
import { extractFromPdf, pollExtractionStatus } from "@/services/pulseApi"

type ChunkingMethod = "semantic" | "recursive"

export const usePulseExtract = () => {
	const [extractionStatus, setExtractionStatus] = useState<string>("")
	const [extractedData, setExtractedData] = useState<any>(null)
	const [chunkingMethod, setChunkingMethod] =
		useState<ChunkingMethod>("semantic")
	const [estimatedTime, setEstimatedTime] = useState<Date | null>(null)
	const [progress, setProgress] = useState<number>(0)
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (estimatedTime && progress < 100) {
			timer = setInterval(() => {
				const now = new Date()
				const remaining = Math.max(
					0,
					estimatedTime.getTime() - now.getTime()
				)
				setTimeRemaining(Math.round(remaining / 1000)) // Convert to seconds
			}, 1000)
		}
		return () => clearInterval(timer)
	}, [estimatedTime, progress])

	const pollStatus = async (jobId: string) => {
		try {
			console.log("Polling job:", jobId)
			const data = await pollExtractionStatus(jobId)
			setProgress(data.progress || 0)

			if (data.estimated_completion_time) {
				setEstimatedTime(new Date(data.estimated_completion_time))
			}

			if (data.status === "completed" && data.result) {
				setExtractedData(data.result)
				setExtractionStatus("Extraction completed!")
				setProgress(100)
				return true
			} else if (data.status === "failed") {
				throw new Error("Extraction failed")
			} else {
				setTimeout(() => pollStatus(jobId), 2000)
				return false
			}
		} catch (error: any) {
			console.error("Poll error:", error)
			setExtractionStatus(`Failed to check status: ${error.message}`)
			return false
		}
	}

	const startExtraction = async (fileUrl: string) => {
		try {
			setExtractionStatus("Starting extraction...")
			setProgress(0)
			setTimeRemaining(null)
			setEstimatedTime(null)
			setExtractedData(null)

			console.log("Starting extraction for:", fileUrl)

			// Show initial progress
			setProgress(25)

			const response = await extractFromPdf(fileUrl, {
				chunking: chunkingMethod,
				return_tables: true,
				skipPolling: true,
			})

			// Show progress before completion
			setProgress(75)

			if ("result" in response) {
				console.log("Extraction result:", response.result) // Debug log
				setExtractedData(response.result)
				setProgress(100)
				setExtractionStatus("Extraction completed!")
			} else {
				setExtractionStatus("Processing document...")
				await pollStatus(response.job_id)
			}
		} catch (error: any) {
			console.error("Extraction error:", error)
			setExtractionStatus(
				`Failed to extract: ${error?.message || "Unknown error"}`
			)
		}
	}

	const resetExtraction = () => {
		setExtractionStatus("")
		setExtractedData(null)
		setProgress(0)
		setTimeRemaining(null)
		setEstimatedTime(null)
	}

	return {
		extractionStatus,
		extractedData,
		startExtraction,
		setChunkingMethod,
		progress,
		timeRemaining,
		resetExtraction,
	}
}
