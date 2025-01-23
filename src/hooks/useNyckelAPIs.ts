import { useState } from "react"

interface DocumentTypeResult {
	documentType: string
	confidence: number
}

export function useNyckelDocumentIdentifier() {
	const [isIdentifying, setIsIdentifying] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [result, setResult] = useState<DocumentTypeResult | null>(null)

	const identifyDocument = async (
		input: string,
		isBase64: boolean = false
	) => {
		setIsIdentifying(true)
		setError(null)
		setResult(null)

		try {
			const response = await fetch(
				"/api/nyckel/document-types-identifier",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ url: input, isBase64 }),
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			setResult(data)
			return data
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to identify document type"
			setError(errorMessage)
			throw err
		} finally {
			setIsIdentifying(false)
		}
	}

	return {
		identifyDocument,
		isIdentifying,
		error,
		result,
	}
}
