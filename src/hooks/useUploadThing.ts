import { useState } from "react"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/server/uploadthing"

const { useUploadThing: useUploadThingCore } =
	generateReactHelpers<OurFileRouter>()

export const useUploadThing = () => {
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
	const [uploadStatus, setUploadStatus] = useState<string>("")
	const [progress, setProgress] = useState<number>(0)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const { startUpload } = useUploadThingCore("imageUploader")

	const handleFileSelect = (file: File | null) => {
		setSelectedFile(file)
		setUploadStatus("")
		setProgress(0)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedFile) {
			setUploadStatus("No file selected")
			return null
		}

		try {
			setUploadStatus("Starting upload...")
			const res = await startUpload([selectedFile])

			if (res?.[0]?.url) {
				setUploadedUrl(res[0].url)
				setUploadStatus("Upload successful")
				setProgress(100)
				return res[0].url
			}
		} catch (error: any) {
			setUploadStatus(`Upload failed: ${error.message}`)
			setProgress(0)
		}
		return null
	}

	const handleUploadProgress = (progress: number) => {
		setProgress(progress)
	}

	const resetUpload = () => {
		setUploadedUrl(null)
		setUploadStatus("")
		setProgress(0)
		setSelectedFile(null)
	}

	return {
		uploadedUrl,
		uploadStatus,
		progress,
		selectedFile,
		handleFileSelect,
		handleSubmit,
		handleUploadProgress,
		setSelectedFile,
		resetUpload,
	}
}
