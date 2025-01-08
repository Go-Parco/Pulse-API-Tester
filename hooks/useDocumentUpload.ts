import { useUploadThing } from "./useUploadThing"
import { usePulseExtract } from "./usePulseExtract"

export const useDocumentUpload = () => {
	const {
		uploadedUrl,
		uploadStatus,
		progress,
		selectedFile,
		handleFileSelect,
		handleSubmit: handleUploadSubmit,
		handleUploadProgress,
		setSelectedFile,
		resetUpload,
	} = useUploadThing()

	const {
		extractionStatus,
		extractedData,
		startExtraction,
		setChunkingMethod,
		timeRemaining,
		resetExtraction,
	} = usePulseExtract()

	const handleSubmit = async (e: React.FormEvent) => {
		const url = await handleUploadSubmit(e)
		if (url) {
			await startExtraction(url)
		}
	}

	const resetAll = () => {
		resetUpload()
		resetExtraction()
	}

	return {
		uploadedUrl,
		uploadStatus,
		progress,
		selectedFile,
		extractionStatus,
		extractedData,
		handleFileSelect,
		handleSubmit,
		handleUploadProgress,
		setChunkingMethod,
		timeRemaining,
		startExtraction,
		setSelectedFile,
		resetAll,
	}
}

export type UploadResponse = {
	url: string
}[]
