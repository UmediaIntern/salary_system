import { injectable } from "tsyringe";
import {
	EmployeeData,
	type EmployeeDataDecType,
} from "../database/entity/SALARY/employee_data";
import { type z } from "zod";
import {
	createEmployeeDataService,
	type updateEmployeeDataByEmpNoService,
	type updateEmployeeDataService,
} from "../api/types/employee_data_type";
import { BaseResponseError } from "../errors/base_response_error";
import { select_value } from "./helper_function";
import { Op } from "sequelize";
import { EmployeeDataMapper } from "../database/mapper/employee_data_mapper";
import { InternalServerError } from "../errors/internal_server_error";
import { convertToDBWorkStatusEnum } from "../api/types/work_status_enum";
import { ParserError } from "../errors/parser_error";

@injectable()
export class EmployeeDataService {
	constructor(private readonly employeeDataMapper: EmployeeDataMapper) { }

	async createEmployeeData(
		data: z.infer<typeof createEmployeeDataService>
	): Promise<EmployeeDataDecType> {
		const result = createEmployeeDataService.safeParse(data);

    if (!result.success) {
			throw new ParserError(result.error.message);
		}
		const d = result.data;

		const employeeBonus = await this.employeeDataMapper.encode({
			...d,
			create_by: "system",
			update_by: "system",
		});

		const db_newData = await EmployeeData.create(employeeBonus, {
			raw: true,
		});

		const newData = await this.employeeDataMapper.decode(db_newData);
		return newData;
	}

	async getEmployeeDataById(id: number): Promise<EmployeeDataDecType | null> {
		const employeeData = await EmployeeData.findOne({
			where: {
				id: id,
			},
		});
		return await this.employeeDataMapper.decode(employeeData);
	}

	async getEmployeeDataByEmpNoByPeriod(
		period_id: number,
		emp_no: string
	): Promise<EmployeeDataDecType> {
		const employeeData = await EmployeeData.findOne({
			where: {
				emp_no: emp_no,
				period_id: period_id,
			},
		});
		if (employeeData == null) {
			throw new Error(
				`Employee data does not exist,emp_no: ${emp_no},period_id: ${period_id}`
			);
		}
		return await this.employeeDataMapper.decode(employeeData);
	}

	async getLatestEmployeeDataByEmpNo(
		emp_no: string
	): Promise<EmployeeDataDecType> {
		const employeeData = await EmployeeData.findAll({
			where: {
				emp_no: emp_no,
			},
			order: [["period_id", "DESC"]],
		});
		const latest_emp = employeeData[0];
		if (!latest_emp) {
			throw new BaseResponseError(
				`Employee data does not exist, emp_no: ${emp_no}`
			);
		}
		return await this.employeeDataMapper.decode(latest_emp);
	}

	async getLatestEmployeeDataByEmpNoList(
		emp_no_list: string[]
	): Promise<EmployeeDataDecType[]> {
		const candidates = await EmployeeData.findAll({
			where: {
				emp_no: { [Op.in]: emp_no_list },
			},
			order: [["period_id", "DESC"]],
		});
		const employeeDataList = emp_no_list.map((emp_no) => {
			const employeeData = candidates.find(
				(candidate) => candidate.emp_no === emp_no
			);
			if (employeeData == null) {
				throw new BaseResponseError(
					`Employee data does not exist, emp_no: ${emp_no}`
				);
			}
			return employeeData;
		});
		return await this.employeeDataMapper.decodeList(employeeDataList);
	}

	async getEmployeeDataByEmpNoListByPeriod(
		period_id: number,
		emp_no_list: string[]
	): Promise<EmployeeDataDecType[]> {
		const employeeDataList = (
			await EmployeeData.findAll({
				where: {
					emp_no: {
						[Op.in]: emp_no_list,
					},
					period_id: period_id,
				},
			})
		).filter((employeeData) => emp_no_list.includes(employeeData.emp_no));
		return await this.employeeDataMapper.decodeList(employeeDataList);
	}

	async getCurrentEmployeeData(
		period_id: number
	): Promise<EmployeeDataDecType[]> {
		const employeeDataList = await EmployeeData.findAll({
			where: {
				period_id: period_id,
			},
			order: [["emp_no", "ASC"]],
		});
		return await this.employeeDataMapper.decodeList(employeeDataList);
	}

