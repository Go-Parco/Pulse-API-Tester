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
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"

const PdfPageCount = () => {
	const [pdfFile, setPdfFile] = useState<File | null>(null)
	const [numPages, setNumPages] = useState<number>(0)

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
		}
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
					<h1 className="text-3xl font-bold mb-2">PDF Page Count</h1>
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
								{/* Select dropdown */}
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select Pages" />
									</SelectTrigger>
									<SelectContent>
										{Array.from(
											{ length: numPages },
											(_, i) => i + 1
										).map((page) => (
											<SelectItem
												key={page}
												value={page.toString()}>
												{page}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					)}

					<div className="flex flex-col gap-2">{numPages}</div>
				</div>
			</div>
		</div>
	)
}

export default PdfPageCount
