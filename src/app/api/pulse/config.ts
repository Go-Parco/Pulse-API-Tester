export interface PulseExtractResponse {
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
	schema?: {
		document_comes_from?: string
		document_kind?: string
		document_name?: string
		pay_plan?: string
		[key: string]: string | undefined
	}
}

export interface PulseConfig {
	chunking?: "semantic" | "recursive"
	return_tables?: boolean
	skipPolling?: boolean
	schema?: string
}

export interface PollResponse {
	created_at: string
	estimated_completion_time: string
	job_id: string
	progress: number
	status: "pending" | "cancelled" | "failed" | "completed"
	updated_at: string
	result?: PulseExtractResponse
}

export const PULSE_API_URL = "https://api.runpulse.com"
export const DEFAULT_FILE_URL =
	"https://2jestdr1ib.ufs.sh/f/TvfTRqGWZUTvBbN6ep4dEmj3RADhsOzXxUF19rKqcMl"
