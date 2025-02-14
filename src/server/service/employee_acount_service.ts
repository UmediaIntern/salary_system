import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { select_value } from "./helper_function";
import { z } from "zod";
import {
	createEmployeeAccountService,
	updateEmployeeAccountService,
} from "../api/types/parameters_input_type";
import { EmployeeAccount } from "../database/entity/SALARY/employee_account";

@injectable()
export class EmployeeAccountService {
	constructor() { }

	async createEmployeeAccount({
		emp_no,
		bank_account,
		ratio,
	}: z.infer<typeof createEmployeeAccountService>): Promise<EmployeeAccount> {
		const newData = await EmployeeAccount.create(
			{
				emp_no: emp_no,
				bank_account: bank_account,
				ratio: ratio,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}

	async getEmployeeAccountById(id: number): Promise<EmployeeAccount | null> {
		const employeeAccount = await EmployeeAccount.findOne(
			{
				where: { id: id },
			}
		);
		return employeeAccount;
	}

	async getEmployeeAccountByEmpNo(emp_no: string): Promise<EmployeeAccount[] | null> {
		const employeeAccountList = await EmployeeAccount.findAll(
			{
				where: {
					disabled: false,
					emp_no: emp_no
				},
			}
		);
		return employeeAccountList;
	}

	async getCurrentEmployeeAccount(): Promise<EmployeeAccount[]> {
		const employeeAccount = await EmployeeAccount.findAll(
			{
				where: { disabled: false },
			}
		);
		return employeeAccount;
	}

	async getAllEmployeeAccount(): Promise<EmployeeAccount[]> {
		const employeeAccount = await EmployeeAccount.findAll(
			{
				where: { disabled: false },
			}
		);
		return employeeAccount;
	}

	async updateEmployeeAccount({
		id,
		emp_no,
		bank_account,
		ratio,
	}: z.infer<typeof updateEmployeeAccountService>): Promise<void> {
		const employeeAccount = await this.getEmployeeAccountById(id);
		if (employeeAccount == null) {
			throw new BaseResponseError("Employee account does not exist");
		}

		await this.deleteEmployeeAcount(id);

		await this.createEmployeeAccount(
			{
				emp_no: select_value(emp_no, employeeAccount.emp_no),
				bank_account: select_value(
					bank_account,
					employeeAccount.bank_account
				),
				ratio: select_value(ratio, employeeAccount.ratio),
			},
		);
	}

	async deleteEmployeeAcount(id: number): Promise<void> {
		const destroyedRows = await EmployeeAccount.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
