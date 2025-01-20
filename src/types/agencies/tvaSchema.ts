import { z } from "zod"

const tvaBasicSchema = z.object({
	// dateOfHire - none
	baseSalary: z.number().positive(),
	netTakeHome: z.number().positive(),
	// payPeriod - none
	payPeriodStart: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	payPeriodEnd: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	// payPlanGradeStep - none
	// payPlan - none
	// payGrade - none
	// payStep - none
	payPeriodHours: z
		.literal("80")
		.or(
			z
				.number()
				.refine((val) => val === 80, {
					message: "payPeriodHours must equal 80.",
				})
		),
	rate: z.number().positive(),
})

const tvaBenefitSchema = z.object({
	// benefit -none
	// fers - none
	lifeInsuranceTotal: z.number().positive(),
	// medicarePaidByGovernment - none
	// oasdi - none
	// fehb - none
	// tsp: z.object({
	// basic: - none
	// matching: - none
	// }),
})

const tvaLeaveSchema = z.object({
	currentAnnualLeaveBalance: z.number().positive(),
	currentSickLeaveBalance: z.number().positive(),
})

const tvaEmployerSchema = z.object({
	_401k: z.number().positive(),
	coreLife: z.number().positive(),
	fegli: z.object({
		basic: z.number().positive(),
	}),
})

const tvaCodesSchema = z.object({
	//- none
})

const tvaDeductionSchema = z.object({
	_401k: z.number().positive(),
	_401kAfterTax: z.number().positive(),
	adsMgsSpa: z.number().positive(),
	// alotChecking - none
	// alotSaving - no example
	dentalBeforeTax: z.number().positive(),
	dentalEmployer: z.number().positive(),
	// dentalVision - none
	disability: z.number().positive(),
	duesTVAEngineersAssoc: z.number().positive(),
	// fdvv - none
	// fdvd - none
	federalCampaign: z.number().positive(),
	fedMedEE: z.number().positive(),
	// fedMedER - none
	fegli: z.object({
		basic: z.number().positive(),
		//  coverage - none
		optionA: z.number().positive(),
		optionB: z.number().positive(),
		optionC: z.number().positive(),
		// optional - none
	}),
	// fsa - none
	// healthInsurancePremium: none
	medicalBeforeTax: z.number().positive(),
	medicalEmployer: z.number().positive(),
	oasdi: z.number().positive(),
	// retirement - none
	suppLife: z.number().positive(),
	suppLifeAfterTax: z.number().positive(),
	suppLifeEmployer: z.number().positive(),
	// tsp: z.object({
	// contribution - none
	//	savings - none
	//	loans - none
	//}),
	witholding: z.number().positive(),
	// withholdingFed - none
	// withholdingState - none
})

export {
	tvaBasicSchema,
	tvaBenefitSchema,
	tvaEmployerSchema,
	tvaLeaveSchema,
	tvaCodesSchema,
	tvaDeductionSchema,
}
