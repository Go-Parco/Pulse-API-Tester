import {
	FileIcon,
	ImageIcon as DefaultIcon,
	ArchiveIcon,
	WholeWordIcon as WordIcon,
	TableIcon,
	PresentationIcon,
	FileImageIcon as PdfIcon,
	VideoIcon,
	Disc3Icon as ThreeDIcon,
	MusicIcon,
	CodeIcon,
	ImageIcon,
	DownloadIcon as TorrentIcon,
	GamepadIcon as GameIcon,
	BinaryIcon as ExecutableIcon,
} from "lucide-react"
import React, {
	forwardRef,
	useCallback,
	useState,
	useEffect,
	useImperativeHandle,
} from "react"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { parseBlob } from "music-metadata-browser"
import { SafeLog } from "@/utils/SafeLog"

export interface FileUploaderProps {
	onFilesAdded?: (files: File[]) => void
	onSubmit?: (files: File[]) => void
	name?: string
	disabled?: boolean
	loading?: boolean
	maxFileSize?: number
	accept?: string[]
	maxFileCount?: number
	className?: string
	style?: React.CSSProperties
	preview?: string | null
	buttonText?: string
	buttonClassName?: string
	dropzoneClassName?: string
	dropzoneActiveClassName?: string
	dropzoneRejectClassName?: string
	dropzoneAcceptedClassName?: string
}

export interface CustomDropzoneRef {
	clearDropzone: () => void
	addFile: (file: File) => void
}

interface FileWithPreview extends File {
	preview: string | null
}

export type FileType =
	| "archive"
	| "word"
	| "table"
	| "presentation"
	| "pdf"
	| "video"
	| "3d"
	| "music"
	| "code"
	| "image"
	| "torrent"
	| "game"
	| "executable"
	| "default"

export const fileTypeMap: Record<FileType, typeof FileIcon> = {
	archive: ArchiveIcon,
	word: WordIcon,
	table: TableIcon,
	presentation: PresentationIcon,
	pdf: PdfIcon,
	video: VideoIcon,
	"3d": ThreeDIcon,
	music: MusicIcon,
	code: CodeIcon,
	image: ImageIcon,
	torrent: TorrentIcon,
	game: GameIcon,
	executable: ExecutableIcon,
	default: DefaultIcon,
}

export function getFileType(fileName: string): FileType {
	const extension = fileName.split(".").pop()?.toLowerCase() || ""

	if (["zip", "7z", "rar"].includes(extension)) return "archive"
	if (["doc", "docx", "odt", "rtf"].includes(extension)) return "word"
	if (["xls", "xlsx", "ods", "numbers"].includes(extension)) return "table"
	if (["ppt", "pptx", "odp", "key"].includes(extension)) return "presentation"
	if (extension === "pdf") return "pdf"
	if (["mp4", "mov", "avi", "mkv"].includes(extension)) return "video"
	if (["obj", "fbx", "stl", "blend"].includes(extension)) return "3d"
	if (["mp3", "wav", "ogg", "flac"].includes(extension)) return "music"
	if (["js", "ts", "py", "java", "cpp", "cs"].includes(extension))
		return "code"
	if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) return "image"
	if (extension === "torrent") return "torrent"
	if (["iso", "rom", "nes", "sfc"].includes(extension)) return "game"
	if (["exe", "dmg", "app"].includes(extension)) return "executable"

	return "default"
}

