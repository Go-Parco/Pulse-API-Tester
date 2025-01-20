import { z } from "zod"

const doeBasicSchema = z.object({
	// Tripple Checked
	dateOfHire: z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
			message: "Invalid date format. Expected MM/DD/YYYY",
		}),
	baseSalary: z.number().positive(),
	netTakeHome: z.number().positive(),
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
	rate: z.number().positive(),
})

const doeBenefitSchema = z.object({
	// Tripple Checked
	fehb: z.number().positive(),
	fers: z.number().positive(),
	medicarePaidByGov: z.number().positive(),
	oasdi: z.number().positive(),
	tsp: z.object({
		matching: z.number().positive(),
	}),
})

const doeLeaveSchema = z.object({
	// Tripple Checked
	currentAnnualLeaveBalance: z.number().positive(),
	currentSickLeaveBalance: z.number().positive(),
})

const doeEmployerSchema = z.null()

const doeCodesSchema = z.object({
	// Tripple Checked
	basic: z.object({
		organizationCode: z.string(),
	}),
	deduction: z.object({
		fehbCode: z.string(),
		medicareCode: z.string(),
		oasdiCode: z.string(),
		retirementCode: z.string(),
	}),
})

const doeDeductionSchema = z.object({
	// Tripple Checked
	dentalVision: z.number().positive(),
	healthInsurancePremium: z.number().positive(),
	oasdi: z.number().positive(),
	retirement: z.number().positive(),
	tsp: z.object({
		contribution: z.number().positive(),
	}),
	withholdingFed: z.number().positive(),
	withholdingState: z.number().positive(),
})

export {
	doeBasicSchema,
	doeBenefitSchema,
	doeLeaveSchema,
	doeEmployerSchema,
	doeCodesSchema,
	doeDeductionSchema,
}
