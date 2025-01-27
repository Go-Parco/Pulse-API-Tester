"use client"

import { useState } from "react"
import { SafeLog } from "@/utils/SafeLog"

type DocNameFunnelProps = {
	data: {
		schemaData: {
			document_comes_from: string
			document_kind: string
			document_name: string
			pay_plan?: string
		}
		docType: string
		originalFileName?: string
		originalExtension: string
	}
}

export type DocNameFunnelReturn = {
	data: {
		docProvider: string
		docType: string
		docName: string
		extension: string
	} | null
	error: {
		message: string | null
	} | null
	suggestion?: {
		docProvider?: string
		docType?: string
	}
	manualReview: boolean
}

const AgencyLabelConversion: Record<
	string,
	{ display: string; matches: string[] }
> = {
	DOD: {
		display: "DOD",
		matches: ["department of defense"],
	},
	DOEd: {
		display: "DOE(d)",
		matches: ["department of education"],
	},
	DOEn: {
		display: "DOE(n)",
		matches: ["department of energy"],
	},
	USDA: {
		display: "USDA",
		matches: ["rural development", "employee personal page"],
	},
	TVA: {
		display: "TVA",
		matches: ["tennessee valley authority"],
	},
	GSA: {
		display: "GSA",
		matches: ["general services administration"],
	},
	USPS: {
		display: "USPS",
		matches: ["payroll system", "payroll department", "payloc finance"],
	},
	IRS: {
		display: "IRS",
		matches: ["internal revenue service", "irs ogden payroll"],
	},
	DOS: {
		display: "DOS",
		matches: ["department of state"],
	},
	USAID: {
		display: "USAID",
		matches: [
			"u.s. agency for international development",
			"agency for international development",
			"usaid",
		],
	},
}

const BankLabelConversion = {
	Charles_Schwab: { display: "Charles Schwab", matches: ["charles schwab"] },
	edward_Jones: { display: "Edward Jones", matches: ["edward jones"] },
	Scudder_Investor_Relations: {
		display: "Scudder",
		matches: ["scudder investor relations"],
	},
}

const formatDocName = (
	docType: string,
	docProvider: string,
	extension: string,
	abbreviation?: string,
	originalFileName?: string
) => {
	SafeLog({
		display: false,
		log: {
			"formatDocName inputs": {
				docType,
				docProvider,
				extension,
				abbreviation,
			},
		},
	})
	const baseName = abbreviation
		? `${docType} - ${abbreviation}`
		: `${docType} - ${docProvider}`

	// Clean up the extension to ensure it's properly formatted
	const cleanExtension = extension.trim()
		? extension.startsWith(".")
			? extension
			: `.${extension}`
		: ""

	const fullName = `${baseName}${cleanExtension}`
	SafeLog({
		display: false,
		log: { "formatDocName output": fullName },
	})
	return { name: fullName, extension: cleanExtension }
}

const processEarningsStatements = (
	origDocName: string,
	docType: string,
	schemaData: {
		document_comes_from: string
		document_name: string
		document_kind: string
	},
	extension: string,
	setSuggestion: (suggestion: DocNameFunnelReturn["suggestion"]) => void,
	setDocProvider: (provider: string) => void,
	setError: (error: DocNameFunnelReturn["error"]) => void,
	setDocName: (name: string) => void,
	setManualReview: (manualReview: boolean) => void,
	setConfirmedDocType: (type: string) => void,
	setExtension: (ext: string) => void
) => {
	const comesFrom = schemaData.document_comes_from.toLowerCase()
	SafeLog({
		display: false,
		log: {
			"Agency Matching": {
				"Document comes from": comesFrom,
				"Checking against agencies": AgencyLabelConversion,
			},
		},
	})

	// Find matching agency by checking if the document_comes_from matches any of the possible matches
	const matchingAgency = Object.entries(AgencyLabelConversion).find(
		([key, value]) => {
			const matches = value.matches.some((match) => {
				const matchLower = match.toLowerCase()
				const sourceMatch = comesFrom === matchLower
				const sourceIncludes = comesFrom.includes(matchLower)
				SafeLog({
					display: false,
					log: {
						"Agency Check": {
							key,
							match,
							sourceMatch,
							sourceIncludes,
						},
					},
				})
				return sourceMatch || sourceIncludes
			})
			return matches
		}
	)

	SafeLog({
		display: false,
		log: { "Agency match result": matchingAgency },
	})

	if (matchingAgency) {
		const [key, value] = matchingAgency
		setDocProvider(value.display)
		const { name, extension: cleanExtension } = formatDocName(
			"Earnings Statement",
			value.display,
			extension,
			key
		)
		SafeLog({
			display: false,
			log: {
				"Document name creation": {
					docName: name,
					extension: cleanExtension,
				},
			},
		})
		setDocName(name)
		setExtension(cleanExtension)
		setConfirmedDocType("Earnings Statement")
	} else {
		setError({
			message: `Could not find a provider based upon the document_comes_from or document_name. Comes From:${schemaData.document_comes_from}, Name:${schemaData.document_name}, Kind:${schemaData.document_kind}, Type:${docType}`,
		})
		setManualReview(true)
		setSuggestion({
			docProvider: schemaData.document_comes_from,
			docType: "Earnings Statement",
		})
	}
}

