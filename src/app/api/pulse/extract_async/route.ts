import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PulseConfig } from "../config"

export async function POST(request: Request) {
	try {
		const { fileUrl } = await request.json()
		const apiKey = process.env.PULSE_API_KEY

		if (!apiKey) {
			throw new Error("PULSE_API_KEY is not configured")
		}

		console.log("Request details:", {
			url: `${PULSE_API_URL}/extract_async`,
			apiKey: apiKey?.slice(0, 4) + "..." + apiKey?.slice(-4),
			body: {
				"file-url": fileUrl,
				chunking: "semantic",
				return_table: true,
				schema: {},
			},
		})

		const response = await fetch(`${PULSE_API_URL}/extract_async`, {
			method: "POST",
			headers: {
				"x-api-key": apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"file-url": fileUrl,
				chunking: "semantic",
				return_table: true,
				schema: {},
			}),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error("Pulse API Error:", {
				status: response.status,
				statusText: response.statusText,
				error: errorData,
			})
			throw new Error(
				errorData.error ||
					`HTTP error! status: ${response.status} - ${response.statusText}`
			)
		}

		const data = await response.json()
		console.log("Raw API Response:", data)

		if (!data.job_id) {
			throw new Error("No job ID returned from API")
		}

		return NextResponse.json({
			job_id: data.job_id,
			status: data.status || "pending",
		})
	} catch (error: any) {
		console.error("Extraction error:", error)
		return NextResponse.json(
			{
				error: error.message || "Failed to start async extraction",
				details: error.toString(),
			},
			{ status: 500 }
		)
	}
}

export const dynamic = "force-dynamic"
export const maxDuration = 60
