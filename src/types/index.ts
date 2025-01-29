import { Query } from "@aws-sdk/client-textract"

type IncludesALiasOrName = { Alias: string } | { Name: string }

type OCR = "Textract" | "Pulse" | "Tesseract" | "Nyckel"
type Status = "success" | "neutral" | "failed"

type Test = {
	testString: string
	ocr: OCR
	status: Status
}

type QueryWithNames = Query & {
	Marker: string
	Name: string
	Container: string
	Verified: boolean // true
	VerifiedOutput?: string
	Tests?: Test[]
	PulseQuery?: string
	Code?: string
} & IncludesALiasOrName

export { type QueryWithNames, type Query }
