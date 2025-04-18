import { z } from "zod";
import { Id } from "./common_type";

const roleInfo = z.object({
	role: z.string(),
});

export const accessiblePages = z.object({
	// actions access
	functions: z.boolean().default(false),
	synchronize: z.boolean().default(false),
	employees: z.boolean().default(false),
	employees_write: z.boolean().default(false),
	employees_r_lv: z.number().default(0),
	parameters: z.boolean().default(false),
	parameters_write: z.boolean().default(false),
	bonus: z.boolean().default(false),
	calendar: z.boolean().default(false),
	calendar_write: z.boolean().default(false),
	// settings access
	settings: z.boolean().default(false),
	roles: z.boolean().default(false),
	report: z.boolean().default(false),
});
export type AccessiblePages = z.infer<typeof accessiblePages>;

export const createAccessAPI = accessiblePages.merge(roleInfo);
export const updateAccessAPI = accessiblePages
	.partial()
	.merge(roleInfo)
	.merge(Id);

export const accessFE = accessiblePages.merge(Id).merge(roleInfo);
export type AccessFEType = z.infer<typeof accessFE>;
