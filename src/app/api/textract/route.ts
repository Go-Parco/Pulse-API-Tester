"use server"
import { NextResponse } from "next/server"
import { AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract"
import { client } from "@/lib/textract"
// @ts-ignore Keeping this testAgencyQueries in case needed for future testing
import { testAgencyQueries } from "@/app/(pages)/dashboard/(ocr)/apis/textract/estAgencyQueries"

// Handle GET requests for response unification
export async function GET(request: Request) {
	try {
		const url = new URL(request.url)
		const responsesParam = url.searchParams.get("responses")
		if (!responsesParam) {
			return NextResponse.json(
				{ error: "No responses provided" },
				{ status: 400 }
			)
		}

		const parsedResponses = JSON.parse(responsesParam)
		const totalUndefined = parseInt(
			url.searchParams.get("totalUndefined") || "0"
		)

		// Add debug logging
		console.log("Parsed responses:", parsedResponses)

		// Ensure we have an array and flatten it properly
		const combinedData = Array.isArray(parsedResponses)
			? parsedResponses.flat().filter(Boolean)
			: []

		console.log("Combined data:", combinedData)

		return NextResponse.json({
			data: combinedData,
			undefinedCount: totalUndefined,
		})
	} catch (error) {
		console.error("Error unifying responses:", error)
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to unify responses",
				details: error,
			},
			{ status: 500 }
		)
	}
}

// Handle POST requests for document analysis
export async function POST(request: Request) {
	try {
		const formData = await request.formData()
		const file = formData.get("file") as File
		const startIndex = parseInt(formData.get("startIndex") as string) || 0
		const endIndex = parseInt(formData.get("endIndex") as string) || 15
		const queriesRaw = formData.get("queries")

		console.log("Received queries:", queriesRaw) // Debug log

		const queries = queriesRaw ? JSON.parse(queriesRaw as string) : []

		if (!file || !queries.length) {
			return NextResponse.json(
				{ error: "No file or queries provided" },
				{ status: 400 }
			)
		}

		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		console.log("Processing queries:", queries) // Debug log

		const params = {
			Document: {
				Bytes: buffer,
			},
			FeatureTypes: [FeatureType.TABLES, FeatureType.QUERIES],
			QueriesConfig: {
				Queries: queries.map((q: string) => ({ Text: q })),
			},
		}

		const command = new AnalyzeDocumentCommand(params)
		const response = await client.send(command)

		console.log("Textract response:", response) // Debug log

		return NextResponse.json({
			data: response,
			queriesProcessed: queries.length,
			startIndex,
			endIndex,
		})
	} catch (error) {
		console.error("Error analyzing document:", error)
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to analyze document",
			},
			{ status: 500 }
		)
	}
}
