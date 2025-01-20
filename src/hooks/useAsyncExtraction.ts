import { useState } from "react"

export function useAsyncExtraction() {
	const [extractedData, setExtractedData] = useState<any>(null)
	const [isExtracting, setIsExtracting] = useState(false)

	const handleAsyncExtraction = async (file: File) => {
		setIsExtracting(true)
		try {
			// Create form data
			const formData = new FormData()
			formData.append("file", file)

			// Start async extraction
			const startResponse = await fetch("/api/extract-async/start", {
				method: "POST",
				body: formData,
			})

			if (!startResponse.ok) {
				throw new Error("Failed to start extraction")
			}

			const { jobId } = await startResponse.json()

			// Poll for results
			const pollInterval = setInterval(async () => {
				const statusResponse = await fetch(
					`/api/extract-async/status/${jobId}`
				)
				const { status, data } = await statusResponse.json()

				if (status === "completed") {
					clearInterval(pollInterval)
					setExtractedData(data)
					setIsExtracting(false)
				} else if (status === "failed") {
					clearInterval(pollInterval)
					setIsExtracting(false)
					throw new Error("Extraction failed")
				}
			}, 2000) // Poll every 2 seconds

			// Cleanup interval after 5 minutes (timeout)
			setTimeout(() => {
				clearInterval(pollInterval)
				if (isExtracting) {
					setIsExtracting(false)
					console.error("Extraction timed out")
				}
			}, 5 * 60 * 1000)
		} catch (error) {
			console.error("Extraction error:", error)
			setIsExtracting(false)
		}
	}

	return {
		extractedData,
		isExtracting,
		handleAsyncExtraction,
	}
}
