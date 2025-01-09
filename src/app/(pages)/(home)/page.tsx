"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDocumentUpload } from "@/hooks/useDocumentUpload"
import { UploadForm } from "@/components/UploadForm"
import { defaultChunks } from "@/types/chunks"
import { DEFAULT_FILE_URL } from "@/app/api/pulse/config"

export default function Home() {
	const router = useRouter()
	const [showPreview, setShowPreview] = useState(false)
	const [isMediaScreen, setIsMediaScreen] = useState(false)
	const [isDefaultFile, setIsDefaultFile] = useState(false)
	const [isRawDataExpanded, setIsRawDataExpanded] = useState(false)
	const {
		uploadedUrl,
		extractionStatus,
		extractedData,
		progress,
		uploadStatus,
		selectedFile,
		handleFileSelect,
		handleSubmit,
		setChunkingMethod,
		timeRemaining,
		startExtraction,
		setSelectedFile,
		resetAll,
	} = useDocumentUpload()

	// Detect medium screens and up
	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)")
		setIsMediaScreen(mediaQuery.matches)

		const handler = (e: MediaQueryListEvent) => setIsMediaScreen(e.matches)
		mediaQuery.addEventListener("change", handler)
		return () => mediaQuery.removeEventListener("change", handler)
	}, [])

	const handleSignOut = async () => {
		try {
			const response = await fetch("/api/auth/signout", {
				method: "POST",
			})

			if (!response.ok) {
				throw new Error("Failed to sign out")
			}

			router.push("/signin")
		} catch (error) {
			console.error("Sign out error:", error)
		}
	}

	// Custom chunks for USDA documents
	const defaultChunks = [
		{
			id: "usda-semantic",
			label: "Semantic",
			value: "semantic",
			description: "Optimized for forms",
		},
		{
			id: "usda-header",
			label: "Headers",
			value: "header",
			description: "Based on document headers",
		},
	]

	const handleDefaultFile = () => {
		setSelectedFile(new File([], "default.pdf"))
		setShowPreview(true)
		setIsDefaultFile(true)
	}

	const handleFileUpload = (file: File | null) => {
		handleFileSelect(file)
		setShowPreview(false)
		setIsDefaultFile(false)
	}

	const handleReset = () => {
		// Reset all upload and extraction states
		resetAll()

		// Reset UI states
		setShowPreview(false)
		setIsDefaultFile(false)
		setIsRawDataExpanded(false)

		// Reset extraction method to default
		setChunkingMethod("semantic")
	}

	const isExtracting =
		extractionStatus === "Processing document..." ||
		extractionStatus === "Starting extraction..."

	// Show preview if default is selected or if a file has been uploaded successfully
	// AND raw data view is not expanded
	const shouldShowPreview = (showPreview || uploadedUrl) && !isRawDataExpanded

	// Only disable controls during active processing
	const isProcessing = isExtracting || (progress > 0 && progress < 100)

	return (
		<div className="min-h-screen p-8">
			<div className="relative mx-auto md:flex md:gap-8 md:items-start md:max-w-6xl">
				{/* File Preview - On medium screens, appears on the left */}
				{shouldShowPreview && (
					<div className="sticky hidden md:block md:w-1/2 lg:w-2/5 top-8">
						<div className="overflow-hidden bg-white border rounded-lg">
							<div className="px-4 py-2 border-b bg-gray-50">
								<h3 className="text-sm font-medium text-gray-700">
									File Preview
								</h3>
							</div>
							<div className="h-[800px]">
								<iframe
									src={uploadedUrl || DEFAULT_FILE_URL}
									className="w-full h-full"
									title="PDF Preview"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Form and Outputs - On medium screens, appears on the right */}
				<div className="min-w-0 space-y-4 md:flex-1">
					<div className="flex justify-end">
						<button
							onClick={handleSignOut}
							className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
							Sign out
						</button>
					</div>

					<UploadForm
						selectedFile={selectedFile}
						progress={isExtracting ? progress : 0}
						uploadStatus={uploadStatus}
						handleFileSelect={handleFileUpload}
						handleSubmit={async (e) => {
							e.preventDefault()
							if (isDefaultFile) {
								await startExtraction(DEFAULT_FILE_URL)
							} else {
								await handleSubmit(e)
							}
						}}
						chunks={defaultChunks}
						onChunkSelect={(chunk) =>
							setChunkingMethod(chunk as "semantic" | "recursive")
						}
						onUseDefault={handleDefaultFile}
						isExtracting={isExtracting}
						isUploading={
							progress > 0 && progress < 100 && !isExtracting
						}
						filePreviewUrl={
							shouldShowPreview
								? uploadedUrl || DEFAULT_FILE_URL
								: undefined
						}
						onReset={handleReset}
						isDefaultFile={isDefaultFile}
						extractedData={extractedData}
						isProcessing={isProcessing}
					/>

					{/* Extraction Status and Data */}
					{extractedData && (
						<div className="p-6 mt-6 overflow-x-auto bg-white rounded-lg shadow-lg">
							<h3 className="mb-4 text-lg font-semibold">
								Extracted Data
							</h3>
							<div className="space-y-4">
								{/* Display Text Content */}
								{extractedData.text && (
									<div>
										<h4 className="mb-2 font-medium">
											Extracted Text
										</h4>
										<div className="p-4 text-sm whitespace-pre-wrap rounded bg-gray-50">
											{extractedData.text}
										</div>
									</div>
								)}

								{/* Display Tables if present */}
								{extractedData.tables &&
									extractedData.tables.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium">
												Tables
											</h4>
											{extractedData.tables.map(
												(table: any, index: number) => (
													<div
														key={index}
														className="overflow-x-auto">
														<table className="min-w-full mb-4 border border-gray-200">
															<tbody>
																{table.data.map(
																	(
																		row: any,
																		rowIndex: number
																	) => (
																		<tr
																			key={
																				rowIndex
																			}
																			className={
																				rowIndex %
																					2 ===
																				0
																					? "bg-gray-50"
																					: "bg-white"
																			}>
																			{row.map(
																				(
																					cell: any,
																					cellIndex: number
																				) => (
																					<td
																						key={
																							cellIndex
																						}
																						className="px-4 py-2 text-sm border">
																						{
																							cell
																						}
																					</td>
																				)
																			)}
																		</tr>
																	)
																)}
															</tbody>
														</table>
													</div>
												)
											)}
										</div>
									)}

								{/* Debug View */}
								<details
									onToggle={(e) =>
										setIsRawDataExpanded(
											(e.target as HTMLDetailsElement)
												.open
										)
									}>
									<summary className="text-sm text-gray-600 cursor-pointer">
										View Raw Data
									</summary>
									<div className="p-4 overflow-x-auto text-xs whitespace-pre bg-gray-100 rounded">
										<pre className="p-4 mt-2 text-xs whitespace-pre rounded">
											{JSON.stringify(
												extractedData,
												null,
												2
											)}
										</pre>
									</div>
								</details>
							</div>
						</div>
					)}

					{extractionStatus &&
						extractionStatus !== "Starting extraction..." &&
						extractionStatus !== "Processing document..." && (
							<p className="text-sm text-center text-gray-600">
								{extractionStatus}
							</p>
						)}
				</div>
			</div>
		</div>
	)
}
