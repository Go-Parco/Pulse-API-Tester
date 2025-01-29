import { Query, QueryWithNames } from "@/types"

/*
 *==================================================
 * MARK:						         TYPES
 *==================================================
 */

type CurrentLeaveBalance = {
	Marker: string
	Verified: boolean // true
	Container: string
	Alias: "currentLeaveBalance"
	Name: "currentAnnualLeaveBalance"
}

/*
 *==================================================
 * MARK:						   COPY AND PASTE
 *==================================================

	{
		Marker: "",
		Text: "",
		Alias: "",
		Name: "",
		Container: "",
		Verified: false,
	},
	
 */

/*
 *==================================================
 * MARK:							🟪    MAIN FILE
 *==================================================
 */

export const usdaQueries: (QueryWithNames | Query | CurrentLeaveBalance)[] = [
	// When Query sheet is "completed", remove Query from the type options above and change Verified to true, for Validated Verified and Required Alias.
	/*
	 *==================================================
	 * MARK:						         EXISTING
	 *==================================================
	 */
	{
		Marker: "",
		Text: "What agency does this document come from?",
		Alias: "What agency does this document come from?",
		Name: "documentComesFrom",
		Container: "",
		Verified: true,
		VerifiedOutput: "RURAL DEVELOPMENT",
		PulseQuery: "document_comes_from",
		Tests: [
			{
				testString: "\bd{2}/d{2}/d{4} d{2}/d{2}/d{4}\b",
				ocr: "Pulse",
				status: "success",
			},
		],
	},
	{
		Marker: "name of this document",
		Text: "What is the name of this document?",
		Alias: "docName",
		Name: "docName",
		Container: "basic",
		Verified: true,
		VerifiedOutput: "Statement of EARNINGS AND LEAVE",
		PulseQuery: "document_name",
	},
	{
		Marker: "",
		Text: "",
		Alias: "",
		Name: "",
		Container: "",
		Verified: true,
		VerifiedOutput: "STATEMENT OF EARNINGS AND LEAVE",
		PulseQuery: "What kind of document is this?",
	},
	{
		Marker: "SCD FOR LEAVE",
		Text: "What is the SCD FOR LEAVE?",
		Alias: "dateOfHire",
		Name: "dateOfHire",
		Container: "basic",
		Verified: true,
		VerifiedOutput: "01/11/2015",
	},
	{
		Marker: "SALARY",
		Text: "What is the SALARY?",
		Alias: "baseSalary",
		Name: "baseSalary",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > P/P x NET PAY",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the NET PAY P/P?",
		Alias: "netTakeHome",
		Name: "netTakeHome",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "EARINGINS AND DEDUCTIONS > AMOUNT > FEGLI-COVERAGE x P/P",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the P/P x FEGLI-COVERAGE?",
		Alias: "fegliCoverage",
		Name: "fegli.basic",
		Container: "deduction",
		Verified: true,
		Code: "81",
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > CHKING/SAVING P/P",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the P/P x CHKING/SAVING?",
		Alias: "deduction.alotchecking",
		Name: "alotchecking",
		Container: "deduction",
		Verified: true,
		Code: "88",
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > VISION PLAN x P/P",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the VISION PLAN P/P?",
		Alias: "deduction.fdvv",
		Name: "fdvv",
		Container: "deduction",
		Verified: false, // no leave statement example to test. Also anything labelled P/P will output the P/P value at the top if it cant be found instead of resulting in 0.
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > DENTAL PLAN x P/P",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the DENTAL PLAN P/P?",
		Alias: "deduction.fdvd",
		Name: "fdvd",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > TSP-FERS x P/P",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the TSP-FERS P/P?",
		Alias: "tspContribution",
		Name: "tsp.contribution",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > FEHBA - ENROLL CODE 104 x P/P",
		Text: "In the EARNINGS AND DEDUCTIONS table in the DESCRIPTION table what is the P/P FEHBA - ENROLL CODE 104?",
		Alias: "healthInsurancePremium",
		Name: "healthInsurancePremium",
		Container: "deduction",
		Verified: true, // only works if including 104. I tried rearranging it with no differences.
	},
	{
		Marker: "YEAR TO DATE LEAVE STATUS > BALANCE x ANN",
		Text: "In the YEAR TO DATE LEAVE STATUS table what is the ANN BALANCE?",
		Alias: "currentLeaveBalance",
		Name: "currentAnnualLeaveBalance",
		Container: "leave",
		Verified: true,
	},
	{
		Marker: "YEAR TO DATE LEAVE STATUS > BALANCE x SICK",
		Text: "In the YEAR TO DATE LEAVE STATUS table what is the SICK BALANCE?",
		Alias: "currentSickLeaveBalance",
		Name: "currentSickLeaveBalance",
		Container: "leave",
		Verified: true,
	},
	/*
	 *==================================================
	 * MARK:	             NOT ORIGINALLY INCLUDED
	 *==================================================
	 */
	{
		Marker: "PAY PERIOD DATE MO DA YR MO DA YR",
		Text: "What is the PAY PERIOD DATE MO DA YR MO DA YR?",
		Alias: "",
		Name: "payPeriod",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "value between PERSNL OFFICE and GR.",
		Text: "What is the value between PERSNL OFFICE and GR?",
		Alias: "",
		Name: "payPlan",
		Container: "basic",
		Verified: true, // PAY PLAN produces incorrect result.
	},
	{
		Marker: "GR.",
		Text: "What is the GR.?",
		Alias: "",
		Name: "payGrade",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "STEP",
		Text: "What is the STEP?",
		Alias: "",
		Name: "payStep",
		Container: "basic",
		Verified: true,
	},
	{
		// Marker: "EARNINGS AND DEDUCTIONS > HOURS > REGULAR TIME x P/P", // Gets the regular hours // verified
		// Text: "In the EARNINGS AND DEDUCTIONS table in the HOURS table what is the REGULAR TIME P/P?",
		Marker: "EARNINGS AND DEDUCTIONS > HOURS > **** PAY PERIOD HOURS & GROSS PAY **** x P/P", // Gets the total hours // verified
		Text: "In the EARNINGS AND DEDUCTIONS table in the HOURS table what is the P/P **** PAY PERIOD HOURS & GROSS PAY ****",
		Alias: "",
		Name: "payPeriodHours",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > P/P x OASDI",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the OASDI P/P?",
		Alias: "",
		Name: "oasdi",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > P/P x RETIREMENT",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the RETIREMENT P/P?",
		Alias: "",
		Name: "retirement",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > P/P x FSA - HEALTHCARE",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the FSA - HEALTHCARE P/P?",
		Alias: "",
		Name: "fsa",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > AMOUNT > P/P x OPT FEGLI-AGE BRACKET",
		Text: "In the EARNINGS AND DEDUCTIONS table in the AMOUNT table what is the OPT FEGLI-AGE BRACKET P/P?",
		Alias: "",
		Name: "fegli.optional",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EARNINGS AND DEDUCTIONS > DESCRIPTION > FEGLI-COVERAGE$ ",
		Text: "In the EARNINGS AND DEDUCTIONS table in the DESCRIPTION table what is the FEGLI-COVERAGE$ ",
		Alias: "",
		Name: "fegli.coverage",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "RATE",
		Text: "What is the RATE?",
		Alias: "",
		Name: "rate",
		Container: "basic",
		Verified: true,
	},
	/*
	 *==================================================
	 * MARK:						         CODES
	 *==================================================
	 */
	{
		Marker: "EARNINGS AND DEDUCTIONS > DESCRIPTION > FEHBA - ENROLL CODE",
		Text: "In the EARNINGS AND DEDUCTIONS table in the DESCRIPTION table what is the FEHBA - ENROLL CODE?",
		Alias: "healthInsurancePremium",
		Name: "healthInsurancePremiumCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "FEHBA - ENROLL CODE",
		// CODE TO RIGHT - NOT THE CODE TO THE LEFT
		Text: "What is the FEHBA - ENROLL CODE?",
		Alias: "fehbCode",
		Name: "fehbCode",
		Container: "codes.deduction",
		Verified: true,
	},
	// fsaCode
	// annualLeaveCode
	// sickLeaveCode
	// otherLeaveCode
	// retirementCode
	// tsp.fersCode
	// oasdiCode
	// fegli.code
	// allotmentCode
	// fegli.optionalCode
	// tsp.loansCode
]
