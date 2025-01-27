"use client"
import React, { useState, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { createWorker } from "tesseract.js"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import textractLogo from "@/assets/icons/textract.png"
import FileSourceSelector from "@/components/myComponents/fileSourceSelector"
import { AcceptedFileType } from "@/types/FileTypes"
import { SafeLog } from "@/utils/SafeLog"

interface FormData {
	query: string
	ocrResult: string
	searchResult: string
}

const OCRWithSearch = () => {
	const [isProcessing, setIsProcessing] = useState(false)
	const [result, setResult] = useState("")
	const [query, setQuery] = useState("")
	const [queryResult, setQueryResult] = useState("")
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [selectedInputType, setSelectedInputType] = useState<
		"file" | "url" | "default"
	>("file")

	const handleReset = () => {
		setResult("")
		setQuery("")
		setQueryResult("")
		setHasSubmitted(false)
		setIsProcessing(false)
		setSelectedInputType("file")
		const fileInput = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement
		if (fileInput) {
			fileInput.value = ""
		}
	}

	const handleUpload = async (file: File) => {
		try {
			setIsProcessing(true)
			setResult("")

			const formData = new FormData()
			formData.append("file", file)

			const response = await fetch("/api/tesseract/simple", {
				method: "POST",
				body: formData,
			})

			const data = await response.json()
			SafeLog({ display: false, log: { "OCR Response": data } })

			if (data.success) {
				setResult(data.text)
				setHasSubmitted(true)
			}
		} catch (error) {
			SafeLog({ display: false, log: { "Upload error": error } })
		} finally {
			setIsProcessing(false)
		}
	}

	const handleQuerySearch = () => {
		if (!result || !query) return

		const lines = result.split("\n")
		const matchingLine = lines.find((line) =>
			line.toLowerCase().includes(query.toLowerCase())
		)

		if (matchingLine) {
			const value = matchingLine
				.substring(matchingLine.indexOf(query) + query.length)
				.trim()
			setQueryResult(value)
		} else {
			setQueryResult("Not found")
		}
	}

	return (
		<Card className="max-w-[calc(100vw-16rem)] overflow-hidden">
			<CardHeader>
				<CardTitle className="text-3xl flex gap-4">
					<Image
						className="rounded-xl shadow-sm aspect-square object-cover"
						src={textractLogo}
						alt="Textract Logo"
						width={32}
						height={32}
					/>
					Tesseract OCR Search
				</CardTitle>
				<CardDescription className="w-4/5 text-center justify-middle flex mx-auto">
					Upload an image to extract text and search within it.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<FileSourceSelector
					onSubmit={(data) => {
						if (
							data.type === "file" &&
							data.value?.[0] instanceof File
						) {
							handleUpload(data.value[0])
						}
					}}
					defaultFileUrl="https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqGOBEVLf4oYgZ07GhMxwrEV68PNnofWH3sFDyB"
					accept={[AcceptedFileType.IMAGE]}
					onInputTypeChange={setSelectedInputType}
					onReset={() => {
						const fileInput = document.querySelector(
							'input[type="file"]'
						) as HTMLInputElement
						if (fileInput) {
							fileInput.value = ""
						}
					}}
				/>

				{isProcessing && <p className="animate-pulse">Processing...</p>}

				{hasSubmitted && (
					<>
						<div className="mt-4">
							<h3>Recognized Text:</h3>
							<pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap break-words max-w-full overflow-x-auto">
								{result}
							</pre>
						</div>

						<div className="mt-4 space-y-4">
							<h3>Search in Text:</h3>
							<div className="flex gap-2">
								<Input
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Enter search query (e.g., 'Pay Begin Date:')"
									className="flex-1"
								/>
								<Button onClick={handleQuerySearch}>
									Search
								</Button>
								<Button onClick={handleReset} variant="outline">
									Reset
								</Button>
							</div>
						</div>

						{queryResult && (
							<div className="bg-gray-50 p-4 rounded-lg border overflow-x-auto">
								<p className="font-semibold">
									Result for "{query}":
								</p>
								<p className="mt-2">{queryResult}</p>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	)
}

export default OCRWithSearch
