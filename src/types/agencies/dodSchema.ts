import { z } from "zod"

const dodBasicSchema = z.object({
	// Tripple Checked
	dateOfHire: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	baseSalary: z.number().positive(),
	netTakeHome: z.number().positive(),
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
	payPeriodHours: z
		.literal("80")
		.or(
			z
				.number()
				.refine((val) => val === 80, {
					message: "payPeriodHours must equal 80.",
				})
		),
	// rate  ( there is a rate but unsure if it is the information that pertains to the hourly wage)
})

const dodBenefitSchema = z.object({
	// Tripple Checked
	basic: z.number().positive(),
	fehb: z.number().positive(),
	fers: z.number().positive(),
	medicarePaidByGov: z.number().positive(),
	oasdi: z.number().positive(),
	tsp: z.object({
		basic: z.number().positive(),
		matching: z.number().positive(),
	}),
	fegli: z.object({
		basic: z.number().positive(),
	}),
})

const dodEmployerSchema = z.null()

const dodLeaveSchema = z.object({
	// Tripple Checked
	currentAnnualLeaveBalance: z.number().positive(),
	currentSickLeaveBalance: z.number().positive(),
})

const dodCodesSchema = z.object({
	// Tripple Checked
	deduction: z.object({
		allotmentCode: z.string(),
		fegli: z.object({
			bracketCode: z.string(),
			code: z.string(),
			optionalCode: z.string(),
		}),
		fehbCode: z.string(),
		retirementCode: z.string(),
		tsp: z.object({
			loansCode: z.string(),
		}),
	}),
})

const dodDeductionSchema = z.object({
	// Tripple Checked
	alotChecking: z
		.number({ message: "alotChecking must be a number" })
		.positive(),
	fdvd: z.number().positive(),
	fegli: z.object({
		basic: z.number().positive(),
		optional: z.number().positive(),
	}),
	fsa: z.number().positive(),
	healthInsurancePremium: z.number().positive(),
	oasdi: z.number().positive(),
	retirement: z.number().positive(),
	tsp: z.object({
		savings: z.number().positive(),
		loans: z.number().positive(),
	}),
})

export {
	dodBasicSchema,
	dodBenefitSchema,
	dodLeaveSchema,
	dodEmployerSchema,
	dodCodesSchema,
	dodDeductionSchema,
}
