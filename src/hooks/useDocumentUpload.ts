import { useState } from "react"
import { useUploadThing } from "./useUploadThing"
import { usePulseExtract } from "./usePulseExtract"

export function useDocumentUpload() {
	const [isUsingDefault, setIsUsingDefault] = useState(false)
	const defaultFileUrl =
		"https://utfs.io/f/FLqidTvfTRqGLsjyw9WU1YApM8c4qomfkI3S50DdbuOJhrW7"

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
		setChunkingMethod,
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
		const mockFile = new File([""], "sample.pdf", {
			type: "application/pdf",
		})
		setSelectedFile(mockFile)
	}

	const resetForm = () => {
		setIsUsingDefault(false)
		resetUpload()
		resetExtraction()
	}

	return {
		uploadedUrl: isUsingDefault ? defaultFileUrl : uploadedUrl,
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
		setChunkingMethod,
	}
}

export type UploadResponse = {
	url: string
}[]
