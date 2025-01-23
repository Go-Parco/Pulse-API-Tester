"use client"

import React, { useState, useEffect } from "react"
import { z } from "zod"
import FileUploader from "./fileUploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { BsFileEarmarkPdfFill } from "react-icons/bs"
import { AcceptedFileType } from "@/types/FileTypes"
import { CustomRadioGroup, CustomRadioOption } from "./customRadio"
import { getFileIcon } from "./fileUploader"
import { convertPdfToBase64 } from "@/utils/pdfToBase64"

interface FileSourceSelectorProps {
	onSubmit: (data: {
		type: "file" | "url" | "default"
		value: File[] | string | null
	}) => void
	disabledOptions?: ("file" | "url" | "default")[] | "none"
	fileInputRef?: React.RefObject<HTMLInputElement>
	defaultFileUrl?: string
	accept?: AcceptedFileType[]
	multiple?: boolean
	maxFileCount?: number
	convertPDFToBase64?: boolean
	onInputTypeChange?: (type: "file" | "url" | "default") => void
	onReset?: () => void
}

const urlSchema = z.string().url()

const FileSourceSelector: React.FC<FileSourceSelectorProps> = ({
	onSubmit,
	fileInputRef,
	defaultFileUrl = "https://lh3.googleusercontent.com/qnaJEbFIpvsWJm2KrRI_GIvz1yZdXntgEsCZxy-1pVZi244bCk1RFwdk0ZBRmmvdHiUl6sIa_tsmskL5WLKiigp2AMsIIxinOJNf39qCmacViRGXIOY",
	accept,
	convertPDFToBase64 = false,
	multiple = false,
	maxFileCount,
	onInputTypeChange,
	disabledOptions = ["url", "default"],
	onReset,
}) => {
	const [inputType, setInputType] = useState<"file" | "url" | "default">(
		"file"
	)
	const [files, setFiles] = useState<File[]>([])
	const [url, setUrl] = useState<string>("")
	const [urlError, setUrlError] = useState<string>("")

	useEffect(() => {
		// Clear values when input type changes
		setFiles([])
		setUrl("")
		setUrlError("")
		onInputTypeChange?.(inputType)
	}, [inputType, onInputTypeChange])

	const handleSubmit = async (e: React.FormEvent) => {
		const fileExt = url.split(".").pop()?.toLowerCase()
		e.preventDefault()
		switch (inputType) {
			case "file":
				if (convertPDFToBase64 && fileExt === "pdf") {
					const base64 = await convertPdfToBase64(files[0])
					onSubmit({
						type: "file",
						value: base64?.toString() ?? null,
					})
				} else {
					onSubmit({ type: "file", value: files })
				}
				break
			case "url":
				const result = urlSchema.safeParse(url)
				if (result.success) {
					onSubmit({ type: "url", value: url })
				} else {
					setUrlError("Please enter a valid URL")
				}
				break
			case "default":
				onSubmit({ type: "default", value: defaultFileUrl })
				break
		}
	}

	const clearUrl = () => {
		setUrl("")
		setUrlError("")
	}

	const renderPreview = () => {
		const previewUrl = inputType === "url" ? url : defaultFileUrl
		if (previewUrl) {
			const fileExtension = previewUrl.split(".").pop()?.toLowerCase()
			if (
				["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
					fileExtension || ""
				) ||
				inputType === "default" ||
				inputType === "url"
			) {
				return (
					<img
						src={previewUrl}
						alt="File preview"
						className="max-h-[200px] w-auto mx-auto rounded-md"
					/>
				)
			}
		}
		return null
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<Label
					htmlFor="file-input-selector"
					className="text-base font-semibold mb-4 block">
					Select File Input Method
				</Label>
				<CustomRadioGroup
					id="file-input-selector"
					value={inputType}
					onValueChange={(value) =>
						setInputType(value as "file" | "url" | "default")
					}
					className="space-y-2">
					<CustomRadioOption
						value="file"
						label={`Upload File${multiple ? "s" : ""} ${
							disabledOptions.includes("file")
								? " (Coming Soon)"
								: ""
						}`}
						id="file"
						disabled={disabledOptions.includes("file") || false}
					/>
					<CustomRadioOption
						value="url"
						label={`Provide URL${multiple ? "s" : ""} ${
							disabledOptions.includes("url")
								? " (Coming Soon)"
								: ""
						}`}
						id="url"
						disabled={disabledOptions.includes("url") || false}
					/>
					<CustomRadioOption
						value="default"
						label={`Use Default ${
							disabledOptions.includes("default")
								? " (Coming Soon)"
								: ""
						}`}
						id="default"
						disabled={disabledOptions.includes("default") || false}
					/>
				</CustomRadioGroup>
			</div>

			{inputType === "file" && (
				<FileUploader
					acceptMultiple={multiple}
					maxFileSize={5}
					fileInputRef={fileInputRef ? fileInputRef : undefined}
					maxFileCount={maxFileCount}
					acceptedTypes={
						accept || [AcceptedFileType.IMAGE, AcceptedFileType.PDF]
					}
					onFilesSelected={(selectedFiles) => setFiles(selectedFiles)}
					onFileRemoved={() => setFiles([])}
				/>
			)}

			{inputType === "url" && (
				<div className="border-dashed border-2 border-zinc-300 p-6 rounded-lg hover:border-zinc-400 transition-colors">
					<div className="flex items-center space-x-2 mb-4">
						<div className="relative flex-grow">
							<div className="flex items-center gap-4">
								<Label
									htmlFor="url-input"
									className="whitespace-nowrap">
									URL:
								</Label>
								<Input
									id="url-input"
									type="url"
									placeholder="Enter file URL"
									value={url}
									onChange={(e) => {
										setUrl(e.target.value)
										setUrlError("")
									}}
									className="pr-8 border-zinc-300"
								/>
								{url && (
									<button
										type="button"
										onClick={clearUrl}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
										<X size={16} />
									</button>
								)}
							</div>
							{urlError && (
								<p className="text-red-500 text-sm mt-1">
									{urlError}
								</p>
							)}
						</div>
					</div>
					{renderPreview()}
				</div>
			)}

			{inputType === "default" && (
				<div className="border-dashed border-2 border-zinc-300 p-6 rounded-lg">
					{renderPreview()}
				</div>
			)}

			<Button type="submit">Submit</Button>
		</form>
	)
}

export default FileSourceSelector
