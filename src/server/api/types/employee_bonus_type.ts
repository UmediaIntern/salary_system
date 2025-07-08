import { z } from "zod";
import { dateAll, dateCreate, empData, func, Id } from "./common_type";
import { bonusTypeEnum } from "./bonus_type_enum";
import { optionalNumDefaultZero } from "./z_utils";
import { currencyForeignEnum } from "./currency_foreign_enum";

const employeeBonusBase = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	emp_no: z.string(),
	special_multiplier: z.number(),
	multiplier: z.number(),
	fixed_amount: z.number(),
	bud_effective_salary: z.number(),
	bud_amount: z.number(),
	sup_performance_level: z.string().nullable(),
	sup_effective_salary: z.number().nullable(),
	sup_amount: z.number().nullable(),
	app_performance_level: z.string().nullable(),
	app_effective_salary: z.number().nullable(),
	app_amount: z.number().nullable(),
	currency_foreign: currencyForeignEnum.nullable(),
	exchange_rate: z.number().nullable(),
	currency_amount_foreign: z.number().nullable(),
	currency_amount_taiwan: z.number().nullable(),

});

const employeeBonusUpdate = z
	.object({
		period_id: z.number(),
		bonus_type: bonusTypeEnum,
		emp_no: z.string(),
		special_multiplier: optionalNumDefaultZero,
		multiplier: optionalNumDefaultZero,
		fixed_amount: optionalNumDefaultZero,
		bud_effective_salary: optionalNumDefaultZero,
		bud_amount: optionalNumDefaultZero,
		sup_performance_level: z.string().nullable(),
		sup_effective_salary: optionalNumDefaultZero,
		sup_amount: optionalNumDefaultZero,
		app_performance_level: z.string().nullable(),
		app_effective_salary: optionalNumDefaultZero,
		app_amount: optionalNumDefaultZero,
		currency_foreign: currencyForeignEnum.nullable(),
		exchange_rate: optionalNumDefaultZero,
		currency_amount_foreign: optionalNumDefaultZero,
		currency_amount_taiwan: optionalNumDefaultZero,
	})
	.merge(dateAll);

const employeeBonusCreate = employeeBonusBase;


// Exposed Types
// Create Types
export const createEmployeeBonusAPI = employeeBonusCreate;
export const createEmployeeBonusService = employeeBonusCreate;

// Update Types
export const updateEmployeeBonusAPI = employeeBonusUpdate.partial().merge(Id);
export const updateEmployeeBonusService = employeeBonusUpdate
	.partial()
	.merge(Id);

// Frontend
const employeeBonusFE = z
	.object({
		residence_permit_start_date: z.coerce.string().nullable(),
		residence_permit_end_date: z.coerce.string().nullable(),
		registration_date: z.coerce.string(),
		quit_date: z.coerce.string().nullable(),
		seniority: z.coerce.number(),
		position_position_type: z.coerce.string(),
		work_status: z.coerce.string(),
		base_salary: z.coerce.number(),
		supervisor_allowance: z.coerce.number().nullable(),
		subsidy_allowance: z.coerce.number(),
		occupational_allowance: z.coerce.number(),
		food_allowance: z.coerce.number(),
		long_service_allowance: z.coerce.number(),
		total: z.coerce.number(),
		status: z.coerce.string(),
	})
	.merge(employeeBonusBase)
	.merge(Id)
	.merge(empData)
	.merge(dateAll)
	.merge(func)
	.omit({ start_date: true, end_date: true, position: true, position_type: true });

export type EmployeeBonusFEType = z.infer<typeof employeeBonusFE>;
