import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const incomeTaxSchema = z.object({
	id: zc.number(),
	entry_date_threshold: zc.number(),
	multiplier: zc.number(),
	deduction: zc.number(),
	tax_ratio_1: zc.number(),
	tax_ratio_2: zc.number(),
	start_date: zodRequiredDate("start_date"),
	// end_date: zodOptionalDate(),
});
