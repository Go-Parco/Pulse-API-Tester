"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FunnelLogic from "@/documentation/custom_functions/OCR_File_Rename/OCR_File_Rename_Logic.jpg"
import Link from "next/link"
import { CodeExcerpt } from "@/components/myComponents/CodeExcerpt"
import { env } from "@/env"
import { Step, StepState } from "@/components/StepIndicator"
import { SafeLog } from "@/utils/SafeLog"
const { useUploadThing: useUploadThingCore } =
	generateReactHelpers<OurFileRouter>()

const DEFAULT_FILE_URL =
	"https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqGOCArCLoYgZ07GhMxwrEV68PNnofWH3sFDyBJ"

const GetFormattedFileName = (fileName: string) => {
	return fileName.replace(/\s+/g, "_")
}

const PROCESSING_STEPS: Step[] = [
	{ id: "uploading", label: "Uploading File" },
	{ id: "identifying", label: "Identifying Document Type" },
	{ id: "extracting", label: "Extracting Text" },
	{ id: "renaming", label: "Renaming File" },
	{ id: "complete", label: "Complete" },
	{ id: "error", label: "Error Occurred" },
]

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
	const [schemaData, setSchemaData] = useState<any>(null)
	const [docNameResults, setDocNameResults] =
		useState<DocNameFunnelReturn | null>(null)
	const [stepState, setStepState] = useState<StepState>({
		currentStepId: "",
		completedStepIds: [],
	})
	const [uploadedFileKey, setUploadedFileKey] = useState<string>("")

	const MIN_STEP_DELAY = 800
	const MIN_ACTIVE_DELAY = 500

	// Update step state helper
	const updateStep = (stepId: string) => {
		setStepState((prev) => {
			// Get the index of the current step
			const currentIndex = PROCESSING_STEPS.findIndex(
				(step) => step.id === stepId
			)
			// Get all steps before this one
			const completedSteps = PROCESSING_STEPS.slice(0, currentIndex)
				.map((step) => step.id)
				.filter(Boolean)

			return {
				currentStepId: stepId,
				completedStepIds: completedSteps,
			}
		})
	}

	const uploadFile = async (file: File): Promise<string> => {
		setIsUploading(true)
		handleFileSelect(file)
		const extension = file.name.split(".").pop()?.toLowerCase() || ""
		if (!extension) {
			throw new Error("File has no extension")
		}
		setOriginalFileName(file.name)
		SafeLog({ display: false, log: { "Original file name": file.name } })
		setOriginalFileExtension(`.${extension}`)
		SafeLog({
			display: false,
			log: {
				"Starting upload": {
					fileName: file.name,
					extension: extension,
				},
			},
		})

		try {
			const uploadResponse = await startUpload([file])
			const uploadResult = uploadResponse?.[0]
			const url = uploadResult?.url
			SafeLog({
				display: false,
				log: { "Upload complete": uploadResult },
			})
			if (!url) throw new Error("Upload failed - no URL returned")

			// Store the file key from the upload response
			if (uploadResult.key) {
				setUploadedFileKey(uploadResult.key)
				SafeLog({
					display: false,
					log: { "Stored file key": uploadResult.key },
				})
			}

			// Create a blob from the uploaded file to handle downloads
			const response = await fetch(url)
			const blob = await response.blob()
			const objectUrl = URL.createObjectURL(blob)
			setSelectedFileUrl(objectUrl)

			return url
		} catch (uploadError) {
			SafeLog({
				display: false,
				log: {
					"Initial upload failed": "Trying with base64 conversion...",
				},
			})

			if (file.type === "application/pdf") {
				const blob = await convertPdfToBase64(file)
				if (blob) {
					const convertedFile = new File([blob], file.name, {
						type: "application/pdf",
					})
					const retryResponse = await startUpload([convertedFile])
					const url = retryResponse?.[0]?.url
					SafeLog({
						display: false,
						log: {
							"Upload with base64 conversion complete": {
								url: url,
							},
						},
					})
					if (!url) throw new Error("Upload failed - no URL returned")
					return url
				}
			}
			throw uploadError
		} finally {
			setIsUploading(false)
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

	const setStepWithMinimumActiveTime = async (
		stepId: string,
		previousSteps: string[]
	) => {
		updateStep(stepId)
		await new Promise((resolve) => setTimeout(resolve, MIN_ACTIVE_DELAY))
	}

	const handleFileSubmit = async (data: {
		type: "file" | "url" | "default"
		value: string | File[] | null
	}) => {
		if (isUploading || isProcessing) return

		try {
			// Start upload
			setStepState({
				currentStepId: "uploading",
				completedStepIds: [],
			})

			const url = await getDocumentUrl(data)
			if (!url) {
				throw new Error("Failed to get document URL")
			}

			// Upload complete, move to identifying
			await setStepWithMinimumActiveTime("identifying", ["uploading"])
			setSelectedFileUrl(url)
			setIsProcessing(true)
			await identifyDocument(url)

			// Start extracting
			await setStepWithMinimumActiveTime("extracting", ["identifying"])
			await startAsyncExtraction(url)

			// Wait for extraction to complete
			while (!extractedData) {
				await new Promise((resolve) => setTimeout(resolve, 500))
			}

			// Start renaming if needed
			if (docNameResults?.data?.docName) {
				await setStepWithMinimumActiveTime("renaming", ["extracting"])

				try {
					const response = await fetch("/api/uploadthing/rename", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fileKey: uploadedFileKey,
							newName: docNameResults.data.docName,
						}),
					})

					const data = await response.json()
					SafeLog({
						display: false,
						log: { "Rename API response": data },
					})

					if (!response.ok) {
						throw new Error(
							data.error || "Failed to rename document"
						)
					}

					await new Promise((resolve) =>
						setTimeout(resolve, MIN_STEP_DELAY)
					)
				} catch (error) {
					SafeLog({
						display: false,
						log: { "Error renaming file": error },
					})
					throw error
				}
			}

			// Complete
			await setStepWithMinimumActiveTime("complete", [
				docNameResults?.data?.docName ? "renaming" : "extracting",
			])
		} catch (error) {
			SafeLog({
				display: false,
				log: { "Error processing document": error },
			})
			setStepState({
				currentStepId: "error",
				completedStepIds: [],
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
		setOriginalFileName("")
		// setOriginalFileExtension("")
	}

	const handleInputTypeChange = (type: "file" | "url" | "default") => {
		setSelectedInputType(type)
		// setOriginalFileExtension("")
		handleReset()
	}

	useEffect(() => {
		if (documentTypeResult) {
			setFileType(documentTypeResult.documentType)
			updateStep("identifying")
		}
	}, [documentTypeResult])

	useEffect(() => {
		if (extractedData?.schema) {
			setSchemaData(extractedData.schema)
			// Only move to the next step if we have valid schema data
			const schema = extractedData.schema
			if (
				typeof schema.document_comes_from === "string" &&
				typeof schema.document_kind === "string" &&
				typeof schema.document_name === "string"
			) {
				updateStep("extracting")

				// Process the document name after we have valid schema
				const results = docNameFunnel({
					props: {
						data: {
							schemaData: {
								document_comes_from: schema.document_comes_from,
								document_kind: schema.document_kind,
								document_name: schema.document_name,
								pay_plan: schema.pay_plan,
							},
							docType: fileType || "",
							originalExtension: originalFileExtension,
						},
					},
				})
				setDocNameResults(results)

				// Only proceed with rename if we have valid data and no errors
				if (results.data && !results.error && !results.manualReview) {
					updateStep("renaming")
					// Trigger the rename API call here
					handleRenameDocument(results.data)
				} else {
					// If there are errors or manual review is needed, stop at extracting
					updateStep("extracting")
				}
			}
		}
	}, [extractedData, fileType, originalFileExtension])

	const handleRenameDocument = async (
		renameData: DocNameFunnelReturn["data"]
	) => {
		if (
			!renameData ||
			!renameData.docName ||
			!renameData.docProvider ||
			!uploadedFileKey
		) {
			SafeLog({
				display: false,
				log: {
					"Invalid rename data or missing file key": {
						renameData,
						uploadedFileKey,
					},
				},
			})
			updateStep("error")
			return
		}

		try {
			SafeLog({
				display: false,
				log: {
					"Attempting to rename document": {
						key: uploadedFileKey,
						newName: renameData.docName,
					},
				},
			})

			const response = await fetch("/api/uploadthing/rename", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fileKey: uploadedFileKey,
					newName: renameData.docName,
				}),
			})

			const data = await response.json()
			SafeLog({ display: false, log: { "Rename API response": data } })

			if (!response.ok) {
				throw new Error(data.error || "Failed to rename document")
			}

			updateStep("complete")
		} catch (error) {
			SafeLog({
				display: false,
				log: { "Error renaming document": error },
			})
			updateStep("error")
		}
	}

	const renderSchemaData = () => {
		if (!schemaData) return null

		// Group and order the fields
		const fieldGroups = {
			primary: ["document_name", "document_kind"],
			secondary: ["document_comes_from", "pay_plan"],
		}

		const renderField = (key: string, value: string) => (
			<div key={key} className="p-3 bg-gray-50 rounded-md">
				<label className="text-sm text-gray-500 block mb-1 capitalize">
					{key.replace(/_/g, " ")}
				</label>
				<p className="text-base font-medium">{value || "—"}</p>
			</div>
		)

		return (
			<div className="p-6 bg-white rounded-lg shadow-sm space-y-6">
				<h3 className="text-lg font-semibold">Extracted Information</h3>

				<div className="space-y-4">
					{/* Primary Fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{fieldGroups.primary.map(
							(key) =>
								schemaData[key] &&
								renderField(key, schemaData[key])
						)}
					</div>

					{/* Secondary Fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{fieldGroups.secondary.map(
							(key) =>
								schemaData[key] &&
								renderField(key, schemaData[key])
						)}
					</div>
				</div>
			</div>
		)
	}

	const renderDocNameResults = () => {
		if (!docNameResults) return null

		return (
			<div className="p-6 bg-white rounded-lg shadow-sm space-y-6">
				<h3 className="text-lg font-semibold">Document Name Results</h3>

				{docNameResults.data && (
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-3 bg-gray-50 rounded-md">
								<label className="text-sm text-gray-500 block mb-1">
									Provider
								</label>
								<p className="text-base font-medium">
									{docNameResults.data.docProvider || "—"}
								</p>
							</div>
							<div className="p-3 bg-gray-50 rounded-md">
								<label className="text-sm text-gray-500 block mb-1">
									Type
								</label>
								<p className="text-base font-medium">
									{docNameResults.data.docType || "—"}
								</p>
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
					<div className="p-4 bg-red-50 rounded-md">
						<p className="text-red-600 font-medium">Error</p>
						<p className="text-sm text-red-600 mt-1">
							{docNameResults.error.message}
						</p>
					</div>
				)}

				{docNameResults.suggestion &&
					(docNameResults.suggestion.docProvider ||
						docNameResults.suggestion.docType) && (
						<div className="p-4 bg-blue-50 rounded-md">
							<p className="text-blue-600 font-medium mb-2">
								Suggestions
							</p>
							<div className="space-y-2">
								{docNameResults.suggestion.docProvider && (
									<div>
										<label className="text-sm text-blue-500 block">
											Provider
										</label>
										<p className="text-blue-700">
											{
												docNameResults.suggestion
													.docProvider
											}
										</p>
									</div>
								)}
								{docNameResults.suggestion.docType && (
									<div>
										<label className="text-sm text-blue-500 block">
											Type
										</label>
										<p className="text-blue-700">
											{docNameResults.suggestion.docType}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

				{docNameResults.manualReview && (
					<div className="p-4 bg-yellow-50 rounded-md">
						<p className="text-yellow-600 font-medium">
							Manual Review Required
						</p>
					</div>
				)}
			</div>
		)
	}

	const FileExtNotes = `# API & Usage & File Notes

## Nyckel API - Document Identifier (Public Classifier)
- Takes in only an image file URL and returns the document type and confidence level.
- Takes in the file URL or a file directly.
- So long as the url or the file is an image, the Nyckel API will work. If the file is a pdf, 
then it must be converted to a base64 string before being passed to the Nyckel API.

## Pulse API - Extract File Async
- Takes in a file URL (Accepts both pdf & image) and returns the extracted data 
from the document.

> Not all URLs will specity the file type. For instance, a url that all it contains is the 
> pdf may not have the file extension in the url. In this case, the file extension will 
> be unknown and the Pulse API will not be able to extract the data from the document.
> that we can only verify the contents of the url by whether the API returns an error or not.

For instance, the file that is uploaded will either be a pdf or an image (as these are the 
only 2 file types that are accepted by the Nyckel API). 
`

	return (
		<div className="space-y-8 flex-1 w-full">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold mb-2">
						Document Rename Page
					</h1>
					<p className="text-muted-foreground pl-2 w-2/3">
						Upload a document to rename it to a standard format $"
						{"{"}DocType{"}"}"_"{"{"}DocProvider{"}"}"_"${"{"}
						FileExtension{"}"}. This page demonstrates the usage of
						both the Nyckel API in tandom with the Pulse API to
						discipher the file type and provider before providing a
						file rename update or suggestion. <br />
						<br />
						To better understand the client-side logic behind how
						each api is utilized, as well as the funnel logic, check
						on the file here:
						<br />
						<br />
						<Dialog>
							<DialogTrigger className="bg-black text-white px-4 flex-1 py-1 rounded-md cursor-pointer">
								Logic Preview
							</DialogTrigger>
							<DialogContent className="w-[calc(100vw-3rem)] h-[calc(100vh-3rem)] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] p-6 overflow-scroll">
								<DialogHeader>
									<DialogTitle>Funnel Logic</DialogTitle>
									<Tabs
										defaultValue="account"
										className="min-w-[400px]">
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="funnel">
												Funnel Logic
											</TabsTrigger>
											<TabsTrigger value="file_ext">
												File Extention Logic
											</TabsTrigger>
										</TabsList>
										<TabsContent
											value="funnel"
											className="">
											<Card className="">
												<CardHeader>
													<CardTitle>
														Funnel Logic Diagram
													</CardTitle>
													<CardDescription>
														Funnel Logic ensuring
														that the file has been
														checked in 2 seperate
														ways before being
														certain of a file type /
														provider.
													</CardDescription>
												</CardHeader>
												<CardContent className="">
													<Image
														src={FunnelLogic}
														width={1200}
														height={400}
														alt="Funnel Logic Diagram"
														className="rounded-lg"
													/>
												</CardContent>
											</Card>
										</TabsContent>
										<TabsContent value="file_ext">
											<Card>
												<CardHeader>
													<CardTitle>
														File Extension Logic
													</CardTitle>
													<CardDescription>
														Provided below is the
														links to test each api
														outside of this
														application.
														<br />
														<br />
														<ul>
															<li className="list-disc ml-4 hover:underline ease-in duration-200 transition-all underline-offset-2">
																<Link
																	href="https://www.nyckel.com/pretrained-classifiers/document-types-identifier/"
																	className="text-sky-500 hover:text-sky-600 text-lg"
																	target="_blank"
																	rel="noreferrer">
																	Nyckel API -
																	Document
																	Identifier
																	(Public
																	Classifier)
																	Demo Link
																</Link>
															</li>
															<li className="list-disc ml-4 hover:underline ease-in duration-200 transition-all underline-offset-2">
																<a
																	href="https://docs.runpulse.com/api-reference/endpoint/extract_async"
																	className="text-sky-500 hover:text-sky-600 text-lg"
																	target="_blank"
																	rel="noreferrer">
																	Pulse API -
																	Extract File
																	Async Demo
																	Link
																</a>
															</li>
														</ul>
														<br />
														<p>
															To use the Pulse
															API, click on the
															blue "TRY IT". You
															will need to copy
															this api key into
															the API Key field to
															use it.
														</p>
														<CodeExcerpt
															title="Pulse API Key"
															className="w-full flex"
															theme="dark"
															copyContent={
																env.NEXT_PUBLIC_PULSE_API_KEY
															}
															content={`PULSE_API_KEY='${env.NEXT_PUBLIC_PULSE_API_KEY}'`}
															language="env"
														/>
														<CodeExcerpt
															title="Notes"
															hideCopy={true}
															className="w-full flex"
															copyContent={
																env.NEXT_PUBLIC_NYCKEL_API_KEY
															}
															content={
																FileExtNotes
															}
															language="markdown"
														/>
													</CardDescription>
												</CardHeader>
												<CardContent className="space-y-2">
													<div className="space-y-1">
														<CodeExcerpt
															title="Notes"
															hideCopy={true}
															className="w-full flex"
															copyContent={
																env.NEXT_PUBLIC_NYCKEL_API_KEY
															}
															content={
																FileExtNotes
															}
															language="markdown"
														/>
													</div>
												</CardContent>
											</Card>
										</TabsContent>
									</Tabs>
								</DialogHeader>
							</DialogContent>
						</Dialog>
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

			<h3 className="text-lg font-semibold mb-2">Processing State:</h3>
			<StepIndicator steps={PROCESSING_STEPS} currentState={stepState} />

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

			{/* Schema Data */}
			{schemaData && renderSchemaData()}

			{/* Document Name Results */}
			{docNameResults && renderDocNameResults()}
		</div>
	)
}
