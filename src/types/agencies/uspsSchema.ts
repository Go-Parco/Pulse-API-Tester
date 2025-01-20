import { z } from "zod"

const uspsBasicSchema = z.object({
	// NO Date of Hire
	// baseSalary - no example
	// fers - none
	// medicarePaidByGovernment - none
	// netTakeHome - no example
	// payPeriod - none
	payPeriodStart: z.string().regex(/^(\d{2}- \d{2}|\d{2} \d{2})$/, {
		message: "Invalid pay period format. Expected DD- DD or xx xx",
	}),
	// payPeriodEnd - none
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
	// rate - none
})

const uspsBenefitSchema = z.object({
	// benefit -none
	// lifeInsuranceTotal - none
	// oasdi - none
	// tsp: z.object({
	// basic: - none
	// matching: - none
	// }),
})

const uspsLeaveSchema = z.object({
	currentAnnualLeaveBalance: z.number().positive(),
	currentSickLeaveBalance: z.number().positive(),
})

const uspsEmployerSchema = z.object({
	// coreLife - none
	// _401k - none
	// 	fegli: z.object({
	//	basic: - none
	//}),
})

const uspsCodesSchema = z.object({
	basic: z.object({
		annualLeaveCode: z.string(),
		sickLeaveCode: z.string(),
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
		retirementCode: z.string(),
		tsp: z.object({
			fersCode: z.string(),
			loansCode: z.string(),
		}),
	}),
})

const uspsDeductionSchema = z.object({
	// _401k - none
	// _401kAfterTax - none
	// adsMgsSpa - none
	// alotChecking: z.number({message: "alotChecking must be a number"}).positive(),
	// alotSaving - no example
	// dentalBeforeTax - none
	// dentalEmployer - none
	// dentalVision - none
	// duesTVAEngineersAssoc - none
	// federalCampaign - none
	// fedMedEE - none
	// fedMedER - none
	// fegli: z.object({
	//	basic: z.number().positive(),
	//  coverage: z.string(),
	// optionA - none
	// optionB - none
	// optionC - none
	// optional - none
	// })
	// disibility - none
	// medicalBeforeTax - none
	// medicalEmployer - none
	// oasdi - none
	// retirement - none
	// suppLife - none
	// suppLifeAfterTax - none
	// suppLifeEmployer - none
	// tsp: z.object({
	//	savings - none
	//	loans - none
	// }),
	// withholding - none
	// withholdingFed - none
	// withholdingState - none
})

export {
	uspsBasicSchema,
	uspsBenefitSchema,
	uspsEmployerSchema,
	uspsLeaveSchema,
	uspsCodesSchema,
	uspsDeductionSchema,
}
