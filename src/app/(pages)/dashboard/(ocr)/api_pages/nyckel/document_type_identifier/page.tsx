"use client"

import { useState } from "react"
import { useUploadThing } from "@/hooks/useUploadThing"
import { useNyckelDocumentIdentifier } from "@/hooks/useNyckelAPIs"
import FileSourceSelector from "@/components/myComponents/fileSourceSelector"
import { AcceptedFileType } from "@/types/FileTypes"
import { Button } from "@/components/ui/button"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/config"
import { convertPdfToBase64 } from "@/utils/pdfToBase64"

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

				console.log("Starting upload with file:", file.name)

				// First try to upload the file normally
				try {
					const uploadResponse = await startUpload([file])
					url = uploadResponse?.[0]?.url
					console.log("Upload complete, URL:", url)
				} catch (uploadError) {
					console.log(
						"Initial upload failed, trying with base64 conversion..."
					)

					// If the file is a PDF and the upload failed, try converting to base64
					if (file.type === "application/pdf") {
						const blob = await convertPdfToBase64(file)
						if (blob) {
							const convertedFile = new File([blob], file.name, {
								type: "application/pdf",
							})
							const retryResponse = await startUpload([
								convertedFile,
							])
							url = retryResponse?.[0]?.url
							console.log(
								"Upload with base64 conversion complete, URL:",
								url
							)
						}
					} else {
						throw uploadError
					}
				}

				if (!url) {
					throw new Error("Upload failed - no URL returned")
				}
			} else if (data.type === "url" && typeof data.value === "string") {
				url = data.value
			} else if (data.type === "default") {
				url = DEFAULT_FILE_URL
			}

			if (url) {
				setIsProcessing(true)
				console.log("Starting document identification...")
				await identifyDocument(url)
				console.log("Document identification complete")
			}
		} catch (error) {
			console.error("Error processing document:", error)
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
				accept={[AcceptedFileType.IMAGE]}
				onReset={handleReset}
				defaultFileUrl={DEFAULT_FILE_URL}
				disabledOptions="none"
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
