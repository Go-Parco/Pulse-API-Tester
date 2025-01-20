export const analyzeDocument = async (file: File) => {
	const formData = new FormData()
	formData.append("file", file)

	const response = await fetch("/api/textract", {
		method: "POST",
		body: formData,
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.error || "Failed to analyze document")
	}

	return data
}
