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
 * MARK:				              🟧    MAIN FILE
 *==================================================
 */

export const doeQueries: (QueryWithNames | Query)[] = [
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
		Marker: "Annual Salary",
		Text: "What is the Annual Salary?",
		Alias: "baseSalary",
		Name: "baseSalary",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "Your Pay Consists of > Net Pay x Current",
		Text: "In the Your Pay Consists of table What is the Current Net Pay?",
		Alias: "netTakeHome",
		Name: "netTakeHome",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > TSP Tax Deferred x Current",
		Text: "In the DEDUCTIONS table, what is the Current TSP Tax Deferred?",
		Alias: "tspContribution",
		Name: "tsp.contribution",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > Health Benefits - Pretax x Current",
		Text: "In the DEDUCTIONS table, what is the Current Health Benefits - Pretax?",
		Alias: "healthInsurancePremium",
		Name: "healthInsurancePremium",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "LEAVE > Annual Leave x Lv Current",
		Text: "In the LEAVE table, what is the Lv Current Annual Leave?",
		Alias: "currentLeaveBalance",
		Name: "currentAnnualLeaveBalance",
		Container: "leave",
		Verified: true,
	},
	{
		Marker: "LEAVE > Sick Leave x Lv Current",
		Text: "In the LEAVE table, what is the Lv Current Sick Leave?",
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
		Marker: "DEDUCTIONS > Dental/Vision x Current",
		Text: "In the DEDUCTIONS table, what is the Current Dental/Vision?",
		Alias: "",
		Name: "dentalVision",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "Pay Begin Date",
		Text: "What is the Pay Begin Date?",
		Alias: "",
		Name: "payPeriodStart",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "For Pay Period Ending",
		Text: "What is the For Pay Period Ending?",
		Alias: "",
		Name: "payPeriodEnd",
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
		Marker: "EARNINGS > Hours",
		Text: "In the EARNINGS table, what is the Hours?",
		Alias: "",
		Name: "payPeriodHours",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > OASDI x Current",
		Text: "In the BENEFITS PAID BY GOVT. table, what is the Current OASDI?",
		Alias: "",
		Name: "oasdi",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > OASDI Tax x Current",
		Text: "In the DEDUCTIONS table, what is the Current OASDI Tax?",
		Alias: "",
		Name: "oasdi",
		Container: "deduction",
		Verified: false, // not working, it's returning the code. Added to Readme.md
	},
	{
		Marker: "DEDUCTIONS > Retirement - FERS x Current",
		Text: "In the DEDUCTIONS table, what is the Current Retirement - FERS?",
		Alias: "",
		Name: "retirement",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "Hourly Rate",
		Text: "What is the Hourly Rate?",
		Alias: "",
		Name: "rate",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > FEHB x Current",
		Text: "In the BENEFITS PAID BY GOVT. table, what is the Current FEHB?",
		Alias: "",
		Name: "fehb",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "Addtl Wthhld x Federal",
		Text: "What is the Federal Addtl Wthhld?",
		Alias: "",
		Name: "withholdingFed",
		Container: "deduction",
		Verified: false, // not working, it's returning nothing. Added to Readme.md
	},
	{
		Marker: "Addtl Wthhld x State",
		Text: "What is the State Addtl Wthhld?",
		Alias: "",
		Name: "withholdingState",
		Container: "deduction",
		Verified: false, // not working, it's returning nothing. Added to Readme.md
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > TSP Matching x Current",
		Text: "In the BENEFITS PAID BY GOVT. table, what is the Current TSP Matching?",
		Alias: "",
		Name: "tsp.matching",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > FERS x Current",
		Text: "In the BENEFITS PAID BY GOVT. table, what is the Current FERS?",
		Alias: "",
		Name: "fers",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BENEFITS PAID BY GOVT. > Medicare x Current",
		Text: "In the BENEFITS PAID BY GOVT. table, what is the Current Medicare?",
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
		Marker: "DEDUCTIONS > Health Benefits - Pretax x Misc",
		Text: "In the DEDUCTIONS table, what is the Misc Health Benefits - Pretax?",
		Alias: "fehbCode",
		Name: "fehbCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > OASDI TAX x Misc",
		Text: "In the DEDUCTIONS table, what is the Misc OASDI TAX?",
		Alias: "",
		Name: "oasdiCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > Misc x Retirement- FERS",
		Text: "In the DEDUCTIONS table, what is the Misc Retirement - FERS?",
		Alias: "",
		Name: "retirementCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "DEDUCTIONS > Misc x Medicare Tax",
		Text: "In the DEDUCTIONS table, what is the Misc Medicare Tax?",
		Alias: "",
		Name: "medicareCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "Basic Information > Organization Code",
		Text: "In the Basic Information table, what is the Organization Code?",
		Alias: "",
		Name: "medicareCode",
		Container: "codes.deduction",
		Verified: true,
	},
	{
		Marker: "Basic Information > Organization Code",
		Text: "In the Basic Information table, what is the Organization Code?",
		Alias: "",
		Name: "organizationCode",
		Container: "codes.basic",
		Verified: true,
	},
]
