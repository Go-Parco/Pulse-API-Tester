import { z } from "zod"

// replace "irs" with the irs name
// terminology:
// - Schema (refers to zod schema)
// - Type (refers to TypeScript Type)

const irsBasicSchema = z.object({
	dateOfHire: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	baseSalary: z.number().positive(),
	netTakeHome: z.number().positive(),
	payPeriod: z
		.string()
		.regex(
			/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4} (0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
			{
				message:
					"Invalid pay period format. Expected MM/DD/YYYY MM/DD/YYYY",
			}
		),
	payPeriodStart: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}), // USPS format does not match this regex. lmk if you want to merge the two to account for both formats.
	payPeriodEnd: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	payPlanGradeStep: z.string().regex(/^NH \d{2} \d{2}$/, {
		message: "Invalid format. Expected NH 03 00",
	}),
	payPlan: z.string().regex(/^[A-Z]{2}$/, {
		message: "Invalid format. Expected XX",
	}),
	payGrade: z.string().regex(/^\d{2}$/, {
		message: "Invalid format. Expected 00",
	}),
	payStep: z.string().regex(/^\d{2}$/, {
		message: "Invalid format. Expected 00",
	}),
	payPeriodHours: z.literal("80").or(
		z.number().refine((val) => val === 80, {
			message: "payPeriodHours must equal 80.",
		})
	),
})

const irsBenefitSchema = z.object({
	basic: z.number().positive(),
	lifeInsuranceTotal: z.number().positive(),
	fehb: z.number().positive(),
	fers: z.number().positive(),
	tsp: z.object({
		basic: z.number().positive(),
		matching: z.number().positive(),
	}),
})

const irsEmployerSchema = z.object({
	_401k: z.number().positive(),
	coreLife: z.number().positive(),
	fegli: z.object({
		basic: z.number().positive(),
	}),
})

const irsLeaveSchema = z.object({
	currentAnnualLeaveBalance: z.number().positive(),
	currentSickLeaveBalance: z.number().positive(),
})

const irsCodesSchema = z.object({
	basic: z.object({
		annualLeaveCode: z.string(),
		sickLeaveCode: z.string(),
		organizationCode: z.string(),
		otherLeaveCode: z.string(),
	}),
	deduction: z.object({
		annualLeaveCode: z.string(),
		allotmentCode: z.string(),
		fegli: z.object({
			bracketCode: z.string(),
			code: z.string(),
			optionalCode: z.string(),
		}),
		fehbCode: z.string(),
		fsaCode: z.string(),
		healthInsurancePremiumCode: z.string(),
		medicareCode: z.string(),
		oasdiCode: z.string(),
		retirementCode: z.string(),
		tsp: z.object({
			fersCode: z.string(),
			loansCode: z.string(),
		}),
	}),
})

const irsDeductionSchema = z.object({
	_401k: z.number().positive(),
	_401kAfterTax: z.number().positive(),
	adsMgsSpa: z.number().positive(),
	alotChecking: z
		.number({ message: "alotChecking must be a number" })
		.positive(),
	alotSaving: z.number().positive(),
	dentalVision: z.number().positive(),
	dentalBeforeTax: z.number().positive(),
	dentalEmployer: z.number().positive(),
	disability: z.number().positive(),
	duesTVAEngineersAssoc: z.number().positive(),
	fdvv: z.number().positive(),
	fdvd: z.number().positive(),
	federalCampaign: z.number().positive(),
	fedMedEE: z.number().positive(),
	// fedMedER - none
	fegli: z.object({
		basic: z.number().positive(),
		coverage: z.number().positive(),
		optionA: z.number().positive(),
		optionB: z.number().positive(),
		optionC: z.number().positive(),
		optional: z.number().positive(),
	}),
	fsa: z.number().positive(),
	healthInsurancePremium: z.number().positive(),
	medicalBeforeTax: z.number().positive(),
	medicalEmployer: z.number().positive(),
	oasdi: z.number().positive(),
	retirement: z.number().positive(),
	suppLife: z.number().positive(),
	suppLifeAfterTax: z.number().positive(),
	suppLifeEmployer: z.number().positive(),
	tsp: z.object({
		contribution: z.number().positive(),
		savings: z.number().positive(),
		loans: z.number().positive(),
	}),
	witholding: z.number().positive(),
	witholdingFed: z.number().positive(),
	witholdingState: z.number().positive(),
})

export {
	irsBasicSchema,
	irsBenefitSchema,
	irsLeaveSchema,
	irsEmployerSchema,
	irsCodesSchema,
	irsDeductionSchema,
}
