import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const levelRangeSchema = z.object({
  id: zc.number(),
	type: z.enum(["勞保", "健保", "職災", "勞退"]),
	start_date: zodRequiredDate("start_date"),
  level_start: zc.number(),
  level_end: zc.number(),
});
