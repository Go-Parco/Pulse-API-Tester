interface PulseExtractResponse {
	text?: string
	tables?: Array<{
		data: any[][]
	}>
	chunks?: {
		semantic?: Array<{
			chunk_number: number
			content: string
			method: string
		}>
		recursive?: Array<{
			chunk_number: number
			content: string
			method: string
		}>
	}
}

interface PollResponse {
	created_at: string
	estimated_completion_time: string
	job_id: string
	progress: number
	status: "pending" | "cancelled" | "failed" | "completed"
	updated_at: string
	result?: PulseExtractResponse
}

// Update to a more reliable PDF URL
export const DEFAULT_FILE_URL =
	"https://utfs.io/f/FLqidTvfTRqGaAYiwUqBvh2SHufCYlJ0FAbR6mIjgrEpLqO1"

export async function extractFromPdf(
	fileUrl: string = DEFAULT_FILE_URL,
	options: {
		chunking?: "semantic" | "recursive"
		return_tables?: boolean
		skipPolling?: boolean
	} = {}
) {
	console.log("Attempting extraction with URL:", fileUrl)

	try {
		// First verify the file is accessible
		const fileCheck = await fetch(fileUrl)
		if (!fileCheck.ok) {
			throw new Error(`PDF file not accessible: ${fileCheck.status}`)
		}

		// Use non-async endpoint when skipping polling
		const endpoint = options.skipPolling ? "extract" : "extract_async"
		const response = await fetch(`https://api.runpulse.com/${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": process.env.PULSE_API_KEY!,
			},
			body: JSON.stringify({
				"file-url": fileUrl,
				chunking: options.chunking,
				return_tables: options.return_tables,
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			console.error("API Error Response:", data)
			throw new Error(
				data.error || `HTTP error! status: ${response.status}`
			)
		}

		// Return full response for non-async, job_id for async
		return options.skipPolling ? { result: data } : { job_id: data.job_id }
	} catch (error: any) {
		console.error("Full extraction error:", error)
		throw new Error(error.message || "Failed to extract PDF")
	}
}

const MAX_RETRIES = 2
const RETRY_DELAY = 3000

export const pollExtractionStatus = async (
	jobId: string,
	retryCount = 0
): Promise<PollResponse> => {
	try {
		const response = await fetch(`https://api.runpulse.com/job/${jobId}`, {
			method: "GET",
			headers: {
				"x-api-key": process.env.PULSE_API_KEY!,
			},
		})

		const data = await response.json()
		console.log("Poll response:", data)

		// Just return the API response as is
		return {
			created_at: data.created_at || new Date().toISOString(),
			estimated_completion_time:
				data.estimated_completion_time || new Date().toISOString(),
			job_id: jobId,
			progress: 0, // Don't try to calculate progress
			status: data.status || "pending",
			updated_at: data.updated_at || new Date().toISOString(),
			result: data.result,
		}
	} catch (error) {
		if (retryCount < MAX_RETRIES) {
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
			return pollExtractionStatus(jobId, retryCount + 1)
		}
		throw error
	}
}
