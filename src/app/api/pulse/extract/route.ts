import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PulseConfig, PulseExtractResponse } from "../config"

// Set timeout to 2 minutes
const TIMEOUT = 120000

const fetchWithTimeout = async (url: string, options: RequestInit) => {
	const controller = new AbortController()
	const id = setTimeout(() => controller.abort(), TIMEOUT)

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		})
		clearTimeout(id)
		return response
	} catch (error) {
		clearTimeout(id)
		throw error
	}
}

export async function POST(request: Request) {
	try {
		const { fileUrl, method } = await request.json()
		const apiKey = process.env.PULSE_API_KEY

		if (!apiKey) {
			throw new Error("PULSE_API_KEY is not configured")
		}

		console.log("Request details:", {
			url: `${PULSE_API_URL}/extract`,
			apiKey: apiKey?.slice(0, 4) + "..." + apiKey?.slice(-4),
			body: {
				"file-url": fileUrl,
				chunking: method || "semantic",
				return_table: true,
			},
		})

		const response = await fetchWithTimeout(`${PULSE_API_URL}/extract`, {
			method: "POST",
			headers: {
				"x-api-key": apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"file-url": fileUrl,
				chunking: method || "semantic",
				return_table: true,
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
			{
				error: error.message || "Failed to extract PDF",
				details: error.toString(),
			},
			{ status: error.name === "AbortError" ? 504 : 500 }
		)
	}
}

export const dynamic = "force-dynamic"
export const maxDuration = 120
