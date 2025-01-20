"use client"

import { useState, useEffect } from "react"
import { UploadForm } from "./UploadForm"
import { useDocumentUploadThingUpload } from "@/hooks/useDocumentUploadThingUpload"
import { defaultChunks } from "@/types/chunks"
import { useRouter } from "next/navigation"

export default function ExtractPage() {
	const router = useRouter()
	const [showPreview, setShowPreview] = useState(true)
	const [isRawDataExpanded, setIsRawDataExpanded] = useState(false)
	const DEFAULT_PDF_URL =
		"https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqG7ISpBGweVmXo0cniOfj8HrZ9JlWDkq2aU4Gt"

	const {
		extractionStatus,
		extractedData,
		uploadProgress,
		extractionProgress,
		uploadStatus,
		selectedFile,
		isUsingDefault,
		handleFileSelect,
		handleSubmit,
		handleUploadProgress,
		useDefaultFile,
		resetForm,
		uploadedUrl,
		setChunkingMethod,
	} = useDocumentUploadThingUpload()

	const isExtracting =
		extractionStatus === "Processing document..." ||
		(extractionProgress > 0 && extractionProgress < 100)
	const isUploading =
		uploadProgress > 0 && uploadProgress < 100 && !isExtracting

	useEffect(() => {
		if (extractedData) {
			console.log("Extracted Data Updated:", {
				hasSchema: !!extractedData.schema,
				schema: extractedData.schema,
				fullData: extractedData,
			})
		}
	}, [extractedData])

	useEffect(() => {
		console.log("Extracted Data Updated:", extractedData)
	}, [extractedData])

	return (
		<div className="min-h-screen p-8">
			<div className="relative mx-auto md:flex md:flex-col md:max-w-6xl">
				{/* Header Section */}
				<div className="mb-8 mt-10">
					<div className="flex justify-between items-center mb-6">
						<div className="space-y-4">
							<h1 className="text-2xl font-bold text-gray-900">
								Document Extraction Demo
							</h1>
							<div className="space-y-2">
								<p className="text-gray-600 max-w-2xl">
									Upload a PDF document to extract its
									contents using Parco's document processing
									API. You can either upload your own PDF or
									use our sample document to test the
									extraction capabilities.
								</p>
								<div className="text-sm text-gray-600 space-y-1">
									<p className="font-medium">
										Testing Instructions:
									</p>
									<ul className="list-disc list-inside pl-2 space-y-1">
										<li>
											Click "Use Default" to test with our
											sample document
										</li>
										<li>
											Choose between semantic or recursive
											extraction methods
										</li>
										<li>
											Watch the progress bar for real-time
											extraction status
										</li>
										<li>
											View extracted text, tables, and raw
											data in the results
										</li>
										<li>
											Try uploading your own PDF (up to
											8MB) to test with different
											documents
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="md:flex md:gap-8 md:items-start">
					{/* File Preview - On medium screens, appears on the left */}
					{showPreview && (isUsingDefault || uploadedUrl) && (
						<div className="sticky hidden md:block md:w-1/2 lg:w-2/5 top-8">
							<div className="overflow-hidden bg-white border rounded-lg">
								<div className="px-4 py-2 border-b bg-gray-50">
									<h3 className="text-sm font-medium text-gray-700">
										File Preview
									</h3>
								</div>
								<div className="h-[800px]">
									<iframe
										src={uploadedUrl || DEFAULT_PDF_URL}
										className="w-full h-full"
										title="PDF Preview"
									/>
								</div>
							</div>
						</div>
					)}

					{/* Form and Outputs - On medium screens, appears on the right */}
					<div className="min-w-0 space-y-4 md:flex-1">
						<UploadForm
							selectedFile={selectedFile}
							progress={extractionProgress}
							uploadStatus={uploadStatus}
							handleFileSelect={handleFileSelect}
							handleSubmit={handleSubmit}
							chunks={defaultChunks}
							onChunkSelect={setChunkingMethod}
							onUseDefault={useDefaultFile}
							onReset={resetForm}
							isExtracting={isExtracting}
							isUploading={isUploading}
							isDefaultFile={isUsingDefault}
							extractedData={extractedData}
							isProcessing={isExtracting || isUploading}
						/>

						{/* Extraction Status and Data */}
						<div className="p-6 mt-6 overflow-x-auto bg-white rounded-lg shadow-lg">
							<h3 className="mb-4 text-lg font-semibold">
								Extracted Data
							</h3>
							<div className="space-y-4">
								{isExtracting ? (
									<div className="p-4 text-sm rounded bg-gray-100">
										<div className="flex items-center justify-center h-24">
											<div className="flex items-center gap-2">
												<div className="w-4 h-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
												<div className="animate-pulse text-gray-500">
													Extracting document
													contents...
												</div>
											</div>
										</div>
									</div>
								) : extractedData ? (
									<>
										{/* Display Schema Information */}
										{extractedData?.schema && (
											<div className="mb-6">
												<h4 className="mb-2 font-medium">
													Document Information
												</h4>
												<div className="p-4 space-y-2 text-sm rounded bg-gray-50">
													{Object.entries(
														extractedData.schema
													).map(([key, value]) => (
														<div
															key={key}
															className="flex">
															<span className="w-40 font-medium capitalize">
																{key.replace(
																	/_/g,
																	" "
																)}
																:
															</span>
															<p>
																{/* @ts-ignore*/}
																{value ||
																	"Not specified"}
															</p>
														</div>
													))}
												</div>
											</div>
										)}

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
										{extractedData?.tables &&
											extractedData.tables.length > 0 && (
												<div>
													<h4 className="mb-2 font-medium">
														Tables
													</h4>
													{extractedData.tables.map(
														(
															table: any,
															index: number
														) => (
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
													(
														e.target as HTMLDetailsElement
													).open
												)
											}>
											<summary className="text-sm text-gray-600 cursor-pointer">
												View Raw Data
											</summary>
											<div className="p-4 overflow-x-auto text-xs whitespace-pre bg-gray-100 rounded">
												<pre>
													{JSON.stringify(
														extractedData,
														null,
														2
													)}
												</pre>
											</div>
										</details>
									</>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
