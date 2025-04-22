import { delay, inject, injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import { Op } from "sequelize";
import {
	EmployeeTrust,
	type EmployeeTrustDecType,
	type encEmployeeTrust,
} from "../database/entity/SALARY/employee_trust";
import { EHRService } from "./ehr_service";
import {
	employeeTrustCreateService,
	type employeeTrustFE,
	type updateEmployeeTrustService,
} from "../api/types/employee_trust_type";
import { EmployeeTrustMapper } from "../database/mapper/employee_trust_mapper";
import { dateToString, stringToDate } from "../api/types/z_utils";
import { EmployeeDataService } from "./employee_data_service";

type EmployeeTrustMapperType = EmployeeTrustMapper;

@injectable()
export class EmployeeTrustService {
	constructor(
		@inject(delay(() => EmployeeTrustMapper))
		private readonly employeeTrustMapper: EmployeeTrustMapperType,
		private readonly ehrService: EHRService,
		private readonly employeeDataService: EmployeeDataService
	) {}

	async createEmployeeTrust(
		data: z.input<typeof employeeTrustCreateService>
	): Promise<EmployeeTrust> {
		const d = employeeTrustCreateService.parse(data);

		const create_input = {
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		};

		const employeeTrust = await this.employeeTrustMapper.encode(
			create_input
		);

		const newData = await EmployeeTrust.create(employeeTrust, {
			raw: true,
		});

		await this.createAndScheduleEmployeeTrust(newData.id, create_input);

		return newData;
	}

	async getEmployeeTrustById(
		id: number
	): Promise<EmployeeTrustDecType | null> {
		const employeeTrust = await EmployeeTrust.findOne({
			where: {
				id: id,
			},
			raw: true,
		});

		if (employeeTrust == null) {
			return null;
		}

		return await this.employeeTrustMapper.decode(employeeTrust);
	}

	async getAllEmployeeTrust(): Promise<EmployeeTrustDecType[]> {
		const employeeTrust = await EmployeeTrust.findAll({
			where: { disabled: false },
			order: [["emp_no", "ASC"]],
		});

		return await this.employeeTrustMapper.decodeList(employeeTrust);
	}

	async getAllEmployeeTrustByEmpNo(
		emp_no: string
	): Promise<EmployeeTrustDecType[]> {
		const employeeTrust = await EmployeeTrust.findAll({
			where: { disabled: false, emp_no: emp_no },
			order: [["emp_no", "ASC"]],
			raw: true,
		});

		return await this.employeeTrustMapper.decodeList(employeeTrust);
	}

	async getCurrentEmployeeTrustByEmpNoByDate(
		emp_no: string,
		date: Date
	): Promise<EmployeeTrustDecType> {
		const date_str = dateToString.parse(date);

		const employeeTrust = await EmployeeTrust.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: date_str,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date_str }, { [Op.eq]: null }],
				},
				disabled: false,
			},
			raw: true,
		});

		if (employeeTrust == null) {
			throw new BaseResponseError("Employee Trust does not exist");
		}

		return await this.employeeTrustMapper.decode(employeeTrust);
	}

  // TODO: why are these FE shit here?
	async getCurrentEmployeeTrustFE(
		period_id: number
	): Promise<z.infer<typeof employeeTrustFE>[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date = stringToDate.parse(period.end_date);

		// 获取所有的员工信任记录
		const allEmployeeTrustRecords = await this.getAllEmployeeTrust();
		if (allEmployeeTrustRecords == null) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		// 将记录按工号分组
		const groupedEmployeeTrustRecords: Record<
			string,
			EmployeeTrustDecType[]
		> = {};

		allEmployeeTrustRecords.forEach((record) => {
			if (!groupedEmployeeTrustRecords[record.emp_no]) {
				groupedEmployeeTrustRecords[record.emp_no] = [];
			}
			groupedEmployeeTrustRecords[record.emp_no]!.push(record);
		});

		// 将分组后的记录转换为数组格式，并映射为前端格式
		const groupedRecordsArray = Object.values(groupedEmployeeTrustRecords);
		const allEmployeeTrustFE = await Promise.all(
			groupedRecordsArray.map(
				async (employeeTrustList) =>
					await this.employeeTrustMapper.getEmployeeTrustFE(
						employeeTrustList
					)
			)
		);

		const current_employee_trustFE = await Promise.all(
			allEmployeeTrustFE.map((emp_trust_list) => {
				const current_emp_trust = emp_trust_list.find((emp_trust) => {
					return (
						emp_trust.start_date! <= current_date &&
						(emp_trust.end_date == null ||
							emp_trust.end_date >= current_date)
					);
				});
				if (current_emp_trust) {
					return current_emp_trust;
				}
				return null;
			})
		);
		return current_employee_trustFE.filter(
			(emp_trust) => emp_trust != null
		);
	}

	async getCurrentEmployeeTrustFEByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<z.infer<typeof employeeTrustFE>> {
		const current_emp_trustFE = await this.getCurrentEmployeeTrustFE(
			period_id
		);
		return current_emp_trustFE.filter(
			(emp_trust) => emp_trust.emp_no == emp_no
		)[0]!;
	}

	async getAllEmployeeTrustFE(): Promise<
		z.infer<typeof employeeTrustFE>[][]
	> {
		const allEmployeeTrustRecords = await this.getAllEmployeeTrust();
		if (allEmployeeTrustRecords == null) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		// Group by emp_no
		const groupedEmployeeTrustRecords: Record<
			string,
			EmployeeTrustDecType[]
		> = {};

		allEmployeeTrustRecords.forEach((record) => {
			if (!groupedEmployeeTrustRecords[record.emp_no]) {
				groupedEmployeeTrustRecords[record.emp_no] = [];
			}
			groupedEmployeeTrustRecords[record.emp_no]!.push(record);
		});

		const groupedRecordsArray = Object.values(groupedEmployeeTrustRecords);
		const allEmployeeTrustFE = await Promise.all(
			groupedRecordsArray.map(
				async (employeeTrustList) =>
					await this.employeeTrustMapper.getEmployeeTrustFE(
						employeeTrustList
					)
			)
		);
		return allEmployeeTrustFE;
	}

	async updateEmployeeTrust({
		id,
		emp_no,
		emp_trust_reserve,
		emp_special_trust_incent,
		start_date,
		end_date,
	}: z.infer<typeof updateEmployeeTrustService>): Promise<void> {
		const employeeTrust = await this.getEmployeeTrustById(id);
		if (employeeTrust == null) {
			throw new BaseResponseError("Employee Trust does not exist");
		}

		await this.deleteEmployeeTrust(id);

		await this.createEmployeeTrust({
			emp_no: select_value(emp_no, employeeTrust.emp_no),
			emp_trust_reserve: select_value(
				emp_trust_reserve,
				employeeTrust.emp_trust_reserve
			),
			emp_special_trust_incent: select_value(
				emp_special_trust_incent,
				employeeTrust.emp_special_trust_incent
			),
			start_date: select_value(start_date, employeeTrust.start_date),
			end_date: select_value(end_date, employeeTrust.end_date),
		});
	}

	async deleteEmployeeTrust(id: number): Promise<void> {
		const destroyedRows = await EmployeeTrust.update(
			{ disabled: true },
			{
				where: { id: id },
			}
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleEmployeeTrust(): Promise<void> {
		const employeeTrustList = await EmployeeTrust.findAll({
			where: { disabled: false },
			order: [
				["emp_no", "ASC"],
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});
		for (let i = 0; i < employeeTrustList.length - 1; i += 1) {
			const end_date_string = employeeTrustList[i]!.end_date
				? get_date_string(new Date(employeeTrustList[i]!.end_date!))
				: null;
			const start_date = new Date(employeeTrustList[i + 1]!.start_date);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			const quit_date = (
				await this.employeeDataService.getLatestEmployeeDataByEmpNo(
					employeeTrustList[i]!.emp_no
				)
			).quit_date;
			if (quit_date != null) {
				continue;
			}
			if (
				employeeTrustList[i]!.emp_no == employeeTrustList[i + 1]!.emp_no
			) {
				if (end_date_string != new_end_date_string) {
					if (
						new_end_date_string < employeeTrustList[i]!.start_date
					) {
						await this.deleteEmployeeTrust(
							employeeTrustList[i]!.id
						);
					} else {
						await this.updateEmployeeTrust({
							id: employeeTrustList[i]!.id,
							end_date: new Date(new_end_date_string),
						});
					}
				}
			} else if (end_date_string != null) {
				await this.updateEmployeeTrust({
					id: employeeTrustList[i]!.id,
					end_date: null,
				});
			}
		}
		if (employeeTrustList[employeeTrustList.length - 1]!.end_date != null) {
			await this.updateEmployeeTrust({
				id: employeeTrustList[employeeTrustList.length - 1]!.id,
				end_date: null,
			});
		}
	}

	async rescheduleEmployeeTrustByQuitDate(
		emp_no: string,
		period_id: number
	): Promise<void> {
		const period = await this.ehrService.getPeriodById(period_id);
		const quit_date = period.end_date;
		const encList = await EmployeeTrust.findAll({
			where: { emp_no: emp_no, disabled: false },
			order: [
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});

		const employeeTrustList = await this.employeeTrustMapper.decodeList(
			encList
		);

		for (const emp_trust of employeeTrustList) {
			const start_date_string = get_date_string(emp_trust.start_date);
			const end_date_string = emp_trust.end_date
				? get_date_string(emp_trust.end_date)
				: null;

			if (start_date_string > quit_date) {
				await this.deleteEmployeeTrust(emp_trust.id);
			} else if (end_date_string == null || end_date_string > quit_date) {
				await this.updateEmployeeTrust({
					id: emp_trust.id,
					end_date: new Date(quit_date),
				});
			}
		}
	}

	async createAndScheduleEmployeeTrust(
		new_emp_id: number,
		new_emp_trust: z.input<typeof encEmployeeTrust>
	): Promise<void> {
		const new_emp_trust_end_date = new_emp_trust.end_date
			? new Date(new_emp_trust.end_date)
			: null;
		const allEmployeeTrust = (
			await this.getAllEmployeeTrustByEmpNo(new_emp_trust.emp_no)
		).filter((emp_trust) => emp_trust.id != new_emp_id);

		// );
		//左端在裡面
		const startOverlapList = allEmployeeTrust.filter(
			(emp_trust) =>
				new_emp_trust.end_date !== null &&
				emp_trust.start_date <= new_emp_trust.end_date &&
				emp_trust.start_date >= new_emp_trust.start_date &&
				(emp_trust.end_date == null ||
					emp_trust.end_date > new_emp_trust.end_date)
		);
		//兩端都在裡面
		const twoEndInsideList = allEmployeeTrust.filter(
			(emp_trust) =>
				emp_trust.start_date >= new_emp_trust.start_date &&
				(new_emp_trust.end_date == null ||
					(emp_trust.end_date
						? emp_trust.end_date <= new_emp_trust.end_date
						: false))
		);
		//新資料被包在裡面
		const twoEndOutsideList = allEmployeeTrust.filter(
			(emp_trust) =>
				emp_trust.start_date < new_emp_trust.start_date &&
				new_emp_trust.end_date !== null &&
				(emp_trust.end_date
					? emp_trust.end_date > new_emp_trust.end_date
					: true)
		);

		await Promise.all(
			startOverlapList.map(async (emp_trust) => {
				await this.updateEmployeeTrust({
					id: emp_trust.id,
					start_date: new Date(
						new_emp_trust_end_date!.setDate(
							new_emp_trust_end_date!.getDate() + 1
						)
					),
				});
			})
		);

		await Promise.all(
			twoEndInsideList.map(async (emp_trust) => {
				await this.deleteEmployeeTrust(emp_trust.id);
			})
		);

		await Promise.all(
			twoEndOutsideList.map(async (emp_trust) => {
				await this.createEmployeeTrust({
					emp_no: emp_trust.emp_no,
					emp_trust_reserve: emp_trust.emp_trust_reserve,
					emp_special_trust_incent:
						emp_trust.emp_special_trust_incent,
					start_date: new Date(
						new_emp_trust_end_date!.setDate(
							new_emp_trust_end_date!.getDate() + 1
						)
					),
					end_date: emp_trust.end_date,
				});
			})
		);
	}
}
