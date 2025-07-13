import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";
import { allowanceTypeEnum } from "~/server/api/types/allowance_type_enum";

const zc = z.coerce;

export const allowanceRangeSchema = z.object({
	id: zc.number(),
	position: z.number(),
	position_type: z.string(),
	allowance_type: allowanceTypeEnum,
	allowance_start: z.number(),
	allowance_end: z.number(),
	start_date: zodRequiredDate("start_date"),
});
