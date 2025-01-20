import { Query } from "@aws-sdk/client-textract"

type IncludesALiasOrName = { Alias: string } | { Name: string }

type QueryWithNames = Query & {
	Marker: string
	Name: string
	Container: string
	Verified: boolean // true
	Code?: string
} & IncludesALiasOrName

export { type QueryWithNames, type Query }
