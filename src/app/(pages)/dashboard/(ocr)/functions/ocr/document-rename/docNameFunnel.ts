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

const AgencyLabelConversion = {
	DOD: "department of defense",
	DOE: "department of energy",
	USDA: "rural development",
	TVA: "tennessee valley authority",
	GSA: "general services administration",
	USPS: "payloc finance",
	IRS: "internal revenue service",
	DOS: "department of state",
	USAID: "u.s. agency for international development",
}

const BankLabelConversion = {
	Charles_Schwab: "charles schwab",
	Edward_Jones: "edward jones",
	Scudder_Investor_Relations: "scudder investor relations",
}

const formatDocName = (docType: string, docProvider: string) => {
	return `${docType} ${docProvider}`
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
	setManualReview: (manualReview: boolean) => void
) => {
	// If the document_comes_from is listed as a value in AgencyLabelConversion, then set the docProvider to the key of AgencyLabelConversion
	if (schemaData.document_comes_from in AgencyLabelConversion) {
		setDocProvider(
			AgencyLabelConversion[
				schemaData.document_comes_from as keyof typeof AgencyLabelConversion
			]
		)
		setDocName(
			formatDocName(
				schemaData.document_name,
				AgencyLabelConversion[
					schemaData.document_comes_from as keyof typeof AgencyLabelConversion
				]
			)
		)
	} else if (
		// look for the documentName and see if it contains either the key or the value in the AgencyLabelConversion
		schemaData.document_name.includes(
			AgencyLabelConversion[
				schemaData.document_comes_from as keyof typeof AgencyLabelConversion
			]
		)
	) {
		setDocProvider(
			AgencyLabelConversion[
				schemaData.document_comes_from as keyof typeof AgencyLabelConversion
			]
		)
		setDocName(
			formatDocName(
				schemaData.document_name,
				AgencyLabelConversion[
					schemaData.document_comes_from as keyof typeof AgencyLabelConversion
				]
			)
		)
	} else {
		// Could not find the provider.
		setError({
			message: `Could not find a provider based upon the document_comes_from or document_name. Comes From:${schemaData.document_comes_from}, Name:${schemaData.document_name}, Kind:${schemaData.document_kind}, Type:${docType}`,
		})
		setManualReview(true)
		setSuggestion({
			docProvider: "",
			docType,
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
	// first check if the document_name or document_kind contains the word "check" (make sure its to lowercase)
	if (
		schemaData.document_name.toLowerCase().includes("check") ||
		schemaData.document_kind.toLowerCase().includes("check")
	) {
		setDocProvider(schemaData.document_comes_from)
		setDocType("Voided Check")
		setDocName(
			formatDocName("Voided Check", schemaData.document_comes_from)
		)
	} // final check if the document is a check
	else if (
		schemaData.document_kind.toLowerCase().includes("financial statement")
	) {
		// check if bankLabelConversion contains the document_comes_from in the values (to lowercase)
		if (
			Object.values(BankLabelConversion).some(
				(value) =>
					value.toLowerCase() === schemaData.document_comes_from
			)
		) {
			// We are certain that the document is a bank statement (list of verified bank/account statements)
			setDocProvider(
				BankLabelConversion[
					schemaData.document_comes_from as keyof typeof BankLabelConversion
				]
			)
			setDocType("Account Statement")
			setDocName(
				formatDocName(
					"Account Statement",
					schemaData.document_comes_from
				)
			)
		}

		// We are uncertain if the document is a bank statement but it's definately not a Earnings Statement and probably not a check
		setSuggestion({
			docProvider: schemaData.document_comes_from,
			docType: "Account Statement",
		})
		setManualReview(true)
		setError({
			message: `Could not find a provider based upon the document_comes_from or document_name. Comes From:${schemaData.document_comes_from}, Name:${schemaData.document_name}, Kind:${schemaData.document_kind}, Type:${docType}`,
		})
	} else {
		setError({
			message: `Could not find a provider based upon the document_comes_from or document_name. Comes From:${schemaData.document_comes_from}, Name:${schemaData.document_name}, Kind:${schemaData.document_kind}, Type:${docType}`,
		})
		setManualReview(true)
		setSuggestion({
			docProvider: "",
			docType: "",
		})
	}
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

	// First thing is to check what the docType is. If the docType === "budget" | "specification", then the doc type is "Earnings Statement"
	if (docType === "budget" || docType === "specification") {
		confirmedDocType = "Earnings Statement"
		// continue with the funnel for Earnings Statements
		processEarningsStatements(
			schemaData.document_name,
			docType,
			schemaData,
			setSuggestion,
			setDocProvider,
			setError,
			setDocName,
			setManualReview
		)
	} else {
		// the confirmed doc type is either "Voided Check" or "Account Statement"
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
	}

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
