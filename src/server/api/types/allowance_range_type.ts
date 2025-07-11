import { z } from "zod";
import { dateAll, dateCreate, func, Id } from "./common_type";
import { allowanceTypeEnum } from "./allowance_type_enum";

const allowanceRangeBase = z.object({
	position: z.number(),
	position_type: z.string(),
	allowance_type: allowanceTypeEnum,
	allowance_start: z.number(),
	allowance_end: z.number(),
});

// Exposed Types
// Create Types
export const createAllowanceRangeAPI = allowanceRangeBase
	.merge(dateCreate)
	.omit({ end_date: true });
export const createAllowanceRangeService = allowanceRangeBase.merge(dateCreate);

// Update Types
export const updateAllowanceRangeAPI = allowanceRangeBase
	.merge(dateAll)
	.partial()
	.merge(Id);
export const updateAllowanceRangeService = allowanceRangeBase
	.merge(dateAll)
	.partial()
	.merge(Id);

// Frontend Types
export const allowanceRangeFE = z
	.object({
		id: z.number(),
	})
	.merge(allowanceRangeBase)
	.merge(dateAll)
	.merge(func);
export type AllowanceRangeFEType = z.infer<typeof allowanceRangeFE>;
