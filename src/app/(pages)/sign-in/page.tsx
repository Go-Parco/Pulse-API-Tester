"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePulseAsyncExtract } from "@/hooks/usePulseAsyncExtract"
import type { ExtractionState } from "@/hooks/usePulseAsyncExtract"

const extractionSteps = [
	{ state: "pending", label: "Initializing" },
	{ state: "processing", label: "Extracting Content" },
	{ state: "completed", label: "Completed" },
] as const

function StepIndicator({ currentState }: { currentState: ExtractionState }) {
	return (
		<div className="flex items-center justify-center space-x-2 mb-4">
			{extractionSteps.map((step, index) => {
				const isActive = currentState === step.state
				const isCompleted =
					extractionSteps.findIndex((s) => s.state === currentState) >
					extractionSteps.findIndex((s) => s.state === step.state)

				return (
					<div key={step.state} className="flex items-center">
						<div
							className={`w-4 h-4 rounded-full ${
								isActive
									? "bg-blue-500 animate-pulse"
									: isCompleted
									? "bg-green-500"
									: "bg-gray-300"
							}`}
						/>
						{isActive && (
							<span className="ml-2 text-sm text-gray-600">
								{step.label}
							</span>
						)}
						{index < extractionSteps.length - 1 && (
							<div
								className={`w-8 h-0.5 mx-1 ${
									isCompleted ? "bg-green-500" : "bg-gray-300"
								}`}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default function SignIn() {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const {
		startAsyncExtraction,
		extractionStatus,
		extractionState,
		extractedData,
		isProcessing,
	} = usePulseAsyncExtract()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		try {
			const response = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || "Failed to sign in")
			}

			router.push("/")
		} catch (err: any) {
			setError(err.message)
		}
	}

	const handleAsyncExtraction = async () => {
		const defaultFileUrl =
			"https://2jestdr1ib.ufs.sh/f/FLqidTvfTRqG7ISpBGweVmXo0cniOfj8HrZ9JlWDkq2aU4Gt"
		await startAsyncExtraction(defaultFileUrl)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
						</div>
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center">
							{error}
						</div>
					)}

					<div className="space-y-4">
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
							Sign in
						</button>

						<div className="space-y-2">
							{isProcessing && (
								<StepIndicator currentState={extractionState} />
							)}
							<button
								type="button"
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
					</div>
				</form>

				{/* Extraction Results */}
				{extractedData && (
					<div className="mt-8 space-y-4">
						<h3 className="text-lg font-medium text-gray-900">
							Extraction Results
						</h3>

						{/* Add Schema Display */}
						<h4 className="text-2xl">Schema (Queries)</h4>
						{extractedData?.schema && (
							<div className="mt-4 p-4 bg-white rounded-lg shadow">
								<div className="space-y-2">
									{Object.entries(extractedData.schema).map(
										([key, value]) => (
											<div key={key} className="flex">
												<span className="pr-auto flex-1 font-semibold whitespace-nowrap text-gray-500 capitalize">
													{key.replace(/_/g, " ")}:
												</span>
												<p className="font-thin">
													{value || "Not specified"}
												</p>
											</div>
										)
									)}
								</div>
							</div>
						)}
						<h4 className="text-2xl">Raw Data</h4>
						{extractedData.text && (
							<div className="p-4 bg-gray-50 rounded-lg">
								<h4 className="text-sm font-medium text-gray-700 mb-2">
									Extracted Text
								</h4>
								<div className="text-sm text-gray-600 whitespace-pre-wrap">
									{extractedData.text}
								</div>
							</div>
						)}
						<h4 className="text-2xl">Tables</h4>
						{extractedData.tables &&
							extractedData.tables.length > 0 && (
								<div className="space-y-4">
									<h4 className="text-sm font-medium text-gray-700">
										Tables
									</h4>
									{extractedData.tables.map(
										(table: any, index: number) => {
											if (!table?.data?.length)
												return null
											return (
												<div
													key={index}
													className="overflow-x-auto">
													<table className="min-w-full border border-gray-200">
														<tbody>
															{table.data.map(
																(
																	row: any[],
																	rowIndex: number
																) => (
																	<tr
																		key={
																			rowIndex
																		}
																		className={
																			rowIndex %
																				2 ===
																			0
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
																					{
																						cell
																					}
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
										}
									)}
								</div>
							)}
					</div>
				)}
			</div>
		</div>
	)
}
