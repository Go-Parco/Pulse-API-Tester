import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PulseConfig, PulseExtractResponse } from "../config"
import { env } from "@/env"
import { SafeLog } from "@/utils/SafeLog"

export async function POST(request: Request) {
	try {
		const { fileUrl, method } = await request.json()
		const apiKey = env.PULSE_API_KEY

		if (!apiKey) {
			throw new Error("PULSE_API_KEY is not configured")
		}

		SafeLog({
			display: false,
			log: {
				"Request details": {
					url: `${PULSE_API_URL}/extract`,
					apiKey: apiKey?.slice(0, 4) + "..." + apiKey?.slice(-4),
					body: {
						"file-url": fileUrl,
						chunking: method || "semantic",
						return_table: true,
					},
				},
			},
		})

		const response = await fetch(`${PULSE_API_URL}/extract`, {
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
			SafeLog({
				display: false,
				log: {
					"Pulse API Error": {
						status: response.status,
						statusText: response.statusText,
						error: errorData,
					},
				},
			})
			throw new Error(
				errorData.error ||
					`HTTP error! status: ${response.status} - ${response.statusText}`
			)
		}

		const data = await response.json()
		SafeLog({ display: false, log: { "Raw API Response": data } })

		// Transform the response to match our expected format
		const result: PulseExtractResponse = {
			text: data.markdown || data.text,
			tables:
				data.tables?.map((table: any) => {
					// Handle both array format and object format with data property
					const tableData = Array.isArray(table) ? table : table.data
					return { data: tableData || [] }
				}) || [],
		}

		SafeLog({ display: false, log: { "Transformed Response": result } })
		return NextResponse.json({ result })
	} catch (error: any) {
		SafeLog({ display: false, log: { "Extraction error": error } })
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
export const maxDuration = 60
