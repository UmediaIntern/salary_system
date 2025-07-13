import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const salaryIncomeTaxSchema = z.object({
	id: zc.number(),
	salary_start: zc.number(),
	salary_end: zc.number(),
	dependent: zc.number(),
	tax_amount: zc.number(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
