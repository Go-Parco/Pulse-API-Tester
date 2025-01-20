export const convertPdfToBase64 = (file: File) => {
	if (!file) return null
	const reader = new FileReader()
	return new Promise<Blob>((resolve) => {
		reader.onload = () => {
			const base64 = (reader.result as string).replace(
				/^data\:.+base64,/,
				""
			)
			const fileData = Buffer.from(base64, "base64")
			const blob = new Blob([fileData], { type: "application/pdf" })
			resolve(blob)
		}
		reader.readAsDataURL(file)
	})
}