	async getAllEmployeeData(): Promise<EmployeeDataDecType[]> {
		const employeeDataList = await EmployeeData.findAll({
			order: [["emp_no", "ASC"]],
		});
		return await this.employeeDataMapper.decodeList(employeeDataList);
	}

	async getAllEmployeeDataByPeriod(
		period_id: number
	): Promise<EmployeeDataDecType[]> {
		const employeeDataList = await EmployeeData.findAll({
			where: {
				period_id: period_id,
			},
			order: [["emp_no", "ASC"]],
		});
		return await this.employeeDataMapper.decodeList(employeeDataList);
	}

	async updateEmployeeData(
		data: z.infer<typeof updateEmployeeDataService>
	): Promise<void> {
		const employeeData = await this.getEmployeeDataById(data.id);
		if (employeeData == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const updateEmployeeData = await this.getEmployeeDataAfterSelectValue(
			data,
			employeeData
		);

		const affectedCount = await EmployeeData.update(
			{
				period_id: select_value(data.period_id, employeeData.period_id),
				...updateEmployeeData,
				// TODO
				work_status: updateEmployeeData.work_status
					? convertToDBWorkStatusEnum(updateEmployeeData.work_status)
					: undefined,
				update_by: "system",
			},
			{ where: { id: data.id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async updateEmployeeDataByEmpNoByPeriod(
		data: z.infer<typeof updateEmployeeDataByEmpNoService>
	): Promise<void> {
		if (!data.period_id || !data.emp_no) {
			throw new InternalServerError(
				`period id or emp no is undefined. period id: ${data.period_id}, emp no: ${data.emp_no}`
			);
		}

		const employeeData = await this.getEmployeeDataByEmpNoByPeriod(
			data.period_id,
			data.emp_no
		);

		if (employeeData == null) {
			throw new InternalServerError("Employee account does not exist");
		}
		const updateEmployeeData = await this.getEmployeeDataAfterSelectValue(
			data,
			employeeData
		);
		const affectedCount = await EmployeeData.update(
			{
				...updateEmployeeData,
				// TODO
				work_status: updateEmployeeData.work_status
					? convertToDBWorkStatusEnum(updateEmployeeData.work_status)
					: undefined,
				update_by: "system",
			},
			{ where: { emp_no: data.emp_no } }
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

	private async getEmployeeDataAfterSelectValue(
		{
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
		}: z.infer<typeof updateEmployeeDataByEmpNoService>,
		employee_data: EmployeeDataDecType
	): Promise<z.infer<typeof updateEmployeeDataByEmpNoService>> {
		return {
			emp_no: select_value(emp_no, employee_data.emp_no),
			emp_name: select_value(emp_name, employee_data.emp_name),
			position: select_value(position, employee_data.position),
			position_type: select_value(
				position_type,
				employee_data.position_type
			),
			group_insurance_type: select_value(
				group_insurance_type,
				employee_data.group_insurance_type
			),
			department: select_value(department, employee_data.department),
			work_type: select_value(work_type, employee_data.work_type),
			work_status: select_value(work_status, employee_data.work_status),
			disabilty_level: select_value(
				disabilty_level,
				employee_data.disabilty_level
			),
			sex_type: select_value(sex_type, employee_data.sex_type),
			dependents: select_value(dependents, employee_data.dependents),
			healthcare_dependents: select_value(
				healthcare_dependents,
				employee_data.healthcare_dependents
			),
			registration_date: select_value(
				registration_date,
				employee_data.registration_date
			),
			quit_date: select_value(quit_date, employee_data.quit_date),
			license_id: select_value(license_id, employee_data.license_id),
			bank_account_taiwan: select_value(
				bank_account_taiwan,
				employee_data.bank_account_taiwan
			),
			bank_account_foreign: select_value(
				bank_account_foreign,
				employee_data.bank_account_foreign
			),
			received_elderly_benefits: select_value(
				received_elderly_benefits,
				employee_data.received_elderly_benefits
			),
		};
	}
}
