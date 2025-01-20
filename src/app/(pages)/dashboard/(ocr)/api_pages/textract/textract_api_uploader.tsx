"use client"
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { analyzeDocument } from "@/functions/analizeDocument"
import { extractQueries } from "@/functions/extractQueries"
import { Loader2 } from "lucide-react"
import { AgencyForm } from "./AgencyForm"
import { agencyOptions } from "@/types/zodQuerySchemaMaster"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { usdaQueries } from "@/queries/usda-queries"
import { dodQueries } from "@/queries/dod-queries"
import { useDropzone } from "react-dropzone"
import { Query, QueryWithNames } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Agency } from "@/types/FileTypes"
import { convertPdfToBase64 } from "@/utils/pdfToBase64"
import TableViewer from "@/components/myComponents/tableViewer"
import { exampleQueries } from "@/queries/example"
import { doeQueries } from "@/queries/doe-queries"
import { tvaQueries } from "@/queries/tva-queries"
import { gsaQueries } from "@/queries/gsa-queries"
import { uspsQueries } from "@/queries/usps-queries"
import { dosQueries } from "@/queries/dos-queries"
import { usaidQueries } from "@/queries/usaid-queries"
import { irsQueries } from "@/queries/irs-queries"

const formSchema = z.object({
	agency: z.string({
		required_error: "Please select an agency",
	}),
	file:
		typeof window === "undefined"
			? z.any()
			: z
					.instanceof(FileList)
					.nullable()
					.refine(
						(files) => files && files.length > 0,
						"File is required."
					)
					.refine(
						(files) =>
							files &&
							(files[0].type.startsWith("image/") ||
								files[0].type === "application/pdf"),
						"File must be an image or PDF."
					)
					.refine(
						(files) => files && files[0].size <= 5000000,
						"File size must be less than 5MB."
					),
})

type FormValues = z.infer<typeof formSchema>

type LoadingState =
	| "idle"
	| "loading"
	| "processing"
	| "populating form"
	| "completed"

