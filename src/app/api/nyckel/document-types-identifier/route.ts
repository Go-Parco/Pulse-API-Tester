import { NextResponse } from "next/server"
import { NYCKEL_API_KEY } from "../config"
import { SafeLog } from "@/utils/SafeLog"

export async function POST(request: Request) {
	try {
		const { url, isBase64 } = await request.json()
		SafeLog({
			display: false,
			log: { "Received input type": isBase64 ? "base64" : "url" },
		})

		if (!url) {
			return NextResponse.json(
				{ error: "URL or base64 data is required" },
				{ status: 400 }
			)
		}

		const nyckelPayload = {
			data: isBase64 ? url : encodeURI(url),
			contentType: isBase64 ? "BASE64" : "URL",
		}
		console.log("Nyckel payload type:", nyckelPayload.contentType)

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
			SafeLog({
				display: true,
				log: { "Nyckel API error response": errorText },
			})
			throw new Error(
				`Nyckel API error: ${response.statusText}. Details: ${errorText}`
			)
		}

		const data = await response.json()
		SafeLog({
			display: false,
			log: { "Nyckel API response": data },
		})

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
