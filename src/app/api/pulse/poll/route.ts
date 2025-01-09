import { NextResponse } from "next/server"
import { PULSE_API_URL } from "../config"
import type { PollResponse } from "../config"

const MAX_RETRIES = 2
const RETRY_DELAY = 3000

async function pollWithRetry(
	request: Request,
	retryCount = 0
): Promise<Response> {
	try {
		const { searchParams } = new URL(request.url)
		const jobId = searchParams.get("jobId")
		const apiKey = process.env.PULSE_API_KEY

		if (!jobId) {
			return NextResponse.json(
				{ error: "Job ID is required" },
				{ status: 400 }
			)
		}

		if (!apiKey) {
			throw new Error("PULSE_API_KEY is not configured")
		}

		const response = await fetch(`${PULSE_API_URL}/job/${jobId}`, {
			headers: {
				"x-api-key": apiKey,
			},
		})

		const data = await response.json()
		console.log("Poll response:", data)

		const pollResponse: PollResponse = {
			created_at: data.created_at || new Date().toISOString(),
			estimated_completion_time:
				data.estimated_completion_time || new Date().toISOString(),
			job_id: jobId,
			progress: 0,
			status: data.status || "pending",
			updated_at: data.updated_at || new Date().toISOString(),
			result: data.result,
		}

		return NextResponse.json(pollResponse)
	} catch (error: any) {
		if (retryCount < MAX_RETRIES) {
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
			return pollWithRetry(request, retryCount + 1)
		}
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
}

export const GET = pollWithRetry
