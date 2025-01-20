import { NextResponse } from "next/server"
import { NYCKEL_API_KEY } from "../config"

export async function POST(request: Request) {
	try {
		const { url } = await request.json()
		console.log("Received URL:", url)

		if (!url) {
			return NextResponse.json(
				{ error: "URL is required" },
				{ status: 400 }
			)
		}

		// Ensure the URL is properly encoded
		const encodedUrl = encodeURI(url)
		console.log("Encoded URL:", encodedUrl)

		const nyckelPayload = {
			data: encodedUrl,
			contentType: "URL",
		}
		console.log("Nyckel payload:", nyckelPayload)

		const response = await fetch(
			"https://www.nyckel.com/v1/functions/document-types-identifier/invoke",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${NYCKEL_API_KEY}`,
				},
				body: JSON.stringify(nyckelPayload),
			}
		)

		if (!response.ok) {
			const errorText = await response.text()
			console.error("Nyckel API error response:", errorText)
			throw new Error(
				`Nyckel API error: ${response.statusText}. Details: ${errorText}`
			)
		}

		const data = await response.json()
		console.log("Nyckel API response:", data)

		return NextResponse.json({
			documentType: data.labelName,
			confidence: data.confidence,
		})
	} catch (error) {
		console.error("Document type identification error:", error)
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to identify document type",
			},
			{ status: 500 }
		)
	}
}
