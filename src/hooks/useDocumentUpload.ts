import { useState } from "react"
import { useUploadThing } from "./useUploadThing"
import { usePulseExtract } from "./usePulseExtract"

export function useDocumentUpload() {
	const [isUsingDefault, setIsUsingDefault] = useState(false)
	const defaultFileUrl = "/sample.pdf"

	const {
		uploadedUrl,
		uploadStatus,
		progress: uploadProgress,
		selectedFile,
		handleFileSelect,
		handleSubmit: handleUploadSubmit,
		handleUploadProgress,
		setSelectedFile,
		resetUpload,
	} = useUploadThing()

	const {
		extractedData,
		extractionStatus,
		progress: extractionProgress,
		startExtraction,
		resetExtraction,
	} = usePulseExtract()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedFile && !isUsingDefault) return

		let fileUrl: string | null = isUsingDefault ? defaultFileUrl : null

		if (!isUsingDefault) {
			const uploadedFileUrl = await handleUploadSubmit(e)
			if (uploadedFileUrl) {
				fileUrl = uploadedFileUrl
			}
		}

		if (fileUrl) {
			await startExtraction(fileUrl)
		}
	}

	const useDefaultFile = () => {
		setIsUsingDefault(true)
		setSelectedFile(null)
	}

	const resetForm = () => {
		setIsUsingDefault(false)
		resetUpload()
		resetExtraction()
	}

	return {
		uploadedUrl,
		uploadStatus,
		uploadProgress,
		extractedData,
		extractionStatus,
		extractionProgress,
		selectedFile,
		isUsingDefault,
		handleFileSelect,
		handleSubmit,
		handleUploadProgress,
		useDefaultFile,
		resetForm,
	}
}

export type UploadResponse = {
	url: string
}[]
