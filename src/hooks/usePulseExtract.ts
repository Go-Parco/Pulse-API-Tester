import { useState, useEffect } from "react"

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
				setTimeRemaining(Math.round(remaining / 1000))
			}, 1000)
		}
		return () => clearInterval(timer)
	}, [estimatedTime, progress])

	const pollStatus = async (jobId: string) => {
		try {
			const response = await fetch(`/api/pulse/poll?jobId=${jobId}`)
			if (!response.ok) throw new Error("Failed to poll status")

			const data = await response.json()
			setProgress(data.progress || Math.min(90, progress + 10))

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
			setProgress(0)
			return false
		}
	}

	const startExtraction = async (fileUrl: string) => {
		try {
			setExtractionStatus("Processing document...")
			setProgress(0)
			setTimeRemaining(null)
			setEstimatedTime(null)
			setExtractedData(null)

			const response = await fetch("/api/pulse/extract", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileUrl,
					method: chunkingMethod,
				}),
			})

			if (!response.ok) throw new Error("Failed to start extraction")
			const data = await response.json()

			if ("result" in data) {
				setExtractedData(data.result)
				setProgress(100)
				setExtractionStatus("Extraction completed!")
			} else {
				setExtractionStatus("Processing document...")
				setProgress(10)
				await pollStatus(data.job_id)
			}
		} catch (error: any) {
			console.error("Extraction error:", error)
			setExtractionStatus(`Failed to extract: ${error.message}`)
			setProgress(0)
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
