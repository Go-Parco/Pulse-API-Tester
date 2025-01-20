"use client"
import React, { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { AcceptedFileType, FileUploaderProps } from "@/types/FileTypes"
import { cn } from "@/lib/utils"

export const FileUploader: React.FC<FileUploaderProps> = ({
	acceptMultiple = false,
	maxFileSize = 5, // Default 5MB
	acceptedTypes = [AcceptedFileType.IMAGE, AcceptedFileType.PDF],
	onFilesSelected,
	onFileRemoved,
	disabled = false,
	className = "",
}) => {
	const [previews, setPreviews] = useState<string[]>([])
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: acceptedTypes.reduce((acc, type) => {
			const mimeTypes = type.split(",")
			mimeTypes.forEach((mime) => {
				if (mime === "image/*") {
					acc[mime] = [".jpeg", ".jpg", ".png", ".gif"]
				} else {
					acc[mime] = []
				}
			})
			return acc
		}, {} as Record<string, string[]>),
		maxFiles: acceptMultiple ? undefined : 1,
		maxSize: maxFileSize * 1024 * 1024,
		disabled,
		onDrop: (acceptedFiles) => {
			const files = acceptMultiple ? acceptedFiles : [acceptedFiles[0]]
			setSelectedFiles(files)
			onFilesSelected(files)

			// Create previews for images
			const newPreviews = files.map((file) =>
				file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
			)
			setPreviews(newPreviews)
		},
	})

	useEffect(() => {
		return () => {
			// Cleanup previews
			previews.forEach((preview) => {
				if (preview) URL.revokeObjectURL(preview)
			})
		}
	}, [previews])

	const clearFiles = (e: React.MouseEvent) => {
		e.stopPropagation()
		setPreviews([])
		setSelectedFiles([])
		onFileRemoved?.()
	}

	const getFileSize = (size: number) => {
		return (size / 1024 / 1024).toFixed(2)
	}

	return (
		<div
			{...getRootProps()}
			className={cn(
				"border-dashed border-2 border-zinc-300 p-6 rounded-lg cursor-pointer hover:border-zinc-400 transition-colors",
				disabled && "opacity-50 cursor-not-allowed",
				className
			)}>
			<input {...getInputProps()} />
			<div className="flex flex-col items-center justify-center gap-4">
				{selectedFiles.length > 0 ? (
					<div className="flex flex-wrap gap-6 w-full items-center relative">
						<button
							onClick={clearFiles}
							className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm z-10"
							type="button">
							<svg
								className="w-4 h-4 text-zinc-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						{selectedFiles.map((file, index) => (
							<div
								key={index}
								className="flex items-center gap-4 w-full">
								{previews[index] && (
									<div className="relative w-full sm:w-auto">
										<img
											src={previews[index]}
											alt={`Preview ${index + 1}`}
											className="max-h-[250px] w-auto object-contain mx-auto rounded-2xl"
										/>
									</div>
								)}
								<div className="flex-1 min-w-[200px] w-full sm:w-auto">
									<div className="max-w-[300px]">
										<p className="text-zinc-600 font-medium truncate">
											{file.name}
										</p>
										<p className="text-zinc-400 text-sm">
											{getFileSize(file.size)} MB
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<>
						<div className="p-4 bg-zinc-100 rounded-full">
							<svg
								className="w-6 h-6 text-zinc-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div className="text-center">
							{isDragActive ? (
								<p className="text-zinc-600">
									Drop the file here...
								</p>
							) : (
								<>
									<p className="text-zinc-600">
										Drag & drop{" "}
										{acceptMultiple ? "files" : "a file"}{" "}
										here, or click to select
									</p>
									<p className="text-zinc-400 text-sm mt-2">
										Supports {acceptedTypes.join(", ")} up
										to {maxFileSize}MB
									</p>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
