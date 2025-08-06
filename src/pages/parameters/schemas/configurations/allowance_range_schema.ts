import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";
import { allowanceTypeEnum } from "~/server/api/types/allowance_type_enum";

const zc = z.coerce;

export const allowanceRangeSchema = z.object({
	id: zc.number(),
	position: zc.number(),
	position_type: zc.string(),
	allowance_type: allowanceTypeEnum,
	allowance_start: zc.number(),
	allowance_end: zc.number(),
	start_date: zodRequiredDate("start_date"),
});
