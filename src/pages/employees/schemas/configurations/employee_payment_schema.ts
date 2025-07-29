import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";
import { LongServiceEnum } from "~/server/api/types/long_service_enum";

const zc = z.coerce;

export const employeePaymentSchema = z.object({
  id: zc.number(),
	emp_no: zc.string(),
	base_salary: zc.number(),
	food_allowance: zc.number(),
	supervisor_allowance: zc.number(),
	occupational_allowance: zc.number(),
	subsidy_allowance: zc.number(),
	long_service_allowance: zc.number(),
	long_service_allowance_type: LongServiceEnum,
	l_r_self_ratio: zc.number(),
	bank_account_foreign: zc.string().nullable(),
	start_date: zodRequiredDate("start_date"),
});
