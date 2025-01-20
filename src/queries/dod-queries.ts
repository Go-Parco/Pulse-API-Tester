import { Query, QueryWithNames } from "@/types"

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
 * MARK:				 🟥    MAIN FILE
 *==================================================
 */

export const dodQueries: (QueryWithNames | Query)[] = [
	// When Query sheet is "completed", remove Query from the type options above and change Verified to true, for Validated Verified and Required Alias.
	/*
	 *==================================================
	 * MARK:						         EXISTING
	 *==================================================
	 */
	{
		Marker: "name of this document",
		Text: "What is the name of this document?",
		Alias: "",
		Name: "docName",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "SCD Leave",
		Text: "What is the SCD Leave?",
		Alias: "dateOfHire",
		Name: "dateOfHire",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "Basic Pay + Locality/Market Adj = Adjusted Basic Pay",
		Text: "What is the Basic Pay + Locality/Market Adj = Adjusted Basic Pay?",
		Alias: "baseSalary",
		Name: "baseSalary",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "NET PAY x Current",
		Text: "What is the CURRENT NET PAY?",
		Alias: "netTakeHome",
		Name: "netTakeHome",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > FEGLI x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT FEGLI?",
		Alias: "fegliCoverage",
		Name: "fegliCoverage",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > ALLOTMENT, SV x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT ALLOTMENT, SV?",
		Alias: "deduction.alotchecking",
		Name: "alotchecking",
		Container: "deduction",
		Verified: true,
	},
	{
		// NOT CURRENTLY FOUND IN THE EXAMPLE LEAVE FORM. ( Added for likelyhood. Remove / edit later if incorrect.)
		Marker: "DEDUCTIONS > VISION x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT VISION?",
		Alias: "deduction.fdvv",
		Name: "fdvv",
		Container: "deduction",
		Verified: false,
	},
	{
		Marker: "DEDUCTIONS > DENTAL x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT DENTAL?",
		Alias: "deduction.fdvd",
		Name: "fdvd",
		Container: "deduction",
		Verified: true,
	},
	// tsp.contribution ( not present on example )
	{
		Marker: "DEDUCTIONS > 112 x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT 112?",
		Alias: "healthInsurancePremium",
		Name: "healthInsurancePremium",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "LEAVE > ANNUAL x CURRENT BALANCE",
		Text: "In the LEAVE table what is the CURRENT ANNUAL BALANCE?",
		Alias: "currentLeaveBalance",
		Name: "currentLeaveBalance",
		Container: "leave",
		Verified: true,
	},
	{
		Marker: "LEAVE > SICK x CURRENT BALANCE",
		Text: "In the LEAVE table what is the CURRENT SICK BALANCE?",
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
		Marker: "PAY PERIOD END",
		Text: "What is the PAY PERIOD END?",
		Alias: "",
		Name: "payPeriodEnd",
		Container: "basic",
		Verified: false,
	},
	{
		Marker: "4. Pay Plan/Grade/Step",
		Text: "What is the 4. Pay Plan/Grade/Step?",
		Alias: "",
		Name: "payPlanGradeStep",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "CURRENT EARNINGS > REGULAR PAY x HOURS/DAYS",
		Text: "In the CURRENT EARNINGS table what is the HOURS/DAYS REGULAR PAY?",
		Alias: "",
		Name: "payPeriodHours",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVERNMENT FOR YOU > OASDI x CURRENT",
		Text: "In the BENEFITS PAID BY GOVERNMENT FOR YOU table what is the CURRENT OASDI?",
		Alias: "",
		Name: "oasdi",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > OASDI x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT OASDI?",
		Alias: "",
		Name: "oasdi",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > K x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT K?",
		Alias: "",
		Name: "retirement",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > FSA-HC x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT FSA-HC?",
		Alias: "",
		Name: "fsa",
		Container: "deduction",
		Verified: true,
	},
	// basic.rate ( it's a "Basic OT Rate". Not sure if the basic.rate should be overtime or standard hourly pay equivelant.)
	{
		Marker: "BENEFITS PAID BY GOVERNMENT FOR YOU > FEHB x CURRENT",
		Text: "In the BENEFITS PAID BY GOVERNMENT FOR YOU table what is the CURRENT FEHB?",
		Alias: "",
		Name: "fehb",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVERNMENT FOR YOU > FEGLI x CURRENT",
		Text: "In the BENEFITS PAID BY GOVERNMENT FOR YOU table what is the CURRENT FEGLI?",
		Alias: "",
		Name: "fegli.basic",
		Container: "benefit",
		Verified: true,
	},
	{
		// This one is very very very difficult to retrieve the value back from
		Marker: "DEDUCTIONS > D0 x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT D0?",
		Alias: "",
		Name: "fegli.basic",
		Container: "deduction",
		Verified: false,
	},
	{
		Marker: "DEDUCTIONS > FEGLI OPTNL x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT FEGLI OPTNL?",
		Alias: "",
		Name: "fegli.optional",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVERNMENT FOR YOU > TSP BASIC x CURRENT",
		Text: "In the BENEFITS PAID BY GOVERNMENT FOR YOU table what is the CURRENT TSP BASIC?",
		Alias: "",
		Name: "tsp.basic",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > TSP SAVINGS x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT TSP SAVINGS?",
		Alias: "",
		Name: "tsp.savings",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > 520005G x CURRENT",
		Text: "In the DEDUCTIONS table what is the CURRENT 520005G?",
		Alias: "",
		Name: "tsp.loans",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVERNMENT FOR YOU > TSP MATCHING x CURRENT",
		Text: "In the BENEFITS PAID BY GOVERNMENT FOR YOU table what is the CURRENT TSP MATCHING?",
		Alias: "",
		Name: "tsp.matching",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVERNMENT FOR YOU > RETIRE, FERS x CURRENT",
		Text: "In the BENEFITS PAID BY GOVERNMENT FOR YOU table what is the CURRENT RETIRE, FERS?",
		Alias: "",
		Name: "fers",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVERNMENT FOR YOU > MEDICARE x CURRENT",
		Text: "In the BENEFITS PAID BY GOVERNMENT FOR YOU table what is the CURRENT MEDICARE?",
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
		Marker: "DEDUCTIONS > CODE x FEGLI OPTNL",
		Text: "In the DEDUCTIONS table what is the FEGLI OPTNL CODE?",
		Alias: "",
		Name: "fegli.bracketCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > CODE x FEHB",
		Text: "In the DEDUCTIONS table what is the FEHB CODE?",
		Alias: "fehbCode",
		Name: "fehbCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > CODE x RETIRE, FERS",
		Text: "In the DEDUCTIONS table what is the RETIRE, FERS CODE?",
		Alias: "",
		Name: "retirementCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > CODE x FEGLI",
		Text: "In the DEDUCTIONS table what is the FEGLI CODE?",
		Alias: "",
		Name: "fegli.code",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > CODE x ALLOTMENT, SV",
		Text: "In the DEDUCTIONS table what is the ALLOTMENT, SV CODE?",
		Alias: "",
		Name: "allotmentCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		// codes.deduction.fegli.optionalCode is the Same marker and output as the codes.deduction.fegliBracket. Should be one or the other.
		Marker: "DEDUCTIONS > CODE x FEGLI OPTNL",
		Text: "In the DEDUCTIONS table what is the FEGLI OPTNL CODE?",
		Alias: "",
		Name: "fegli.optionalCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > CODE x TSP LOANS",
		Text: "In the DEDUCTIONS table what is the TSP LOANS CODE?",
		Alias: "",
		Name: "tsp.loansCode",
		Container: "codes.deduction",
		Verified: false,
	},
]
