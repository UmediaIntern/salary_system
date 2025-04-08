import { z } from "zod";

import { Id } from "./common_type";
import { bonusTypeEnum } from "./bonus_type_enum";
import { WorkTypeEnum } from "./work_type_enum";

const BasicInfo = z.object({
	issue_date: z.date(),
	announcement: z.string(),
});

export const createBasicInfoAPI = BasicInfo;
export const createBasicInfoService = BasicInfo;
export const updateBasicInfoAPI = BasicInfo.partial().merge(Id);
export const updateBasicInfoService = BasicInfo.partial().merge(Id);

const BonusAll = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	multiplier: z.number(),
});

export const createBonusAllAPI = BonusAll;
export const createBonusAllService = BonusAll;
export const updateBonusAllAPI = BonusAll.partial().merge(Id);
export const updateBonusAllService = BonusAll.partial().merge(Id);
export const batchCreateBonusAllAPI = z.array(createBonusAllAPI);

const BonusWorkType = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	work_type: WorkTypeEnum,
	multiplier: z.number(),
});

export const createBonusWorkTypeAPI = BonusWorkType;
export const createBonusWorkTypeService = BonusWorkType;
export const updateBonusWorkTypeAPI = BonusWorkType.partial().merge(Id);
export const updateBonusWorkTypeService = BonusWorkType.partial().merge(Id);
export const batchCreateBonusWorkTypeAPI = z.array(createBonusWorkTypeAPI);

const BonusDepartment = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	department: z.union([z.string(), z.coerce.number()]),
	multiplier: z.number(),
});

export const createBonusDepartmentAPI = BonusDepartment;
export const createBonusDepartmentService = BonusDepartment;
export const updateBonusDepartmentAPI = BonusDepartment.partial().merge(Id);
export const updateBonusDepartmentService = BonusDepartment.partial().merge(Id)
export const batchCreateBonusDepartmentAPI = z.array(createBonusDepartmentAPI);

const BonusPosition = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	position: z.number(),
	position_multiplier: z.number(),
	position_type: z.string(),
	position_type_multiplier: z.number(),
});

export const createBonusPositionAPI = BonusPosition;
export const createBonusPositionService = BonusPosition;
export const updateBonusPositionAPI = BonusPosition.partial().merge(Id);
export const updateBonusPositionService = BonusPosition.partial().merge(Id);
export const batchCreateBonusPositionAPI = z.array(createBonusPositionAPI);

const BonusPositionType = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	position_type: z.string(),
	multiplier: z.number(),
});

export const createBonusPositionTypeAPI = BonusPositionType;
export const createBonusPositionTypeService = BonusPositionType;
export const updateBonusPositionTypeAPI = BonusPositionType.partial().merge(Id);
export const updateBonusPositionTypeService = BonusPositionType.partial().merge(Id);
export const batchCreateBonusPositionTypeAPI = z.array(
	createBonusPositionTypeAPI
);

const BonusSeniority = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	seniority: z.number(),
	multiplier: z.number(),
});

export const createBonusSeniorityAPI = BonusSeniority;
export const createBonusSeniorityService = BonusSeniority;
export const updateBonusSeniorityAPI = BonusSeniority.partial().merge(Id);
export const updateBonusSeniorityService = BonusSeniority.partial().merge(Id);
export const batchCreateBonusSeniorityAPI = z.array(createBonusSeniorityAPI);

const BonusSetting = z.object({
	fixed_multiplier: z.number(),
	criterion_date: z.date(),
	base_on: z.string(),
	type: z.string(),
});

export const createBonusSettingAPI = BonusSetting;
export const createBonusSettingService = BonusSetting;
export const updateBonusSettingAPI = BonusSetting.partial().merge(Id);
export const updateBonusSettingService = BonusSetting.partial().merge(Id);

const PerformanceLevel = z.object({
	performance_level: z.string(),
	multiplier: z.number(),
});

export const createPerformanceLevelAPI = PerformanceLevel;
export const createPerformanceLevelService = PerformanceLevel;
export const updatePerformanceLevelAPI = PerformanceLevel.partial().merge(Id);
export const updatePerformanceLevelService = PerformanceLevel.partial().merge(Id);

//MARK:account
const EmployeeAccount = z.object({
	emp_no: z.string(),
	bank_account: z.string(),
	ratio: z.number(),
});

export const createEmployeeAccountAPI = EmployeeAccount;
export const createEmployeeAccountService = EmployeeAccount;
export const updateEmployeeAccountAPI = EmployeeAccount.partial().merge(Id);
export const updateEmployeeAccountService = EmployeeAccount.partial().merge(Id);

// const EmployeeBonus = z.object({
// 	period_id: z.number(),
// 	bonus_type: BonusTypeEnum,
// 	emp_no: z.string(),
// 	special_multiplier_enc: z.string(),
// 	multiplier_enc: z.string(),
// 	fixed_amount_enc: z.string(),
// 	bud_effective_salary_enc: z.string(),
// 	bud_amount_enc: z.string(),
// 	sup_performance_level_enc: z.string(),
// 	sup_effective_salary_enc: z.string(),
// 	sup_amount_enc: z.string(),
// 	app_performance_level_enc: z.string(),
// 	app_effective_salary_enc: z.string(),
// 	app_amount_enc: z.string(),
// });

