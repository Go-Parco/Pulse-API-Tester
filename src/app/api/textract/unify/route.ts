import { NextResponse } from "next/server"
import { SafeLog } from "@/utils/SafeLog"

export async function POST(request: Request) {
	try {
		const { responses, totalUndefined } = await request.json()

		// Ensure we have valid data
		if (!Array.isArray(responses)) {
			throw new Error("Invalid responses format")
		}

		// Safely combine all responses
		const combinedData = responses
			.flat()
			.filter(Boolean)
			.map((item) => ({
				question: item.question,
				answer: item.answer,
				questionKey: item.questionKey,
			}))

		return NextResponse.json({
			data: combinedData,
			undefinedCount: totalUndefined,
		})
	} catch (error) {
		SafeLog({ display: false, log: { "Error unifying responses": error } })
		return NextResponse.json(
			{ error: "Failed to unify responses" },
			{ status: 500 }
		)
	}
}
