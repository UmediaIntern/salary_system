import { injectable } from "tsyringe";
import { type ImportFieldsType } from "../api/types/import_type";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { EmployeeTrustService } from "./employee_trust_service";
import { Transaction } from "../database/entity/SALARY/transaction";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { EmployeeBonusService } from "./employee_bonus_service";
import { bonusTypeEnum } from "../api/types/bonus_type_enum";
import { CostCategoryEnum } from "../api/types/cost_category_type";
import { dateToString, dateToStringNullable } from "../api/types/z_utils";
import { EHRService } from "./ehr_service";
import { deleteTransactionAndEmpDatas } from "../api/types/import_api_type";
import { z } from "zod";
import { TransactionService } from "./transaction_service";

@injectable()
export class ImportService {
	constructor(
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeePaymentService: EmployeePaymentService,
		private readonly employeeTrustService: EmployeeTrustService,
		private readonly employeeBonusService: EmployeeBonusService,
		private readonly transactionService: TransactionService,
		private readonly ehrService: EHRService
	) {}

	async checkImportTransaction(period_id: number): Promise<boolean> {
		const transaction = await Transaction.findOne({
			where: {
				period_id: period_id,
			},
		});

		return transaction === null;
	}

	async deleteExistingTransactionAndData(
		period_id: number
	): Promise<z.infer<typeof deleteTransactionAndEmpDatas>> {
		const dataDeleted =
			await this.employeeDataService.dropEmployeeDataPeriod(period_id);

		const paymentDeleted =
			await this.employeePaymentService.dropEmployeePaymentPeriod(
				period_id
			);

		const trustDeleted =
			await this.employeeTrustService.dropEmployeeTrustPeriod(period_id);

		const transactionDeleted =
			await this.transactionService.dropTransactionPeriod(period_id);

		const bonusDeleted =
			await this.employeeBonusService.dropEmployeeBonusPeriod(period_id);

		console.log(`empDataDeleted: ${dataDeleted}`);
		console.log(`empPaymentDeleted: ${paymentDeleted}`);
		console.log(`empTrustDeleted: ${trustDeleted}`);
		console.log(`empBonusDeleted: ${bonusDeleted}`);
		console.log(`transactionDeleted: ${transactionDeleted}`);

		return deleteTransactionAndEmpDatas.parse({
			empDataDeleted: dataDeleted,
			empPaymentDeleted: paymentDeleted,
			empTrustDeleted: trustDeleted,
			empBonusDeleted: bonusDeleted,
			transactionDeleted: transactionDeleted,
		});
	}

	async importTransaction(data: ImportFieldsType[]): Promise<void> {
		console.log("importing transaction");
		const importTransactionTasks = data.map((d) =>
			this.importTransactionRow(d)
		);
		await Promise.all(importTransactionTasks);
	}

	async importTransactionRow(data: ImportFieldsType): Promise<void> {
		await this.employeeDataService.createEmployeeData({
			period_id: data.period_id,
			emp_no: data.emp_no,
			emp_name: data.emp_name,
			position: data.position,
			position_type: data.position_type,
			group_insurance_type: data.group_insurance_type,
			department: data.department,
			cost_category: CostCategoryEnum.Values.成本直接,
			work_type: data.work_type,
			work_status: data.work_status,
			disabilty_level: data.disabilty_level,
			sex_type: data.sex_type,
			dependents: data.dependents,
			healthcare_dependents: data.healthcare_dependents,
			residence_permit_start_date: dateToStringNullable.parse(
				data.residence_permit_start_date
			),
			residence_permit_end_date: dateToStringNullable.parse(
				data.residence_permit_end_date
			),
			registration_date: dateToString.parse(data.registration_date),
			quit_date: dateToStringNullable.parse(data.quit_date),
			license_id: data.license_id,
			bank_account_taiwan: data.bank_account_taiwan,
			received_elderly_benefits: data.received_elderly_benefits,
		});

		const period = await this.ehrService.getPeriodById(data.period_id);

		await this.employeePaymentService.insertEmployeePayment({
			emp_no: data.emp_no,
			base_salary: data.base_salary,
			food_allowance: data.food_allowance,
			supervisor_allowance: data.supervisor_allowance,
			occupational_allowance: data.occupational_allowance,
			subsidy_allowance: data.subsidy_allowance,
			long_service_allowance: data.long_service_allowance,
			long_service_allowance_type: LongServiceEnum.Values.month_allowance,
			l_r_self_ratio:
				data.l_r_self === 0
					? 0
					: parseFloat((data.l_r_self / data.l_r).toFixed(2)) * 100,
			l_i: data.l_i,
			h_i: data.h_i,
			l_r: data.l_r,
			occupational_injury: data.occupational_injury,
			bank_account_foreign: data.bank_account_foreign ?? null,
			start_date: period.start_date,
			end_date: null,
		});

		await this.employeeTrustService.insertEmployeeTrust({
			emp_no: data.emp_no,
			emp_trust_reserve: data.emp_trust_reserve,
			emp_special_trust_incent: data.emp_special_trust_incent,
			start_date: period.start_date,
			end_date: null,
		});

		await this.employeeBonusService.createEmployeeBonus({
			period_id: data.period_id,
			emp_no: data.emp_no,
			bonus_type: bonusTypeEnum.Values.project_bonus,
			special_multiplier: -1,
			multiplier: -1,
			fixed_amount: -1,
			bud_effective_salary: -1,
			bud_amount: -1,
			sup_performance_level: "None",
			sup_effective_salary: -1,
			sup_amount: -1,
			app_performance_level: "None",
			app_effective_salary: -1,
			app_amount: data.project_bonus,
			currency_foreign: null,
			exchange_rate: null,
			currency_amount_foreign: null,
			currency_amount_taiwan: null,
		});

		await this.createTransaction(data);
	}

	async createTransaction(data: ImportFieldsType): Promise<void> {
		await Transaction.create({
			...data,
			// period_id: period_id, // 期別
			issue_date: dateToString.parse(data.issue_date),
			residence_permit_start_date: dateToStringNullable.parse(
				data.residence_permit_start_date
			),
			residence_permit_end_date: dateToStringNullable.parse(
				data.residence_permit_end_date
			),
			registration_date: dateToString.parse(data.registration_date), // TODO: change to date
			quit_date: dateToStringNullable.parse(data.quit_date),
			disabled: false,
			create_by: "system",
			update_by: "system",
			org_trust_reserve: 0,
			org_special_trust_incent: 0,
			operational_performance_bonus: 0,
			quarterly_performance_bonus: 0,
			exchange_rate: 0,
			currency_amount_foreign: 0,
			currency_amount_taiwan: 0,
		});
	}
}
