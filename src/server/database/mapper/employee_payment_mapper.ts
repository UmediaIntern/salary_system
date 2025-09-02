import { container, injectable } from "tsyringe";
import {
	type EmployeePaymentDecType,
	encEmployeePayment,
	decEmployeePayment,
	type EmployeePayment,
} from "../entity/SALARY/employee_payment";
import {
	type EmployeeDataDecType,
} from "../entity/SALARY/employee_data";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseMapper } from "./base_mapper";
import { EmployeePaymentFEType, EmployeePaymentInfo, EmployeePaymentWithInfoFEType } from "~/server/api/types/employee_payment_type";
import { AllowanceRangeService } from "~/server/service/allowance_range_service";
import { SyncService } from "~/server/service/sync_service";
import { FunctionsEnum } from "~/server/api/types/functions_enum";
import { allowanceTypeEnum } from "~/server/api/types/allowance_type_enum";

@injectable()
export class EmployeePaymentMapper extends BaseMapper<
	EmployeePayment,
	EmployeePaymentDecType,
	typeof encEmployeePayment,
	typeof decEmployeePayment
> {
	constructor(
		private readonly employeeDataService: EmployeeDataService,
		private readonly allowanceRangeService: AllowanceRangeService,
	) {
		super("Employee Payment Mapper", encEmployeePayment, decEmployeePayment, [
			"base_salary_enc",
			"supervisor_allowance_enc",
			"occupational_allowance_enc",
			"subsidy_allowance_enc",
			"food_allowance_enc",
			"long_service_allowance_enc",
			"l_r_self_ratio_enc",
			"l_i_enc",
			"h_i_enc",
			"l_r_enc",
			"occupational_injury_enc",
		]);
	}

	async getEmployeePaymentFE(dec: EmployeePaymentDecType[]): Promise<EmployeePaymentFEType[]> {
		const list = await this.includeEmployee(dec, [
			"department",
			"emp_name",
			"position",
			"position_type",
			"work_type",
		]);
		const employeePaymentFE = await Promise.all(
			list.map(async (e) => {
				return {
					...e,
					functions: {
						creatable: e.base_salary != 0,
						updatable: e.start_date > new Date() || e.base_salary == 0,
						deletable: e.start_date > new Date(),
					},
				};
			})
		);
		return employeePaymentFE;
	}

	async getEmployeePaymentWithInfoFE(period_id: number, previous_period_id: number, employeePaymentFE: EmployeePaymentFEType[], previousEmployeePaymentFE: EmployeePaymentFEType[]): Promise<EmployeePaymentWithInfoFEType[]> {
		const syncService = container.resolve(SyncService);
		const cur_allowance_range = await this.allowanceRangeService.getCurrentAllowanceRange(period_id);

		const employeeData = await this.employeeDataService.getAllEmployeeDataByPeriod(period_id);
		const previousEmployeeData = await this.employeeDataService.getAllEmployeeDataByPeriod(previous_period_id);

		const cand_paid_emps = await syncService.getCandPaidEmployees(FunctionsEnum.Values.month_salary, period_id);
		const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no);

		const differences = await syncService.compareEhrWithSalaryEmployeeData(period_id, previousEmployeeData, cand_emp_no_list);
		const employeePaymentWithInfos: EmployeePaymentWithInfoFEType[] = [];

		for (const employeePayment of employeePaymentFE) {
			const emp_data = employeeData.find((emp) => emp.emp_no == employeePayment.emp_no)!;
			const emp_diff = differences.find(
				(diff) =>
					diff.emp_no.salary_value == employeePayment.emp_no ||
					diff.emp_no.ehr_value == employeePayment.emp_no
			);

			let isPositionModified = false;
			let isPositionTypeModified = false;
			if (emp_diff) {
				isPositionModified = emp_diff.comparisons.find((cmp) => cmp.key == "position")?.is_different ?? false;
				isPositionTypeModified = emp_diff.comparisons.find((cmp) => cmp.key == "position_type")?.is_different ?? false;
			}
			// Compare with previous period's payment to determine isModified
			let isBaseSalaryInRange = employeePayment.base_salary > 0;
			let isSupervisorInRange = await this.allowanceRangeService.checkAllowanceInRange(cur_allowance_range, emp_data, allowanceTypeEnum.Enum.supervisor_allowance, employeePayment.supervisor_allowance);
			let isOccupationalInRange = await this.allowanceRangeService.checkAllowanceInRange(cur_allowance_range, emp_data, allowanceTypeEnum.Enum.occupational_allowance, employeePayment.occupational_allowance);
			let isLongServiceInRange = await this.allowanceRangeService.checkAllowanceInRange(cur_allowance_range, emp_data, allowanceTypeEnum.Enum.long_service_allowance, employeePayment.long_service_allowance);
			let isSubsidyInRange = await this.allowanceRangeService.checkAllowanceInRange(cur_allowance_range, emp_data, allowanceTypeEnum.Enum.subsidy_allowance, employeePayment.subsidy_allowance);
			let isFoodInRange = await this.allowanceRangeService.checkAllowanceInRange(cur_allowance_range, emp_data, allowanceTypeEnum.Enum.food_allowance, employeePayment.food_allowance);
			let isLIinRange = employeePayment.l_i > 0;
			let isHIinRange = employeePayment.h_i > 0;
			let isLRinRange = employeePayment.emp_no.startsWith("F") ? employeePayment.l_r === 0 : employeePayment.l_r > 0;
			let isOccupationalInjuryInRange = employeePayment.occupational_injury > 0;

			let isSupervisorModified = false;
			let isOccupationalModified = false;
			let isLongServiceModified = false;
			let isSubsidyModified = false;
			let isFoodModified = false;

			const previousEmployeePayment = previousEmployeePaymentFE.find((prevEmp) => prevEmp.emp_no == employeePayment.emp_no);
			if (previousEmployeePayment) {
				isSupervisorModified = employeePayment.supervisor_allowance != previousEmployeePayment.supervisor_allowance;
				isOccupationalModified = employeePayment.occupational_allowance != previousEmployeePayment.occupational_allowance;
				isLongServiceModified = employeePayment.long_service_allowance != previousEmployeePayment.long_service_allowance;
				isSubsidyModified = employeePayment.subsidy_allowance != previousEmployeePayment.subsidy_allowance;
				isFoodModified = employeePayment.food_allowance != previousEmployeePayment.food_allowance;
			} else {
				isSupervisorModified = employeePayment.supervisor_allowance != 0;
				isOccupationalModified = employeePayment.occupational_allowance != 0;
				isLongServiceModified = employeePayment.long_service_allowance != 0;
				isSubsidyModified = employeePayment.subsidy_allowance != 0;
				isFoodModified = employeePayment.food_allowance != 0;
			}

			const info = {
				isPositionModified,
				isPositionTypeModified,
				base_salary: {
					isInRange: isBaseSalaryInRange,
					isModified: isBaseSalaryInRange,
				},
				supervisor: {
					isInRange: isSupervisorInRange,
					isModified: isSupervisorModified,
				},
				occupational: {
					isInRange: isOccupationalInRange,
					isModified: isOccupationalModified,
				},
				longService: {
					isInRange: isLongServiceInRange,
					isModified: isLongServiceModified,
				},
				subsidy: {
					isInRange: isSubsidyInRange,
					isModified: isSubsidyModified,
				},
				food: {
					isInRange: isFoodInRange,
					isModified: isFoodModified,
				},
				l_i: {
					isInRange: isLIinRange,
					isModified: isLIinRange,
				},
				h_i: {
					isInRange: isHIinRange,
					isModified: isHIinRange,
				},
				l_r: {
					isInRange: isLRinRange,
					isModified: isLRinRange,
				},
				occupational_injury: {
					isInRange: isOccupationalInjuryInRange,
					isModified: isOccupationalInjuryInRange,
				},
			};

			employeePaymentWithInfos.push({
				...employeePayment,
				info: info,
				functions: {
					creatable: !this.isAbnormal(info),
					updatable: employeePayment.start_date > new Date() || this.isAbnormal(info),
					deletable: employeePayment.start_date > new Date(),
				}
			});
		}

		employeePaymentWithInfos.sort((a, b) => {
			const aAbnormal = this.isAbnormal(a.info);
			const bAbnormal = this.isAbnormal(b.info);

			if (aAbnormal && !bAbnormal) return -1;
			if (!aAbnormal && bAbnormal) return 1;

			return a.emp_no.localeCompare(b.emp_no);
		});

		return employeePaymentWithInfos
	}

	private async includeEmployee<
		Data extends EmployeePaymentDecType | EmployeePaymentDecType[],
		K extends Partial<keyof EmployeeDataDecType>
	>(
		data: Data,
		keys: K[]
	): Promise<(EmployeePaymentDecType & Pick<EmployeeDataDecType, K>)[]> {
		const employeeDataRecord: Record<string, EmployeeDataDecType> = {};

		const dataList: EmployeePaymentDecType[] = Array.isArray(data)
			? data
			: [data];

		const uniqueEmpNos = new Set<string>();
		dataList.forEach((item) => {
			uniqueEmpNos.add(item.emp_no);
		});
		const uniqueEmpNoList = Array.from(uniqueEmpNos);
		const employeeDataList = await this.employeeDataService.getLatestEmployeeDataByEmpNoList(uniqueEmpNoList);

		await Promise.all(
			uniqueEmpNoList.map(async (empNo) => {
				const emp = employeeDataList.find((e) => e.emp_no === empNo);
				if (!emp) {
					throw new Error(`Employee ${empNo} not found`);
				}
				employeeDataRecord[empNo] = emp;
			})
		);

		const resultList: (EmployeePaymentDecType &
			Pick<EmployeeDataDecType, K>)[] = dataList.map((d) => {
				const empNo = d.emp_no;
				const emp = employeeDataRecord[empNo];
				const result = { ...d } as EmployeePaymentDecType &
					Pick<EmployeeDataDecType, K>;
				if (emp) {
					keys.forEach((key) => {
						result[key] = emp[key] as any;
					});
				} else {
					throw new Error(`Employee ${empNo} not found`);
				}
				return result;
			});

		return resultList;
	}

	isAbnormal(info: EmployeePaymentInfo): boolean {
		return (
			info.isPositionModified ||
			info.isPositionTypeModified ||
			!info.supervisor.isInRange ||
			!info.occupational.isInRange ||
			!info.longService.isInRange ||
			!info.subsidy.isInRange ||
			!info.food.isInRange ||
			!info.base_salary.isInRange ||
			!info.l_i.isInRange ||
			!info.h_i.isInRange ||
			!info.l_r.isInRange ||
			!info.occupational_injury.isInRange
		);
	};
}
