"use client"
import React, { useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { AcceptedFileType } from "@/types/FileTypes"
import { cn } from "@/lib/utils"
import {
	BsFileEarmarkPdfFill,
	BsFileEarmarkWordFill,
	BsFileEarmarkExcelFill,
	BsFileEarmarkTextFill,
	BsFileEarmarkPlayFill,
	BsFileEarmarkRichtextFill,
	BsFileEarmarkPptFill,
	BsFiletypePpt,
	BsFiletypeDoc,
	BsFiletypeDocx,
	BsBox,
	BsFileEarmarkMusicFill,
	BsFileEarmarkZipFill,
} from "react-icons/bs"
import { DiApple } from "react-icons/di"
import { AiFillFile } from "react-icons/ai"
import * as mm from "music-metadata-browser"
import DocumentNameDisplay from "@/components/DocumentNameDisplay"

interface PreviewType {
	type: "audio" | "image" | "pdf" | "other"
	preview: string | null
}

const getFileExtensions = (type: string): string[] => {
	switch (type) {
		case "image/*":
			return [
				".jpeg",
				".jpg",
				".png",
				".gif",
				".webp",
				".svg",
				".heic",
				".avif",
			]
		case "application/pdf":
			return [".pdf"]
		case "application/msword":
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			return [".doc", ".docx", ".pages"]
		case "application/vnd.ms-excel":
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
			return [".xls", ".xlsx", ".csv", ".numbers"]
		case "application/vnd.ms-powerpoint":
		case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
			return [".ppt", ".pptx", ".keynote"]
		case "text/plain":
			return [".txt", ".rtf"]
		case "video/*":
			return [".mp4", ".mov", ".avi", ".m4v"]
		case "audio/*":
			return [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"]
		case "model/*":
			return [".obj", ".fbx", ".stl", ".blend", ".3d"]
		case "application/zip":
		case "application/x-zip-compressed":
		case "application/x-7z-compressed":
			return [".zip", ".7z"]
		case "application/octet-stream":
			return [".bin"]
		default:
			return []
	}
}

export const getFileIcon = (
	fileType: string,
	size: number = 64,
	color: string = "#666"
) => {
	const lowerType = fileType.toLowerCase()

	// Archive formats
	if (
		lowerType.includes("zip") ||
		lowerType.includes("7z") ||
		lowerType.endsWith(".zip") ||
		lowerType.endsWith(".7z")
	) {
		return <BsFileEarmarkZipFill size={size} color="#FFA000" />
	}

	// Binary files
	if (lowerType.includes("octet-stream") || lowerType.endsWith(".bin")) {
		return <AiFillFile size={size} color="#607D8B" />
	}

	// Microsoft Office formats
	if (
		lowerType.includes("word") ||
		lowerType.includes("docx") ||
		lowerType.includes("doc") ||
		lowerType.endsWith(".pages")
	) {
		return <BsFiletypeDocx size={size} color="#2B579A" />
	}
	if (
		lowerType.includes("excel") ||
		lowerType.includes("xlsx") ||
		lowerType.includes("xls") ||
		lowerType.includes("csv")
	) {
		return <BsFileEarmarkExcelFill size={size} color="#217346" />
	}
	if (
		lowerType.includes("powerpoint") ||
		lowerType.includes("pptx") ||
		lowerType.includes("ppt")
	) {
		return <BsFiletypePpt size={size} color="#B7472A" />
	}

	// Apple formats
	if (
		lowerType.includes("pages") ||
		lowerType.includes("numbers") ||
		lowerType.includes("keynote")
	) {
		return <DiApple size={size} color="#666" />
	}

	// Text formats
	if (lowerType.includes("pdf")) {
		return <BsFileEarmarkPdfFill size={size} color="red" />
	}
	if (lowerType.includes("txt")) {
		return <BsFileEarmarkTextFill size={size} color={color} />
	}
	if (lowerType.includes("rtf")) {
		return <BsFileEarmarkRichtextFill size={size} color={color} />
	}

	// Video formats
	if (
		lowerType.includes("video") ||
		lowerType.includes("mp4") ||
		lowerType.includes("mov") ||
		lowerType.includes("m4v") ||
		lowerType.includes("avi")
	) {
		return <BsFileEarmarkPlayFill size={size} color="#FF4081" />
	}

	// 3D formats
	if (
		lowerType.includes("obj") ||
		lowerType.includes("fbx") ||
		lowerType.includes("3d") ||
		lowerType.includes("blend") ||
		lowerType.includes("stl")
	) {
		return <BsBox size={size} color="#EA7600" />
	}

	// Music files
	if (
		lowerType.includes("audio") ||
		[".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"].some((ext) =>
			lowerType.endsWith(ext)
		)
	) {
		return <BsFileEarmarkMusicFill size={size} color="#1DB954" />
	}

	// Default
	return <AiFillFile size={size} color={color} />
}

export interface FileUploaderProps {
	acceptMultiple?: boolean
	maxFileSize?: number
	maxFileCount?: number
	acceptedTypes?: AcceptedFileType[]
	onFilesSelected: (files: File[]) => void
	onFileRemoved?: () => void
	disabled?: boolean
	className?: string
	fileInputRef?: React.RefObject<HTMLInputElement>
	documentName?: string
	fileUrl?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({
	acceptMultiple = false,
	maxFileSize = 5,
	maxFileCount,
	acceptedTypes = [AcceptedFileType.IMAGE, AcceptedFileType.PDF],
	onFilesSelected,
	onFileRemoved,
	disabled = false,
	className = "",
	fileInputRef = undefined,
	documentName = "",
	fileUrl,
}) => {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [previews, setPreviews] = useState<PreviewType[]>([])

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const files = acceptMultiple ? acceptedFiles : [acceptedFiles[0]]

			// Check if adding these files would exceed the maxFileCount
			if (
				maxFileCount &&
				selectedFiles.length + files.length > maxFileCount
			) {
				alert(`You can only upload a maximum of ${maxFileCount} files.`)
				return
			}

			if (!files.length) return

			// If acceptMultiple, append to existing files, otherwise replace
			const newFiles = acceptMultiple
				? [...selectedFiles, ...files]
				: files
			setSelectedFiles(newFiles)
			onFilesSelected(newFiles)

			const newPreviews = await Promise.all(
				files.map(async (file) => {
					if (!file) return { type: "other" as const, preview: null }

					const fileType = (file.type || "").toLowerCase()
					const fileName = (file.name || "").toLowerCase()

					// Handle SVG files first (they might not have correct MIME type)
					if (fileName.endsWith(".svg")) {
						return {
							type: "image" as const,
							preview: URL.createObjectURL(file),
						}
					}

					// Handle audio files
					const isAudioFile =
						fileType.startsWith("audio/") ||
						[".mp3", ".m4a", ".wav", ".ogg", ".flac", ".aac"].some(
							(ext) => fileName.endsWith(ext)
						)

					if (isAudioFile) {
						console.log(
							"Processing audio file:",
							fileName,
							fileType
						)
						try {
							const metadata = await mm.parseBlob(file)
							console.log("Audio metadata:", metadata)

							if (metadata?.common?.picture?.[0]) {
								console.log("Found album art")
								const picture = metadata.common.picture[0]
								const blob = new Blob([picture.data], {
									type: picture.format,
								})
								const url = URL.createObjectURL(blob)
								console.log("Created album art URL:", url)
								return { type: "audio" as const, preview: url }
							} else {
								console.log("No album art found")
							}
						} catch (error) {
							console.error(
								"Error reading audio metadata:",
								error
							)
						}
						// Always return audio type even if metadata extraction fails
						return { type: "audio" as const, preview: null }
					}

					// Handle images
					if (
						fileType.startsWith("image/") ||
						fileName.endsWith(".svg")
					) {
						return {
							type: "image" as const,
							preview: URL.createObjectURL(file),
						}
					}

					// Handle PDFs
					if (
						fileType === "application/pdf" ||
						fileName.endsWith(".pdf")
					) {
						return { type: "pdf" as const, preview: null }
					}

					return { type: "other" as const, preview: null }
				})
			)
			setPreviews(
				acceptMultiple ? [...previews, ...newPreviews] : newPreviews
			)
		},
		[acceptMultiple, onFilesSelected, maxFileCount, selectedFiles, previews]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: acceptedTypes.reduce((acc, type) => {
			const mimeTypes = type.split(",")
			mimeTypes.forEach((mime) => {
				// Skip invalid MIME types
				if (mime === "*/*") return

				// Handle special cases
				if (mime === "image/*") {
					acc["image/jpeg"] = [".jpg", ".jpeg"]
					acc["image/png"] = [".png"]
					acc["image/gif"] = [".gif"]
					acc["image/webp"] = [".webp"]
					acc["image/svg+xml"] = [".svg"]
					acc["image/heic"] = [".heic"]
					acc["image/avif"] = [".avif"]
					return
				}

				if (mime === "video/*") {
					acc["video/mp4"] = [".mp4"]
					acc["video/quicktime"] = [".mov"]
					acc["video/x-msvideo"] = [".avi"]
					acc["video/x-m4v"] = [".m4v"]
					return
				}

				if (mime === "audio/*") {
					acc["audio/mpeg"] = [".mp3"]
					acc["audio/wav"] = [".wav"]
					acc["audio/ogg"] = [".ogg"]
					acc["audio/x-m4a"] = [".m4a"]
					acc["audio/flac"] = [".flac"]
					acc["audio/aac"] = [".aac"]
					return
				}

				if (mime === "model/*") {
					acc["model/obj"] = [".obj"]
					acc["model/fbx"] = [".fbx"]
					acc["model/stl"] = [".stl"]
					acc["model/gltf-binary"] = [".glb"]
					acc["application/x-blender"] = [".blend"]
					return
				}

				// For all other specific MIME types
				acc[mime] = getFileExtensions(mime)
			})
			return acc
		}, {} as Record<string, string[]>),
		maxFiles: acceptMultiple ? maxFileCount : 1,
		maxSize: maxFileSize * 1024 * 1024,
		disabled,
		onDrop,
	})

	useEffect(() => {
		return () => {
			// Cleanup previews
			previews.forEach((preview) => {
				if (preview.preview) URL.revokeObjectURL(preview.preview)
			})
		}
	}, [previews])

	const clearFiles = (e: React.MouseEvent) => {
		e.stopPropagation()
		setPreviews([])
		setSelectedFiles([])
		onFileRemoved?.()
	}

	const removeFile = (e: React.MouseEvent, index: number) => {
		e.stopPropagation()
		const newFiles = selectedFiles.filter((_, i) => i !== index)
		const newPreviews = previews.filter((_, i) => i !== index)
		setSelectedFiles(newFiles)
		setPreviews(newPreviews)
		if (newFiles.length === 0) {
			onFileRemoved?.()
		}
	}

	const getFileSize = (size: number) => {
		return (size / 1024 / 1024).toFixed(2)
	}

	return (
		<div className="space-y-4">
			{selectedFiles.length > 0 && selectedFiles[0] && (
				<DocumentNameDisplay
					originalFileName={selectedFiles[0].name}
					documentName={documentName}
					fileUrl={fileUrl}
				/>
			)}
			<div
				{...getRootProps()}
				className={cn(
					"border-dashed border-2 border-zinc-300 p-6 rounded-lg cursor-pointer hover:border-zinc-400 transition-colors max-h-[475px] overflow-y-auto",
					disabled && "opacity-50 cursor-not-allowed",
					className
				)}>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center justify-center gap-4">
					{selectedFiles.length > 0 ? (
						<div className="flex flex-col gap-6 w-full items-center relative">
							{!acceptMultiple && (
								<button
									onClick={clearFiles}
									className="sticky top-0 right-2 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm z-10 self-end"
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
							)}
							{selectedFiles.map((file, index) => {
								if (!file) return null

								const fileName = file.name.toLowerCase()
								const fileType = file.type.toLowerCase()
								const preview = previews[index]
								const isImage =
									fileType.startsWith("image/") ||
									fileName.endsWith(".svg")
								const isAudioFile =
									fileType.startsWith("audio/") ||
									[
										".mp3",
										".m4a",
										".wav",
										".ogg",
										".flac",
										".aac",
									].some((ext) => fileName.endsWith(ext))

								return (
									<div
										key={index}
										className="flex items-center gap-4 w-full relative">
										{acceptMultiple && (
											<button
												onClick={(e) =>
													removeFile(e, index)
												}
												className="absolute -top-2 -right-2 p-1 bg-white hover:bg-zinc-50 rounded-full shadow-sm z-10"
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
										)}
										{!isAudioFile && (
											<div className="relative w-full sm:w-auto">
												{isImage ? (
													<img
														src={
															preview?.preview ||
															"https://user-images.githubusercontent.com/2351721/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png"
														}
														alt={`Preview ${
															index + 1
														}`}
														className="max-h-[200px] min-w-[100px] min-h-[100px] w-auto object-contain mx-auto rounded-md"
													/>
												) : (
													<div className="flex justify-center min-w-[100px]">
														{getFileIcon(
															file.type ||
																file.name,
															64
														)}
													</div>
												)}
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
								)
							})}
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
											{acceptMultiple
												? "files"
												: "a file"}{" "}
											here, or click to select
										</p>
										<p className="text-zinc-400 text-sm mt-2">
											Supports {acceptedTypes.join(", ")}{" "}
											up to {maxFileSize}MB
											{maxFileCount
												? ` (max ${maxFileCount} files)`
												: ""}
										</p>
									</>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default FileUploader
