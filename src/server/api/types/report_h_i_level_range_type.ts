import { z } from "zod";
import { workTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const HILevelRange = z.object({
	insured_amount: z.number(),
	self: z.number(),				// 本人
	family: z.number(),				// 眷屬
	self_total: z.number(),			// 個人總計
    unit_total: z.number(),			// 單位應計
});

export type HILevelRangeType = z.infer<typeof HILevelRange>;
