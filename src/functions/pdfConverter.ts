import { getDocument } from "@/lib/pdfWorker"
import JSZip from "jszip"

// Helper to wrap FileReader in a Promise
// can be placed at 'src/lib/utils'
const readFileAsArrayBuffer = (file: File | Blob): Promise<ArrayBuffer> => {
	return new Promise((resolve, reject) => {
		if (!(file instanceof Blob)) {
			reject(new Error("Invalid file type: not a Blob or File"))
			return
		}
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as ArrayBuffer)
		reader.onerror = reject
		reader.readAsArrayBuffer(file)
	})
}

export const pdfConverter = async ({
	file,
	extractPage,
}: {
	file?: File | null
	extractPage?: number[]
}): Promise<Blob | null> => {
	if (!file) {
		throw new Error("No file provided")
	}

	try {
		const arrayBuffer = await readFileAsArrayBuffer(file)
		const pdfData = new Uint8Array(arrayBuffer)
		const pdf = await getDocument({ data: pdfData }).promise

		const images: { page: number; src: string }[] = []

		// Generate the pages array if none provided
		if (!extractPage)
			extractPage = Array.from(
				{ length: pdf.numPages },
				(_, index) => index + 1
			)

		// Process each page and convert to image
		for (const pageNum of extractPage) {
			const page = await pdf.getPage(pageNum)
			const scale = 4 // Increase the scale for better quality (! it will increase it's weight)
			const viewport = page.getViewport({ scale })

			const canvas = document.createElement("canvas")
			const ctx = canvas.getContext("2d")
			if (!ctx) return null

			canvas.width = viewport.width
			canvas.height = viewport.height

			await page.render({ canvasContext: ctx, viewport }).promise

			const imageSrc = canvas.toDataURL("image/jpeg", 0.95) // High quality

			images.push({ page: pageNum, src: imageSrc })
		}

		// If more than one image, create a zip file and download it
		if (images.length > 1) {
			const zip = new JSZip()
			images.forEach(({ page, src }) => {
				const imgData = src.split(",")[1] // Get base64 part of the string
				zip.file(`page-${page}.jpg`, imgData, { base64: true })
			})

			return zip.generateAsync({ type: "blob" })
		}

		// If only one image, return it directly
		const imgData = images[0].src.split(",")[1] // Get base64 part
		const page = images[0].page
		const byteCharacters = atob(imgData)
		const byteArrays = []

		for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
			const slice = byteCharacters.slice(offset, offset + 1024)
			const byteNumbers = new Array(slice.length)
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i)
			}
			byteArrays.push(new Uint8Array(byteNumbers))
		}

		const blob = new Blob(byteArrays, { type: "image/jpeg" })
		return blob
		// saveAs(blob, `page-${page}.jpg`);
	} catch (error) {
		console.error("Error processing PDF:", error)
		throw error
	}
}
