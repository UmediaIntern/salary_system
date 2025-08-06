import { injectable } from "tsyringe";
import {
	EmployeeData,
	EmployeeDataDecType,
} from "../database/entity/SALARY/employee_data";
import { EHRService } from "./ehr_service";
import { type Emp } from "../database/entity/UMEDIA/emp";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { type Exact } from "~/utils/exact_type";
import {
	FunctionsEnum,
	type FunctionsEnumType,
} from "../api/types/functions_enum";
import { EmployeeTrustService } from "./employee_trust_service";
import {
	type DataComparison,
	type PaidEmployee,
	QuitDateEnum,
	SyncData,
	type SyncInputType,
} from "../api/types/sync_type";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { createEmployeeDataService } from "../api/types/employee_data_type";
import { Op } from "sequelize";
import {
	WorkStatusEnum,
	WorkStatusEnumType,
} from "../api/types/work_status_enum";
import { z } from "zod";
import { EmployeeDataMapper } from "../database/mapper/employee_data_mapper";
import { IncomeTaxSettingService } from "./income_tax_setting_service";
import { workTypeEnum } from "../api/types/work_type_enum";

@injectable()
export class SyncService {
	constructor(
		private readonly ehrService: EHRService,
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeePaymentService: EmployeePaymentService,
		private readonly employeeTrustService: EmployeeTrustService,
		private readonly employeeDataMapper: EmployeeDataMapper,
		private readonly incomeTaxSettingService: IncomeTaxSettingService
	) {}
	// TODO: move this

	// TODO: move this
	// 將EHR資料格式轉換 Salary資料格式
	private readonly excludedKeys: (keyof EmployeeData)[] = [
		"id",
		// "accumulated_bonus",
		"create_date",
		"create_by",
		"update_date",
		"update_by",
	];
	private readonly ehrConfirmKeys: (keyof EmployeeData)[] = [
		// "period_id",
		// "emp_name",
		// "emp_no",
		// "position",
		// "position_type",
		// "group_insurance_type",
		// "department",
		// "cost_category",
		// "work_type",
		// // "work_status",
		// "disabilty_level",
		// "sex_type",
		// "dependents",
		// "healthcare_dependents",
		// "residence_permit_start_date",
		// "residence_permit_end_date",
		// "registration_date",
		// "quit_date",
		// "license_id",
		// // "bank_account_taiwan",
		// // "received_elderly_benefits",
	];
	empToEmployee(
		ehr_data: Emp,
		period_id: number
	): z.infer<typeof createEmployeeDataService> {
		return {
			period_id: period_id,
			emp_no: ehr_data.emp_no,
			emp_name: ehr_data.emp_name,
			position: ehr_data.position,
			position_type: ehr_data.position_type,
			group_insurance_type: ehr_data.group_insurance_type,
			department: ehr_data.department,
			cost_category: ehr_data.cost_category,
			work_type: ehr_data.work_type,
			work_status: ehr_data.work_status,
			disabilty_level: ehr_data.disabilty_level ?? "正常",
			sex_type: ehr_data.sex_type,
			dependents: ehr_data.dependents ?? 0,
			healthcare_dependents: ehr_data.healthcare_dependents ?? 0,
			residence_permit_start_date: ehr_data.residence_permit_start_date,
			residence_permit_end_date: ehr_data.residence_permit_end_date,
			registration_date: ehr_data.registration_date,
			quit_date: ehr_data.quit_date!,
			license_id: ehr_data.license_id!,
			bank_account_taiwan: ehr_data.bank_account_taiwan,
			received_elderly_benefits: ehr_data.received_elderly_benefits,
		};
	}

	dataComparison<ValueT>(
		key: keyof EmployeeData,
		ehrData: ValueT,
		salaryData?: ValueT
	) {
		const isDifferent =
			!this.excludedKeys.includes(key) && ehrData !== salaryData;
		const comparison: DataComparison = {
			key: key,
			salary_value: salaryData ?? null,
			ehr_value: ehrData,
			is_different: isDifferent,
		};

		return comparison;
	}

