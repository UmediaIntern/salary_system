import { z } from "zod";
import { WorkTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const LRLevelRange = z.object({
	l_r_level_range: z.number(),	
	l_r_contribution: z.number(),	// 勞退金提撥
	l_r_headcount: z.number(),		// 勞退人數
});

export type LRLevelRangeType = z.infer<typeof LRLevelRange>;