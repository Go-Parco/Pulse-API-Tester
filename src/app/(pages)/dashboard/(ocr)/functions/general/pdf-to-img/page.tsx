"use client"
import React, { useState } from "react"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { CodeExcerpt } from "@/components/myComponents/CodeExcerpt"
import { AcceptedFileType } from "@/types/FileTypes"
import FileSourceSelector from "@/components/myComponents/fileSourceSelector"
import { pdfToImages } from "@/functions/pdfConverter"
import { getDocument } from "@/lib/pdfWorker" // Import the helper with PDF.js setup
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { toast } from "@/hooks/use-toast"

const PdfToJpg = () => {
	const [pdfFile, setPdfFile] = useState<File | null>(null)
	const [numPages, setNumPages] = useState<number>(0)
	const [selectedPages, setSelectedPages] = useState<number[]>([])
	const [images, setImages] = useState<{ page: number; src: string }[]>([])

	const DEFAULT_FILE_URL =
		"https://www.nyckel.com/wp-content/uploads/2024/01/nyckel-logo-black.png"
	const [convertedImage, setConvertedImage] = React.useState<string | null>(
		null
	)

	const handleFileSubmit = async (data: {
		type: "file" | "url" | "default"
		value: string | File[] | null
	}) => {
		if (
			data.type === "file" &&
			Array.isArray(data.value) &&
			data.value.length > 0
		) {
			const file = data.value[0]
			setPdfFile(file)

			try {
				const reader = new FileReader()
				reader.readAsArrayBuffer(file)

				reader.onload = async () => {
					const pdfData = new Uint8Array(reader.result as ArrayBuffer)
					const pdf = await getDocument({ data: pdfData }).promise
					setNumPages(pdf.numPages)
					setSelectedPages([])
					setImages([])
				}
			} catch (error) {
				console.error("Error reading PDF:", error)
				toast({
					title: "Error",
					description: "Failed to read PDF file",
					variant: "destructive",
				})
			}
		}
	}

	const handleReset = () => {
		setConvertedImage(null)
		console.log("reset")
	}

	const handleInputTypeChange = (type: string) => {
		console.log(type)
	}

	console.log(
		"Current convertedImage state:",
		convertedImage ? "Has image" : "No image"
	) // Debug state

	// Handle file upload
	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (!file) return
		setPdfFile(file)

		const reader = new FileReader()
		reader.readAsArrayBuffer(file)

		reader.onload = async () => {
			const pdfData = new Uint8Array(reader.result as ArrayBuffer)
			const pdf = await getDocument({ data: pdfData }).promise
			setNumPages(pdf.numPages) // Set the number of pages
			setSelectedPages([]) // Reset page selection
		}
	}

	// Handle page selection
	const handlePageSelection = (page: number) => {
		setSelectedPages((prev) =>
			prev.includes(page)
				? prev.filter((p) => p !== page)
				: [...prev, page]
		)
	}

	// Convert selected pages to JPG images
	const convertPagesToImages = async () => {
		if (!pdfFile || selectedPages.length === 0) return

		const reader = new FileReader()
		reader.readAsArrayBuffer(pdfFile)

		reader.onload = async () => {
			const pdfData = new Uint8Array(reader.result as ArrayBuffer)
			const pdf = await getDocument({ data: pdfData }).promise

			const newImages: { page: number; src: string }[] = []

			for (const pageNum of selectedPages) {
				const page = await pdf.getPage(pageNum)

				const scale = 4 // Increase the scale for better quality (default is 1, try 2, 3 or 4) *will increase its weight
				const viewport = page.getViewport({ scale })

				const canvas = document.createElement("canvas")
				const ctx = canvas.getContext("2d")
				if (!ctx) return

				canvas.width = viewport.width
				canvas.height = viewport.height

				await page.render({ canvasContext: ctx, viewport }).promise

				const imageSrc = canvas.toDataURL("image/jpeg", 0.95) // Adjust the quality parameter (0.95 gives high quality)

				newImages.push({ page: pageNum, src: imageSrc })
			}

			setImages(newImages)
		}
	}

	// Function to download all images as a ZIP
	const downloadAllImagesAsZip = () => {
		const zip = new JSZip()

		images.forEach(({ page, src }) => {
			const imgData = src.split(",")[1] // Remove the "data:image/jpeg;base64," part
			zip.file(`page-${page}.jpg`, imgData, { base64: true })
		})

		zip.generateAsync({ type: "blob" }).then((content) => {
			saveAs(content, "pdf-pages.zip")
		})
	}

	// Function to download a single image
	const downloadSingleImage = (imageSrc: string, page: number) => {
		const imgData = imageSrc.split(",")[1] // Remove the "data:image/jpeg;base64," part
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
		saveAs(blob, `page-${page}.jpg`)
	}

	return (
		<div className="space-y-8 flex-1 w-full">
			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold mb-2">PDF to Img</h1>
					<p className="text-muted-foreground pl-2 w-2/3">
						Converts a PDF to an image or set of images. Select
						specific pages to convert.
					</p>
					<FileSourceSelector
						onSubmit={handleFileSubmit}
						accept={[AcceptedFileType.PDF]}
						onReset={handleReset}
						defaultFileUrl={DEFAULT_FILE_URL}
						disabledOptions="none"
						onInputTypeChange={handleInputTypeChange}
					/>

					{/* Page Selection UI */}
					{numPages > 0 && (
						<div className="mt-4">
							<h2 className="font-semibold">Select Pages:</h2>
							<div className="flex flex-wrap gap-2 mt-2">
								{Array.from(
									{ length: numPages },
									(_, i) => i + 1
								).map((page) => (
									<button
										key={page}
										onClick={() =>
											handlePageSelection(page)
										}
										className={`px-3 py-1 rounded border ${
											selectedPages.includes(page)
												? "bg-blue-500 text-white"
												: "bg-gray-200"
										}`}>
										{page}
									</button>
								))}
							</div>

							<button
								onClick={convertPagesToImages}
								className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-600">
								Convert Selected Pages
							</button>
						</div>
					)}

					{/* Display converted images and download options */}
					{images.length > 0 && (
						<div className="mt-6">
							<h2 className="font-semibold mb-2">
								Converted Images:
							</h2>
							{images.map(({ page, src }) => (
								<div key={page} className="mb-4">
									<h3>Page {page}</h3>
									<img
										src={src}
										alt={`Page ${page}`}
										className="border rounded shadow-lg w-64 h-auto mt-2"
									/>
								</div>
							))}

							{images.length === 1 ? (
								<button
									onClick={() =>
										downloadSingleImage(
											images[0].src,
											images[0].page
										)
									}
									className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600">
									Download Single Image
								</button>
							) : (
								<button
									onClick={downloadAllImagesAsZip}
									className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600">
									Download All Pages as ZIP
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default PdfToJpg
