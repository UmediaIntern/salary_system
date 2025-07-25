import { z } from "zod";
import { workTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const ReportTotal = z.object({
	work_type: z.string(),
	base_salary: z.number(),						// 底薪
	supervisor_allowance: z.number(),				// 主管津貼
	long_service_allowance: z.number(),				// 久任津貼
	professional_cert_allowance: z.number(),		// 專業證照津貼
	food_allowance: z.number(),						// 伙食津貼
	l_i_deduction: z.number(),						// 勞保扣除額
	h_i_deduction: z.number(),						// 健保扣除額
	welfare_contribution: z.number(),				// 福利金提撥
	subsidy_allowance: z.number(),					// 獎助津貼
	weekday_overtime_pay: z.number(),				// 平日加班費
	vehicle_loan: z.number(),						// 車輛貸款
	fixed_deposit_amount: z.number(),				// TODO: 定存金額
	full_attendance_bonus: z.number(),				// 全勤獎金
	personal_leave: z.number(),						// 事假時數
	stock_loan: z.number(),							// 股票貸款
	sick_leave: z.number(),							// 病假時數
	holiday_overtime_pay: z.number(),				// TODO: 假日加班費
	night_fee: z.number(),							// 夜點費
	leave_deduction: z.number(),					// 請假扣款
	excessive_overtime_pay: z.number(),				// TODO: 超時加班
	income_tax: z.number(),							// 薪資所得稅
	bonus_tax: z.number(),							// 獎金所得稅
	occupational_allowance: z.number(), 			// 職務津貼
	shift_allowance: z.number(),					// 輪班津貼
	non_leave_compensation: z.number(),				// 不休假代金
	l_i_pay: z.number(),							// 勞保費
	h_i_pay: z.number(),							// 健保費
	net_salary: z.number(),							// 實發金額
	operational_performance_bonus: z.number(),		// TODO: 營運積效獎金
	performance_bonus: z.number(),					// 績效獎金
	year_end_bonus: z.number(),						// 年終獎金
	other_deduction: z.number(),					// 其他減項
	other_addition: z.number(),						// 其他加項
	meal_deduction: z.number(),						// 伙食扣款
	other_addition_tax: z.number(),					// 其他加項稅
	other_deduction_tax: z.number(),				// 其他減項稅
	// TODO: 加班1
	// TODO: 加班2
	// TODO: 假日加班
	reissue_salary: z.number(),						// 補發薪資
	group_insurance_deduction: z.number(),			// Sum(薪資查詢.團保費代扣) AS 團保費_眷屬代扣之總計
	g_i_deduction_promotion: z.number(),			// 團保費代扣_升等
	// TODO: 加班1_時數
	// TODO: 加班2_時數
	// TODO: 假日加班時數
	income_tax_deduction: z.number(),				// 所得稅代扣
	l_r_self: z.number(),							// 勞退金自提
	parking_fee: z.number(),						// 停車費
	brokerage_fee: z.number(),						// 仲介費
	salary_income_deduction: z.number(),			// 薪資所得扣繳總額
	retirement_income: z.number(),					// 退職所得
	v_2_h_i: z.number(),							// 二代健保
	l_i_reduction: z.number(),						// 勞保減免
	h_i_subsidy: z.number(),						// 健保補助

	// ! TO CHECK
	emp_trust_reserve: z.number(),					// 員工提存金
	emp_special_trust_incent: z.number(),			// 特別獎勵金_員工

});

export type ReportTotalType = z.infer<typeof ReportTotal>;
