import { z } from "zod";
export const TransactionDepartment = z.object({
	id: z.number(),
	period_id: z.number(),
	issue_date: z.string(),
	pay_type: z.string(),

	// 勞工相關信息
	department: z.string(),
    work_type: z.enum(WorkTypeEnumType),
	cost_category: z.enum(CostCategoryEnumType),
	work_status: z.enum(WorkStatusEnumType),
    // 績效獎金之總計
    operational_performance_bonus: z.number(),
    base_salary: z.number(),
	long_service_allowance: z.number(),
    supervisor_allowance: z.number(),
    // 專業證照之總計1
	professional_cert_allowance: z.number(),
    occupational_allowance: z.number(),
    shift_allowance: z.number(),
    // 夜點費
    full_attendance_bonus: z.number(),
    exceed_overtime_pay: z.number(),
    // 營運考核獎金之總計
    project_bonus: z.number(),
    // 考核獎金之總計
    // 年終獎金之總計
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




	position: z.number(),
	position_type: z.string(),
	group_insurance_type: z.string(),
	disabilty_level: z.string(),
	sex_type: z.string(),
	license_id: z.string(),
	dependents: z.number(),
	healthcare_dependents: z.number(),
	residence_permit_start_date: z.string().nullable(),
	residence_permit_end_date: z.string().nullable(),
	registration_date: z.string(),
	quit_date: z.string().nullable(),
	bank_account_taiwan: z.string(),
	bank_account_foreign: z.string().nullable(),
	received_elderly_benefits: z.boolean(),
	seniority: z.number(),
	annual_days_in_service: z.number(),
	probation_period_over: z.boolean(),
	l_i: z.number(),
	h_i: z.number(),
	l_r: z.number(),
	occupational_injury: z.number(),

	// 加項
	
	
	
	
	gross_salary: z.number(),
	salary_total: z.number(),
	
	
	occupational_performance_bonus: z.number(),
	
	retirement_income: z.number(),
	quarterly_performance_bonus: z.number(),
	weekday_134_overtime_hours: z.number(),
	weekday_167_overtime_hours: z.number(),
	rest_134_overtime_hours: z.number(),
	rest_167_overtime_hours: z.number(),
	rest_267_overtime_hours: z.number(),
	weekday_134_tax_overtime_hours: z.number(),
	weekday_167_tax_overtime_hours: z.number(),
	rest_134_tax_overtime_hours: z.number(),
	rest_167_tax_overtime_hours: z.number(),
	rest_267_tax_overtime_hours: z.number(),
	
	
	l_i_addition_previous: z.number(),
	h_i_addition_previous: z.number(),
	
	

	// 減項
	vehicle_loan: z.number(),
	special_personal_leave_deduct: z.number(),
	leave_deduction: z.number(),
	emp_trust_reserve: z.number(),
	emp_special_trust_incent: z.number(),
	l_i_deduction: z.number(),
	h_i_deduction: z.number(),
	welfare_contribution: z.number(),
	group_insurance_deduction: z.number(),
	g_i_deduction_promotion: z.number(),
	dorm_deduction: z.number(),
	income_tax: z.number(),
	bonus_tax: z.number(),
	fixed_deposit_deduction: z.number(),
	court_salary_garnishment: z.number(),
	income_tax_deduction: z.number(),
	l_r_self: z.number(),
	parking_fee: z.number(),
	brokerage_fee: z.number(),
	v_2_h_i: z.number(),
	l_i_deduction_previous: z.number(),
	h_i_deduction_previous: z.number(),
	other_deduction: z.number(),
	other_deduction_tax: z.number(),
	deduction_subtotal: z.number(),

	// ...
	taxable_income: z.number(),
	salary_income_deduction: z.number(),
	
	non_taxable_subtotal: z.number(),
	salary_advance: z.number(),
	l_i_pay: z.number(),
	h_i_pay: z.number(),
	group_insurance_pay: z.number(),
	l_r_contribution: z.number(),
	old_l_r_contribution: z.number(),
	org_trust_reserve: z.number(),
	org_special_trust_incent: z.number(),
	salary_range: z.number(),
	total_salary: z.number(),
	net_salary: z.number(),
	work_day: z.number(),
	l_i_day: z.number(),
	h_i_day: z.number(),
	note: z.string(),

	// ...
	currency_foreign: z.string().nullable(),
	exchange_rate: z.number(),
	currency_amount_foreign: z.number(),
	currency_amount_taiwan: z.number(),
	has_trust: z.boolean(),
});
