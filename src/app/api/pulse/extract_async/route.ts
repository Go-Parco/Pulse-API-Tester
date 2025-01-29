import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PulseConfig } from "../config"
import { env } from "@/env"
import { SafeLog } from "@/utils/SafeLog"
import sharp from "sharp"

// Define the default schema according to the API docs
const DEFAULT_SCHEMA = {
	document_comes_from: "string",
	document_name: "string",
	document_kind: "string",
	pay_plan: "string",
}

type Schema = Record<string, string>

export async function POST(request: Request) {
	try {
		const { fileUrl, schema } = await request.json()
		const apiKey = env.PULSE_API_KEY

		if (!apiKey) {
			throw new Error("PULSE_API_KEY is not configured")
		}

		// Handle WebP conversion if needed
		let finalFileUrl = fileUrl
		if (fileUrl.toLowerCase().endsWith(".webp")) {
			try {
				// Download the WebP image
				const imageResponse = await fetch(fileUrl)
				if (!imageResponse.ok) {
					throw new Error("Failed to fetch WebP image")
				}
				const imageBuffer = await imageResponse.arrayBuffer()

				// Convert to JPG using sharp
				const jpgBuffer = await sharp(Buffer.from(imageBuffer))
					.jpeg({ quality: 90 })
					.toBuffer()

				// Create form data for upload
				const formData = new FormData()
				formData.append(
					"file",
					new Blob([jpgBuffer], { type: "image/jpeg" }),
					"converted.jpg"
				)

				// Upload the converted image
				const uploadResponse = await fetch(
					`${process.env.NEXT_PUBLIC_APP_URL}/api/uploadthing`,
					{
						method: "POST",
						body: formData,
					}
				)

				if (!uploadResponse.ok) {
					throw new Error("Failed to upload converted image")
				}

				const uploadData = await uploadResponse.json()
				finalFileUrl = uploadData.url

				SafeLog({
					display: false,
					log: {
						"WebP conversion successful": {
							originalUrl: fileUrl,
							convertedUrl: finalFileUrl,
						},
					},
				})
			} catch (error) {
				SafeLog({
					display: false,
					log: { "WebP conversion error": error },
				})
				throw new Error("Failed to convert WebP image")
			}
		}

		// Convert schema to proper format if provided
		const finalSchema = DEFAULT_SCHEMA

		const requestBody = {
			"file-url": finalFileUrl,
			chunking: "semantic",
			return_table: true,
			schema: finalSchema,
			extract_schema: true,
		}

		SafeLog({
			display: false,
			log: {
				"Request details": {
					url: `${PULSE_API_URL}/extract_async`,
					apiKey: apiKey?.slice(0, 4) + "..." + apiKey?.slice(-4),
				},
			},
		})

		const response = await fetch(`${PULSE_API_URL}/extract_async`, {
			method: "POST",
			headers: {
				"x-api-key": apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			SafeLog({
				display: false,
				log: {
					"Pulse API Error": {
						status: response.status,
						statusText: response.statusText,
						error: errorData.error,
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

		if (!data.job_id) {
			throw new Error("No job ID returned from API")
		}

		return NextResponse.json({
			job_id: data.job_id,
			status: data.status || "pending",
		})
	} catch (error: any) {
		SafeLog({ display: false, log: { "Extraction error": error } })
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
