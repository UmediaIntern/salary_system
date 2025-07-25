import { z } from "zod";
import { workTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const SalaryOut = z.object({
	bank_account_taiwan: 		z.string(),
	net_salary: 				z.number(),
	bank_account_taiwan_name: 	z.string(),
	license_id: 			z.string(),
	emp_no: 					z.string(),
	emp_name: 					z.string(),	
});

export type SalaryOutType = z.infer<typeof SalaryOut>;
