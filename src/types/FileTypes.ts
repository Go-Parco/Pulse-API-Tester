const accountOptions = ["edward jones", "charles schwab"]
const agencyOptions = [
	"USDA",
	"GSA",
	"DOE",
	"DOD",
	"TVA",
	"USPS",
	"IRS",
	"DOS",
	"USAID",
]
const documentOptions = ["voidedCheck", "bankStatement", "paystub"]

type FileDocRenameType = {
	documentType: (typeof documentOptions)[number]
	accountStatement: (typeof accountOptions)[number]
}

type AccountType = (typeof accountOptions)[number]
type AgencyType = (typeof agencyOptions)[number]
type DocumentType = (typeof documentOptions)[number]

export enum Agency {
	USDA = "USDA",
	DOD = "DOD",
	IRS = "IRS",
	DOS = "DOS",
	TVA = "TVA",
	GSA = "GSA",
	USAID = "USAID",
	DOE = "DOE",
	USPS = "USPS",
	// Add other agencies as needed
}

export enum AcceptedFileType {
	IMAGE = "image/*",
	PDF = "application/pdf",
	EXCEL = "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	DOC = "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	CSV = "text/csv",
	ALL = "*/*",
}

export type FileUploaderProps = {
	acceptMultiple?: boolean
	maxFileSize?: number // in MB
	acceptedTypes?: AcceptedFileType[]
	onFilesSelected: (files: File[]) => void
	onFileRemoved?: () => void
	disabled?: boolean
	className?: string
}

export { accountOptions, agencyOptions, documentOptions }
export type { FileDocRenameType, AccountType, AgencyType, DocumentType }
