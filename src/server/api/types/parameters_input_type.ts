import { z } from "zod";

const Id = z.object({
	id: z.number(),
});

const DateAPI = z.object({
	start_date: z.date().nullable(),
	end_date: z.date().nullable(),
});

const DateService = z.object({
	start_date: z.string().nullable(),
	end_date: z.string().nullable(),
});

const User = z.object({
	emp_id: z.string(),
	password: z.string(),
	auth_l: z.number(),
});

export const createUserAPI = User.merge(DateAPI);
export const createUserService = User.merge(DateService);
export const updateUserAPI = User.merge(Id).merge(DateAPI).partial();
export const updateUserService = User.merge(Id).merge(DateService).partial();

const BankSetting = z.object({
	bank_code: z.string(),
	bank_name: z.string(),
	org_code: z.string(),
	org_name: z.string(),
});

export const createBankSettingAPI = BankSetting.merge(DateAPI);
export const createBankSettingService = BankSetting.merge(DateService);
export const updateBankSettingAPI = BankSetting.merge(Id)
	.merge(DateAPI)
	.partial();
export const updateBankSettingService = BankSetting.merge(Id)
	.merge(DateService)
	.partial();

const AttendanceSetting = z.object({
	personal_leave_dock: z.number(),
	sick_leave_dock: z.number(),
	rate_of_unpaid_leave: z.number(),
	unpaid_leave_compensatory_1: z.number(),
	unpaid_leave_compensatory_2: z.number(),
	unpaid_leave_compensatory_3: z.number(),
	unpaid_leave_compensatory_4: z.number(),
	unpaid_leave_compensatory_5: z.number(),
	overtime_by_local_workers_1: z.number(),
	overtime_by_local_workers_2: z.number(),
	overtime_by_local_workers_3: z.number(),
	local_worker_holiday: z.number(),
	overtime_by_foreign_workers_1: z.number(),
	overtime_by_foreign_workers_2: z.number(),
	overtime_by_foreign_workers_3: z.number(),
	foreign_worker_holiday: z.number(),
});

export const createAttendanceSettingAPI = AttendanceSetting.merge(DateAPI);
export const createAttendanceSettingService =
	AttendanceSetting.merge(DateService);
export const updateAttendanceSettingAPI = AttendanceSetting.merge(Id)
	.merge(DateAPI)
	.partial();
export const updateAttendanceSettingService = AttendanceSetting.merge(Id)
	.merge(DateService)
	.partial();

const BasicInfo = z.object({
	payday: z.date(),
	announcement: z.string(),
});

export const createBasicInfoAPI = BasicInfo;
export const createBasicInfoService = BasicInfo;
export const updateBasicInfoAPI = BasicInfo.merge(Id).partial();
export const updateBasicInfoService = BasicInfo.merge(Id).partial();

const InsuranceRateSetting = z.object({
	min_wage_rate: z.number(),
	l_i_accident_rate: z.number(),
	l_i_employment_premium_rate: z.number(),
	l_i_occupational_hazard_rate: z.number(),
	l_i_wage_replacement_rate: z.number(),
	h_i_standard_rate: z.number(),
	h_i_avg_dependents_count: z.number(),
	v2_h_i_supp_premium_rate: z.number(),
	v2_h_i_dock_tsx_thres: z.number(),
});
export const updateInsuranceRateSettingInput = z
	.object({
		id: z.number(),
		min_wage_rate: z.number().nullable(),
		l_i_accident_rate: z.number().nullable(),
		l_i_employment_premium_rate: z.number().nullable(),
		l_i_occupational_hazard_rate: z.number().nullable(),
		l_i_wage_replacement_rate: z.number().nullable(),
		h_i_standard_rate: z.number().nullable(),
		h_i_avg_dependents_count: z.number().nullable(),
		v2_h_i_supp_premium_rate: z.number().nullable(),
		v2_h_i_dock_tsx_thres: z.number().nullable(),
		start_date: z.date().nullable(),
		end_date: z.date().nullable(),
	})
	.partial();

