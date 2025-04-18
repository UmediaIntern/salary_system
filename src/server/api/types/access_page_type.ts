import { z } from "zod";
import { Id } from "./common_type";

const roleInfo = z.object({
	role: z.string(),
});

export const accessiblePages = z.object({
	// actions access
	functions: z.coerce.boolean().default(false),
	synchronize: z.coerce.boolean().default(false),
	employees: z.coerce.boolean().default(false),
	employees_write: z.coerce.boolean().default(false),
	employees_r_lv: z.coerce.number().default(0),
	parameters: z.coerce.boolean().default(false),
	parameters_write: z.coerce.boolean().default(false),
	bonus: z.coerce.boolean().default(false),
	calendar: z.coerce.boolean().default(false),
	calendar_write: z.coerce.boolean().default(false),
	// settings access
	settings: z.coerce.boolean().default(false),
	roles: z.coerce.boolean().default(false),
	report: z.coerce.boolean().default(false),
});
export type AccessiblePages = z.infer<typeof accessiblePages>;

export const createAccessAPI = accessiblePages.merge(roleInfo);
export const updateAccessAPI = accessiblePages
	.partial()
	.merge(roleInfo)
	.merge(Id);

export const accessFE = accessiblePages.merge(Id).merge(roleInfo);
export type AccessFEType = z.infer<typeof accessFE>;
