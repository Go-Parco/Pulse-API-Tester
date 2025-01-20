import { useState } from "react"

export function useDocumentTypeIdentifier() {
	const [documentType, setDocumentType] = useState<string | null>(null)
	const [isIdentifying, setIsIdentifying] = useState(false)

	const handleIdentification = async (file: File) => {
		setIsIdentifying(true)
		try {
			// Create form data
			const formData = new FormData()
			formData.append("file", file)

			// Send request to your API endpoint
			const response = await fetch("/api/document-type", {
				method: "POST",
				body: formData,
			})

			if (!response.ok) {
				throw new Error("Identification failed")
			}

			const { type } = await response.json()
			setDocumentType(type)
		} catch (error) {
			console.error("Identification error:", error)
		} finally {
			setIsIdentifying(false)
		}
	}

	return {
		documentType,
		isIdentifying,
		handleIdentification,
	}
}
