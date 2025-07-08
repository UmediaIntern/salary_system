import { z } from "zod";
import { WorkTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const LILevelRange = z.object({
	insured_salary: z.number(),	
	self_total: z.number(),			// 個人總計
    unit_total: z.number(),			// 單位應計
	billing_population: z.number(),	// 計費人數
});

export type LILevelRangeType = z.infer<typeof LILevelRange>;