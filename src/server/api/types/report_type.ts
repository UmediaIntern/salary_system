import { z } from "zod";
import { WorkTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const TransactionDepartment = z.object({
	id: z.number(),
	period_id: z.number(),
	issue_date: z.string(),
	pay_type: z.string(),

	// 勞工相關信息
	department: z.string(),
    work_type: WorkTypeEnum,
	cost_category: CostCategoryEnum,
	work_status: WorkStatusEnum,
    performance_bonus: z.number(),					// ! Miss: 績效獎金之總計
    operational_performance_bonus: z.number(),
    base_salary: z.number(),
	long_service_allowance: z.number(),
    supervisor_allowance: z.number(),
    professional_cert_allowance_1: z.number(),		// ! Miss: 專業證照之總計1
	professional_cert_allowance: z.number(),
    occupational_allowance: z.number(),
    shift_allowance: z.number(),
    night_fee: z.number(),							// ! Miss: 夜點費
    full_attendance_bonus: z.number(),
    exceed_overtime_pay: z.number(),
    operational_assessment_bonus: z.number(),		// ! Miss: 營運考核獎金之總計
    project_bonus: z.number(),
    assessment_bonus: z.number(),					// ! Miss: 考核獎金之總計
    year_end_bonus: z.number(),						// ! Miss: 年終獎金之總計
	reissue_salary: z.number(),
    addition_subtotal: z.number(),
    taxable_subtotal: z.number(),
    food_allowance: z.number(),
    weekday_overtime_pay: z.number(),
	rest_overtime_pay: z.number(),
    subsidy_allowance: z.number(),
    non_leave_compensation: z.number(),
    other_addition: z.number(),
	other_addition_tax: z.number(),
    other_deduction: z.number(),
	income_tax_deduction: z.number(),				// 所得稅代扣之總計
	l_r_self: z.number(),							// 勞退金自提之總計
	parking_fee: z.number(),						// 停車費之總計
	brokerage_fee: z.number(),						// 仲介費之總計
	non_taxable_subtotal: z.number(),				// 非課稅小計之總計
	l_i_deduction: z.number(),						// 勞保扣除額之總計
	h_i_deduction: z.number(),						// 健保扣除額之總計
	income_tax: z.number(),							// 薪資所得稅之總計
	bonus_tax: z.number(),							// 獎金所得稅之總計
	welfare_contribution: z.number(),				// 福利金提撥之總計
	l_i_pay: z.number(),							// 勞保費之總計
	salary_advance: z.number(),						// 工資墊償之總計
	h_i_pay: z.number(),							// 健保費之總計
	// ! Miss: 健保費之總合計
	g_i_deduction_family: z.number(),				// 團保費_眷屬代扣之總計
	g_i_deduction_promotion: z.number(),			// 團保費_升等代扣之總計
	leave_deduction: z.number(),					// 請假扣款之總計
	special_personal_leave_deduct: z.number(),		// 特別事假假扣款之總計
	meal_deduction: z.number(),						// 伙食扣款之總計
	other_deduction_tax: z.number(),				// 其他減項稅之總計
	vehicle_loan: z.number(),						// 車輛貸款之總計
	fixed_deposit_deduction: z.number(),			// 定存金額之總計		// 我們叫做定存扣款 (誰取的名字啊)
	stock_loan: z.number(),							// ! Miss: 股票貸款之總計
	deduction_subtotal: z.number(),					// 減項小計
	net_salary: z.number(),							// 實發金額之總計
	taxable_income: z.number(),						// 課稅所得之總計
	special_personal_leave: z.number(),				// 特別事假時數之總計
	personal_leave: z.number(),						// 事假時數之總計
	sick_leave: z.number(),							// 病假時數之總計
	// ! Miss: 加班1_時數之總計
	// ! Miss: 加班2_時數之總計
	holiday_hours: z.number(),						// ! Miss: 假日加班時數之總計
	overtime_pay: z.number(),						// 加班費小計
	year_award_contribution: z.number(),			// ! Miss: 年獎提撥
	l_r_contribution: z.number(),					// 勞退金提撥之總計
	salary_income_deduction: z.number(),			// 薪資所得扣繳總額之總計
	retirement_income: z.number(),					// 退職所得之總計
	v_2_h_i: z.number(),							// 二代健保之總計
	l_i_disability_reduction: z.number(),			// 勞保減免之總計				// 我們叫勞保殘障減免
	h_i_subsidy: z.number(),						// 健保補助之總計
	emp_trust_reserve: z.number(),					// 員工提存金之總計
	emp_special_trust_incent: z.number(),			// 特別獎勵金_員工之總計
});

export type TransactionDepartmentType = z.infer<typeof TransactionDepartment>;