export function Translate(word: string) {
	if (word === "id")    return "資料編號"
	if (word === "update_by")    return "更新者"
	if (word === "create_by")    return "建立者"
	if (word === "multiplier")    return "倍率"
	if (word === "update_date")    return "更新時間"
	if (word === "create_date")    return "建立時間"
	if (word === "performance_level")    return "performance_level"
	if (word === "position")    return "職等"	//number
	if (word === "position_type")    return "職級"	//string
	if (word === "org_trust_reserve_limit")    return "公司信託提存金"
	if (word === "emp_trust_reserve_limit")    return "員工信託提存金"
	if (word === "org_special_trust_incent_limit")    return "特別信託獎勵金　公司"
	if (word === "emp_special_trust_incent_limit")    return "特別信託獎勵金　員工"
	if (word === "end_date")    return "截止時間"
	if (word === "start_date")    return "開始時間"
	if (word === "sick_leave_dock")    return "病假扣薪"
	if (word === "personal_leave_dock")    return "事假扣薪"
	if (word === "rate_of_unpaid_leave")    return "不休假代金比率"
	if (word === "local_worker_holiday")    return "本勞假日"
	if (word === "foreign_worker_holiday")    return "外勞假日"
	if (word === "overtime_by_local_workers_3")    return "本勞加班3"
	if (word === "overtime_by_local_workers_2")    return "本勞加班2"
	if (word === "unpaid_leave_compensatory_5")    return "不休假-補休5"
	if (word === "unpaid_leave_compensatory_3")    return "不休假-補休3"
	if (word === "unpaid_leave_compensatory_2")    return "不休假-補休2"
	if (word === "unpaid_leave_compensatory_1")    return "不休假-補休1"
	if (word === "overtime_by_local_workers_1")    return "本勞加班1"
	if (word === "unpaid_leave_compensatory_4")    return "不休假-補休4"
	if (word === "overtime_by_foreign_workers_1")    return "外勞加班1"
	if (word === "overtime_by_foreign_workers_2")    return "外勞加班2"
	if (word === "overtime_by_foreign_workers_3")    return "外勞加班3"
	if (word === "salt")    return "鹽"
	if (word === "emp_id")    return "員工編號"
	if (word === "password")    return "密碼"
	if (word === "auth_level")    return "權限等級"
	if (word === "org_name")    return "公司名稱"
	if (word === "org_code")    return "公司編號"
	if (word === "bank_name")    return "銀行名稱"
	if (word === "bank_code")    return "銀行代碼"
	if (word === "payday")    return "發薪日期"
	if (word === "anouncement")    return "公告訊息"
	if (word === "department")    return "部門"
	if (word === "seniority")    return "年資"
	if (word === "type")    return "類別"
	if (word === "base_on")    return "獎金計算依據"
	if (word === "criterion_date")    return "獎金(發放)基準日"
	if (word === "fixed_multiplier")    return "固定比率"
	if (word === "ratio")    return "比例"
	if (word === "bank_account")    return "銀行帳號"
	if (word === "email")    return "E-Mail"
	if (word === "gender")    return "性別"
	if (word === "emp_name")    return "姓名"
	if (word === "has_esot")    return "has_esot"
	if (word === "birthdate")    return "birthdate"
	if (word === "work_type")    return "work_type"
	if (word === "hire_date")    return "hire_date"
	if (word === "entry_date")    return "entry_date"
	if (word === "postal_code")    return "postal_code"
	if (word === "nationality")    return "nationality"
	if (word === "work_status")    return "work_status"
	if (word === "english_name")    return "english_name"
	if (word === "departure_date")    return "departure_date"
	if (word === "bank_full_name")    return "bank_full_name"
	if (word === "securities_code")    return "securities_code"
	if (word === "indigenous_name")    return "indigenous_name"
	if (word === "identity_number")    return "identity_number"
	if (word === "mailing_address")    return "mailing_address"
	if (word === "old_age_benifit")    return "old_age_benifit"
	if (word === "dependents_count")    return "dependents_count"
	if (word === "branch_full_name")    return "branch_full_name"
	if (word === "disability_level")    return "disability_level"
	if (word === "tax_rate_category")    return "tax_rate_category"
	if (word === "bonus_calculation")    return "bonus_calculation"
	if (word === "securities_account")    return "securities_account"
	if (word === "registered_address")    return "registered_address"
	if (word === "h_i_dependents_count")    return "h_i_dependents_count"
	if (word === "group_insurance_type")    return "group_insurance_type"
	if (word === "tax_identification_code")    return "tax_identification_code"
	if (word === "probationary_period_over")    return "probationary_period_over"
	if (word === "labor_retirement_self_ratio")    return "labor_retirement_self_ratio"
	if (word === "h_i")    return "h_i"
	if (word === "l_i")    return "l_i"
	if (word === "job_bonus")    return "job_bonus"
	if (word === "base_salary")    return "base_salary"
	if (word === "shift_bonus")    return "shift_bonus"
	if (word === "subsidy_bonus")    return "subsidy_bonus"
	if (word === "supervisor_bonus")    return "supervisor_bonus"
	if (word === "labor_retirement")    return "labor_retirement"
	if (word === "emp_trust_reserve")    return "emp_trust_reserve"
	if (word === "org_trust_reserve")    return "org_trust_reserve"
	if (word === "occupational_injury")    return "occupational_injury"
	if (word === "labor_retirement_self")    return "labor_retirement_self"
	if (word === "professional_cert_bonus")    return "professional_cert_bonus"
	if (word === "emp_special_trust_incent")    return "emp_special_trust_incent"
	if (word === "org_special_trust_incent")    return "org_special_trust_incent"
	if (word === "min_wage_rate")    return "min_wage_rate"
	if (word === "h_i_standard_rate")    return "h_i_standard_rate"
	if (word === "l_i_accident_rate")    return "l_i_accident_rate"
	if (word === "v2_h_i_dock_tsx_thres")    return "v2_h_i_dock_tsx_thres"
	if (word === "v2_h_i_supp_premium_rate")    return "v2_h_i_supp_premium_rate"
	if (word === "h_i_avg_dependents_count")    return "h_i_avg_dependents_count"
	if (word === "l_i_wage_replacement_rate")    return "l_i_wage_replacement_rate"
	if (word === "l_i_employment_premium_rate")    return "l_i_employment_premium_rate"
	if (word === "l_i_occupational_hazard_rate")    return "l_i_occupational_hazard_rate"
	if (word === "level")    return "level"
	if (word === "level_end")    return "level_end"
	if (word === "level_start")    return "level_start"
}