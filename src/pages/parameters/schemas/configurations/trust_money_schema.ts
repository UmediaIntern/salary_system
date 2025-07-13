import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const trustMoneySchema = z.object({
	id: zc.number(),
	position: zc.number(),
	position_type: zc.string().max(2),
	org_trust_reserve_limit: zc.number(),
	org_special_trust_incent_limit: zc.number(),
	start_date: zodRequiredDate("start_date"),
	// end_date: zodOptionalDate(),
});
