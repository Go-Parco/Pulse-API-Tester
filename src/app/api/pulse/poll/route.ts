import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PulseExtractResponse } from "../config"

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const jobId = searchParams.get("jobId")
		const apiKey = process.env.PULSE_API_KEY

		if (!apiKey) {
			throw new Error("PULSE_API_KEY is not configured")
		}

		if (!jobId) {
			throw new Error("Job ID is required")
		}

		const response = await fetch(`${PULSE_API_URL}/job/${jobId}`, {
			method: "GET",
			headers: {
				"x-api-key": apiKey,
				"Content-Type": "application/json",
			},
		})

		const data = await response.json()
		console.log("Raw Poll Response:", data)

		// If there's an error about calculate_job_progress, ignore it and continue
		if (!response.ok && !data.error?.includes("calculate_job_progress")) {
			throw new Error(
				data.error || `HTTP error! status: ${response.status}`
			)
		}

		// If we have a completed status and result, transform the result
		if (data.status === "completed" && data.result) {
			console.log(
				"Raw Poll Response Data:",
				JSON.stringify(data.result, null, 2)
			)

			// Extract schema data from the result
			const schemaData = data.result["schema-json"] || {}
			console.log("Schema Data:", schemaData)

			const result: PulseExtractResponse = {
				text: data.result.markdown || data.result.text,
				tables:
					data.result.tables?.map((table: any) => {
						const tableData = Array.isArray(table)
							? table
							: table.data
						return { data: tableData || [] }
					}) || [],
				schema: {
					document_comes_from: String(
						schemaData.document_comes_from || ""
					),
					document_kind: String(schemaData.document_kind || ""),
					document_name: String(schemaData.document_name || ""),
					pay_plan: String(schemaData.pay_plan || ""),
				},
			}

			console.log("Transformed Response:", result)

			return NextResponse.json({
				status: data.status,
				result,
				progress: data.progress || 100,
			})
		}

		// Return just the status for non-completed states
		return NextResponse.json({
			status: data.status || "pending",
			progress: data.progress || 0,
		})
	} catch (error: any) {
		console.error("Poll error:", error)
		return NextResponse.json(
			{
				error: error.message || "Failed to poll job status",
				details: error.toString(),
			},
			{ status: 500 }
		)
	}
}

export const dynamic = "force-dynamic"
