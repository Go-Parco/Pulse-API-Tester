import * as pdfjsLib from "pdfjs-dist"
export const detectMultiPagePDF = async (file: File): Promise<boolean> => {
	if (file.type === "application/pdf") {
		const arrayBuffer = await file.arrayBuffer()
		const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
		return pdf.numPages > 1
	}
	return false
}
