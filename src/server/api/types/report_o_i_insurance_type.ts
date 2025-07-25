import { z } from "zod";
import { workTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const OIInsurance = z.object({
	salary_range: z.number(),
	total_salary: z.number(),				// 薪資總額
	people_number: z.number(),				// 人數
	insured_total_salary: z.number(),		// 投保總薪資
	g_i_o_i_in_range: z.number(),			// 團保職災_職災級距內
    g_i_o_i_out_range: z.number(),			// 團保職災_職災級距外
});

export type OIInsuranceType = z.infer<typeof OIInsurance>;