	compareEmpData<T>(
		ehrEmp: Partial<Exact<T, EmployeeDataDecType>>,
		salaryEmp?: Exact<T, EmployeeDataDecType>
	): SyncData {
		// TODO: change this
		// syncData.english_name = this.dataComparison("english_name", ehrEmp.english_name, salaryEmp?.english_name);
		const pseudo_english_name: DataComparison = {
			key: "english_name",
			salary_value: "",
			ehr_value: "",
			is_different: false,
		};

		const syncData: SyncData = new SyncData({
			emp_no: this.dataComparison(
				"emp_no",
				ehrEmp.emp_no,
				salaryEmp?.emp_no
			),
			name: this.dataComparison(
				"emp_name",
				ehrEmp.emp_name,
				salaryEmp?.emp_name
			),
			department: this.dataComparison(
				"department",
				ehrEmp.department,
				salaryEmp?.department
			),
			english_name: pseudo_english_name,
			comparisons: [],
		});

		syncData.comparisons = [];
		if ("work_status" in ehrEmp) {
			syncData.comparisons.push(
				this.dataComparison(
					"work_status",
					ehrEmp.work_status,
					salaryEmp?.work_status
				)
			);
		}
		if (
			ehrEmp.work_status == WorkStatusEnum.Values.NewEmployeeFullMonth ||
			ehrEmp.work_status ==
				WorkStatusEnum.Values.NewEmployeePartialMonth ||
			ehrEmp.work_status == WorkStatusEnum.Values.NewEmployee
		) {
			for (const key in ehrEmp) {
				if (
					key == "emp_no" ||
					key == "id" ||
					key == "work_status" ||
					key == "department" ||
					key == "emp_name"
				)
					continue;
				syncData.comparisons.push(
					this.dataComparison(
						key as keyof EmployeeData,
						ehrEmp[key],
						salaryEmp?.[key]
					)
				);
			}
		} else {
			for (const key in ehrEmp) {
				if (key == "emp_no" || key == "id" || key == "work_status")
					continue;
				syncData.comparisons.push(
					this.dataComparison(
						key as keyof EmployeeData,
						ehrEmp[key],
						salaryEmp?.[key]
					)
				);
			}
		}

		return syncData;
	}