// export const createEmployeeBonusAPI = EmployeeBonus;
// export const createEmployeeBonusService = EmployeeBonus;
// export const updateEmployeeBonusAPI = EmployeeBonus.partial().merge(Id);
// export const updateEmployeeBonusByEmpNoAPI = EmployeeBonus.partial();
// export const updateEmployeeBonusService = EmployeeBonus.partial().merge(Id);
// export const updateEmployeeBonusByEmpNoService = EmployeeBonus.partial();

// MARK: Holidays Type
const HolidaysType = z.object({
	pay_id: z.number(),
	holidays_name: z.string(),
	multiplier: z.number(),
	pay_type: z.number(),
});
export const updateHolidaysTypeInput = z
	.object({
		id: z.number(),
		pay_id: z.number().nullable(),
		holidays_name: z.string().nullable(),
		multiplier: z.number().nullable(),
		pay_type: z.number().nullable(),
	})
	.partial();

export const createHolidaysTypeAPI = HolidaysType;
export const createHolidaysTypeService = HolidaysType;
export const updateHolidaysTypeAPI = HolidaysType.partial().merge(Id);
export const updateHolidaysTypeService = HolidaysType.partial().merge(Id);


const SalaryRaiseAll = z.object({
    period_id: z.number(),
    multiplier: z.number(),
});

export const createSalaryRaiseAllAPI = SalaryRaiseAll;
export const createSalaryRaiseAllService = SalaryRaiseAll;
export const updateSalaryRaiseAllAPI = SalaryRaiseAll.partial().merge(Id);
export const updateSalaryRaiseAllService = SalaryRaiseAll.partial().merge(Id);
export const batchCreateSalaryRaiseAllAPI = z.array(createSalaryRaiseAllAPI);

const SalaryRaiseWorkType = z.object({
    period_id: z.number(),
    work_type: WorkTypeEnum,
    multiplier: z.number(),
});

export const createSalaryRaiseWorkTypeAPI = SalaryRaiseWorkType;
export const createSalaryRaiseWorkTypeService = SalaryRaiseWorkType;
export const updateSalaryRaiseWorkTypeAPI = SalaryRaiseWorkType.partial().merge(Id);
export const updateSalaryRaiseWorkTypeService = SalaryRaiseWorkType.partial().merge(Id);
export const batchCreateSalaryRaiseWorkTypeAPI = z.array(createSalaryRaiseWorkTypeAPI);

const SalaryRaiseDepartment = z.object({
    period_id: z.number(),
    department: z.string(),
    multiplier: z.number(),
});

export const createSalaryRaiseDepartmentAPI = SalaryRaiseDepartment;
export const createSalaryRaiseDepartmentService = SalaryRaiseDepartment;
export const updateSalaryRaiseDepartmentAPI = SalaryRaiseDepartment.partial().merge(Id);
export const updateSalaryRaiseDepartmentService = SalaryRaiseDepartment.partial().merge(Id)
export const batchCreateSalaryRaiseDepartmentAPI = z.array(createSalaryRaiseDepartmentAPI);

const SalaryRaisePosition = z.object({
    period_id: z.number(),
    position: z.number(),
    position_multiplier: z.number(),
    position_type: z.string(),
    position_type_multiplier: z.number(),
});

export const createSalaryRaisePositionAPI = SalaryRaisePosition;
export const createSalaryRaisePositionService = SalaryRaisePosition;
export const updateSalaryRaisePositionAPI = SalaryRaisePosition.partial().merge(Id);
export const updateSalaryRaisePositionService = SalaryRaisePosition.partial().merge(Id);
export const batchCreateSalaryRaisePositionAPI = z.array(createSalaryRaisePositionAPI);

const SalaryRaisePositionType = z.object({
    period_id: z.number(),
    position_type: z.string(),
    multiplier: z.number(),
});

export const createSalaryRaisePositionTypeAPI = SalaryRaisePositionType;
export const createSalaryRaisePositionTypeService = SalaryRaisePositionType;
export const updateSalaryRaisePositionTypeAPI = SalaryRaisePositionType.partial().merge(Id);
export const updateSalaryRaisePositionTypeService = SalaryRaisePositionType.partial().merge(Id);
export const batchCreateSalaryRaisePositionTypeAPI = z.array(
    createSalaryRaisePositionTypeAPI
);

const SalaryRaiseSeniority = z.object({
    period_id: z.number(),
    seniority: z.number(),
    multiplier: z.number(),
});

export const createSalaryRaiseSeniorityAPI = SalaryRaiseSeniority;
export const createSalaryRaiseSeniorityService = SalaryRaiseSeniority;
export const updateSalaryRaiseSeniorityAPI = SalaryRaiseSeniority.partial().merge(Id);
export const updateSalaryRaiseSeniorityService = SalaryRaiseSeniority.partial().merge(Id);
export const batchCreateSalaryRaiseSeniorityAPI = z.array(createSalaryRaiseSeniorityAPI);
