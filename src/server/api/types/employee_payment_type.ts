import { z } from "zod";
import { dateAll, dateCreate, dateMetaFE, empData, func, Id } from "./common_type";
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

export const  employeePaymentBatchCreateAPI = z.array(employeePaymentCreate.omit({end_date: true}))

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
