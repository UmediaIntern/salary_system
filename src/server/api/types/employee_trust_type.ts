import { z } from "zod";
import { dateAll, dateCreate, empData, func, Id } from "./common_type";
import { optionalNumDefaultZero } from "./z_utils";

const employeeTrust = z.object({
	emp_no: z.string(),
	emp_trust_reserve: optionalNumDefaultZero,
	emp_special_trust_incent: optionalNumDefaultZero,
}).merge(dateCreate);

export const employeeTrustFE = z.object({
	id: z.number(),
	emp_no: z.string(),
	emp_trust_reserve: z.number(),
	org_trust_reserve: z.number(),
	emp_special_trust_incent: z.number(),
	org_special_trust_incent: z.number(),
}).merge(empData).merge(dateAll).merge(func);

export const employeeTrustCreateAPI = employeeTrust;
export const employeeTrustCreateService = employeeTrust;

export const updateEmployeeTrustAPI = employeeTrustFE.partial().merge(Id);
export const updateEmployeeTrustService = employeeTrust.partial().merge(Id);

export type EmployeeTrustFEType = z.infer<typeof employeeTrustFE>;

export function isEqualEmployeeTrust(
	a: z.infer<typeof employeeTrustCreateService>,
	b: z.infer<typeof employeeTrustCreateService>
): boolean {
	return (
		a.emp_no === b.emp_no &&
		a.emp_trust_reserve === b.emp_trust_reserve&&
		a.emp_special_trust_incent === b.emp_special_trust_incent
	);
}
