import { z } from "zod"

// give me the most strict zod type that conforms to the type:

const usdaBasicSchema = z.object({
	// Tripple Checked
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
	payPlan: z.string().regex(/^[A-Z]{2}$/, {
		message: "Invalid format. Expected XX",
	}),
	payGrade: z.string().regex(/^\d{2}$/, {
		message: "Invalid format. Expected 00",
	}),
	payStep: z.string().regex(/^\d{2}$/, {
		message: "Invalid format. Expected 00",
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

const usdaBenefitSchema = z.object({
	// Tripple Checked
	fegli: z.object({
		coverage: z.number().positive(),
	}),
})

const usdaLeaveSchema = z.object({
	// Tripple Checked
	currentAnnualLeaveBalance: z.number().positive(),
	currentSickLeaveBalance: z.number().positive(),
})

const usdaEmployerSchema = z.null()

const usdaCodesSchema = z.object({
	// Tripple Checked
	deduction: z.object({
		fegli: z.object({
			bracketCode: z.string(),
		}),
		fehbCode: z.string(),
		healthInsurancePremiumCode: z.string(),
	}),
})

const usdaDeductionSchema = z.object({
	// Tripple Checked
	alotChecking: z
		.number({ message: "alotChecking must be a number" })
		.positive(),
	fdvv: z.number().positive(),
	fdvd: z.number().positive(),
	fegli: z.object({
		basic: z.number().positive(),
		fsa: z.number().positive(),
		coverage: z.number().positive(),
		optional: z.number().positive(),
	}),
	healthInsurancePremium: z.number().positive(),
	oasdi: z.number().positive(),
	retirement: z.number().positive(),
	tsp: z.object({
		contribution: z.number().positive(),
	}),
})

export {
	usdaBasicSchema,
	usdaBenefitSchema,
	usdaEmployerSchema,
	usdaLeaveSchema,
	usdaCodesSchema,
	usdaDeductionSchema,
}
