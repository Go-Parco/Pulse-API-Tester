import { useState } from "react"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/config"

const { useUploadThing: useUploadThingCore } =
	generateReactHelpers<OurFileRouter>()

export function useUploadThing() {
	const [uploadedUrl, setUploadedUrl] = useState<string>("")
	const [uploadStatus, setUploadStatus] = useState<string>("")
	const [progress, setProgress] = useState<number>(0)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const { startUpload } = useUploadThingCore("imageUploader")

	const handleFileSelect = (file: File | null) => {
		setSelectedFile(file)
		setUploadedUrl("")
		setUploadStatus("")
		setProgress(0)
	}

	const handleUploadProgress = (progress: number) => {
		setProgress(progress)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedFile) return

		setUploadStatus("Uploading...")
		setProgress(0)

		try {
			const res = await startUpload([selectedFile])
			if (res?.[0]?.url) {
				setUploadedUrl(res[0].url)
				setUploadStatus("Upload complete")
				setProgress(100)
				return res[0].url
			}
		} catch (error: any) {
			setUploadStatus(`Upload failed: ${error.message}`)
			setProgress(0)
		}
	}

	const resetUpload = () => {
		setSelectedFile(null)
		setUploadedUrl("")
		setUploadStatus("")
		setProgress(0)
	}

	return {
		uploadedUrl,
		uploadStatus,
		progress,
		selectedFile,
		handleFileSelect,
		handleSubmit,
		handleUploadProgress,
		resetUpload,
		setSelectedFile,
	}
}