export async function getFilePreview(file: File): Promise<string | null> {
	const fileType = getFileType(file.name)

	if (fileType === "image") {
		return URL.createObjectURL(file)
	}

	// if (fileType === "music") {
	// 	return new Promise((resolve) => {
	// 		const reader = new FileReader()
	// 		reader.onload = (e) => {
	// 			const audio = new Audio(e.target?.result as string)
	// 			audio.addEventListener("loadedmetadata", () => {
	// 				if (audio.duration === Infinity) {
	// 					audio.currentTime = 1e101
	// 					audio.ontimeupdate = () => {
	// 						audio.ontimeupdate = null
	// 						resolve(extractAlbumArt(audio))
	// 					}
	// 				} else {
	// 					resolve(extractAlbumArt(audio))
	// 				}
	// 			})
	// 		}
	// 		reader.readAsDataURL(file)
	// 	})
	// }

	// if (fileType === "video") {
	// 	return new Promise((resolve) => {
	// 		const video = document.createElement("video")
	// 		video.preload = "metadata"
	// 		video.onloadedmetadata = () => {
	// 			video.currentTime = 1
	// 		}
	// 		video.onseeked = () => {
	// 			const canvas = document.createElement("canvas")
	// 			canvas.width = video.videoWidth
	// 			canvas.height = video.videoHeight
	// 			canvas
	// 				.getContext("2d")
	// 				?.drawImage(video, 0, 0, canvas.width, canvas.height)
	// 			resolve(canvas.toDataURL())
	// 		}
	// 		video.src = URL.createObjectURL(file)
	// 	})
	// }

	return null
}

async function extractAlbumArt(
	audio: HTMLAudioElement
): Promise<string | null> {
	try {
		const response = await fetch(audio.src)
		const blob = await response.blob()
		const metadata = await parseBlob(blob)

		if (metadata.common.picture && metadata.common.picture.length > 0) {
			const picture = metadata.common.picture[0]
			const blob = new Blob([picture.data], { type: picture.format })
			return URL.createObjectURL(blob)
		}

		// Fallback to default music icon if no album art
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")
		canvas.width = 200
		canvas.height = 200

		if (ctx) {
			const gradient = ctx.createLinearGradient(
				0,
				0,
				canvas.width,
				canvas.height
			)
			gradient.addColorStop(0, "#3b82f6")
			gradient.addColorStop(1, "#2563eb")
			ctx.fillStyle = gradient
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			ctx.strokeStyle = "#ffffff"
			ctx.lineWidth = 4
			ctx.beginPath()
			ctx.arc(100, 120, 30, 0, 2 * Math.PI)
			ctx.moveTo(130, 120)
			ctx.lineTo(130, 60)
			ctx.lineTo(100, 60)
			ctx.stroke()
		}

		return canvas.toDataURL()
	} catch (error) {
		SafeLog({
			display: false,
			log: { "Error extracting album art": error },
		})
		return null
	}
}