	// Stage 1
	// 參考salary及ehr的員工數據，回傳理論上需發新的員工數據即有無明顯bug(工作型態與離職日期對不起來)
	async getCandPaidEmployees(
		func: FunctionsEnumType, // 要執行的功能
		period_id: number // 期間
	): Promise<PaidEmployee[]> {
		// 返回需支付的員工數組的Promise
		let cand_paid_emps: PaidEmployee[] = [];
		// 支付工作狀態列表
		const paid_status: WorkStatusEnumType[] = [
			WorkStatusEnum.Values.RegularEmployee,
			WorkStatusEnum.Values.ForeignWorker,
			WorkStatusEnum.Values.ResignedEmployeePartialMonth,
			WorkStatusEnum.Values.ResignedEmployeeFullMonth,
			WorkStatusEnum.Values.NewEmployeePartialMonth,
			WorkStatusEnum.Values.NewEmployeeFullMonth,
		];

		if (func == FunctionsEnum.Enum.month_salary) {
			// 如果功能是月薪計算
			const db_salary_emps_data = await EmployeeData.findAll({
				where: {
					period_id: period_id,
				},
				raw: true,
			});
			const salary_emps_data = await this.employeeDataMapper.decodeList(
				db_salary_emps_data
			);

			// 篩選符合支付工作狀態的員工
			const salary_emps: z.infer<typeof createEmployeeDataService>[] =
				salary_emps_data.filter((emp) => {
					return paid_status.includes(emp.work_status);
				});

			const salary_emp_nos = salary_emps.map((emp) => emp.emp_no); // 提取工資員工的員工編號
			const ehr_emps = await this.ehrService.getEmp(period_id); // 從EHR服務中獲取員工數據

			// 步驟1: 創建ehr_emps的字典
			const ehr_dict: Map<string, Emp> = new Map<string, Emp>();
			ehr_emps.forEach((emp) => {
				ehr_dict.set(emp.emp_no, emp);
			});

			// New employees
			const newEmps: Array<Emp> = [];
			ehr_emps.map((emp) => {
				if (
					emp.change_flag == "當月新進" &&
					!salary_emp_nos.includes(emp.emp_no)
				)
					newEmps.push(emp);
			});
			// 將新員工轉換為Employee
			const new_employees: z.infer<typeof createEmployeeDataService>[] =
				newEmps.map((emp) => this.empToEmployee(emp, period_id));

			const all_emps = salary_emps.concat(new_employees); // 合併所有員工數據

			//假設用EHR資料更新掉衝突部分後的資料
			const updated_all_emps = all_emps.map((salaryEmp) => {
				const matching_ehr_emp = ehr_dict.get(salaryEmp.emp_no);
				return matching_ehr_emp
					? this.empToEmployee(matching_ehr_emp, period_id)
					: salaryEmp;
			});

			const periodInfo = await this.ehrService.getPeriodById(period_id);
			const parsedPeriod = this.ehrService.parsedPeriod(periodInfo);
			// NOTE: check employee work status
			// NOTE: 檢查所有員工的支付狀態有無不合理處
			cand_paid_emps = await Promise.all(
				updated_all_emps.map(async (emp) => {
					let msg = "";
					const quit_date = await this.ehrService.checkQuitDate(
						parsedPeriod,
						emp.quit_date
					);
					switch (emp.work_status) {
						case WorkStatusEnum.Values.RegularEmployee:
							// 檢查不合理的離職日期
							if (
								quit_date !== QuitDateEnum.Values.future &&
								quit_date !== QuitDateEnum.Values.null
							) {
								msg = `一般員工卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						case WorkStatusEnum.Values.ResignedEmployeePartialMonth:
							// 檢查不合理的離職日期
							if (quit_date === QuitDateEnum.Values.null) {
								msg = "當月離職人員卻沒有離職日期";
							} else if (
								quit_date !== QuitDateEnum.Values.current
							) {
								msg = `當月離職人員卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						case WorkStatusEnum.Values.ResignedEmployeeFullMonth:
							// 檢查不合理的離職日期
							if (quit_date === QuitDateEnum.Values.null) {
								msg = "當月離職人員卻沒有離職日期";
							} else if (
								quit_date !== QuitDateEnum.Values.current
							) {
								msg = `當月離職人員卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						case WorkStatusEnum.Values.ResignedEmployee:
							// 檢查不合理的離職日期
							if (quit_date === QuitDateEnum.Values.null) {
								msg = "離職人員卻沒有離職日期";
							} else if (quit_date !== QuitDateEnum.Values.past) {
								msg = `離職人員卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						case WorkStatusEnum.Values.ForeignWorker:
							// 檢查不合理的工作類別
							if (
								emp.work_type !==
								workTypeEnum.Values.ForeignWorker
							) {
								msg = "外勞的工作類別不是外勞";
							}
						default:
							// 檢查不合理的離職日期
							if (
								quit_date !== QuitDateEnum.Values.future &&
								quit_date !== QuitDateEnum.Values.null
							) {
								msg = `有不合理離職日期(${emp.quit_date})`;
							}
							break;
					}

					const cand_paid_emp: PaidEmployee = {
						emp_no: emp.emp_no,
						name: emp.emp_name,
						department: emp.department,
						work_status: emp.work_status,
						quit_date: emp.quit_date,
						bug: msg != "" ? msg : undefined, // 如果消息不為空，將其添加為bug屬性
					};
					return cand_paid_emp; // 返回候選已支付員工對象
				})
			);
		}
		return cand_paid_emps;
	}

	async createNewMonthData(period_id: number, emp_no_list: string[]) {
		const salary_datas = await EmployeeData.findAll({
			where: {
				emp_no: {
					[Op.in]: emp_no_list,
				},
				period_id: period_id,
			},
		});
		const previous_period_id = await this.ehrService.getPreviousPeriodId(
			period_id
		);
		if (salary_datas.length == 0) {
			await Promise.all(
				emp_no_list.map(async (emp_no) => {
					const old_employee_data =
						await this.employeeDataService.getEmployeeDataByEmpNoByPeriod(
							previous_period_id,
							emp_no
						);
					if (!old_employee_data) return;
					const old_work_status = old_employee_data.work_status;
					let new_work_status = old_work_status;
					switch (old_work_status) {
						case WorkStatusEnum.Values.ResignedEmployeePartialMonth:
						case WorkStatusEnum.Values.ResignedEmployeeFullMonth:
							new_work_status =
								WorkStatusEnum.Enum.ResignedEmployee;
							break;
						case WorkStatusEnum.Values.NewEmployeePartialMonth:
						case WorkStatusEnum.Values.NewEmployeeFullMonth:
							new_work_status =
								WorkStatusEnum.Enum.RegularEmployee;
							break;
						default:
							break;
					}
					await this.employeeDataService.createEmployeeData({
						...old_employee_data,
						period_id: period_id,
						work_status: new_work_status,
					});
				})
			);
		}
	}

	// Stage 2
	// 比較salary和ehr的基本資料
	async checkEmployeeData(
		func: FunctionsEnumType,
		period_id: number
	): Promise<SyncData[]> {
		const previous_period_id = await this.ehrService.getPreviousPeriodId(
			period_id
		);
		const previous_paid_emps = await this.getPaidEmps(
			func,
			previous_period_id
		);
		const previous_paid_emp_no_list = previous_paid_emps.map(
			(emp) => emp.emp_no
		);
		await this.createNewMonthData(period_id, previous_paid_emp_no_list); //複製並更新上個月已有的資料
		const cand_paid_emps = await this.getCandPaidEmployees(func, period_id); // 獲取候選需支付員工數據
		const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no); // 提取候選員工的員工編號列表

		// Get Data from Salary and EHR
		let salary_datas: EmployeeDataDecType[] = [];

		if (func == FunctionsEnum.Enum.month_salary) {
			const db_salary_datas = await EmployeeData.findAll({
				where: {
					emp_no: {
						[Op.in]: cand_emp_no_list,
					},
					period_id: period_id,
				},
			});
			salary_datas = await this.employeeDataMapper.decodeList(
				db_salary_datas
			);
		}

		return await this.compareEhrWithSalaryEmployeeData(
			period_id,
			salary_datas,
			cand_emp_no_list
		);
	}

	async compareEhrWithSalaryEmployeeData(
		period_id: number,
		salary_datas: EmployeeDataDecType[],
		cand_emp_no_list: string[]
	): Promise<SyncData[]> {
		const ehr_datas: Emp[] = await this.ehrService.getEmp(period_id);
		const ehr_datas_transformed: z.infer<
			typeof createEmployeeDataService
		>[] = ehr_datas.map((emp) => this.empToEmployee(emp, period_id));

		// Lookup table by EMP_NO
		const ehrDict: Map<string, Partial<EmployeeDataDecType>> = new Map<
			string,
			Partial<EmployeeDataDecType>
		>();
		const salaryDict: Map<string, EmployeeDataDecType> = new Map<
			string,
			EmployeeDataDecType
		>();

		// Union of the emp_no // TODO: Test allEmpNo
		const allEmpNo: string[] = [];
		salary_datas.forEach((emp) => {
			salaryDict.set(emp.emp_no, emp);
			allEmpNo.push(emp.emp_no);
		});

		ehr_datas_transformed.forEach((emp) => {
			ehrDict.set(emp.emp_no, emp);
			if (!allEmpNo.includes(emp.emp_no)) {
				allEmpNo.push(emp.emp_no);
			}
		});

		// Compare data
		const changedDatas: SyncData[] = [];
		for (const cand_emp_no of cand_emp_no_list) {
			// Get data from lookup table
			const ehrEmp = ehrDict.get(cand_emp_no);
			const salaryEmp = salaryDict.get(cand_emp_no);

			if (!ehrEmp) {
				continue;
			}

			const syncData = this.compareEmpData(ehrEmp, salaryEmp);
			const hasDiff = syncData.comparisons.some(
				(data) => data.is_different
			);
			if (hasDiff) changedDatas.push(syncData);
		}

		return changedDatas;
	}

	async filterExcludedColumns(changedDatas: SyncData[] | null) {
		if (!changedDatas) return null;
		return changedDatas.map((data) => {
			return {
				emp_no: data.emp_no,
				name: data.name,
				department: data.department,
				english_name: data.english_name,
				comparisons: data.comparisons.filter((cmp) => {
					return !this.ehrConfirmKeys.includes(
						cmp.key as keyof EmployeeData
					);
				}),
			};
		});
	}

	async synchronize(period_id: number, change_emp_list: SyncInputType[]) {
		// NOTE: All employee data from EHR
		const period = await this.ehrService.getPeriodById(period_id);
		const ehr_datas = await this.ehrService.getEmp(period_id);
		const ehrDict: Map<string, Emp> = new Map<string, Emp>();
		ehr_datas.forEach((emp) => {
			ehrDict.set(emp.emp_no, emp);
		});

		// NOTE: All the employee that needs to be updated
		const changed_emp_nos = change_emp_list.map((emp) => emp.emp_no);

		// All existing employee data from Salary
		const db_salary_datas = await EmployeeData.findAll({
			where: {
				period_id: period_id,
				emp_no: { [Op.in]: changed_emp_nos },
			},
		});
		const salary_datas = await this.employeeDataMapper.decodeList(
			db_salary_datas
		);

		const incomeTaxSetting =
			await this.incomeTaxSettingService.getIncomeTaxSettingByDate(
				period.end_date
			);
		if (!incomeTaxSetting) {
			throw new Error("Income tax setting not found");
		}
		const defaultFoodAllowance = incomeTaxSetting.deduction;

		// Update fields
		const updatedDatas: EmployeeDataDecType[] = [];
		for (const changeEmp of change_emp_list) {
			const ehr_emp_data: z.infer<typeof createEmployeeDataService> =
				this.empToEmployee(ehrDict.get(changeEmp.emp_no)!, period_id);

			let salary_emp_data: EmployeeDataDecType | undefined =
				salary_datas.find((emp) => emp.emp_no == changeEmp.emp_no);
			// Create default employee if not exist
			if (!salary_emp_data) {
				salary_emp_data =
					await this.employeeDataService.createEmployeeData(
						ehr_emp_data
					);

				await this.employeePaymentService.createEmployeePayment({
					emp_no: ehr_emp_data.emp_no,
					long_service_allowance_type:
						LongServiceEnum.Enum.month_allowance,
					start_date: period.start_date,
					end_date: null,
					base_salary: 0,
					food_allowance: defaultFoodAllowance,
					supervisor_allowance: 0,
					occupational_allowance: 0,
					subsidy_allowance: 0,
					long_service_allowance: 0,
					l_r_self_ratio: 0,
					l_i: 0,
					h_i: 0,
					l_r: 0,
					occupational_injury: 0,
					bank_account_foreign: null,
				});

				await this.employeeTrustService.createEmployeeTrust({
					emp_no: ehr_emp_data.emp_no,
					emp_trust_reserve: 0,
					emp_special_trust_incent: 0,
					start_date: new Date(0),
					end_date: null,
				});
			}

			const updatedData: EmployeeDataDecType = salary_emp_data;
			for (const key of changeEmp.keys) {
				const data_key = key as keyof z.infer<
					typeof createEmployeeDataService
				>;
				Object.assign(updatedData, {
					[data_key]: ehr_emp_data[data_key],
				}); // updatedData[data_key] = ehr_emp_data[data_key] as unknown;
			}

			await this.employeeDataService.updateEmployeeDataByEmpNoByPeriod(
				updatedData
			);
			updatedDatas.push(updatedData);

			if (updatedData.quit_date) {
				await this.employeePaymentService.rescheduleEmployeePaymentByQuitDate(
					updatedData.emp_no
				);
				await this.employeeTrustService.rescheduleEmployeeTrustByQuitDate(
					updatedData.emp_no
				);
			}
		}

		return updatedDatas;
	}

	// Stage 3
	// 獲取本期需發薪員工的函數
	async getPaidEmps(
		func: FunctionsEnumType,
		period_id: number
	): Promise<EmployeeDataDecType[]> {
		if (func == FunctionsEnum.Enum.month_salary) {
			// 定義需發薪的員工狀態列表
			// TODO
			const paid_status: WorkStatusEnumType[] = [
				WorkStatusEnum.Values.RegularEmployee,
				WorkStatusEnum.Values.ForeignWorker,
				WorkStatusEnum.Values.ResignedEmployeePartialMonth,
				WorkStatusEnum.Values.ResignedEmployeeFullMonth,
				WorkStatusEnum.Values.NewEmployeePartialMonth,
				WorkStatusEnum.Values.NewEmployeeFullMonth,
			];
			const db_paid_emps = await EmployeeData.findAll({
				where: {
					period_id: period_id,
				},
				order: [["emp_no", "ASC"]],
			});
			const paid_emps = await this.employeeDataMapper.decodeList(
				db_paid_emps
			);
			return paid_emps.filter((emp) =>
				paid_status.includes(emp.work_status)
			);
		} else {
			// 如果功能不是月薪計算, 查找所有需支付的員工數據
			const db_paid_emps = await EmployeeData.findAll({});
			const paid_emps = await this.employeeDataMapper.decodeList(
				db_paid_emps
			);
			return paid_emps;
		}
	}
}
