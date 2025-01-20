import { z } from "zod"

const gsaBasicSchema = z.object({
	dateOfHire: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	baseSalary: z.number().positive(),
	netTakeHome: z.number().positive(),
	// payPeriod - none
	// payPeriodStart - none
	payPeriodEnd: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	payPlanGradeStep: z
		.string()
		.regex(/^[A-Za-z0-9]{2} [A-Za-z0-9]{2} [A-Za-z0-9]{2}$/, {
			message: "Invalid format. Expected XX XX XX",
		}),
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
	oasdi: z.number().positive(), // can be a decimal
	// rate - none
})

const gsaBenefitSchema = z.object({
	basic: z.number().positive(),
	fehb: z.number().positive(),
	fers: z.number().positive(),
	// lifeInsuranceTotal - none
	// 	fegli: z.object({
	//	basic: - none
	//}),
	// oasdi - none
	tsp: z.object({
		basic: z.number().positive(),
		matching: z.number().positive(),
	}),
})

const gsaLeaveSchema = z.object({
	currentAnnualLeaveBalance: z.number().positive(),
	currentSickLeaveBalance: z.number().positive(),
})

const gsaEmployerSchema = z.object({
	// _401k - none
	// coreLife - none
})

const gsaCodesSchema = z.object({
	deduction: z.object({
		fegli: z.object({
			bracketCode: z.string(),
		}),
		fehbCode: z.string(),
		retirementCode: z.string(),
	}),
})

const gsaDeductionSchema = z.object({
	// _401k - none
	// _401kAfterTax - none
	// adsMgsSpa - none
	// alotChecking - none
	alotSaving: z.number().positive(),
	// dentalBeforeTax - none
	// dentalEmployer - none
	// dentalVision - none
	// disibility - none
	// duesTVAEngineersAssoc - none
	// federalCampaign - none
	fdvd: z.number().positive(),
	// fdvv - none
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
	fsa: z.number().positive(),
	healthInsurancePremium: z.number().positive(),
	medicalBeforeTax: z.number().positive(),
	oasdi: z.number().positive(),
	retirement: z.number().positive(),
	// suppLife - none
	// suppLifeAfterTax - none
	// suppLifeEmployer - none
	tsp: z.object({
		contribution: z.number().positive(),
		//	savings - none
		//	loans - none
	}),
	// withholding - none
	witholdingFed: z.number().positive(),
	withholdingState: z.number().positive(),
})

export {
	gsaBasicSchema,
	gsaBenefitSchema,
	gsaEmployerSchema,
	gsaLeaveSchema,
	gsaCodesSchema,
	gsaDeductionSchema,
}
