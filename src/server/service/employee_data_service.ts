import { container, injectable } from "tsyringe";
import { EmployeeData, EmployeeDataDecType } from "../database/entity/SALARY/employee_data";
import { type z } from "zod";
import {
	type createEmployeeDataService,
	type updateEmployeeDataByEmpNoService,
	type updateEmployeeDataService,
} from "../api/types/employee_data_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";
import { Op } from "sequelize";
import { EmployeeDataMapper } from "../database/mapper/employee_data_mapper";

@injectable()
export class EmployeeDataService {
	/* constructor() {} */

	async createEmployeeData({
		period_id,
		emp_no,
		emp_name,
		position,
		position_type,
		group_insurance_type,
		department,
		work_type,
		work_status,
		disabilty_level,
		sex_type,
		dependents,
		healthcare_dependents,
		registration_date,
		quit_date,
		license_id,
		bank_account_taiwan,
		bank_account_foreign,
		received_elderly_benefits,
	}:
		z.infer<typeof createEmployeeDataService>): Promise<EmployeeData> {
		const newData = await EmployeeData.create({
			period_id: period_id,
			emp_no: emp_no,
			emp_name: emp_name,
			position: position,
			position_type: position_type,
			group_insurance_type: group_insurance_type,
			department: department,
			work_type: work_type,
			work_status: work_status,
			disabilty_level: disabilty_level,
			sex_type: sex_type,
			dependents: dependents,
			healthcare_dependents: healthcare_dependents,
			registration_date: registration_date,
			quit_date: quit_date,
			license_id: license_id,
			bank_account_taiwan: bank_account_taiwan,
			bank_account_foreign: bank_account_foreign,
			received_elderly_benefits: received_elderly_benefits,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getEmployeeDataById(id: number): Promise<EmployeeDataDecType | null> {
		const employeeData = await EmployeeData.findOne({
			where: {
				id: id,
			},
		});
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
		return await employee_data_mapper.decode(employeeData);
	}

	async getEmployeeDataByEmpNoByPeriod(period_id: number, emp_no: string): Promise<EmployeeDataDecType> {
		const employeeData = await EmployeeData.findOne({
			where: {
				emp_no: emp_no,
				period_id: period_id,
			},
		});
		if (employeeData == null) {
			throw new Error(`Employee data does not exist,emp_no: ${emp_no},period_id: ${period_id}`)
		}
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
		return await employee_data_mapper.decode(employeeData);
	}

	async getLatestEmployeeDataByEmpNo(emp_no: string): Promise<EmployeeDataDecType> {
		const employeeData = await EmployeeData.findAll({
			where: {
				emp_no: emp_no,
			},
			order: [["period_id", "DESC"]],
		});
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
    // TODO: why assert??? without check???
		return await employee_data_mapper.decode(employeeData[0]!);
	}

	async getLatestEmployeeDataByEmpNoList(emp_no_list: string[]): Promise<EmployeeDataDecType[]> {
		const candidates = await EmployeeData.findAll({
			where: {
				emp_no: { [Op.in]: emp_no_list },
			},
			order: [["period_id", "DESC"]],
		});
		const employeeDataList = emp_no_list.map((emp_no) => {
			const employeeData = candidates.find((candidate) => candidate.emp_no === emp_no);
			if (employeeData == null) {
				throw new BaseResponseError(`Employee data does not exist, emp_no: ${emp_no}`);
			}
			return employeeData;
		})
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
		return await employee_data_mapper.decodeList(employeeDataList);
	}
	// async getEmployeeDataByEmpNoByDate(date: Date,emp_no: string): Promise<EmployeeDataDecType | null> {
	// 	const ehr_service = container.resolve(EHRService);
	// 	const period_id = await ehr_service.getPeriodIdByDate(date);
	// 	const employeeData = await EmployeeData.findOne({
	// 		where: {
	// 			emp_no: emp_no,
	// 			period_id: period_id,
	// 		},
	// 	});
	// 	const employee_data_mapper = container.resolve(EmployeeDataMapper);
	// 	if (employeeData == null ){
	// 		this.getLatestEmployeeDataByEmpNo(emp_no);
	// 		throw new BaseResponseError("Employee data does not exist");
	// 	}
	// 	return await employee_data_mapper.decode(employeeData);
	// }

	async getEmployeeDataByEmpNoListByPeriod(period_id: number, emp_no_list: string[]): Promise<EmployeeDataDecType[]> {
		const employeeDataList = (await EmployeeData.findAll({
			where: {
				emp_no: {
					[Op.in]: emp_no_list,
				},
				period_id: period_id
			},
		})).filter((employeeData) => emp_no_list.includes(employeeData.emp_no));
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
		return await employee_data_mapper.decodeList(employeeDataList);
	}

	async getCurrentEmployeeData(period_id: number): Promise<EmployeeDataDecType[]> {
		const employeeDataList = await EmployeeData.findAll({
			where: {
				period_id: period_id
			},
		});
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
		return await employee_data_mapper.decodeList(employeeDataList);
	}


	async getAllEmployeeData(): Promise<EmployeeDataDecType[]> {
		const employeeDataList = await EmployeeData.findAll({
			order: [["emp_no", "ASC"]],
		});
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
		return await employee_data_mapper.decodeList(employeeDataList);
	}

	async getAllEmployeeDataByPeriod(period_id: number): Promise<EmployeeDataDecType[]> {
		const employeeDataList = await EmployeeData.findAll({
			where: {
				period_id: period_id
			},
			order: [["emp_no", "ASC"]],
		});
		const employee_data_mapper = container.resolve(EmployeeDataMapper);
		return await employee_data_mapper.decodeList(employeeDataList);
	}

	async updateEmployeeData({
		id,
		period_id,
		emp_no,
		emp_name,
		position,
		position_type,
		group_insurance_type,
		department,
		work_type,
		work_status,
		disabilty_level,
		sex_type,
		dependents,
		healthcare_dependents,
		registration_date,
		quit_date,
		license_id,
		bank_account_taiwan,
		bank_account_foreign,
		received_elderly_benefits,
	}:
		z.infer<typeof updateEmployeeDataService>): Promise<void> {
		const employeeData = await this.getEmployeeDataById(id);
		if (employeeData == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeData.update(
			{
				period_id: select_value(period_id, employeeData.period_id),
				emp_no: select_value(emp_no, employeeData.emp_no),
				emp_name: select_value(emp_name, employeeData.emp_name),
				position: select_value(position, employeeData.position),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				group_insurance_type: select_value(
					group_insurance_type,
					employeeData.group_insurance_type
				),
				department: select_value(department, employeeData.department),
				work_type: select_value(work_type, employeeData.work_type),
				work_status: select_value(
					work_status,
					employeeData.work_status
				),
				disabilty_level: select_value(
					disabilty_level,
					employeeData.disabilty_level
				),
				sex_type: select_value(sex_type, employeeData.sex_type),
				dependents: select_value(dependents, employeeData.dependents),
				healthcare_dependents: select_value(
					healthcare_dependents,
					employeeData.healthcare_dependents
				),
				registration_date: select_value(
					registration_date,
					employeeData.registration_date
				),
				quit_date: select_value(quit_date, employeeData.quit_date),
				license_id: select_value(license_id, employeeData.license_id),
				bank_account_taiwan: select_value(
					bank_account_taiwan,
					employeeData.bank_account_taiwan
				),
				bank_account_foreign: select_value(
					bank_account_foreign,
					employeeData.bank_account_foreign
				),
				received_elderly_benefits: select_value(
					received_elderly_benefits,
					employeeData.received_elderly_benefits
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async updateEmployeeDataByEmpNoByPeriod({
		period_id,
		emp_no,
		emp_name,
		position,
		position_type,
		group_insurance_type,
		department,
		work_type,
		work_status,
		disabilty_level,
		sex_type,
		dependents,
		healthcare_dependents,
		registration_date,
		quit_date,
		license_id,
		bank_account_taiwan,
		bank_account_foreign,
		received_elderly_benefits,
	}:
		z.infer<typeof updateEmployeeDataByEmpNoService>): Promise<void> {
		const employeeData = await this.getEmployeeDataByEmpNoByPeriod(period_id!, emp_no!);
		if (employeeData == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeData.update(
			{
				emp_no: select_value(emp_no, employeeData.emp_no),
				emp_name: select_value(emp_name, employeeData.emp_name),
				position: select_value(position, employeeData.position),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				group_insurance_type: select_value(
					group_insurance_type,
					employeeData.group_insurance_type
				),
				department: select_value(department, employeeData.department),
				work_type: select_value(work_type, employeeData.work_type),
				work_status: select_value(
					work_status,
					employeeData.work_status
				),
				disabilty_level: select_value(
					disabilty_level,
					employeeData.disabilty_level
				),
				sex_type: select_value(sex_type, employeeData.sex_type),
				dependents: select_value(dependents, employeeData.dependents),
				healthcare_dependents: select_value(
					healthcare_dependents,
					employeeData.healthcare_dependents
				),
				registration_date: select_value(
					registration_date,
					employeeData.registration_date
				),
				quit_date: select_value(quit_date, employeeData.quit_date),
				license_id: select_value(license_id, employeeData.license_id),
				bank_account_taiwan: select_value(
					bank_account_taiwan,
					employeeData.bank_account_taiwan
				),
				bank_account_foreign: select_value(
					bank_account_foreign,
					employeeData.bank_account_foreign
				),
				received_elderly_benefits: select_value(
					received_elderly_benefits,
					employeeData.received_elderly_benefits
				),
				update_by: "system",
			},
			{ where: { emp_no: emp_no } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteEmployeeData(id: number): Promise<void> {
		const destroyedRows = await EmployeeData.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
