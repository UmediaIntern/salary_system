import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const bankSchema = z.object({
	id: zc.number(),
	bank_code: z
		.string()
		.length(3)
		.refine((val) => /^\d+$/.test(val), {
			message: "bank_code must be a 3-digit number",
		}),
	bank_name: z.string(),
	org_code: z
		.string()
		.length(3)
		.refine((val) => /^\d+$/.test(val), {
			message: "org_code must be a 3-digit number",
		}),
	org_name: z.string(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
