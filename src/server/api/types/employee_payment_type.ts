import { z } from "zod";
import {
	dateAll,
	dateCreate,
	dateMetaFE,
	empData,
	func,
	Id,
} from "./common_type";
import { LongServiceEnum } from "./long_service_enum";
import { optionalNumDefaultZero } from "./z_utils";

const employeePaymentBase = z.object({
	emp_no: z.string(),
	base_salary: z.number(),
	food_allowance: z.number(),
	supervisor_allowance: z.number(),
	occupational_allowance: z.number(),
	subsidy_allowance: z.number(),
	long_service_allowance: z.number(),
	long_service_allowance_type: LongServiceEnum,
	l_r_self_ratio: z.number(),
	l_i: z.number(),
	h_i: z.number(),
	l_r: z.number(),
	occupational_injury: z.number(),
	bank_account_foreign: z.string().nullable(),
});

const employeePaymentUpdate = z
	.object({
		emp_no: z.string(),
		base_salary: optionalNumDefaultZero,
		food_allowance: optionalNumDefaultZero,
		supervisor_allowance: optionalNumDefaultZero,
		occupational_allowance: optionalNumDefaultZero,
		subsidy_allowance: optionalNumDefaultZero,
		long_service_allowance: optionalNumDefaultZero,
		long_service_allowance_type: LongServiceEnum,
		l_r_self_ratio: optionalNumDefaultZero,
		l_i: optionalNumDefaultZero,
		h_i: optionalNumDefaultZero,
		l_r: optionalNumDefaultZero,
		occupational_injury: optionalNumDefaultZero,
		bank_account_foreign: z.string().nullable().optional(),
	})
	.merge(dateAll);

const employeePaymentCreate = employeePaymentBase.merge(dateCreate);

// Exposed Types
// Create Types
export const employeePaymentCreateAPI = employeePaymentCreate.omit({
	l_i: true,
	h_i: true,
	l_r: true,
	occupational_injury: true,
	end_date: true,
});

export const employeePaymentBatchCreateAPI = z.array(
	employeePaymentCreate.omit({ end_date: true })
);

export const employeePaymentCreateService = employeePaymentCreate;

// Update Types
export const updateEmployeePaymentAPI = employeePaymentUpdate
	.partial()
	.merge(Id);
export const updateEmployeePaymentService = employeePaymentUpdate
	.partial()
	.merge(Id);

// Frontend
export const employeePaymentFE = employeePaymentBase
	.merge(Id)
	.merge(empData)
	.merge(dateMetaFE)
	.merge(func);

export type EmployeePaymentFEType = z.infer<typeof employeePaymentFE>;

// Types functions
export function isEqualEmployeePayment(
	a: z.infer<typeof employeePaymentCreateService>,
	b: z.infer<typeof employeePaymentCreateService>
): boolean {
	return (
		a.emp_no === b.emp_no &&
		a.base_salary === b.base_salary &&
		a.food_allowance === b.food_allowance &&
		a.supervisor_allowance === b.supervisor_allowance &&
		a.occupational_allowance === b.occupational_allowance &&
		a.subsidy_allowance === b.subsidy_allowance &&
		a.long_service_allowance === b.long_service_allowance &&
		a.long_service_allowance_type === b.long_service_allowance_type &&
		a.l_r_self_ratio === b.l_r_self_ratio &&
		a.l_i === b.l_i &&
		a.h_i === b.h_i &&
		a.l_r === b.l_r &&
		a.occupational_injury === b.occupational_injury &&
		a.bank_account_foreign === b.bank_account_foreign
	);
}
