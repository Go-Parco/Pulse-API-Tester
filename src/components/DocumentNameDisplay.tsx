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
	const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || ""
	const displayName = documentName || originalFileName

	const handleDownload = (e: React.MouseEvent) => {
		e.preventDefault()
		if (fileUrl) {
			const a = document.createElement("a")
			a.href = fileUrl
			// Use the original file extension for the download
			a.download = `${displayName}.${fileExtension}`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
		}
	}

	return (
		<div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
			<div className="flex items-center gap-3">
				{getFileIcon(originalFileName, 24)}
				<span className="text-sm font-medium text-zinc-700">
					{displayName}
					<span className="text-zinc-400 ml-1">.{fileExtension}</span>
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
