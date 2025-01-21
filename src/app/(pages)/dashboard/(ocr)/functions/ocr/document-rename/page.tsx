"use client"

import { useState, useEffect } from "react"
import { useUploadThing } from "@/hooks/useUploadThing"
import { useNyckelDocumentIdentifier } from "@/hooks/useNyckelAPIs"
import FileSourceSelector from "@/components/myComponents/fileSourceSelector"
import { AcceptedFileType } from "@/types/FileTypes"
import { Button } from "@/components/ui/button"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/config"
import { convertPdfToBase64 } from "@/utils/pdfToBase64"
import { usePulseAsyncExtract } from "@/hooks/usePulseAsyncExtract"
import StepIndicator from "@/components/StepIndicator"
import { docNameFunnel, type DocNameFunnelReturn } from "./docNameFunnel"
import DocumentNameDisplay from "@/components/DocumentNameDisplay"

const { useUploadThing: useUploadThingCore } =
	generateReactHelpers<OurFileRouter>()

const DEFAULT_FILE_URL =
	"https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqGOCArCLoYgZ07GhMxwrEV68PNnofWH3sFDyBJ"

const GetFormattedFileName = (fileName: string) => {
	return fileName.replace(/\s+/g, "_")
}

export default function DocumentRenamePage() {
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

	const {
		startAsyncExtraction,
		extractionStatus,
		extractionState,
		extractedData,
		isProcessing: isPulseProcessing,
	} = usePulseAsyncExtract()

	const [isProcessing, setIsProcessing] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [selectedInputType, setSelectedInputType] = useState<
		"file" | "url" | "default"
	>("file")
	const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null)
	const [originalFileName, setOriginalFileName] = useState<string>("")
	const [originalFileExtension, setOriginalFileExtension] =
		useState<string>("")
	const [fileType, setFileType] = useState<string | null>(null)
	const [docProvider, setDocProvider] = useState<string | null>(null)
	const [schemaData, setSchemaData] = useState<any>(null)
	const [docNameResults, setDocNameResults] =
		useState<DocNameFunnelReturn | null>(null)

	// Define expected schema
	const expectedSchema = {
		document_comes_from: "string",
		document_kind: "string",
		document_name: "string",
	}

	const uploadFile = async (file: File): Promise<string> => {
		setIsUploading(true)
		handleFileSelect(file)
		setOriginalFileName(file.name)
		setOriginalFileExtension(
			file.name.split(".").pop()?.toLowerCase() || ""
		)
		console.log("Starting upload with file:", file.name)

		try {
			const uploadResponse = await startUpload([file])
			const url = uploadResponse?.[0]?.url
			console.log("Upload complete, URL:", url)
			if (!url) throw new Error("Upload failed - no URL returned")
			return url
		} catch (uploadError) {
			console.log(
				"Initial upload failed, trying with base64 conversion..."
			)

			if (file.type === "application/pdf") {
				const blob = await convertPdfToBase64(file)
				if (blob) {
					const convertedFile = new File([blob], file.name, {
						type: "application/pdf",
					})
					const retryResponse = await startUpload([convertedFile])
					const url = retryResponse?.[0]?.url
					console.log(
						"Upload with base64 conversion complete, URL:",
						url
					)
					if (!url) throw new Error("Upload failed - no URL returned")
					return url
				}
			}
			throw uploadError
		}
	}

	const processDocument = async (url: string) => {
		setIsProcessing(true)
		console.log("Starting document identification...")
		await identifyDocument(url)
		console.log("Document identification complete")

		// After document identification, start Pulse extraction
		if (url) {
			console.log("Starting Pulse extraction...")
			await startAsyncExtraction(url)
		}
	}

	const getDocumentUrl = async (data: {
		type: "file" | "url" | "default"
		value: string | File[] | null
	}): Promise<string | undefined> => {
		if (data.type === "file" && data.value && Array.isArray(data.value)) {
			const file = data.value[0]
			if (!file) return undefined
			return await uploadFile(file)
		} else if (data.type === "url" && typeof data.value === "string") {
			return data.value
		} else if (data.type === "default") {
			return DEFAULT_FILE_URL
		}
		return undefined
	}

	const handleFileSubmit = async (data: {
		type: "file" | "url" | "default"
		value: string | File[] | null
	}) => {
		if (isUploading || isProcessing) return

		try {
			const url = await getDocumentUrl(data)
			if (url) {
				setSelectedFileUrl(url)
				await processDocument(url)
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
		setOriginalFileName("")
		setOriginalFileExtension("")
	}

	const handleInputTypeChange = (type: "file" | "url" | "default") => {
		setSelectedInputType(type)
		handleReset()
	}

	useEffect(() => {
		if (documentTypeResult) {
			setFileType(documentTypeResult.documentType)
		}
	}, [documentTypeResult])

	useEffect(() => {
		if (extractedData?.schema && fileType) {
			console.log("=== PULSE EXTRACTION DATA ===")
			console.log("Schema:", extractedData.schema)
			console.log("Text:", extractedData.text)
			console.log("Tables:", extractedData.tables)
			console.log("==========================")

			const schema = {
				document_comes_from:
					extractedData.schema.document_comes_from || "",
				document_kind: extractedData.schema.document_kind || "",
				document_name: extractedData.schema.document_name || "",
				pay_plan: extractedData.schema.pay_plan,
			}
			setSchemaData(schema)

			console.log("=== DOC NAME FUNNEL INPUT ===")
			console.log("Schema:", schema)
			console.log("Doc Type:", fileType)
			console.log("==========================")

			const results = docNameFunnel({
				props: {
					data: {
						schemaData: schema,
						docType: fileType,
					},
				},
			})

			console.log("=== DOC NAME FUNNEL RESULTS ===")
			console.log(results)
			console.log("==============================")

			setDocNameResults(results)
		}
	}, [extractedData, fileType])

	const renderSchemaData = () => {
		if (!schemaData) return null

		return (
			<div className="p-4 bg-white rounded-lg shadow-sm space-y-2">
				<h3 className="text-lg font-semibold mb-4">Extracted Schema</h3>
				{(Object.entries(schemaData) as [string, string][])
					.filter(([_, value]) => value !== undefined && value !== "")
					.map(([key, value]) => (
						<div key={key} className="flex">
							<span className="w-40 font-medium capitalize">
								{key.replace(/_/g, " ")}:
							</span>
							<p>{value}</p>
						</div>
					))}
			</div>
		)
	}

	const renderDocNameResults = () => {
		if (!docNameResults) return null

		const handleDownload = () => {
			if (selectedFileUrl) {
				const a = document.createElement("a")
				a.href = selectedFileUrl
				const extension = selectedFileUrl.split(".").pop() || ""
				a.download = `${docNameResults.data?.docName}.${extension}`
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
			}
		}

		return (
			<div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
				<h3 className="text-lg font-semibold mb-2">
					Document Name Results
				</h3>

				{docNameResults.data && (
					<div className="space-y-4">
						<div className="space-y-2">
							<div className="flex">
								<span className="w-40 font-medium">
									Provider:
								</span>
								<p>{docNameResults.data.docProvider}</p>
							</div>
							<div className="flex">
								<span className="w-40 font-medium">Type:</span>
								<p>{docNameResults.data.docType}</p>
							</div>
						</div>

						<DocumentNameDisplay
							originalFileName={originalFileName}
							documentName={docNameResults.data.docName}
							fileUrl={selectedFileUrl || ""}
						/>
					</div>
				)}

				{docNameResults.error && (
					<div className="mt-4 p-3 bg-red-50 rounded-md">
						<p className="text-red-600">
							{docNameResults.error.message}
						</p>
					</div>
				)}

				{docNameResults.suggestion &&
					(docNameResults.suggestion.docProvider ||
						docNameResults.suggestion.docType) && (
						<div className="mt-4 p-3 bg-blue-50 rounded-md">
							<p className="font-medium mb-2">Suggestions:</p>
							{docNameResults.suggestion.docProvider && (
								<p>
									Provider:{" "}
									{docNameResults.suggestion.docProvider}
								</p>
							)}
							{docNameResults.suggestion.docType && (
								<p>Type: {docNameResults.suggestion.docType}</p>
							)}
						</div>
					)}

				{docNameResults.manualReview && (
					<div className="mt-4 p-3 bg-yellow-50 rounded-md">
						<p className="text-yellow-600">
							Manual review required
						</p>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold mb-2">
						Document Rename Page
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

			{isPulseProcessing && (
				<StepIndicator currentState={extractionState} />
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

			{/* Schema Data */}
			{schemaData && renderSchemaData()}

			{/* Document Name Results */}
			{docNameResults && renderDocNameResults()}
		</div>
	)
}
