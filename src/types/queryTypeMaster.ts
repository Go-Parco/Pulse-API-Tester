type BasicType = {
	name: string
	dateOfHire: string // CHECK
	baseSalary: string // CHECK
	netTakeHome: string // CHECK
	payPeriod?: string // CHECK
	payPeriodStart?: string // CHECK
	payPeriodEnd?: string // CHECK
	payPlanGradeStep?: string // CHECK
	payPlan?: string // CHECK
	payGrade?: string // CHECK
	payStep?: string // CHECK
	payPeriodHours?: string // CHECK
	rate?: string // CHECK
}

type DeductionType = {
	deduction: {
		alotchecking?: string // CHECK
		alotSaving?: string // CHECK
		fegli: {
			basic?: string // CHECK
			coverage?: string // CHECK // ?? Same as LifeInsuranceTotal ???
			optionA?: string // CHECK
			optionB?: string // CHECK
			optionC?: string // CHECK
			optional?: string // CHECK
		}
		// gli: { fegli and gli are the same thing with the same data structure.
		// 	basic?: string 
		// 	optionA?: string 
		// 	optionB?: string 
		// 	optionC?: string 
		// }
		fsa?: string // CHECK
		fdvv?: string // CHECK
		fdvd?: string // CHECK
		fedMedEE?: string // CHECK
		fedMedER?: string // CHECK
		dentalVision?: string // CHECK
		medicalBeforeTax?: string // CHECK
		dentalBeforeTax?: string // CHECK
		disibility?: string // CHECK
		coreLife?: string // CHECK
		suppLife?: string // CHECK
		suppLifeAfterTax?: string // CHECK
		retirement?: string // CHECK
		oasdi?: string // CHECK
		tsp?: {
			contribution?: string // CHECK
			savings?: string // CHECK
			loans?: string // CHECK
		}
		_401k?: string // CHECK
		_401kAfterTax?: string // CHECK
		federalCampain?: string // CHECK
		duesTVAEngineersAssoc?: string // CHECK
		addMgsSpa?: string // CHECK
		withholding?: string // CHECK
		withholdingFed?: string // CHECK
		withholdingState?: string // CHECK
		healthInsurancePremium?: string // CHECK
	} 
}

type LeaveType = {
	currentAnnualLeaveBalance?: string // CHECK
	currentSickLeaveBalance?: string // CHECK
}

type BenefitType = {
	benefit: {
		fegli?: {
			basic?: string // CHECK
		} 
		tsp?: {
			basic?: string // CHECK
			matching?: string // CHECK
		} 
		fehb?: string // CHECK
		fers?: string // CHECK
		oasdi?: string // CHECK
		lifeInsuranceTotal?: string // CHECK
		medicarePaidByGov?: string // CHECK
	} 
}

type EmployerType = {
	employer: {
		medicalEmployer?: string // CHECK
		dentalEmployer?: string // CHECK
		coreLife?: string // CHECK
		suppLifeEmployer?: string // CHECK
		_401k?: string // CHECK
		fegli: {
			basic: string // CHECK
		}
	} 
}

type CodesType = {
	codes: {
		basic: {
			annualLeaveCode?: string // CHECK
			sickLeaveCode?: string // CHECK
			otherLeaveCode?: string // CHECK
			organizationCode?: string // CHECK
		}
		deduction: {
			fehbCode?: string // CHECK
			fsaCode?: string // CHECK
			retirementCode?: string // CHECK
			allotmentCode?: string // CHECK
			healthInsurancePremiumCode?: string // CHECK
			medicareCode?: string // CHECK
			tsp: {
				fersCode?: string // CHECK
				loansCode?: string // CHECK
			}
			oasdiCode?: string // CHECK
			fegli: {
				bracketCode?: string // CHECK
				code?: string // CHECK
				optionalCode?: string // CHECK
			} 
		} 
	} 
}

type MasterTypes = BasicType &
	BenefitType &
	DeductionType &
	LeaveType &
	EmployerType &
	CodesType

export default MasterTypes
