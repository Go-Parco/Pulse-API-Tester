import { type Query, type QueryWithNames } from "@/types"

/*
 *==================================================
 * MARK:		   					     TYPES
 *==================================================
 */
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
 * MARK:			            	🩵    MAIN FILE
 *==================================================
 */

export const gsaQueries: (QueryWithNames | Query)[] = [
	// When Query sheet is "completed", remove Query from the type options above and change Verified to true, for Validated Verified and Required Alias.
	/*
	 *==================================================
	 * MARK:						         EXISTING
	 *==================================================
	 */
	{
		Marker: "name of this document",
		Text: "What is the name of this document?",
		Alias: "docName",
		Name: "docName",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "Basic Information > Service Comp Date",
		Text: "In the Basic Information table, what is the Service Comp Date?",
		Alias: "dateOfHire",
		Name: "dateOfHire",
		Container: "basic",
		Verified: true,
	},
	{
		// returns "$ 122,343.00". Need to remove the "$" and the "," and trim the whitespace. The formatToNumber() function will handle this.
		Marker: "Annual Salary",
		Text: "What is the Annual Salary?",
		Alias: "baseSalary",
		Name: "baseSalary",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "Net Pay x Current",
		Text: "What is the Current Net Pay?",
		Alias: "netTakeHome",
		Name: "netTakeHome",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > Savings Allotments x Current",
		Text: "What is the Current Savings Allotments?",
		Alias: "deduction.alotSaving",
		Name: "alotSaving",
		Container: "deduction",
		Verified: true,
	},
	{
		// Not outputting - tried many different queries, but none worked.
		Marker: "DEDUCTIONS > Dental x Current",
		Text: "In the DEDUCTIONS table what is the Current Dental?",
		Alias: "deduction.fdvd",
		Name: "fdvd",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > TSP Employee x Current",
		Text: "In the DEDUCTIONS table what is the Current TSP Employee?",
		Alias: "tspContribution",
		Name: "tspContribution",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > HBI x Current",
		Text: "In the DEDUCTIONS table what is the Current HBI?",
		Alias: "healthInsurancePremium",
		Name: "healthInsurancePremium",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "LEAVE > Ending Bal x Annual Leave",
		Text: "In the LEAVE table what is the Annual Leave Ending Bal?",
		Alias: "currentLeaveBalance",
		Name: "currentAnnualLeaveBalance",
		Container: "leave",
		Verified: true,
	},
	{
		Marker: "LEAVE > Ending Bal x Sick Leave",
		Text: "In the LEAVE table what is the Sick Leave Ending Bal?",
		Alias: "currentSickBalance",
		Name: "currentAnnualSickBalance",
		Container: "leave",
		Verified: true,
	},
	/*
	 *==================================================
	 * MARK:	             NOT ORIGINALLY INCLUDED
	 *==================================================
	 */
	{
		// Not outputting - Trying to figure out how to return the value under the "DEDUCTIONS" table. Returning the Benefits Paid table value instead. Added to Readme.md
		// Also verify that the deduction.medicare is always before tax. Added to the concerns.md
		Marker: "DEDUCTIONS > Medicare x Current",
		Text: "In the DEDUCTIONS table what is the Current Medicare?",
		Alias: "",
		Name: "medicalBeforeTax",
		Container: "deduction",
		Verified: false,
	},
	{
		Marker: "DEDUCTIONS > GLI Basic Employee x Current",
		Text: "In the DEDUCTIONS table what is the Current GLI Basic Employee?",
		Alias: "",
		Name: "fegli.basic",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > FEGLI x Current",
		Text: "In the BENEFITS PAID BY GOVT. table what is the Current FEGLI?",
		Alias: "",
		Name: "fegli.basic",
		Container: "benefit",
		Verified: true,
	},
	{
		// No Example, but if ran without an option A, it will return the option B value. Added to the concerns.md
		Marker: "DEDUCTIONS > GLI OPT A x Current",
		Text: "In the DEDUCTIONS table what is the Current GLI OPT A?",
		Alias: "",
		Name: "fegli.optionA",
		Container: "deduction",
		Verified: false,
	},
	{
		Marker: "DEDUCTIONS > GLI OPT B x Current",
		Text: "In the DEDUCTIONS table what is the Current GLI OPT B?",
		Alias: "",
		Name: "fegli.optionB",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > GLI OPT C x Current",
		Text: "In the DEDUCTIONS table what is the Current GLI OPT C?",
		Alias: "",
		Name: "fegli.optionC",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "FOR PAY PERIOD ENDING",
		Text: "What is the FOR PAY PERIOD ENDING?",
		Alias: "",
		Name: "paryPeriodEnd",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "Pay Plan/Grade/Step",
		Text: "What is the Pay Plan/Grade/Step?",
		Alias: "",
		Name: "payPlanGradeStep",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "EARNINGS > Hours x Base Pay",
		Text: "In the EARNINGS table what is the Base Pay Hours?",
		Alias: "",
		Name: "payPeriodHours",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > OASDI x Current",
		Text: "In the BENEFITS PAID BY GOVT. table what is the Current OASDI?",
		Alias: "",
		Name: "oasdi",
		Container: "benefit",
		Verified: true,
	},
	{
		// Not outputting. Returning Benefits Paid > OASDI value instead. Added to the README.md
		Marker: "DEDUCTIONS > OASDI x Current",
		Text: "In the DEDUCTIONS table what is the Current OASDI?",
		Alias: "",
		Name: "oasdi",
		Container: "deduction",
		Verified: false,
	},
	{
		Marker: "DEDUCTIONS > Retire FERS Employee x Current",
		Text: "In the DEDUCTIONS table what is the Current Retire FERS Employee?",
		Alias: "",
		Name: "retirement",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > Flexible Spending Account x Current",
		Text: "In the DEDUCTIONS table what is the Current Flexible Spending Account?",
		Alias: "",
		Name: "fsa",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > FEHB x Current",
		Text: "In the BENEFITS PAID BY GOVT. table what is the Current FEHB?",
		Alias: "",
		Name: "fehb",
		Container: "benefit",
		Verified: true,
	},
	{
		// Not outputting - It's returning Benefits Paid > Current Medicare value instead. Added to the README.md
		Marker: "DEDUCTIONS > Medicare x Current",
		Text: "In the DEDUCTIONS table what is the Current Medicare?",
		Alias: "",
		Name: "fedMedEE",
		Container: "deduction",
		Verified: false,
	},
	{
		Marker: "Federal x Addtl Wthhld",
		Text: "In the DEDUCTIONS table what is the Federal x Addtl Wthhld?",
		Alias: "",
		Name: "withholdingFed",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "Addtl Wthhld x State",
		Text: "What is the State Addtl Wthhld?",
		Alias: "",
		Name: "withholdingState",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > TSP Basic x Current",
		Text: "In the BENEFITS PAID BY GOVT. table what is the Current TSP Basic?",
		Alias: "",
		Name: "tsp.basic",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > TSP MATCHING x Current",
		Text: "In the BENEFITS PAID BY GOVT. table what is the Current TSP MATCHING?",
		Alias: "",
		Name: "tsp.matching",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > FERS/CSRS x Current",
		Text: "In the BENEFITS PAID BY GOVT. table what is the Current FERS/CSRS?",
		Alias: "",
		Name: "fers",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > Medicare x Current",
		Text: "In the BENEFITS PAID BY GOVT. table what is the Current Medicare?",
		Alias: "",
		Name: "medicarePaidByGov",
		Container: "benefit",
		Verified: true,
	},
	/*
	 *==================================================
	 * MARK:						         CODES
	 *==================================================
	 */
	{
		Marker: "FEGLI Code",
		Text: "What is the FEGLI Code?",
		Alias: "",
		Name: "fegli.bracketCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "Basic Information > FEHBA Code",
		Text: "In the Basic Information table, what is the FEHBA Code?",
		Alias: "fehbCode",
		Name: "fehbCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "Retirement Code",
		Text: "What is the Retirement Code?",
		Alias: "",
		Name: "retirementCode",
		Container: "codes.deduction",
		Verified: true,
	},
]
