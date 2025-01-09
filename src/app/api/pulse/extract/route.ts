import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PulseConfig, PulseExtractResponse } from "../config"

export async function POST(request: Request) {
	try {
		const { fileUrl, method } = await request.json()
		const apiKey = process.env.PULSE_API_KEY

		console.log("Request details:", {
			url: `${PULSE_API_URL}/extract`,
			apiKey: apiKey?.slice(0, 4) + "..." + apiKey?.slice(-4),
			body: {
				"file-url": fileUrl,
				chunking: method || "semantic",
				return_table: true,
			},
		})

		const response = await fetch(`${PULSE_API_URL}/extract`, {
			method: "POST",
			headers: {
				"x-api-key": apiKey!,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"file-url": fileUrl,
				chunking: method || "semantic",
				return_table: true,
			}),
		})

		const data = await response.json()
		console.log("Raw API Response:", data)

		if (!response.ok) {
			throw new Error(
				data.error || `HTTP error! status: ${response.status}`
			)
		}

		// Transform the response to match our expected format
		const result: PulseExtractResponse = {
			text: data.markdown || data.text,
			tables:
				data.tables?.map((table: any) => ({
					data: Array.isArray(table) ? table : table.data || [],
				})) || [],
		}

		console.log("Transformed Response:", result)
		return NextResponse.json({ result })
	} catch (error: any) {
		console.error("Extraction error:", error)
		return NextResponse.json(
			{ error: error.message || "Failed to extract PDF" },
			{ status: 500 }
		)
	}
}
