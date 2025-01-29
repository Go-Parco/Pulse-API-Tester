import { getDocument } from "@/lib/pdfWorker"
import { PDFDocumentProxy } from "pdfjs-dist"

export const pdfPageCount = async (pdfFile: File): Promise<number> => {
	if (!pdfFile) throw new Error("PDF file not provided")
	if (pdfFile.size === 0) throw new Error("PDF file is empty")
	console.log(pdfFile.size)

	// Create a promise to handle the FileReader
	const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as ArrayBuffer)
		reader.onerror = reject
		reader.readAsArrayBuffer(pdfFile)
	})

	const pdfData = new Uint8Array(arrayBuffer)
	console.log("pdfData", pdfData)
	const pdf = await getDocument({ data: pdfData }).promise

	console.log("pdf", pdf.numPages)

	// Clean up
	await pdf.destroy()

	return pdf.numPages
}