export const createInsuranceRateSettingAPI =
	InsuranceRateSetting.merge(DateAPI);
export const createInsuranceRateSettingService =
	InsuranceRateSetting.merge(DateService);
export const updateInsuranceRateSettingAPI = InsuranceRateSetting.merge(Id)
	.merge(DateAPI)
	.partial();
export const updateInsuranceRateSettingService = InsuranceRateSetting.merge(Id)
	.merge(DateService)
	.partial();

const BonusDepartment = z.object({
	department: z.string(),
	multiplier: z.number(),
});

export const createBonusDepartmentAPI = BonusDepartment;
export const createBonusDepartmentService = BonusDepartment;
export const updateBonusDepartmentAPI = BonusDepartment.merge(Id).partial();
export const updateBonusDepartmentService = BonusDepartment.merge(Id).partial();

const BonusPosition = z.object({
	position: z.number(),
	multiplier: z.number(),
});

export const createBonusPositionAPI = BonusPosition;
export const createBonusPositionService = BonusPosition;
export const updateBonusPositionAPI = BonusPosition.merge(Id).partial();
export const updateBonusPositionService = BonusPosition.merge(Id).partial();

const BonusPositionType = z.object({
	position_type: z.string(),
	multiplier: z.number(),
});

export const createBonusPositionTypeAPI = BonusPositionType;
export const createBonusPositionTypeService = BonusPositionType;
export const updateBonusPositionTypeAPI = BonusPositionType.merge(Id).partial();
export const updateBonusPositionTypeService =
	BonusPositionType.merge(Id).partial();

const BonusSeniority = z.object({
	seniority: z.number(),
	multiplier: z.number(),
});

export const createBonusSeniorityAPI = BonusSeniority;
export const createBonusSeniorityService = BonusSeniority;
export const updateBonusSeniorityAPI = BonusSeniority.merge(Id).partial();
export const updateBonusSeniorityService = BonusSeniority.merge(Id).partial();

const BonusSetting = z.object({
	fixed_multiplier: z.number(),
	criterion_date: z.date(),
	base_on: z.string(),
	type: z.string(),
});

export const createBonusSettingAPI = BonusSetting;
export const createBonusSettingService = BonusSetting;
export const updateBonusSettingAPI = BonusSetting.merge(Id).partial();
export const updateBonusSettingService = BonusSetting.merge(Id).partial();

const LevelRange = z.object({
	type: z.string(),
	level_start: z.number(),
	level_end: z.number(),
});

export const createLevelRangeAPI = LevelRange;
export const createLevelRangeService = LevelRange;
export const updateLevelRangeAPI = LevelRange.merge(Id).partial();
export const updateLevelRangeService = LevelRange.merge(Id).partial();

const Level = z.object({
	level: z.number(),
});

export const createLevelAPI = Level;
export const createLevelService = Level;
export const updateLevelAPI = Level.merge(Id).partial();
export const updateLevelService = Level.merge(Id).partial();

const PerformanceLevel = z.object({
	performance_level: z.string(),
	multiplier: z.number(),
});

export const createPerformanceLevelAPI = PerformanceLevel;
export const createPerformanceLevelService = PerformanceLevel;
export const updatePerformanceLevelAPI = PerformanceLevel.merge(Id).partial();
export const updatePerformanceLevelService =
	PerformanceLevel.merge(Id).partial();

const TrustMoney = z.object({
	position: z.number(),
	position_type: z.string(),
	emp_trust_reserve_limit: z.number().nullable(),
	org_trust_reserve_limit: z.number(),
	emp_special_trust_incent_limit: z.number().nullable(),
	org_special_trust_incent_limit: z.number(),
});

export const createTrustMoneyAPI = TrustMoney;
export const createTrustMoneyService = TrustMoney;
export const updateTrustMoneyAPI = TrustMoney.merge(Id).partial();
export const updateTrustMoneyService = TrustMoney.merge(Id).partial();