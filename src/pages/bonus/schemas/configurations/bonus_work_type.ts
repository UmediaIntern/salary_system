import { z } from "zod";
import { workTypeEnum } from "~/server/api/types/work_type_enum";

const zc = z.coerce;

export const bonusWorkTypeSchema = z.object({
	id: zc.number(),
	work_type: workTypeEnum,
	multiplier: zc.number(),
});
