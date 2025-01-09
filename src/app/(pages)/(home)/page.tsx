"use client"

import { UploadForm } from "@/components/UploadForm"
import { useDocumentUpload } from "@/hooks/useDocumentUpload"
import { defaultChunks } from "@/types/chunks"

export default function Home() {
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
	} = useDocumentUpload()

	const isExtracting = extractionStatus === "Processing document..."
	const isUploading =
		uploadProgress > 0 && uploadProgress < 100 && !isExtracting

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
				<div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
					<UploadForm
						selectedFile={selectedFile}
						progress={extractionProgress}
						uploadStatus={uploadStatus}
						handleFileSelect={handleFileSelect}
						handleSubmit={handleSubmit}
						chunks={defaultChunks}
						onUseDefault={useDefaultFile}
						onReset={resetForm}
						isExtracting={isExtracting}
						isUploading={isUploading}
						isDefaultFile={isUsingDefault}
						extractedData={extractedData}
					/>
				</div>

				{extractedData && (
					<div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
						<pre className="text-xs">
							{JSON.stringify(extractedData, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</main>
	)
}
