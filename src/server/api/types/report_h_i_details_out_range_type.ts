import { z } from "zod";
import { workTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const HIDetailsOut = z.object({
	department: 		z.string(),
	emp_no: 			z.string(),
	emp_name: 			z.string(),
	identity_number: 	z.string(),
	occupational_injury_insured_amount: 	z.number(),
	l_i_deduction: 		z.number(),				// 勞保扣除額
	l_i_pay: 			z.number(),
	salary_advance: 	z.number(),
	h_i_insured_amount: z.number(),
	healthcare_dependents: 					z.number(),
	h_i_deduction: 		z.number(),
	h_i_pay: 			z.number(),
	l_i_insured_amount: z.number(),
	l_r_self: 			z.number(),
	l_r_contribution: 	z.number(),
	v_2_h_i: 			z.number(),
	l_i_reduction: 		z.number(),				// 勞保減免
	h_i_subsidy: 		z.number(),				// 健保補助
});

export type HIDetailsOutType = z.infer<typeof HIDetailsOut>;