const processInvoiceDocs = (
	docType: string,
	schemaData: {
		document_comes_from: string
		document_name: string
		document_kind: string
	},
	extension: string,
	setDocProvider: (provider: string) => void,
	setDocType: (type: string) => void,
	setDocName: (name: string) => void,
	setError: (error: DocNameFunnelReturn["error"]) => void,
	setManualReview: (manualReview: boolean) => void,
	setSuggestion: (suggestion: DocNameFunnelReturn["suggestion"]) => void
) => {
	SafeLog({
		display: false,
		log: {
			"Invoice Document Processing": {
				"Document comes from": schemaData.document_comes_from,
				"Document kind": schemaData.document_kind,
				"Document name": schemaData.document_name,
				"Checking against banks": BankLabelConversion,
			},
		},
	})

	// first check if the document_name or document_kind contains the word "check"
	if (
		schemaData.document_name.toLowerCase().includes("check") ||
		schemaData.document_kind.toLowerCase().includes("check")
	) {
		setDocProvider(schemaData.document_comes_from)
		setDocType("Voided Check")
		setDocName(
			formatDocName(
				"Voided_Check",
				schemaData.document_comes_from,
				extension
			).name
		)
	} else {
		// Try to match the bank name
		const bankMatch = Object.entries(BankLabelConversion).find(
			([key, value]) => {
				const sourceMatch =
					schemaData.document_comes_from.toLowerCase() ===
					value.display.toLowerCase()
				const keyMatch = schemaData.document_comes_from
					.toLowerCase()
					.includes(key.toLowerCase().replace("_", " "))
				SafeLog({
					display: false,
					log: {
						"Bank Check": {
							key,
							value,
							sourceMatch,
							keyMatch,
						},
					},
				})
				return sourceMatch || keyMatch
			}
		)

		SafeLog({
			display: false,
			log: { "Bank match result": bankMatch },
		})

		if (bankMatch) {
			const [key, { display }] = bankMatch
			setDocProvider(display)
			setDocType("Account Statement")
			setDocName(
				formatDocName("Account_Statement", display, extension).name
			)
		} else {
			setError({
				message: `Could not find a provider based upon the document_comes_from or document_name. Comes From:${schemaData.document_comes_from}, Name:${schemaData.document_name}, Kind:${schemaData.document_kind}, Type:${docType}`,
			})
			setManualReview(true)
			setSuggestion({
				docProvider: schemaData.document_comes_from,
				docType: "Account Statement",
			})
		}
	}
	SafeLog({
		display: false,
		log: { "=========================": null },
	})
}

export const docNameFunnel = ({
	props,
}: {
	props: DocNameFunnelProps
}): DocNameFunnelReturn => {
	const { schemaData, docType, originalExtension, originalFileName } =
		props.data
	let docProvider = ""
	let docName = ""
	let confirmedDocType = ""
	let extension = originalExtension
	let error: DocNameFunnelReturn["error"] = null
	let manualReview = false
	let suggestion: DocNameFunnelReturn["suggestion"] = {
		docProvider: "",
		docType: "",
	}

	const setDocProvider = (provider: string) => {
		docProvider = provider
	}

	const setDocName = (name: string) => {
		docName = name
	}

	const setConfirmedDocType = (type: string) => {
		confirmedDocType = type
	}

	const setExtension = (ext: string) => {
		extension = ext
	}

	const setError = (err: DocNameFunnelReturn["error"]) => {
		error = err
	}

	const setManualReview = (review: boolean) => {
		manualReview = review
	}

	const setSuggestion = (sug: DocNameFunnelReturn["suggestion"]) => {
		suggestion = sug
	}

	// First check if it's a budget or specification type, or if the document kind/name indicates it's an earnings statement
	if (
		docType.toLowerCase() === "budget" ||
		docType.toLowerCase() === "specification" ||
		docType.toLowerCase() === "pay statement" ||
		docName.toLowerCase() === "pay information" ||
		schemaData.document_kind.toLowerCase().includes("earnings") ||
		schemaData.document_kind.toLowerCase().includes("leave") ||
		schemaData.document_name.toLowerCase().includes("earnings") ||
		schemaData.document_name.toLowerCase().includes("leave")
	) {
		setConfirmedDocType("Earnings Statement")
		processEarningsStatements(
			schemaData.document_name,
			docType,
			schemaData,
			originalExtension,
			setSuggestion,
			setDocProvider,
			setError,
			setDocName,
			setManualReview,
			setConfirmedDocType,
			setExtension
		)
		return {
			data: {
				docProvider,
				docType: confirmedDocType,
				docName,
				extension,
			},
			manualReview,
			error,
			suggestion,
		}
	}

	// Only process as invoice/bank docs if it's not an earnings statement
	processInvoiceDocs(
		docType,
		schemaData,
		originalExtension,
		setDocProvider,
		setConfirmedDocType,
		setDocName,
		setError,
		setManualReview,
		setSuggestion
	)

	return {
		data: {
			docProvider,
			docType: confirmedDocType,
			docName,
			extension,
		},
		manualReview,
		error,
		suggestion,
	}
}
