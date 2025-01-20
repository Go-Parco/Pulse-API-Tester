export const NYCKEL_API_KEY = process.env.NYCKEL_API_KEY

if (!NYCKEL_API_KEY) {
	throw new Error("Missing NYCKEL_API_KEY environment variable")
}

export interface NyckelResponse<T = any> {
	result: T
	status: "success" | "error"
	error?: string
}

export interface DocumentTypeResult {
	labelName: string
	confidence: number
}
