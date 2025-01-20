import { Query, QueryWithNames } from "@/types"

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
 * MARK:				          🟩    MAIN FILE
 *==================================================
 */

export const tvaQueries: (QueryWithNames | Query)[] = [
	// When Query sheet is "completed", remove Query from the type options above and change Verified to true, for Validated Verified and Required Alias.
	/*
	 *==================================================
	 * MARK:						         EXISTING
	 *==================================================
	 */
	{
		Marker: "Pay Rate:",
		// comes back as "$xx.xx Annual". Will need to remove the "$" & "Annual" from the string.
		Text: "What is the Pay Rate:?",
		Alias: "baseSalary",
		Name: "baseSalary",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "NET PAY x Current",
		Text: "What is the Current NET PAY?",
		Alias: "netTakeHome",
		Name: "netTakeHome",
		Container: "basic",
		Verified: true,
	},
	/*
	 *==================================================
	 * MARK:	             NOT ORIGINALLY INCLUDED
	 *==================================================
	 */
	{
		// Medical MGS 00 shortened due to potential inconsistency
		Marker: "BEFORE-TAX DEDUCTIONS > Medical MGS x Current",
		Text: "In the BEFORE-TAX DEDUCTIONS table what is the Current Medical MGS 00?",
		Alias: "",
		Name: "medicalBeforeTax",
		Container: "deduction",
		Verified: true,
	},
	{
		// Medical MGS 00 shortened due to potential inconsistency
		Marker: "EMPLOYER PAID BENEFITS > Medical MGS x Current",
		Text: "In the EMPLOYER PAID BENEFITS table what is the Current Medical MGS 00?",
		Alias: "",
		Name: "medicalEmployer",
		Container: "employer",
		Verified: true,
	},
	{
		// Dental MGS 00 shortened due to potential inconsistency
		Marker: "BEFORE-TAX DEDUCTIONS > Dental MGS x Current",
		Text: "In the BEFORE-TAX DEDUCTIONS table what is the Current Dental MGS 00?",
		Alias: "",
		Name: "dentalBeforeTax",
		Container: "deduction",
		Verified: true,
	},
	{
		// Dental MGS 00 shortened due to potential inconsistency
		Marker: "EMPLOYER PAID BENEFITS > Dental MGS x Current",
		Text: "In the EMPLOYER PAID BENEFITS table what is the Current Dental MGS?",
		Alias: "",
		Name: "dentalEmployer",
		Container: "employer",
		Verified: true,
	},
	{
		// EMPLOYEE* May need removed... We'll see
		Marker: "BEFORE-TAX DEDUCTIONS > AD/D MGS/SPA EMPLOYEE x Current",
		Text: "In the BEFORE-TAX DEDUCTIONS table what is the Current AD/D MGS/SPA EMPLOYEE?",
		Alias: "",
		Name: "addMgsSpa",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EMPLOYER PAID BENEFITS > Core Life Insurance x Current",
		Text: "In the EMPLOYER PAID BENEFITS table what is the Current Core Life Insurance?",
		Alias: "",
		Name: "coreLife",
		Container: "employer",
		Verified: true,
	},
	{
		// returns "50k". Will need to convert to number.
		// at firt thought, I thought this may have gone to fegli.basic, but fegli.basic is a deduction, not a description of their coverage.
		Marker: "EMPLOYER PAID BENEFITS > Core Life Insurance",
		Text: "In the EMPLOYER PAID BENEFITS table what is the Core Life Insurance?",
		Alias: "",
		Name: "lifeInsuranceTotal",
		Container: "benefit",
		Verified: true,
	},
	{
		Marker: "BEFORE-TAX DEDUCTIONS > SUPP LIFE 2 MGS/SPA x Current",
		Text: "In the BEFORE-TAX DEDUCTIONS table what is the Current SUPP LIFE 2 MGS/SPA?",
		Alias: "",
		Name: "suppLife",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EMPLOYER PAID BENEFITS > SUPP LIFE 2 MGS/SPA x Current",
		Text: "In the EMPLOYER PAID BENEFITS table what is the Current SUPP LIFE 2 MGS/SPA?",
		Alias: "",
		Name: "suppLifeEmployer",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "BEFORE-TAX DEDUCTIONS > 401K x Current",
		Text: "In the BEFORE-TAX DEDUCTIONS table what is the Current 401K?",
		Alias: "",
		Name: "_401k",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > 401K x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current 401K?",
		Alias: "",
		Name: "_401kAfterTax",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EMPLOYER PAID BENEFITS > 401(k) Employer Automatic x Current",
		Text: "In the EMPLOYER PAID BENEFITS table what is the Current 401(k) Employer Automatic?",
		Alias: "",
		Name: "_401k",
		Container: "employer",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > SUPPL LIFE MGS/SPA SPOUSE x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current SUPPL LIFE MGS/SPA SPOUSE?",
		Alias: "",
		Name: "suppLifeAfterTax",
		Container: "deduction",
		Verified: false,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > FEGLI Basic Life MGS/SPA x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current FEGLI Basic Life MGS/SPA?",
		Alias: "",
		Name: "fegli.basic", // Verify that fegli.basic is always after-tax.
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "EMPLOYER PAID BENEFITS > FEGLI Basic Life MGS/SPA x Current",
		Text: "In the EMPLOYER PAID BENEFITS table what is the Current FEGLI Basic Life MGS/SPA?",
		Alias: "",
		Name: "fegli.basic",
		Container: "employer",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > FEGLI - Option A x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current FEGLI - Option A?",
		Alias: "",
		Name: "fegli.optionA",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > FEGLI - Option B x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current FEGLI - Option B?",
		Alias: "",
		Name: "fegli.optionB",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > FEGLI - Option C x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current FEGLI - Option C?",
		Alias: "",
		Name: "fegli.optionC",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > LONG TERM DISABILITY x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current LONG TERM DISABILITY?",
		Alias: "",
		Name: "disability",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > COMBINED FEDERAL x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current COMBINED FEDERAL?",
		Alias: "",
		Name: "federalCampain",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "AFTER-TAX DEDUCTIONS > DUES TVA ENGINEERS x Current",
		Text: "In the AFTER-TAX DEDUCTIONS table what is the Current DUES TVA ENGINEERS?",
		Alias: "",
		Name: "duesTVAEngineersAssoc",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "HOURS AND EARNINGS > Rate x STRAIGHT TIME",
		Text: "In the HOURS AND EARNINGS table what is the STRAIGHT TIME Rate?",
		Alias: "",
		Name: "rate",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "Hours x STRAIGHT TIME",
		Text: "What is the STRAIGHT TIME Hours?",
		Alias: "",
		Name: "payPeriodHours",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "TAXES > Fed OASDI/EE x Current",
		Text: "In the TAXES table what is the Current Fed OASDI/EE?",
		Alias: "",
		Name: "oasdi",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "TAXES > Fed MED/EE x Current",
		Text: "In the TAXES table what is the Current Fed MED/EE?",
		Alias: "",
		Name: "fedMedEE",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "TAXES > Fed Withholding x Current",
		Text: "In the TAXES table what is the Current Fed Withholding?",
		Alias: "",
		Name: "withholding",
		Container: "deduction",
		Verified: true,
	},
	{
		Marker: "Pay Begin Date:",
		Text: "What is the Pay Begin Date?",
		Alias: "",
		Name: "payPeriodStart",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "Pay End Date:",
		Text: "What is the Pay End Date?",
		Alias: "payPeriodEnd",
		Name: "payPeriodEnd",
		Container: "basic",
		Verified: true,
	},
	{
		Marker: "LEAVE INFORMATION > Annual Leave - Full Time x Balance",
		Text: "In the LEAVE INFORMATION table what is the Current Annual Leave - Full Time Balance?",
		Alias: "currentLeaveBalance",
		Name: "currentAnnualLeaveBalance",
		Container: "leave",
		Verified: true,
	},
	{
		Marker: "LEAVE INFORMATION > Sick Leave - Full Time x Balance",
		Text: "In the LEAVE INFORMATION table what is the Current Sick Leave - Full Time Balance?",
		Alias: "currentSickLeaveBalance",
		Name: "currentSickLeaveBalance",
		Container: "leave",
		Verified: true,
	},
	/*
	 *==================================================
	 * MARK:						         CODES
	 *==================================================
	 */
	{
		Marker: "",
		Text: "",
		Alias: "",
		Name: "",
		Container: "",
		Verified: false,
	},
]
