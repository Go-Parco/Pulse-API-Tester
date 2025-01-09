import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PulseConfig } from "../config"

export async function POST(request: Request) {
	try {
		const { fileUrl, method, skipPolling } = await request.json()
		const apiKey = process.env.PULSE_API_KEY

		console.log("API Key:", {
			exists: !!apiKey,
			length: apiKey?.length,
			value: apiKey?.slice(0, 4) + "..." + apiKey?.slice(-4),
		})

		if (!apiKey) {
			throw new Error("PULSE_API_KEY is not configured")
		}

		// First verify the file is accessible
		const fileCheck = await fetch(fileUrl)
		if (!fileCheck.ok) {
			throw new Error(`PDF file not accessible: ${fileCheck.status}`)
		}

		// Use non-async endpoint when skipping polling
		const endpoint = skipPolling ? "extract" : "extract_async"
		const response = await fetch(`${PULSE_API_URL}/${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": apiKey,
			},
			body: JSON.stringify({
				"file-url": fileUrl,
				chunking: method,
				return_tables: true,
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			console.error("API Error Response:", data)
			throw new Error(
				data.error || `HTTP error! status: ${response.status}`
			)
		}

		// Return full response for non-async, job_id for async
		return NextResponse.json(
			skipPolling ? { result: data } : { job_id: data.job_id }
		)
	} catch (error: any) {
		console.error("Full extraction error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to extract PDF" },
			{ status: 500 }
		)
	}
}
