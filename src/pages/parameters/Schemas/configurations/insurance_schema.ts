import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const insuranceSchema = z.object({
	min_wage_rate: zc.number(),
	l_i_accident_rate: zc.number(),
	l_i_employment_premium_rate: zc.number(),
	l_i_occupational_hazard_rate: zc.number(),
	l_i_wage_replacement_rate: zc.number(),
	h_i_standard_rate: zc.number(),
	h_i_avg_dependents_count: zc.number(),
	v2_h_i_supp_premium_rate: zc.number(),
	v2_h_i_dock_tsx_thres: zc.number(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
