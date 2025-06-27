import { z } from "zod";
import { WorkTypeEnum } from "./work_type_enum";
import { WorkStatusEnum } from "./work_status_enum";
import { CostCategoryEnum } from "./cost_category_type";

export const TransactionIndividual = z.object({
	id: z.number(),											/** 薪資期間 ID */
	period_id: z.number(),									/** 發薪日期 */
	issue_date: z.string(),									/** 發薪別 */
	pay_type: z.string(),									/** 勞工相關信息 */ 
	department: z.string(),									/** 部門 */
	emp_no: z.string(),										/** 員工編號 */
	emp_name: z.string(),									/** 員工姓名 */
	cost_category: CostCategoryEnum, 						/** 成本分類 */
	work_type: WorkTypeEnum,								/** 工作類別 */
	work_status: WorkStatusEnum,							/** 工作形態 */
	position: z.number(),									/** 職等 */
	position_type: z.string(),								/** 職級 */
	group_insurance_type: z.string(),						/** 團保類別 */
	disabilty_level: z.string(),							/** 殘障等級 */
	sex_type: z.string(),									/** 性別 */
	license_id: z.string(),									/** 身份(居留)證字號 */
	dependents: z.number(),									/** 扶養人數 */
	healthcare_dependents: z.number(),						/** 健保眷口數 */
	residence_permit_start_date: z.string().nullable(),		/** 居留證開始日期 */
	residence_permit_end_date: z.string().nullable(),		/** 居留證截止日期 */
	registration_date: z.string(),							/** 入職日期 */
	quit_date: z.string().nullable(),						/** 離職日期 */
	bank_account_taiwan: z.string(),						/** 台幣帳號 */
	bank_account_foreign: z.string().nullable(),			/** 外幣帳號 */
	received_elderly_benefits: z.boolean(),					/** 已領老年給付 */
	seniority: z.number(),									/** 年資 */
	annual_days_in_service: z.number(),						/** 年度在職天數 */
	probation_period_over: z.boolean(),						/** 預備期滿 */
	l_i: z.number(),										/** 勞保 */
	h_i: z.number(),										/** 健保 */	
	l_r: z.number(),										/** 勞退 */
	occupational_injury: z.number(),						/** 職災 */
	
	// 加項
	base_salary: z.number(),								/** 底薪 */
	supervisor_allowance: z.number(),						/** 主管津貼 */
	occupational_allowance: z.number(),						/** 職務津貼 */
	/** 久任津貼 */
	long_service_allowance: z.number(),
	/** 補助津貼 */
	subsidy_allowance: z.number(),
	/** 伙食津貼 */
	food_allowance: z.number(),
	/** 應發底薪 */
	gross_salary: z.number(),
	/** 輪班津貼 */
	shift_allowance: z.number(),
	/** 專業証照津貼 */
	professional_cert_allowance: z.number(),
	/** 薪資總計 */
	salary_total: z.number(),
	/** 全勤獎金 */
	full_attendance_bonus: z.number(),
	// ! operational_performance_bonus: z.number(),			/** 營運績效獎金 */
	/** 職務績效獎金 */
	occupational_performance_bonus: z.number(),
	/** 補發薪資 */
	reissue_salary: z.number(),
	/** 不休假代金 */
	non_leave_compensation: z.number(),
	/** 退職所得 */
	retirement_income: z.number(),
	/** 專案獎金 */
	project_bonus: z.number(),
	// ! quarterly_performance_bonus: z.number(),			/** 季績效獎金 */
	/** 平日134加班時數 */
	weekday_134_overtime_hours: z.number(),
	/** 平日167加班時數 */
	weekday_167_overtime_hours: z.number(),
	/** 休息日134加班時數 */
	rest_134_overtime_hours: z.number(),
	/** 休息日167加班時數 */
	rest_167_overtime_hours: z.number(),
	/** 休息日267加班時數 */
	rest_267_overtime_hours: z.number(),
	/** 平日134加班時數(稅) */
	weekday_134_tax_overtime_hours: z.number(),
	/** 平日167加班時數(稅) */
	weekday_167_tax_overtime_hours: z.number(),
	/** 休息日134加班時數(稅) */
	rest_134_tax_overtime_hours: z.number(),
	/** 休息日167加班時數(稅) */
	rest_167_tax_overtime_hours: z.number(),
	/** 休息日267加班時數(稅) */
	rest_267_tax_overtime_hours: z.number(),
	/** 平日加班費 */
	weekday_overtime_pay: z.number(),
	/** 休息日加班費 */
	rest_overtime_pay: z.number(),
	/** 超時加班費 */
	exceed_overtime_pay: z.number(),
	/** 勞保加項 */
	l_i_addition_previous: z.number(),
	/** 健保加項 */
	h_i_addition_previous: z.number(),
	/** 其他加項 */
	other_addition: z.number(),
	/** 其他加項稅 */
	other_addition_tax: z.number(),
	/** 加項小計 */
	addition_subtotal: z.number(),
	
	// 減項
	/** 車輛貸款 */
	vehicle_loan: z.number(),
	/** 特別事假扣款 */
	special_personal_leave_deduct: z.number(),
	/** 請假扣款 */
	leave_deduction: z.number(),
	/** 員工信託提存金 */
	emp_trust_reserve: z.number(),
	/** 特別信託獎勵金_員工 */
	emp_special_trust_incent: z.number(),
	/** 勞保扣除額 */
	l_i_deduction: z.number(),
	/** 健保扣除額 */
	h_i_deduction: z.number(),
	/** 福利金提撥 */
	welfare_contribution: z.number(),
	/** 團保費代扣 */
	group_insurance_deduction: z.number(),
	/** 團保費代扣_升等 */
	g_i_deduction_promotion: z.number(),
	/** 住宿代扣款 */
	dorm_deduction: z.number(),
	/** 薪資所得稅 */
	income_tax: z.number(),
	/** 獎金所得稅 */
	bonus_tax: z.number(),
	/** 定存扣款 */
	fixed_deposit_deduction: z.number(),
	/** 法院薪資扣押款 */
	court_salary_garnishment: z.number(),
	/** 所得稅代扣 */
	income_tax_deduction: z.number(),
	/** 勞退金自提 */
	l_r_self: z.number(),
	/** 停車費 */
	parking_fee: z.number(),
	/** 仲介費 */
	brokerage_fee: z.number(),
	/** 二代健保 */
	v_2_h_i: z.number(),
	/** 勞保減項 */
	l_i_deduction_previous: z.number(),
	/** 健保減項 */
	h_i_deduction_previous: z.number(),
	/** 其他減項 */
	other_deduction: z.number(),
	/** 其他減項稅 */
	other_deduction_tax: z.number(),
	/** 減項小計 */
	deduction_subtotal: z.number(),
	
	/** 課稅所得 */
	taxable_income: z.number(),
	/** 薪資所得扣繳總額 */
	salary_income_deduction: z.number(),
	/** 課稅小計 */
	taxable_subtotal: z.number(),
	/** 非課說小計 */
	non_taxable_subtotal: z.number(),
	/** 工資墊償 */
	salary_advance: z.number(),
	/** 公司勞保負擔(60%) */
	l_i_pay: z.number(),
	/** 公司健保負擔(60%) */
	h_i_pay: z.number(),
	/** 公司團保負擔 */
	group_insurance_pay: z.number(),
	/** 勞退金提撥 */
	l_r_contribution: z.number(),
	/** 勞退金提撥_舊制 */
	old_l_r_contribution: z.number(),
	// ! org_trust_reserve: z.number(),				/** 公司獎勵金 */
	// ! org_special_trust_incent: z.number(),		/** 特別信託獎勵金_公司 */
	/** 薪資區隔 */
	salary_range: z.number(),
	/** 薪資總額 */
	total_salary: z.number(),
	/** 實發金額 */
	net_salary: z.number(),
	/** 工作天數 */
	work_day: z.number(),
	/** 勞保天數 */
	l_i_day: z.number(),
	/** 健保天數 */
	h_i_day: z.number(),
	/** 備註 */
	note: z.string(),
	
	// ! currency_foreign: z.string().nullable(),		/** 外幣幣別 */
	// ! exchange_rate: z.number(),						/** 匯率 */
	// ! currency_amount_foreign: z.number(),			/** 外幣金額 */
	// ! currency_amount_taiwan: z.number(),			/** 台幣金額 */
	/** 持股信託_YN */
	has_trust: z.boolean(),
});

export type TransactionIndividualType = z.infer<typeof TransactionIndividual>;