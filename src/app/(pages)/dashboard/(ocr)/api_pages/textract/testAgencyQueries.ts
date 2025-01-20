import { Query } from "@aws-sdk/client-textract"

export const testAgencyQueries: Query[] = [
	{ Text: "What are the current deductions?" },
	{ Text: "What are the year to date deductions?" },
	{ Text: "What are the current taxable wages?" },
	{ Text: "What are the year to date taxable wages?" },
	{ Text: "What is the current gross pay?" },
	{ Text: "What is the year to date gross pay?" },
	{ Text: "What is the current net pay?" },
	{ Text: "What is the year to date net pay?" },
	{ Text: "What are the current tax deferred wages?" },
	{ Text: "What are the year to date tax deferred wages?" },
	{ Text: "What is the current fegli optnl A?" },
	{ Text: "What is the year to date fegli optnl A?" },
	{ Text: "What is the Adjusted Basic Pay?" },
]
