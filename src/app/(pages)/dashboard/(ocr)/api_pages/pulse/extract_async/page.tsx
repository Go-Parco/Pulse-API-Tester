"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePulseAsyncExtract } from "@/hooks/usePulseAsyncExtract"
import StepIndicator, { Step } from "@/components/StepIndicator"
import { SafeLog } from "@/utils/SafeLog"

type TabId = "schema" | "text" | "tables"

interface Tab {
	id: TabId
	label: string
}

const EXTRACTION_STEPS: Step[] = [
	{ id: "idle", label: "Ready" },
	{ id: "pending", label: "Starting" },
	{ id: "processing", label: "Processing" },
	{ id: "completed", label: "Complete" },
	{ id: "failed", label: "Error" },
]

export default function ExtractAsyncPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [showPreview, setShowPreview] = useState(true)
	const [isRawDataExpanded, setIsRawDataExpanded] = useState(false)
	const [origDocTitle, setOrigDocTitle] = useState<string | null>(null)
	const [formattedDocTitle, setFormattedDocTitle] = useState<string | null>(
		null
	)
	const DEFAULT_PDF_URL =
		"https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqG7ISpBGweVmXo0cniOfj8HrZ9JlWDkq2aU4Gt"

	// Async extract mode hooks
	const {
		startAsyncExtraction,
		extractionStatus,
		extractionState,
		extractedData,
		isProcessing,
	} = usePulseAsyncExtract()

	const [activeTab, setActiveTab] = useState<TabId>("schema")

	const handleAsyncExtraction = async () => {
		await startAsyncExtraction(DEFAULT_PDF_URL)
	}

	useEffect(() => {
		if (extractedData) {
			SafeLog({
				display: false,
				log: { "Raw Extracted Data": extractedData },
			})
			SafeLog({
				display: false,
				log: { "Schema Data": extractedData?.schema },
			})
			SafeLog({
				display: false,
				log: { "Extraction State": extractionState },
			})
		}
	}, [extractedData, extractionState])

	const renderSchemaData = () => {
		if (!extractedData) return null

		// Define expected schema values
		const expectedSchema = {
			document_comes_from: "string",
			document_kind: "string",
			document_name: "string",
			pay_plan: "string",
		}

		// Use expected schema if available, otherwise fall back to extractedData.schema
		const schemaData = {
			...extractedData.schema,
			...expectedSchema,
		}

		return Object.entries(schemaData)
			.filter(([key, value]) => value !== undefined && value !== null)
			.map(([key, value]) => (
				<div key={key} className="flex">
					<span className="w-40 font-medium capitalize">
						{key.replace(/_/g, " ")}:
					</span>
					<p>{value}</p>
				</div>
			))
	}

	const renderTabs = () => {
		const tabs: Tab[] = [
			{ id: "schema", label: "Schema" },
			{ id: "text", label: "Text" },
			...(extractedData?.tables?.length
				? [{ id: "tables", label: "Tables" } as const]
				: []),
		]

		return (
			<div className="border-b mb-4">
				<div className="flex space-x-2">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								activeTab === tab.id
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}>
							{tab.label}
						</button>
					))}
				</div>
			</div>
		)
	}

	const renderContent = () => {
		switch (activeTab) {
			case "schema":
				return (
					<div className="p-4 space-y-2 text-sm rounded bg-gray-50">
						{renderSchemaData()}
					</div>
				)
			case "text":
				return (
					<div className="p-4 text-sm rounded bg-gray-50">
						<p className="whitespace-pre-wrap break-words">
							{extractedData?.text}
						</p>
					</div>
				)
			case "tables":
				return (
					<div className="space-y-4">
						{extractedData?.tables?.map(
							(table: any, index: number) => (
								<div key={index} className="overflow-x-auto">
									<table className="min-w-full border border-gray-200">
										<tbody>
											{table.data.map(
												(
													row: any,
													rowIndex: number
												) => (
													<tr
														key={rowIndex}
														className={
															rowIndex % 2 === 0
																? "bg-gray-50"
																: "bg-white"
														}>
														{row.map(
															(
																cell: any,
																cellIndex: number
															) => (
																<td
																	key={
																		cellIndex
																	}
																	className="px-4 py-2 text-sm border">
																	{cell}
																</td>
															)
														)}
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							)
						)}
					</div>
				)
		}
	}

	return (
		<div className="max-w-full">
			<div className="relative mx-auto space-y-8">
				{/* Header Section */}
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Async Document Extraction
					</h1>
					<p className="text-muted-foreground">
						Start an asynchronous document extraction job.
					</p>
				</div>

				{/* Main Content */}
				<div className="grid gap-8 lg:grid-cols-2">
					{/* File Preview Section */}
					{showPreview && (
						<div className="lg:sticky lg:top-8 h-fit">
							<div className="overflow-hidden bg-white border rounded-lg">
								<div className="px-4 py-2 border-b bg-gray-50">
									<h3 className="text-sm font-medium text-gray-700">
										File Preview
									</h3>
								</div>
								<div
									className="relative w-full"
									style={{ paddingTop: "129.4%" }}>
									<iframe
										src={DEFAULT_PDF_URL}
										className="absolute inset-0 w-full h-full"
										title="PDF Preview"
									/>
								</div>
							</div>
						</div>
					)}

					{/* Form and Outputs Section */}
					<div className="space-y-4">
						<div className="space-y-4">
							{isProcessing && (
								<StepIndicator
									steps={EXTRACTION_STEPS}
									currentState={{
										currentStepId: extractionState,
										completedStepIds: [],
									}}
								/>
							)}
							<button
								onClick={handleAsyncExtraction}
								disabled={isProcessing}
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
								{isProcessing ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
										<span>Processing...</span>
									</div>
								) : (
									"Extract Async"
								)}
							</button>
						</div>

						{/* Results Section */}
						{extractedData && (
							<div className="overflow-x-auto bg-white rounded-lg shadow-lg">
								<div className="p-6">
									<h3 className="mb-4 text-lg font-semibold">
										Extracted Data
									</h3>
									{renderTabs()}
									{renderContent()}

									{/* Debug View */}
									<div className="mt-4">
										<button
											onClick={() =>
												setIsRawDataExpanded(
													!isRawDataExpanded
												)
											}
											className="flex items-center text-sm text-gray-600 cursor-pointer">
											<span className="mr-2">
												{isRawDataExpanded ? "▼" : "▶"}
											</span>
											View Raw Data
										</button>
										{isRawDataExpanded && (
											<div className="p-4 mt-2 overflow-x-auto text-xs whitespace-pre bg-gray-100 rounded">
												<pre>
													{JSON.stringify(
														extractedData,
														null,
														2
													)}
												</pre>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
