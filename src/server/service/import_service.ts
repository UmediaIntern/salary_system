import { injectable } from "tsyringe";
import { type ImportFieldsType } from "../api/types/import_type";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { EmployeeTrustService } from "./employee_trust_service";
import { Transaction } from "../database/entity/SALARY/transaction";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { EmployeeBonusService } from "./employee_bonus_service";
import { bonusTypeEnum } from "../api/types/bonus_type_enum";

@injectable()
export class ImportService {
	constructor(
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeePaymentService: EmployeePaymentService,
		private readonly employeeTrustService: EmployeeTrustService,
		private readonly employeeBonusService: EmployeeBonusService
	) {}

	async importTransaction(data: ImportFieldsType[]): Promise<void> {
    console.log("importing transaction");
    // De-dup the data
    const importTransactionTasks = data.map(d => this.importTransactionRow(d));
    await Promise.all(importTransactionTasks);
  }

	async importTransactionRow(data: ImportFieldsType): Promise<void> {

		// await this.employeeDataService.createEmployeeData({
		// 	period_id: data.period_id,
		// 	emp_no: data.emp_no,
		// 	emp_name: data.emp_name,
		// 	position: data.position,
		// 	position_type: data.position_type,
		// 	group_insurance_type: data.group_insurance_type,
		// 	department: data.department,
		// 	work_type: data.work_type,
		// 	work_status: data.work_status,
		// 	disabilty_level: data.disabilty_level,
		// 	sex_type: data.sex_type,
		// 	dependents: data.dependents,
		// 	healthcare_dependents: data.healthcare_dependents,
		// 	registration_date: data.registration_date,
		// 	quit_date: data.quit_date,
		// 	license_id: data.license_id,
		// 	bank_account_taiwan: data.bank_account_taiwan,
		// 	bank_account_foreign: data.bank_account_foreign,
		// 	received_elderly_benefits: data.received_elderly_benefits,
		// });

		await this.employeePaymentService.insertEmployeePayment({
			emp_no: data.emp_no,
			base_salary: data.base_salary,
			food_allowance: data.food_allowance,
			supervisor_allowance: data.supervisor_allowance,
			occupational_allowance: data.occupational_allowance,
			subsidy_allowance: data.subsidy_allowance,
			long_service_allowance: data.long_service_allowance,
			long_service_allowance_type: LongServiceEnum.Values.month_allowance,
			l_r_self_ratio: parseFloat((data.l_r_self / data.l_r).toFixed(2)),
			l_i: data.l_i,
			h_i: data.h_i,
			l_r: data.l_r,
			occupational_injury: data.occupational_injury,
			start_date: new Date(),
			end_date: null,
		});

		// await this.employeeTrustService.createEmployeeTrust({
		// 	emp_no: data.emp_no,
		// 	emp_trust_reserve: data.emp_trust_reserve,
		// 	emp_special_trust_incent: data.emp_special_trust_incent,
		// 	start_date: new Date(),
		// 	end_date: new Date(),
		// });

		// await this.employeeBonusService.createEmployeeBonus({
		// 	period_id: data.period_id,
		// 	emp_no: data.emp_no,
		// 	bonus_type: bonusTypeEnum.Values.project_bonus,
		// 	special_multiplier: -1,
		// 	multiplier: -1,
		// 	fixed_amount: -1,
		// 	bud_effective_salary: -1,
		// 	bud_amount: -1,
		// 	sup_performance_level: "None",
		// 	sup_effective_salary: -1,
		// 	sup_amount: -1,
		// 	app_performance_level: "None",
		// 	app_effective_salary: -1,
		// 	app_amount: data.project_bonus,
		// 	start_date: new Date(),
		// 	end_date: new Date(),
		// });
		// await this.createTransaction(data);
	}

	async createTransaction(data: ImportFieldsType): Promise<void> {
		await Transaction.create({
			...data,
			// period_id: period_id, // 期別
			disable: false,
			create_by: "system",
			update_by: "system",
		});
	}
}