const FileUploader = forwardRef<CustomDropzoneRef, FileUploaderProps>(
	(
		{
			onFilesAdded,
			onSubmit,
			name,
			disabled = false,
			loading = false,
			maxFileSize = Infinity,
			accept,
			maxFileCount = Infinity,
			className,
			style,
			preview,
			buttonText = "Submit",
			buttonClassName,
			dropzoneClassName,
			dropzoneActiveClassName,
			dropzoneRejectClassName,
			dropzoneAcceptedClassName,
		},
		ref
	) => {
		const [files, setFiles] = useState<FileWithPreview[]>([])
		const [errors, setErrors] = useState<string[]>([])

		const processFile = useCallback(
			async (file: File) => {
				const newErrors: string[] = []

				if (files.length >= maxFileCount) {
					newErrors.push(
						`Maximum number of files (${maxFileCount}) exceeded`
					)
					return { file: null, errors: newErrors }
				}

				if (maxFileSize && file.size > maxFileSize) {
					newErrors.push(
						`${file.name}: File size exceeds the limit of ${
							maxFileSize / 1024 / 1024
						}MB`
					)
					return { file: null, errors: newErrors }
				}

				if (
					accept &&
					accept[0] !== "all" &&
					!accept.some((type) => file.type.match(type))
				) {
					newErrors.push(`${file.name}: File type not allowed`)
					return { file: null, errors: newErrors }
				}

				const preview = await getFilePreview(file)
				return {
					file: Object.assign(file, { preview }),
					errors: newErrors,
				}
			},
			[files.length, maxFileCount, maxFileSize, accept]
		)

		const onDrop = useCallback(
			async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
				setErrors([]) // Clear existing errors
				const results = await Promise.all(
					acceptedFiles.map(processFile)
				)
				const validFiles = results.filter(
					(
						result
					): result is { file: FileWithPreview; errors: string[] } =>
						result.file !== null && "preview" in result.file
				)
				const newFiles = validFiles.map((result) => result.file)
				const newErrors = results.flatMap((result) => result.errors)

				setFiles((prevFiles) => [...prevFiles, ...newFiles])
				if (onFilesAdded) {
					onFilesAdded(newFiles)
				}

				const rejectionErrors = fileRejections.map(({ file, errors }) =>
					errors.map((e) => `${file.name}: ${e.message}`).join(", ")
				)
				setErrors((prev) => [...prev, ...newErrors, ...rejectionErrors])
			},
			[onFilesAdded, processFile]
		)

		const removeFile = (fileToRemove: File) => {
			setFiles((prevFiles) =>
				prevFiles.filter((file) => file !== fileToRemove)
			)
		}

		const clearDropzone = useCallback(() => {
			setFiles([])
			setErrors([])
			if (onFilesAdded) {
				onFilesAdded([])
			}
		}, [onFilesAdded])

		const addFile = useCallback(
			async (file: File) => {
				setErrors([]) // Clear existing errors
				const { file: processedFile, errors: newErrors } =
					await processFile(file)
				if (processedFile) {
					setFiles((prevFiles) => [...prevFiles, processedFile])
					if (onFilesAdded) {
						onFilesAdded([processedFile])
					}
				}
				setErrors(newErrors)
			},
			[processFile, onFilesAdded]
		)

		useImperativeHandle(ref, () => ({
			clearDropzone,
			addFile,
		}))

		const { getRootProps, getInputProps } = useDropzone({
			onDrop,
			disabled: disabled || loading,
			maxSize: maxFileSize,
			accept:
				accept && accept[0] !== "all"
					? accept.reduce((acc, type) => {
							acc[type] = []
							return acc
					  }, {} as { [key: string]: string[] })
					: undefined,
		} as DropzoneOptions)

		useEffect(() => {
			return () =>
				files.forEach(
					(file) => file.preview && URL.revokeObjectURL(file.preview)
				)
		}, [files])

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault()
			if (onSubmit) {
				onSubmit(files)
			}
		}

		return (
			<form onSubmit={handleSubmit}>
				<div
					{...getRootProps()}
					className={`relative p-4 border-2 border-dashed border-gray-300 rounded-lg max-h-[475px] overflow-y-auto ${
						disabled ? "opacity-50 cursor-not-allowed" : ""
					} ${loading ? "animate-pulse" : ""} ${className || ""}`}
					style={style}>
					<input {...getInputProps({ name })} />
					{files.length === 0 ? (
						<p className="text-gray-500">
							Drag 'n' drop some files here, or click to select
							files
						</p>
					) : (
						<div className="space-y-4">
							{files.map((file, index) => {
								const fileType = getFileType(file.name)
								const Icon = fileTypeMap[fileType]
								return (
									<div
										key={index}
										className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 relative">
										{file.preview ? (
											<div className="w-full sm:w-auto">
												<img
													src={
														file.preview ||
														"/placeholder.svg"
													}
													alt={file.name}
													className="max-w-[200px] w-full h-auto object-contain rounded"
												/>
											</div>
										) : (
											<Icon className="w-6 h-6 flex-shrink-0" />
										)}
										<div className="flex-grow">
											<p className="text-sm font-medium">
												{file.name}
											</p>
											<p className="text-xs text-gray-500">
												{(
													file.size /
													1024 /
													1024
												).toFixed(2)}{" "}
												MB
											</p>
										</div>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation()
												removeFile(file)
											}}
											className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
											disabled={disabled || loading}>
											<X className="w-5 h-5" />
										</button>
									</div>
								)
							})}
						</div>
					)}
				</div>
				{errors.length > 0 && (
					<div className="mt-2 text-red-500">
						{errors.map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
				{onSubmit && (
					<Button
						type="submit"
						className={`mt-4 ${buttonClassName || ""}`}
						disabled={disabled || loading || files.length === 0}>
						{buttonText}
					</Button>
				)}
			</form>
		)
	}
)

FileUploader.displayName = "FileUploader"

export default FileUploader
