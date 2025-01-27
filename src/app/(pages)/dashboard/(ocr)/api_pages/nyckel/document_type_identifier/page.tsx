"use client"

import { useState, useEffect } from "react"
import { useUploadThing } from "@/hooks/useUploadThing"
import { useNyckelDocumentIdentifier } from "@/hooks/useNyckelAPIs"
import FileSourceSelector from "@/components/myComponents/fileSourceSelector"
import { AcceptedFileType } from "@/types/FileTypes"
import { Button } from "@/components/ui/button"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/config"
import { SafeLog } from "@/utils/SafeLog"

async function convertPdfToImage(pdfFile: File): Promise<string> {
	SafeLog({
		display: true,
		log: { Status: "Starting PDF to Image conversion..." },
	})
	try {
		const formData = new FormData()
		formData.append("file", pdfFile)

		const response = await fetch("/api/pdf-convert", {
			method: "POST",
			body: formData,
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		if (data.error) {
			throw new Error(data.error)
		}

		SafeLog({
			display: true,
			log: { Status: "PDF successfully converted to image" },
		})
		return data.base64Image
	} catch (error) {
		SafeLog({ display: true, log: { "Error in PDF conversion": error } })
		throw error
	}
}

const { useUploadThing: useUploadThingCore } =
	generateReactHelpers<OurFileRouter>()

const DEFAULT_FILE_URL =
	"https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqGLsjyw9WU1YApM8c4qomfkI3S50DdbuOJhrW7"

export default function DocumentTypeIdentifierPage() {
	const { startUpload } = useUploadThingCore("imageUploader")
	const {
		uploadStatus,
		progress: uploadProgress,
		handleFileSelect,
		setSelectedFile,
		resetUpload,
	} = useUploadThing()

	const {
		identifyDocument,
		isIdentifying,
		error: identificationError,
		result: documentTypeResult,
	} = useNyckelDocumentIdentifier()

	const [isProcessing, setIsProcessing] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [selectedInputType, setSelectedInputType] = useState<
		"file" | "url" | "default"
	>("file")

	const handleFileSubmit = async (data: {
		type: "file" | "url" | "default"
		value: string | File[] | null
	}) => {
		if (isUploading || isProcessing) return

		try {
			let url: string | undefined

			if (
				data.type === "file" &&
				data.value &&
				Array.isArray(data.value)
			) {
				const file = data.value[0]
				if (!file) return

				setIsUploading(true)
				handleFileSelect(file)

				if (file.type === "application/pdf") {
					try {
						SafeLog({
							display: false,
							log: {
								"Processing PDF file": {
									name: file.name,
									size: file.size,
									type: file.type,
								},
							},
						})
						setIsProcessing(true)

						SafeLog({
							display: false,
							log: {
								Status: "Starting PDF conversion process...",
							},
						})
						const imageBase64 = await convertPdfToImage(file)
						SafeLog({
							display: false,
							log: {
								Status: "PDF successfully converted to image",
							},
						})

						SafeLog({
							display: false,
							log: { Status: "Sending to Nyckel API..." },
						})
						const result = await identifyDocument(imageBase64, true)
						SafeLog({
							display: false,
							log: { "Nyckel API response": result },
						})
					} catch (error) {
						SafeLog({
							display: false,
							log: { "Error in PDF processing": error },
						})
						if (error instanceof Error) {
							SafeLog({
								display: false,
								log: {
									"Error details": {
										message: error.message,
										stack: error.stack,
									},
								},
							})
						}
					} finally {
						setIsUploading(false)
						setIsProcessing(false)
					}
				} else {
					SafeLog({
						display: true,
						log: { "Starting upload with file": file.name },
					})
					const uploadResponse = await startUpload([file])
					url = uploadResponse?.[0]?.url
					SafeLog({
						display: true,
						log: { "Upload complete, URL": url },
					})

					if (url) {
						setIsProcessing(true)
						SafeLog({
							display: true,
							log: {
								Status: "Starting document identification...",
							},
						})
						const result = await identifyDocument(url)
						SafeLog({
							display: true,
							log: { Status: "Document identification complete" },
						})
						SafeLog({ display: false, log: { Result: result } })
					}
				}
			} else if (data.type === "url" && typeof data.value === "string") {
				url = data.value
				SafeLog({ display: true, log: { "Using provided URL": url } })
			} else if (data.type === "default") {
				url = DEFAULT_FILE_URL
			}

			if (url) {
				setIsProcessing(true)
				SafeLog({
					display: true,
					log: { Status: "Starting document identification..." },
				})
				const result = await identifyDocument(url)
				SafeLog({
					display: true,
					log: { Status: "Document identification complete" },
				})
				SafeLog({ display: false, log: { Result: result } })
				if (result.error) {
					SafeLog({
						display: false,
						log: { Status: "bypass the url and pass" },
					})
				}
			}
		} catch (error) {
			SafeLog({
				display: false,
				log: { "Error processing document": error },
			})
		} finally {
			setIsUploading(false)
			setIsProcessing(false)
		}
	}

	const handleReset = () => {
		if (isUploading || isProcessing) return
		setSelectedFile(null)
		resetUpload()
		setIsProcessing(false)
		setIsUploading(false)
	}

	const handleInputTypeChange = (type: "file" | "url" | "default") => {
		setSelectedInputType(type)
		handleReset()
	}

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold mb-2">
						Document Type Identifier
					</h1>
					<p className="text-muted-foreground">
						Upload a document to identify its type using Nyckel's
						public document-type-classifier API.
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => window.location.reload()}
					disabled={isUploading || isProcessing}>
					Reset
				</Button>
			</div>

			<FileSourceSelector
				onSubmit={handleFileSubmit}
				accept={[AcceptedFileType.IMAGE, AcceptedFileType.PDF]}
				onReset={handleReset}
				defaultFileUrl={DEFAULT_FILE_URL}
				disabledOptions="none"
				convertPDFToBase64={true}
				onInputTypeChange={handleInputTypeChange}
			/>

			{/* Upload Status */}
			{isUploading && (
				<div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
					<div className="w-4 h-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
					<p className="text-sm text-blue-600">
						Uploading document...{" "}
						{uploadProgress > 0 && `${uploadProgress.toFixed(0)}%`}
					</p>
				</div>
			)}

			{/* Processing Status */}
			{!isUploading && isProcessing && (
				<div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
					<div className="w-4 h-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
					<p className="text-sm text-blue-600">
						Identifying document type...
					</p>
				</div>
			)}

			{/* Error Status */}
			{identificationError && (
				<div className="p-4 bg-red-50 rounded-lg">
					<p className="text-sm text-red-600">
						Error: {identificationError}
					</p>
				</div>
			)}

			{/* Result */}
			{documentTypeResult && (
				<div className="p-4 bg-green-50 rounded-lg space-y-2">
					<p className="text-sm font-medium text-green-600">
						Document Type: {documentTypeResult.documentType}
					</p>
					<p className="text-xs text-green-500">
						Confidence:{" "}
						{(documentTypeResult.confidence * 100).toFixed(1)}%
					</p>
				</div>
			)}
		</div>
	)
}
