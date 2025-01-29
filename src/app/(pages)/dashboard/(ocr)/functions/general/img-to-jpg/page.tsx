"use client"
import React, { useState } from "react"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { AcceptedFileType } from "@/types/FileTypes"
import FileSourceSelector from "@/components/myComponents/fileSourceSelector"

const ImgToJpg = () => {
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const [downloadLink, setDownloadLink] = useState<string | null>(null)

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (!file) return

		const bitmap = await createImageBitmap(file) // Convert file to ImageBitmap for faster processing
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")

		if (!ctx) return

		// Set canvas dimensions to match the image
		canvas.width = bitmap.width
		canvas.height = bitmap.height

		// Draw the image on the canvas
		ctx.drawImage(bitmap, 0, 0)

		// Convert canvas to JPG format (change 'image/jpeg' to 'image/png' for PNG)
		const convertedImage = canvas.toDataURL("image/jpeg", 0.9) // Adjust quality if needed

		setImageSrc(convertedImage)
		setDownloadLink(convertedImage)
	}

	const DEFAULT_FILE_URL =
		"https://www.nyckel.com/wp-content/uploads/2024/01/nyckel-logo-black.png"
	const handleFileSubmit = async (data: {
		type: "file" | "url" | "default"
		value: string | File[] | null
	}) => {
		if (
			data.type === "file" &&
			Array.isArray(data.value) &&
			data.value.length > 0
		) {
			const file = data.value[0]
			try {
				const bitmap = await createImageBitmap(file)
				const canvas = document.createElement("canvas")
				const ctx = canvas.getContext("2d")

				if (!ctx) return

				// Set canvas dimensions to match the image
				canvas.width = bitmap.width
				canvas.height = bitmap.height

				// Draw the image on the canvas
				ctx.drawImage(bitmap, 0, 0)

				// Convert canvas to JPG format
				const convertedImage = canvas.toDataURL("image/jpeg", 0.9)

				setImageSrc(convertedImage)
				setDownloadLink(convertedImage)
			} catch (error) {
				console.error("Error converting image:", error)
			}
		}
	}

	const handleReset = () => {
		setImageSrc(null)
		setDownloadLink(null)
	}

	const handleInputTypeChange = (type: string) => {
		console.log(type)
	}

	return (
		<div className="space-y-8 flex-1 w-full">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold mb-2">Image to JPG</h1>
					<p className="text-muted-foreground pl-2 w-2/3">
						Converts an image of a impopular type (such as .webp or
						heic) to a popular type for api compatibility (like JPG
						or PNG)
					</p>
					<FileSourceSelector
						onSubmit={handleFileSubmit}
						accept={[AcceptedFileType.IMAGE]}
						onReset={handleReset}
						defaultFileUrl={DEFAULT_FILE_URL}
						disabledOptions="none"
						onInputTypeChange={handleInputTypeChange}
					/>

					{imageSrc && (
						<div className="flex flex-col items-center">
							<img
								src={imageSrc}
								alt="Converted"
								className="border rounded shadow-lg w-64 h-auto mt-4"
							/>

							{downloadLink && (
								<a
									href={downloadLink}
									download="converted.jpg"
									className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600">
									Download JPG
								</a>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ImgToJpg
