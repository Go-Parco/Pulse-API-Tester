import React, { useState } from "react"
import { ChunkDefinition } from "@/types/chunks"

interface UploadFormProps {
	selectedFile: File | null
	progress: number
	uploadStatus: string
	handleFileSelect: (file: File | null) => void
	handleSubmit: (e: React.FormEvent) => Promise<void>
	chunks: ChunkDefinition[]
	onChunkSelect?: (chunk: "semantic" | "recursive") => void
	onUseDefault?: () => void
	isExtracting?: boolean
	isUploading?: boolean
	filePreviewUrl?: string
	onReset?: () => void
	isDefaultFile?: boolean
	extractedData?: any
	isProcessing?: boolean
}

export const UploadForm: React.FC<UploadFormProps> = ({
	selectedFile,
	progress,
	uploadStatus,
	handleFileSelect,
	handleSubmit,
	chunks,
	onChunkSelect,
	onUseDefault,
	isExtracting = false,
	isUploading = false,
	filePreviewUrl,
	onReset,
	isDefaultFile = false,
	extractedData,
	isProcessing = false,
}) => {
	const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)
	const isComplete = extractedData !== undefined
	const shouldDisableControls = isProcessing || isComplete

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="w-full space-y-2">
					<div className="flex gap-2">
						<input
							type="file"
							onChange={(e) =>
								handleFileSelect(e.target.files?.[0] || null)
							}
							accept="application/pdf"
							className="hidden"
							id="file-upload"
							disabled={isProcessing}
						/>
						<label
							htmlFor="file-upload"
							className={`flex-1 block px-6 py-3 text-center ${
								isProcessing
									? "bg-gray-400 cursor-not-allowed"
									: "bg-blue-500 hover:bg-blue-600 cursor-pointer"
							} text-white rounded-lg transition-colors duration-200`}>
							{selectedFile ? selectedFile.name : "Select PDF"}
						</label>
						<button
							type="button"
							onClick={onUseDefault}
							disabled={isProcessing}
							className={`px-6 py-3 ${
								isProcessing
									? "bg-gray-400 cursor-not-allowed"
									: "bg-gray-500 hover:bg-gray-600"
							} text-white rounded-lg transition-colors duration-200`}>
							Use Default
						</button>
					</div>
					<p className="text-sm text-gray-600 text-center">
						PDF files up to 8MB
					</p>
				</div>

				{/* File Preview - Mobile Toggle */}
				{filePreviewUrl && (
					<div className="md:hidden">
						<button
							type="button"
							onClick={() =>
								setIsPreviewExpanded(!isPreviewExpanded)
							}
							className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors duration-200">
							<span className="text-sm font-medium text-gray-700">
								File Preview
							</span>
							<svg
								className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
									isPreviewExpanded ? "rotate-180" : ""
								}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
						{isPreviewExpanded && (
							<div className="mt-2 border rounded-lg overflow-hidden">
								<div className="h-[600px]">
									<iframe
										src={filePreviewUrl}
										className="w-full h-full"
										title="PDF Preview"
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{selectedFile && (
					<>
						{/* Upload Status Indicator */}
						<div className="flex items-center justify-center space-x-2">
							{isUploading ? (
								<>
									<div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
									<p className="text-sm text-gray-600">
										Uploading document...
									</p>
								</>
							) : uploadStatus ? (
								<p className="text-sm text-green-600">
									Document uploaded successfully
								</p>
							) : null}
						</div>

						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Extraction Method
							</label>
							<select
								className={`w-full p-2 border border-gray-300 rounded-md ${
									isProcessing
										? "bg-gray-100 cursor-not-allowed"
										: ""
								}`}
								onChange={(e) =>
									onChunkSelect?.(
										e.target.value as
											| "semantic"
											| "recursive"
									)
								}
								defaultValue={chunks[0]?.value}
								disabled={isProcessing}>
								{chunks.map((chunk) => (
									<option
										key={chunk.id}
										value={chunk.value}
										title={chunk.description}>
										{chunk.label}
									</option>
								))}
							</select>
						</div>

						<div className="flex gap-2">
							<button
								type="submit"
								className={`flex-1 px-6 py-3 ${
									isProcessing
										? "bg-gray-400 cursor-not-allowed"
										: "bg-green-500 hover:bg-green-600"
								} text-white rounded-lg transition-colors duration-200`}
								disabled={isProcessing}>
								{isExtracting
									? "Extracting..."
									: isUploading
									? "Uploading..."
									: progress > 0 && progress < 100
									? "Processing..."
									: isDefaultFile
									? "Start Extraction"
									: "Upload and Extract"}
							</button>
							{isComplete && onReset && (
								<button
									type="button"
									onClick={onReset}
									className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200">
									Reset Form
								</button>
							)}
						</div>
					</>
				)}
			</form>

			{/* Progress Bar */}
			{(progress > 0 && progress < 100) || isExtracting ? (
				<>
					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div
							className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}
						/>
					</div>
					{isExtracting && (
						<div className="flex items-center justify-center space-x-2">
							<div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
							<p className="text-sm text-gray-600">
								Extracting document contents...
							</p>
						</div>
					)}
				</>
			) : null}

			{/* Status Messages */}
			{uploadStatus && !isExtracting && !isUploading && (
				<p className="text-sm text-center text-gray-600">
					{uploadStatus}
				</p>
			)}
		</div>
	)
}
