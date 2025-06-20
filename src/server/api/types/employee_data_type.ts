import { z } from "zod";

import { Id } from "./common_type";
import { WorkTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

//MARK:employee_data
const employeeData = z.object({
	period_id: z.number(),
	emp_no: z.string(),
	emp_name: z.string(),
	position: z.number(),
	position_type: z.string(),
	group_insurance_type: z.string(),
	department: z.string(),
	cost_category: CostCategoryEnum,
	work_type: WorkTypeEnum,
	work_status: WorkStatusEnum,
	disabilty_level: z.string().nullable(),
	sex_type: z.string(),
	dependents: z.number().nullable(),
	healthcare_dependents: z.number().nullable(),
	residence_permit_start_date: z.string().nullable(),
	residence_permit_end_date: z.string().nullable(),
	registration_date: z.string(),
	quit_date: z.string().nullable(),
	license_id: z.string().nullable(),
	bank_account_taiwan: z.string(),
	received_elderly_benefits: z.boolean(),
});

export const createEmployeeDataAPI = employeeData;
export const createEmployeeDataService = employeeData;

export const updateEmployeeDataAPI = employeeData.partial().merge(Id);
export const updateEmployeeDataByEmpNoAPI = employeeData.partial();
export const updateEmployeeDataService = employeeData.partial().merge(Id);
export const updateEmployeeDataByEmpNoService = employeeData.partial();

