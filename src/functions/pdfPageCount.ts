import { getDocument } from "@/lib/pdfWorker"

export const pdfPageCount = async (file: File): Promise<number> => {
	if (!file) throw new Error("PDF file not provided")
	if (file.size === 0) throw new Error("PDF file is empty")

	try {
		// Create a Promise to handle FileReader
		const arrayBuffer = await new Promise<ArrayBuffer>(
			(resolve, reject) => {
				const reader = new FileReader()
				reader.onload = () => resolve(reader.result as ArrayBuffer)
				reader.onerror = reject
				reader.readAsArrayBuffer(file)
			}
		)

		const pdfData = new Uint8Array(arrayBuffer)
		const pdf = await getDocument({ data: pdfData }).promise
		const pageCount = pdf.numPages

		// Clean up
		await pdf.destroy()
		return pageCount
	} catch (error) {
		console.error("Error processing PDF:", error)
		throw error
	}
}
