"use server"
// api/mock_api
import { NextResponse } from "next/server"

const responses = {
	name: "Earnings and Leave Statement",
	netTakeHome: "1500",
	alotSaving: "89",
	tspContribution: "100",
	healthInsurancePremium: "200",
	currentLeaveBalance: "80",
	currentSickLeaveBalance: "40",
	fdvd: "20",
	medicalBeforeTax: "30",
	medicalEmployer: "40",
	dentalVision: "50",
	dentalBeforeTax: "60",
	dentalEmployer: "70",
	coreLife: "80",
	lifteInsuranceTotal: "90",
	suppLife: "100",
	_401k: "110",
	_401kAfterTax: "120",
	disability: "130",
	federalCampaign: "140",
	baseSalary: "75000",
	dateOfHire: "2023-01-01",
	payPeriod: "26",
	payPeriodStart: "2024-01-01",
	payPeriodEnd: "2024-01-14",
	payPlanGradeStep: "GS-12-3",
	payPlan: "GS",
	payGrade: "12",
	payStep: "3",
	oasdi: "160",
	retirement: "170",
	fsa: "180",
	rate: "36.50",
	fehb: "190",
	fedMedEE: "200",
	fedMedRR: "210",
	withholding: "220",
}

// This is a mock API that simulates a server response. it gives what is asked for but limits the responses
// Get Request that takes in the name of an array of items: strings and returns the item[name] from the responses object

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		// If responses parameter exists, unify the responses
		const responsesParam = searchParams.get("responses")
		if (responsesParam) {
			const parsedResponses = JSON.parse(responsesParam)
			const combinedData = parsedResponses.reduce(
				(acc: any, curr: any) => ({ ...acc, ...curr }),
				{}
			)
			// Get the total undefined count from the query parameter
			const totalUndefined = parseInt(
				searchParams.get("totalUndefined") || "0"
			)
			return NextResponse.json({
				data: combinedData,
				undefinedCount: totalUndefined,
			})
		}

		// Handle individual item requests
		const itemsParam = searchParams.get("item")
		if (itemsParam) {
			const requestedItems = itemsParam.split(",")
			const result: Record<string, string | undefined> = {}
			let undefinedCount = 0

			requestedItems.forEach((item) => {
				const value =
					item in responses
						? responses[item as keyof typeof responses]
						: undefined
				result[item] = value
				if (value === undefined) undefinedCount++
			})

			return NextResponse.json({ data: result, undefinedCount })
		}

		return NextResponse.json({ error: "No valid parameters provided" })
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
