import { useState } from "react"
import { SafeLog } from "@/utils/SafeLog"

export function useDocumentRename() {
	const [suggestedName, setSuggestedName] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)

	const handleRename = async (file: File) => {
		setIsProcessing(true)
		try {
			// Create form data
			const formData = new FormData()
			formData.append("file", file)

			// Send request to your API endpoint
			const response = await fetch("/api/document-rename", {
				method: "POST",
				body: formData,
			})

			if (!response.ok) {
				throw new Error("Rename suggestion failed")
			}

			const { suggestedName } = await response.json()
			setSuggestedName(suggestedName)
		} catch (error) {
			SafeLog({ display: false, log: { "Rename error": error } })
		} finally {
			setIsProcessing(false)
		}
	}

	return {
		suggestedName,
		isProcessing,
		handleRename,
	}
}
