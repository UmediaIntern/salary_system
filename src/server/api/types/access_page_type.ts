import { z } from "zod";

export const accessiblePages = z.object({
	// actions access
	functions: z.boolean().default(false),
	synchronize: z.boolean().default(false),
	employees: z.boolean().default(false),
	employees_write: z.boolean().default(false),
	employees_read_level: z.number().default(0),
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

export type AccessiblePagesType = z.infer<typeof accessiblePages>;
