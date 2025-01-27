import { useState } from "react"
import { SafeLog } from "@/utils/SafeLog"

export function useExtraction() {
	const [extractedData, setExtractedData] = useState<any>(null)
	const [isExtracting, setIsExtracting] = useState(false)

	const handleExtraction = async (file: File) => {
		setIsExtracting(true)
		try {
			// Create form data
			const formData = new FormData()
			formData.append("file", file)

			// Send request to your API endpoint
			const response = await fetch("/api/extract", {
				method: "POST",
				body: formData,
			})

			if (!response.ok) {
				throw new Error("Extraction failed")
			}

			const data = await response.json()
			setExtractedData(data)
		} catch (error) {
			SafeLog({ display: false, log: { "Extraction error": error } })
		} finally {
			setIsExtracting(false)
		}
	}

	return {
		extractedData,
		isExtracting,
		handleExtraction,
	}
}
