import { z } from "zod";
import { workTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const ReportDepartmentTotal = z.object({
	department: z.string(),						// 部門
	work_type: workTypeEnum,					// 工作類別
	cost_category: CostCategoryEnum,			// 成本類別
	performance_bonus: z.number(),				// 績效獎金
	operational_performance_bonus: z.number(),	// 營運積效獎金
	base_salary: z.number(),					// 底薪
	long_service_allowance: z.number(),			// 久任津貼
	supervisor_allowance: z.number(),			// 主管津貼
	professional_cert_allowance: z.number(),	// 專業証照津貼
	occupational_allowance: z.number(),			// 職務津貼
	shift_allowance: z.number(),				// 輪班津貼
	night_fee: z.number(),						// 夜點費
	full_attendance_bonus: z.number(),			// 全勤獎金
	exceed_overtime: z.number(),				// 超時加班
	project_bonus: z.number(),					// 專案獎金
	assessment_bonus: z.number(),				// 考核獎金
	year_end_bonus: z.number(),					// 年終獎金
	reissue_salary: z.number(),					// 補發薪資
	addition_subtotal: z.number(),				// Sum(主管津貼)+Sum(薪資查詢.底薪)+Sum(薪資查詢.全勤獎金)+Sum(薪資查詢.伙食津貼)+Sum(薪資查詢.職務津貼)+Sum(薪資查詢.補助津貼)+Sum(薪資查詢.其他加項稅)) AS 加項小計
	taxable_subtotal: z.number(),				// 課稅小計
	food_allowance: z.number(),					// 伙食津貼
	weekday_overtime_pay: z.number(),			// 平日加班費
	holiday_overtime_pay: z.number(),			// 假日加班費
	subsidy_allowance: z.number(),				// 補助津貼
	non_leave_compensation: z.number(),			// 不休假代金
	other_addition: z.number(),					// 其他加項
	other_addition_tax: z.number(),				// 其他加項稅
	other_deduction: z.number(),				// 其他減項
	income_tax_deduction: z.number(),			// 所得稅代扣
	l_r_self: z.number(),						// 勞退金自提
	parking_fee: z.number(),					// 停車費
	brokerage_fee: z.number(),					// 仲介費
	non_taxable_subtotal: z.number(),			// 非課稅小計
	l_i_deduction: z.number(),					// 勞保扣除額
	h_i_deduction: z.number(),					// 健保扣除額
	income_tax: z.number(),						// 薪資所得稅
	bonus_tax: z.number(),						// 獎金所得稅
	welfare_contribution: z.number(),			// 福利金提撥
	l_i_pay: z.number(),						// 勞保費
	salary_advance: z.number(),					// 工資墊償
	h_i_pay: z.number(),						// 健保費之總計
	l_i_h_i_pay: z.number(),					// (Sum(薪資查詢.勞保費)+Sum(薪資查詢.健保費)) AS 健保費之總合計
	group_insurance_deduction: z.number(),		// 團保費代扣
	g_i_deduction_promotion: z.number(),		// 團保費代扣_升等
	leave_deduction: z.number(),				// 請假扣款
	special_personal_leave_deduct: z.number(),	// 特別事假扣款
	meal_deduction: z.number(),					// 伙食扣款
	other_deduction_tax: z.number(),			// 其他減項稅
	vehicle_loan: z.number(),					// 車輛貸款
	fixed_deposit_amount: z.number(),			// 定存金額
	stock_loan: z.number(),						// 股票貸款
	deduction_subtotal: z.number(),				// (Sum(薪資查詢.勞保扣除額)+Sum(薪資查詢.健保扣除額)+Sum(薪資查詢.福利金提撥)+Sum(薪資查詢.請假扣款)+Sum(薪資查詢.團保費代扣)+Sum(薪資查詢.其他減項)+Sum(薪資查詢.伙食扣款)+Sum(薪資查詢.薪資所得稅)+Sum(薪資查詢.員工提存金)+Sum(薪資查詢.特別獎勵金_員工)) AS 減項小計
	net_salary: z.number(),						// 實發金額
	taxable_income: z.number(),					// 課稅所得
	special_personal_leave: z.number(),			// Round(Sum(薪資查詢.特別事假時數),2) AS 特別事假時數之總計, 
	personal_leave: z.number(),					// Round(Sum(薪資查詢.事假時數),2) AS 事假時數之總計, 
	sick_leave: z.number(),						// Round(Sum(薪資查詢.病假時數),2) AS 病假時數之總計, 
	hours_134: z.number(),						// Round(Sum(薪資查詢.加班1_時數),2) AS 加班1_時數之總計, 
	hours_167: z.number(),						// Round(Sum(薪資查詢.加班2_時數),2) AS 加班2_時數之總計, 
	hours_2: z.number(),
	holiday_hours: z.number(),					// Round(Sum(薪資查詢.假日加班時數),2) AS 假日加班時數之總計, 
	overtime_pay: z.number(),					// (Sum(薪資查詢.平日加班費)+Sum(薪資查詢.假日加班費)+Sum(薪資查詢.超時加班)) AS 加班費小計, 
	year_award_contribution: z.number(),		// (Sum(薪資查詢.主管津貼)+Sum(薪資查詢.底薪)+Sum(薪資查詢.伙食津貼)+Sum(薪資查詢.補助津貼)+Sum(薪資查詢.職務津貼))*3/12 AS 年獎提撥, 
	l_r_contribution: z.number(),				// 勞退金提撥 
	salary_income_deduction: z.number(),		// 薪資所得扣繳總額
	retirement_income: z.number(),				// 退職所得
	v_2_h_i: z.number(),						// 二代健保
	l_i_reduction: z.number(),					// 勞保減免
	h_i_subsidy: z.number(),					// 健保補助
	emp_trust_reserve_limit: z.number(),		// 員工提存金
	emp_special_trust_incent: z.number(),		// 特別獎勵金_員工
});

export type ReportDepartmentTotalType = z.infer<typeof ReportDepartmentTotal>;