const TextractUploader = () => {
	const [loadingState, setLoadingState] = useState<LoadingState>("idle")
	const { toast } = useToast()
	const form = useForm<FormValues>({
		// resolver: zodResolver(formSchema),
		defaultValues: {
			agency: "",
			file: null,
		},
	})
	const [formData, setFormData] = useState<any>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			"image/*": [".jpeg", ".png"],
			"application/pdf": [".pdf"],
		},
		maxFiles: 1,
		onDrop: (acceptedFiles) => {
			const file = acceptedFiles[0]
			if (file) {
				const dataTransfer = new DataTransfer()
				dataTransfer.items.add(file)

				const detectedAgency = Object.values(Agency).find(
					(agency): agency is Agency =>
						typeof agency === "string" &&
						file.name.toLowerCase().includes(agency.toLowerCase())
				)

				if (detectedAgency && !form.getValues("agency")) {
					form.setValue("agency", detectedAgency)
					toast({
						title: "Success",
						description: "Agency auto-selected based on filename",
					})
				}

				form.setValue("file", dataTransfer.files)
				setSelectedFile(file)
				setPreview(URL.createObjectURL(file))
				setLoadingState("idle")
			}
		},
	})

	useEffect(() => {
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview)
			}
		}
	}, [preview])

	const clearFile = (e: React.MouseEvent) => {
		e.stopPropagation()
		setPreview(null)
		setSelectedFile(null)
		form.setValue("file", null)
	}
	const onSubmit = async (data: FormValues) => {
		try {
			if (!data.file) return // Early return if no file
			setLoadingState("loading")
			console.log("Uploading file:", data.file)

			// Get the selected agency's queries
			const agencyQueries = getAgencyQueries(data.agency)
			const queryTexts = agencyQueries
				.filter(
					(q): q is QueryWithNames =>
						"Name" in q &&
						"Text" in q &&
						"Verified" in q &&
						typeof q.Text === "string" &&
						typeof q.Verified === "boolean" &&
						Boolean(q.Text) &&
						q.Verified
				)
				.map((q) => q.Text)

			console.log("Query texts to process:", queryTexts) // Debug log

			let fetches = 0
			let responses = []
			let undefinedCount = 0

			// Process queries in batches of 15
			for (let i = 0; i < queryTexts.length; i += 15) {
				const batchQueries = queryTexts.slice(i, i + 15)
				console.log(`Processing batch ${i / 15 + 1}:`, batchQueries) // Debug log

				const formData = new FormData()
				// convert the file to base64 if it is a pdf, and append it to the form data
				if (data.file[0].type !== "application/pdf") {
					formData.append("file", data.file[0])
				} else {
					const blob = await convertPdfToBase64(data.file[0])
					if (blob) formData.append("file", blob)
				}
				formData.append("startIndex", i.toString())
				formData.append(
					"endIndex",
					Math.min(i + 15, queryTexts.length).toString()
				)
				formData.append("queries", JSON.stringify(batchQueries))

				setLoadingState("processing")
				const response = await fetch("/api/textract", {
					method: "POST",
					body: formData,
				})

				const result = await response.json()
				fetches++

				if (result.data) {
					const queries = await extractQueries(result.data)
					const undefinedQueries = queries.filter(
						(q: any) => !q.answer
					).length
					undefinedCount += undefinedQueries

					console.log({
						fetchNumber: fetches,
						queriesProcessed: result.queriesProcessed,
						undefinedValues: undefinedQueries,
						data: queries,
					})

					responses.push(queries)
				}
			}

			// Unify all responses
			const unifyResponse = await fetch("/api/textract/unify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					responses,
					totalUndefined: undefinedCount,
				}),
			})
			const unifiedResponse = await unifyResponse.json()

			console.log("Unified Response:", unifiedResponse)

			// Transform unified response into form data
			const formValues = (unifiedResponse.data || []).reduce(
				(acc: any, query: any) => {
					if (!query.question || !query.answer) return acc

					// Find matching query from agency queries to get the Name field
					const matchingQuery = agencyQueries.find(
						(q): q is QueryWithNames =>
							"Text" in q &&
							"Name" in q &&
							q.Text === query.question
					)

					if (matchingQuery && matchingQuery.Name) {
						// Use the Name field as the form field key
						acc[matchingQuery.Name] = query.answer
					}

					return acc
				},
				{}
			)

			console.log("Form values to set:", formValues)
			setFormData(formValues)

			console.log("SUMMARY", {
				totalQueries: queryTexts.length,
				totalFetches: fetches,
				undefinedAmount: undefinedCount,
				data: unifiedResponse.data,
			})

			setLoadingState("populating form")
			await new Promise((resolve) => setTimeout(resolve, 1000))
			setLoadingState("completed")

			// Reset file state
			setPreview(null)
			setSelectedFile(null)
			form.setValue("file", null)

			setTimeout(() => {
				setLoadingState("idle")
			}, 3000)
		} catch (error) {
			console.error("Error uploading file:", error)
			setLoadingState("idle")
		}
	}

	const handleFormSubmit = (data: any) => {
		console.log("Form submitted with data:", data)
		// Handle form submission
	}

	const getStatusMessage = () => {
		switch (loadingState) {
			case "loading":
				return (
					<div className="flex items-center gap-2 text-blue-600">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Loading document...</span>
					</div>
				)
			case "processing":
				return (
					<div className="flex items-center gap-2 text-amber-600">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>
							Processing{" "}
							{form.getValues("file")?.[0]?.type ===
							"application/pdf"
								? "PDF"
								: "image"}
							...
						</span>
					</div>
				)
			case "populating form":
				return (
					<div className="flex items-center gap-2 text-amber-600">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Populating form...</span>
					</div>
				)
			case "completed":
				return (
					<div className="flex items-center gap-2 text-green-600">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span>Data processed successfully!</span>
					</div>
				)
			default:
				return null
		}
	}

	const getAgencyQueries = (agency: string | undefined) => {
		if (!agency) return []

		switch (agency.toLowerCase()) {
			case "usda":
				return usdaQueries
			case "dod":
				return dodQueries
			case "doe":
				return doeQueries
			case "gsa":
				return gsaQueries
			case "tva":
				return tvaQueries
			case "usps":
				return uspsQueries
			case "dos":
				return dosQueries
			case "usaid":
				return usaidQueries
			case "irs":
				return irsQueries
			case "all":
				return exampleQueries
			default:
				return []
		}
	}

	// Add this condition to check if we should show the agency select
	const showAgencySelect = selectedFile && !form.getValues("agency")

	return (
		<div className="border border-zinc-400 rounded-xl p-4">
			<h1 className="text-2xl font-bold text-black mb-4">
				Upload Earnings & Leave Statement
			</h1>
			<p className="text-zinc-600 mb-4 md:w-3/4 text-left mr-auto">
				Upload an earnings & leave statement and we will extract the
				data and fill out whatever values we can for you. Please upload
				a digital copy if possible in image format. PDF support is
				currently in testing.
			</p>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4">
					{showAgencySelect && (
						<FormField
							control={form.control}
							name="agency"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select an agency" />
											</SelectTrigger>
											<SelectContent>
												{agencyOptions.map((agency) => (
													<SelectItem
														key={agency}
														value={agency}>
														{agency}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name="file"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div
										{...getRootProps()}
										className="border-dashed border-2 border-zinc-300 p-6 rounded-lg cursor-pointer hover:border-zinc-400 transition-colors">
										<input
											{...getInputProps()}
											disabled={loadingState !== "idle"}
										/>
										<div className="flex flex-col items-center justify-center gap-4">
											{preview ? (
												<div className="flex flex-wrap gap-6 w-full items-center relative">
													<button
														onClick={clearFile}
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
													<div className="relative w-full sm:w-auto">
														<img
															src={preview}
															alt="Preview"
															className="max-h-[250px] w-auto object-contain mx-auto rounded-2xl"
														/>
													</div>
													<div className="flex-1 min-w-[200px] w-full sm:w-auto text-center sm:text-left">
														<div className="max-w-[300px] mx-auto sm:mx-0">
															<p className="text-zinc-600 font-medium truncate">
																{form.getValues(
																	"file"
																)?.[0]?.name ??
																	""}
															</p>
															<p className="text-zinc-400 text-sm">
																{(
																	(form.getValues(
																		"file"
																	)?.[0]
																		?.size ??
																		0) /
																	1024 /
																	1024
																).toFixed(
																	2
																)}{" "}
																MB
															</p>
														</div>
													</div>
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
																Drop the file
																here...
															</p>
														) : (
															<>
																<p className="text-zinc-600">
																	Drag & drop
																	a file here,
																	or click to
																	select
																</p>
																<p className="text-zinc-400 text-sm mt-2">
																	Supports
																	PNG, JPG,
																	PDF up to
																	5MB
																</p>
															</>
														)}
													</div>
												</>
											)}
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="min-h-[24px]">{getStatusMessage()}</div>
					<Button
						type="submit"
						className="bg-black text-white p-2 rounded-md w-full mb-8"
						disabled={
							loadingState !== "idle" ||
							!form.getValues("file") ||
							!form.getValues("agency")
						}>
						{loadingState !== "idle" ? (
							<div className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								{loadingState === "loading"
									? "Loading..."
									: loadingState === "processing"
									? "Processing..."
									: loadingState === "populating form"
									? "Populating form..."
									: "Completed"}
							</div>
						) : (
							"Upload"
						)}
					</Button>
				</form>
			</Form>
			<div className="mt-8">
				<TableViewer
					data={formData || {}}
					isLoading={
						loadingState === "processing" ||
						loadingState === "loading"
					}
					options={{
						buttons: {
							copyTable: true,
							copyColumn: true,
							copyColumnIndex: 1,
						},
						pagination: {
							enabled: true,
							maxRows: 10,
						},
						filters: {
							search: true,
							searchPlaceholder: "Search fields or values...",
							searchDebounce: 300,
						},
					}}
				/>
				<AgencyForm
					onSubmit={handleFormSubmit}
					defaultValues={formData}
					selectedAgency={form.watch("agency")}
					queries={getAgencyQueries(form.watch("agency"))}
				/>
			</div>
		</div>
	)
}

export default TextractUploader
