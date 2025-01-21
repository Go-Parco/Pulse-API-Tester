"use client"

import { useState } from "react"

type DocNameFunnelProps = {
	data: {
		schemaData: {
			document_comes_from: string
			document_kind: string
			document_name: string
			pay_plan?: string
		}
		docType: string
	}
}

export type DocNameFunnelReturn = {
	data: {
		docProvider: string
		docType: string
		docName: string
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
		display: "department of defense",
		matches: ["department of defense"],
	},
	DOE: {
		display: "department of energy",
		matches: ["department of energy"],
	},
	USDA: {
		display: "rural development",
		matches: ["rural development"],
	},
	TVA: {
		display: "tennessee valley authority",
		matches: ["tennessee valley authority"],
	},
	GSA: {
		display: "general services administration",
		matches: ["general services administration"],
	},
	USPS: {
		display: "united states postal service",
		matches: ["payroll system", "payroll department", "payloc finance"],
	},
	IRS: {
		display: "internal revenue service",
		matches: ["internal revenue service"],
	},
	DOS: {
		display: "department of state",
		matches: ["department of state"],
	},
	USAID: {
		display: "u.s. agency for international development",
		matches: [
			"u.s. agency for international development",
			"agency for international development",
			"usaid",
		],
	},
}

const BankLabelConversion = {
	Charles_Schwab: "charles schwab",
	Edward_Jones: "edward jones",
	Scudder_Investor_Relations: "scudder investor relations",
}

const formatDocName = (
	docType: string,
	docProvider: string,
	abbreviation?: string
) => {
	if (abbreviation) {
		return `${docType} - ${abbreviation}`
	}
	return `${docType} - ${docProvider}`
}

const processEarningsStatements = (
	origDocName: string,
	docType: string,
	schemaData: {
		document_comes_from: string
		document_name: string
		document_kind: string
	},
	setSuggestion: (suggestion: DocNameFunnelReturn["suggestion"]) => void,
	setDocProvider: (provider: string) => void,
	setError: (error: DocNameFunnelReturn["error"]) => void,
	setDocName: (name: string) => void,
	setManualReview: (manualReview: boolean) => void,
	setConfirmedDocType: (type: string) => void
) => {
	const comesFrom = schemaData.document_comes_from.toLowerCase()
	console.log("=== AGENCY MATCHING DEBUG ===")
	console.log("Document comes from:", comesFrom)
	console.log("Checking against agencies:", AgencyLabelConversion)

	// Find matching agency by checking if the document_comes_from matches any of the possible matches
	const matchingAgency = Object.entries(AgencyLabelConversion).find(
		([key, value]) => {
			const matches = value.matches.some((match) => {
				const matchLower = match.toLowerCase()
				const sourceMatch = comesFrom === matchLower
				const sourceIncludes = comesFrom.includes(matchLower)
				console.log(`Checking agency - Key: ${key}, Match: ${match}`)
				console.log(
					`Source exact match: ${sourceMatch}, Source includes: ${sourceIncludes}`
				)
				return sourceMatch || sourceIncludes
			})
			return matches
		}
	)

	console.log("Agency match result:", matchingAgency)
	console.log("=========================")

	if (matchingAgency) {
		const [key, value] = matchingAgency
		setDocProvider(value.display)
		setDocName(formatDocName("Earnings Statement", value.display, key))
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
	setDocProvider: (provider: string) => void,
	setDocType: (type: string) => void,
	setDocName: (name: string) => void,
	setError: (error: DocNameFunnelReturn["error"]) => void,
	setManualReview: (manualReview: boolean) => void,
	setSuggestion: (suggestion: DocNameFunnelReturn["suggestion"]) => void
) => {
	console.log("=== INVOICE DOCS MATCHING DEBUG ===")
	console.log("Document comes from:", schemaData.document_comes_from)
	console.log("Document kind:", schemaData.document_kind)
	console.log("Document name:", schemaData.document_name)
	console.log("Checking against banks:", BankLabelConversion)

	// first check if the document_name or document_kind contains the word "check"
	if (
		schemaData.document_name.toLowerCase().includes("check") ||
		schemaData.document_kind.toLowerCase().includes("check")
	) {
		setDocProvider(schemaData.document_comes_from)
		setDocType("Voided Check")
		setDocName(
			formatDocName("Voided Check", schemaData.document_comes_from)
		)
	} else {
		// Try to match the bank name
		const bankMatch = Object.entries(BankLabelConversion).find(
			([key, value]) => {
				const sourceMatch =
					schemaData.document_comes_from.toLowerCase() ===
					value.toLowerCase()
				const keyMatch = schemaData.document_comes_from
					.toLowerCase()
					.includes(key.toLowerCase().replace("_", " "))
				console.log(`Checking bank - Key: ${key}, Value: ${value}`)
				console.log(
					`Source match: ${sourceMatch}, Key match: ${keyMatch}`
				)
				return sourceMatch || keyMatch
			}
		)

		console.log("Bank match result:", bankMatch)

		if (bankMatch) {
			const [key, value] = bankMatch
			setDocProvider(value)
			setDocType("Account Statement")
			setDocName(formatDocName("Account Statement", value))
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
	console.log("=========================")
}

export const docNameFunnel = ({
	props,
}: {
	props: DocNameFunnelProps
}): DocNameFunnelReturn => {
	const { schemaData, docType } = props.data
	let docProvider = ""
	let docName = ""
	let confirmedDocType = ""
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
		docType === "budget" ||
		docType === "specification" ||
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
			setSuggestion,
			setDocProvider,
			setError,
			setDocName,
			setManualReview,
			setConfirmedDocType
		)
		return {
			data: {
				docProvider,
				docType: confirmedDocType,
				docName,
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
		},
		manualReview,
		error,
		suggestion,
	}
}
