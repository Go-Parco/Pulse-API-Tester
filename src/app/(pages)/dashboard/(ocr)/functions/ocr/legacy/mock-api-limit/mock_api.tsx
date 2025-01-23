"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export const queries = [
	"name",
	"netTakeHome",
	"alotSaving",
	"tspContribution",
	"healthInsurancePremium",
	"currentLeaveBalance",
	"currentSickLeaveBalance",
	"fdvv",
	"fdvd",
	"medicalBeforeTax",
	"medicalEmployer",
	"dentalVision",
	"dentalBeforeTax",
	"dentalEmployer",
	"coreLife",
	"lifteInsuranceTotal",
	"suppLife",
	"_401k",
	"_401kAfterTax",
	"disability",
	"federalCampaign",
	"baseSalary",
	"dateOfHire",
	"payPeriod",
	"payPeriodStart",
	"payPeriodEnd",
	"payPlanGradeStep",
	"payPlan",
	"payGrade",
	"payStep",
	"oasdi",
	"retirement",
	"fsa",
	"rate",
	"fehb",
	"fedMedEE",
	"fedMedRR",
	"withholding",
]

const MockAPI = () => {
	const { toast } = useToast()
	const [showTestApiInstruct, setShowTestApiInstruct] = useState(true)
	const [summaryResults, setSummaryResults] = useState<{
		totalFetchedItems: number
		definedValues: number
		undefinedValues: number
		data: Record<string, any>
		totalFetches: number
		fetchErrors: Array<{
			fetchNumber: number
			undefinedCount: number
			queries: Array<{
				query: string
				reason: string
			}>
		}>
	} | null>(null)

	const handleSubmitQueries = async () => {
		try {
			let fetches = 0
			let responses = []
			let undefinedCount = 0
			let fetchErrors: Array<{
				fetchNumber: number
				undefinedCount: number
				queries: Array<{
					query: string
					reason: string
				}>
			}> = []

			// Collect all API responses
			for (let i = 0; i < queries.length; i += 15) {
				const currentQueries = queries.slice(i, i + 15)
				const response = await fetch(
					`/api/mock_api?item=${currentQueries.join(",")}`
				)
				const data = await response.json()
				fetches++
				console.log({
					fetchNumber: fetches,
					data: data.data,
					undefinedValues: data.undefinedCount,
				})
				if (data.undefinedCount > 0) {
					undefinedCount += data.undefinedCount
					// Find which queries returned undefined
					const failedQueries = currentQueries
						.map((query) => {
							if (data.data[query] === undefined) {
								return {
									query,
									reason:
										query === "fdvv"
											? "Query not supported in mock API"
											: "No data available for this field",
								}
							}
							return null
						})
						.filter(
							(q): q is { query: string; reason: string } =>
								q !== null
						)

					fetchErrors.push({
						fetchNumber: fetches,
						undefinedCount: data.undefinedCount,
						queries: failedQueries,
					})
				}
				responses.push(data.data)
			}

			// Call the unify-responses API
			const unifyResponse = await fetch(
				`/api/mock_api?responses=${JSON.stringify(
					responses
				)}&totalUndefined=${undefinedCount}`
			)
			const unifiedResponse = await unifyResponse.json()

			if ("error" in unifiedResponse && unifiedResponse.error) {
				toast({
					title: "Error: " + unifiedResponse.error,
				})
			} else if ("data" in unifiedResponse && unifiedResponse.data) {
				const definedValues = Object.values(
					unifiedResponse.data
				).filter((v) => v !== undefined)

				const summary = {
					totalFetchedItems: queries.length,
					definedValues: definedValues.length,
					undefinedValues: unifiedResponse.undefinedCount,
					data: unifiedResponse.data,
					totalFetches: fetches,
					fetchErrors,
				}

				console.log("SUMMARY", summary)
				setSummaryResults(summary)
				toast({
					title:
						"Complete Success: " +
						definedValues.length +
						" values received (" +
						unifiedResponse.undefinedCount +
						" undefined)",
				})
			}
		} catch (error) {
			if (error instanceof Error) {
				toast({
					title: "Error fetching data: " + error.message,
				})
			} else {
				toast({
					title: "An unknown error occurred",
				})
			}
		}
	}

	return (
		<>
			<div className="relative min-h-24">
				<Button
					onClick={() => {
						setShowTestApiInstruct(!showTestApiInstruct)
					}}
					className="bg-black/50 text-xl z-10 hover:bg-black cursor-pointer !px-4 !py-2 absolute top-4 right-6 rounded-xl">
					{showTestApiInstruct ? "Minimize" : "Show"} Test Queries
				</Button>
				<div
					className={`${
						showTestApiInstruct ? "h-fit p-4" : "h-0 p-0"
					} bg-gray-800 relative rounded-xl ease-in-out duration-300 transition-all text-white`}>
					<code
						className={`text-sm block ${
							showTestApiInstruct ? "" : "hidden"
						}`}>
						{queries.map((query, index) => (
							<p key={index} className={`my-1`}>
								{query}
								{query === "fdvv" ? (
									<>
										<span
											className={`${
												showTestApiInstruct
													? "block"
													: "hidden"
											} text-red-500 pl-2`}>
											// This value will not be returned
											to simulate a failed response
										</span>
										,
									</>
								) : (
									","
								)}
							</p>
						))}
					</code>
				</div>
				<Button
					onClick={handleSubmitQueries}
					className="bg-black mt-4 text-xl z-10 hover:bg-zinc-800 cursor-pointer !px-4 !py-2 rounded-xl">
					Submit Queries
				</Button>

				{summaryResults && (
					<>
						<p className="mt-4 text-zinc-600">
							You can also see the results directly in the
							developer console.
						</p>
						<div className="mt-8 p-6 bg-gray-900 rounded-xl text-white">
							<h2 className="text-xl font-bold mb-4">
								Results Summary
							</h2>
							<div className="space-y-2">
								<p>
									Total Queries:{" "}
									{summaryResults.totalFetchedItems}
								</p>
								<p>
									Total Fetches: {summaryResults.totalFetches}
								</p>
								<p>
									Successful Responses:{" "}
									{summaryResults.definedValues}
								</p>
								<p>
									Failed Responses:{" "}
									{summaryResults.undefinedValues}
								</p>
								{summaryResults.fetchErrors.length > 0 && (
									<div className="mt-4">
										<p className="font-semibold text-yellow-400">
											Fetch Errors:
										</p>
										{summaryResults.fetchErrors.map(
											(error, index) => (
												<div
													key={index}
													className="ml-4 mb-2">
													<p className="text-sm text-yellow-200">
														Fetch #
														{error.fetchNumber}:{" "}
														{error.undefinedCount}{" "}
														undefined values
													</p>
													<p className="text-sm text-yellow-100/70 ml-4">
														Failed queries:
													</p>
													<ul className="list-disc ml-8">
														{error.queries.map(
															(q, qIndex) => (
																<li
																	key={qIndex}
																	className="text-sm text-yellow-100/70">
																	{q.query}:{" "}
																	<span className="text-red-400">
																		{
																			q.reason
																		}
																	</span>
																</li>
															)
														)}
													</ul>
												</div>
											)
										)}
									</div>
								)}
								<div className="mt-6">
									<h3 className="text-lg font-semibold mb-2">
										Response Data:
									</h3>
									<pre className="bg-gray-950 p-4 rounded-lg overflow-auto max-h-96">
										{JSON.stringify(
											summaryResults.data,
											null,
											2
										)}
									</pre>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default MockAPI
