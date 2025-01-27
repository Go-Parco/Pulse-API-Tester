"use server"
import { NextResponse } from "next/server"
import { AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract"
import { client } from "@/lib/textract"
// @ts-ignore Keeping this testAgencyQueries in case needed for future testing
import { testAgencyQueries } from "@/app/(pages)/dashboard/(ocr)/apis/textract/estAgencyQueries"
import { SafeLog } from "@/utils/SafeLog"
import { unifyResponses } from "./unify"
import { extractQueries } from "@/functions/extractQueries"

// Handle GET requests for response unification
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const queriesRaw = searchParams.get("queries")

		if (!queriesRaw) {
			return NextResponse.json(
				{ error: "No queries provided" },
				{ status: 400 }
			)
		}

		SafeLog({ display: false, log: { "Received queries": queriesRaw } })

		// Parse queries
		let queries
		try {
			queries = JSON.parse(queriesRaw)
		} catch (error) {
			return NextResponse.json(
				{ error: "Invalid queries format" },
				{ status: 400 }
			)
		}

		SafeLog({ display: false, log: { "Processing queries": queries } })

		// Extract queries from the response
		const response = await extractQueries(queries)
		SafeLog({ display: false, log: { "Textract response": response } })

		return NextResponse.json(response)
	} catch (error: unknown) {
		SafeLog({ display: false, log: { "Error analyzing document": error } })
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Unknown error occurred",
			},
			{ status: 500 }
		)
	}
}

// Handle POST requests for document analysis
export async function POST(request: Request) {
	try {
		const { responses } = await request.json()

		if (!responses || !Array.isArray(responses)) {
			return NextResponse.json(
				{ error: "Invalid responses format" },
				{ status: 400 }
			)
		}

		// Parse each response
		const parsedResponses = responses.map((response) => {
			if (typeof response === "string") {
				return JSON.parse(response)
			}
			return response
		})

		SafeLog({
			display: false,
			log: { "Parsed responses": parsedResponses },
		})

		// Combine the responses
		const combinedData = parsedResponses.reduce((acc, curr) => {
			return {
				...acc,
				...curr,
			}
		}, {})
		SafeLog({ display: false, log: { "Combined data": combinedData } })

		return NextResponse.json(combinedData)
	} catch (error: unknown) {
		SafeLog({ display: false, log: { "Error unifying responses": error } })
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Unknown error occurred",
			},
			{ status: 500 }
		)
	}
}
