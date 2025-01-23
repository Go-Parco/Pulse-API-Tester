import React from "react"
import { FiDownload } from "react-icons/fi"
import { getFileIcon } from "../lib/fileIcons"

interface DocumentNameDisplayProps {
	originalFileName: string
	documentName?: string
	fileUrl?: string
}

const DocumentNameDisplay: React.FC<DocumentNameDisplayProps> = ({
	originalFileName,
	documentName,
	fileUrl,
}) => {
	const fileExtension = `.${
		originalFileName.split(".").pop()?.toLowerCase() || ""
	}`
	// Use the document name as is since it should already include the extension from the funnel
	const displayName = documentName || originalFileName

	const handleDownload = async (e: React.MouseEvent) => {
		e.preventDefault()
		if (fileUrl) {
			try {
				const response = await fetch(fileUrl)
				const blob = await response.blob()
				const objectUrl = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = objectUrl
				// Ensure the download name has an extension
				const downloadName = displayName.includes(".")
					? displayName
					: `${displayName}${fileExtension}`
				a.download = downloadName
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(objectUrl)
			} catch (error) {
				console.error("Error downloading file:", error)
			}
		}
	}

	return (
		<div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
			<div className="flex items-center gap-3">
				{getFileIcon(originalFileName, 24)}
				<span className="text-sm font-medium text-zinc-700">
					{displayName}
				</span>
			</div>
			{fileUrl && (
				<button
					onClick={handleDownload}
					className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
					title="Download original file">
					<FiDownload className="w-4 h-4 text-zinc-600" />
				</button>
			)}
		</div>
	)
}

export default DocumentNameDisplay
