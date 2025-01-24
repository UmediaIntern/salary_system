import { container, delay, inject, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import {
	EmployeePayment,
	type EmployeePaymentDecType,
} from "../database/entity/SALARY/employee_payment";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { LevelRangeService } from "./level_range_service";
import { LevelService } from "./level_service";
import {
	type EmployeePaymentFEType,
	employeePaymentCreateService,
	type updateEmployeePaymentService,
} from "../api/types/employee_payment_type";
import { EmployeePaymentMapper } from "../database/mapper/employee_payment_mapper";
import { EmployeeDataService } from "./employee_data_service";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { WorkTypeEnum } from "../api/types/work_type_enum";

@injectable()
export class EmployeePaymentService {
	constructor(
		private readonly employeePaymentMapper: EmployeePaymentMapper,
		private readonly ehrService: EHRService,
		@inject(delay(() => LevelService))
		private readonly levelService: LevelService,
		private readonly levelRangeService: LevelRangeService,
		private readonly employeeDataService: EmployeeDataService
	) { }

	async createEmployeePayment(
		data: z.input<typeof employeePaymentCreateService>
	): Promise<EmployeePayment> {
		const d = employeePaymentCreateService.parse(data);

		const employeePayment = await this.employeePaymentMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await EmployeePayment.create(employeePayment, {
			raw: true,
		});

		return newData;
	}

	async getEmployeePaymentById(
		id: number
	): Promise<EmployeePaymentDecType | null> {
		const employeePayment = await EmployeePayment.findOne({
			where: {
				id: id,
			},
		});

		if (employeePayment == null) {
			return null;
		}

		return await this.employeePaymentMapper.decode(employeePayment);
	}

	async getEmployeePaymentByEmpNo(
		emp_no: string
	): Promise<EmployeePaymentDecType> {
		const employeePayment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				disabled: false,
			},
		});

		if (employeePayment == null) {
			throw new Error(
				`Employee payment does not exist,emp_no: ${emp_no}`
			);
		}

		return await this.employeePaymentMapper.decode(employeePayment);
	}

	async getCurrentEmployeePayment(
		period_id: number
	): Promise<EmployeePaymentFEType[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
			raw: true,
		});

		const employeePaymentList = await Promise.all(
			employeePayment.map(
				async (e) => await this.employeePaymentMapper.decode(e)
			)
		);

		return this.employeePaymentMapper.getEmployeePaymentFE(
			employeePaymentList
		);
	}

	async getCurrentEmployeePaymentById(
		id: number,
		period_id: number
	): Promise<EmployeePaymentDecType[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findAll({
			where: {
				id: id,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
		});

		const employeePaymentList = await Promise.all(
			employeePayment.map(
				async (e) => await this.employeePaymentMapper.decode(e)
			)
		);

		return employeePaymentList;
	}

	async getCurrentEmployeePaymentByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<EmployeePaymentDecType | null> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
		});

		if (employeePayment == null) {
			return null;
		}

		return await this.employeePaymentMapper.decode(employeePayment);
	}

	async getCurrentEmployeePaymentByEmpNoList(
		emp_no_list: string[],
		period_id: number
	): Promise<EmployeePaymentDecType[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findAll({
			where: {
				emp_no: {
					[Op.in]: emp_no_list,
				},
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
		});

		return await this.employeePaymentMapper.decodeList(employeePayment);
	}

	async getCurrentEmployeePaymentByDate(
		date: Date
	): Promise<EmployeePaymentDecType[]> {
		const date_string = get_date_string(date);
		const employeePayment = await EmployeePayment.findAll({
			where: {
				start_date: {
					[Op.lte]: date_string,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date_string }, { [Op.eq]: null }],
				},
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
			raw: true,
		});

		const employeePaymentList = await Promise.all(
			employeePayment.map(
				async (e) => await this.employeePaymentMapper.decode(e)
			)
		);

		return employeePaymentList;
	}

	async getCurrentEmployeePaymentByEmpNoByDate(
		emp_no: string,
		date: Date
	): Promise<EmployeePaymentDecType | null> {
		const date_string = get_date_string(date);
		const employeePayment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: date_string,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date_string }, { [Op.eq]: null }],
				},
				disabled: false,
			},
			raw: true,
		});

		if (employeePayment == null) {
			return null;
		}

		return await this.employeePaymentMapper.decode(employeePayment);
	}

	// TODO: change the return type of this function
	async getAllEmployeePayment(): Promise<EmployeePaymentFEType[][]> {
		const allEmployeePayment = await EmployeePayment.findAll({
			where: {
				disabled: false,
			},
			order: [
				["emp_no", "ASC"],
				["start_date", "DESC"],
			],
			raw: true,
		});

		const decodedEmployeePayments: EmployeePaymentDecType[] =
			await this.employeePaymentMapper.decodeList(allEmployeePayment);

		const employeePaymentList =
			await this.employeePaymentMapper.getEmployeePaymentFE(
				decodedEmployeePayments
			);

		// 将记录按工号分组
		const groupedEmployeePaymenttRecords: Record<
			string,
			EmployeePaymentFEType[]
		> = {};

		employeePaymentList.forEach((r) => {
			if (!groupedEmployeePaymenttRecords[r.emp_no]) {
				groupedEmployeePaymenttRecords[r.emp_no] = [];
			}
			groupedEmployeePaymenttRecords[r.emp_no]!.push(r);
		});

		return Object.values(groupedEmployeePaymenttRecords);
	}

	async getAllFutureEmployeePayment(): Promise<EmployeePaymentFEType[][]> {
		const current_date_string = get_date_string(new Date());
		const allEmployeePayment = await EmployeePayment.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["emp_no", "ASC"],
				["start_date", "DESC"],
			],
			raw: true,
		});

		const decodedEmployeePayments: EmployeePaymentDecType[] =
			await this.employeePaymentMapper.decodeList(allEmployeePayment);

		const employeePaymentList =
			await this.employeePaymentMapper.getEmployeePaymentFE(
				decodedEmployeePayments
			);

		// 将记录按工号分组
		const groupedEmployeePaymenttRecords: Record<
			string,
			EmployeePaymentFEType[]
		> = {};

		employeePaymentList.forEach((r) => {
			if (!groupedEmployeePaymenttRecords[r.emp_no]) {
				groupedEmployeePaymenttRecords[r.emp_no] = [];
			}
			groupedEmployeePaymenttRecords[r.emp_no]!.push(r);
		});

		return Object.values(groupedEmployeePaymenttRecords);
	}

	async updateEmployeePayment(
		data: z.input<typeof updateEmployeePaymentService>
	): Promise<void> {
		const transData = await this.getEmployeePaymentAfterSelectValue(data);
		await this.createEmployeePayment(transData);
		await this.deleteEmployeePayment(data.id);
	}

	async updateEmployeePaymentAndMatchLevel(
		data: z.input<typeof updateEmployeePaymentService>
	): Promise<void> {
		const transData = await this.getEmployeePaymentAfterSelectValue(data);
		const matchedLevelData = await this.getMatchedLevelEmployeePayment(
			transData,
			transData.start_date!
		);

		await this.createEmployeePayment(matchedLevelData);

		await this.deleteEmployeePayment(data.id);
	}

	async deleteEmployeePayment(id: number): Promise<void> {
		const destroyedRows = await EmployeePayment.update(
			{
				disabled: true,
			},
			{
				where: { id: id },
			}
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async autoCalculateEmployeePayment(start_date: Date): Promise<void> {
		const emp_list = await this.getCurrentEmployeePaymentByDate(start_date);

		const promises = emp_list.map(
			async (empPayment: EmployeePaymentDecType) => {
				// TODO: this is bad. (or not?) figure out a systematic way to handle relation between tables
				const quit_date = (
					await this.employeeDataService.getLatestEmployeeDataByEmpNo(
						empPayment.emp_no
					)
				).quit_date;

				if (quit_date != null || empPayment.end_date != null) {
					return;
				}

				const updatedEmployeePayment =
					await this.getMatchedLevelEmployeePayment(
						empPayment,
						start_date
					);

				if (
					empPayment.l_i != updatedEmployeePayment.l_i ||
					empPayment.h_i != updatedEmployeePayment.h_i ||
					empPayment.l_r != updatedEmployeePayment.l_r ||
					empPayment.occupational_injury !=
					updatedEmployeePayment.occupational_injury
				) {
					await this.createEmployeePayment({
						...updatedEmployeePayment,
						start_date: start_date,
						end_date: null,
					});
				}
			}
		);

		await Promise.all(promises);
	}

	async rescheduleEmployeePayment(): Promise<void> {
		const employeePaymentList = await EmployeePayment.findAll({
			where: { disabled: false },
			order: [
				["emp_no", "ASC"],
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});

		for (let i = 0; i < employeePaymentList.length - 1; i += 1) {
			const end_date_string = employeePaymentList[i]!.end_date
				? get_date_string(new Date(employeePaymentList[i]!.end_date!))
				: null;
			const start_date = new Date(employeePaymentList[i + 1]!.start_date);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			const quit_date = (
				await this.employeeDataService.getLatestEmployeeDataByEmpNo(
					employeePaymentList[i]!.emp_no
				)
			).quit_date;
			if (quit_date != null) {
				continue;
			}
			if (
				employeePaymentList[i]!.emp_no ==
				employeePaymentList[i + 1]!.emp_no
			) {
				if (end_date_string != new_end_date_string) {
					if (
						new_end_date_string < employeePaymentList[i]!.start_date
					) {
						await this.deleteEmployeePayment(
							employeePaymentList[i]!.id
						);
					} else {
						await this.updateEmployeePayment({
							id: employeePaymentList[i]!.id,
							end_date: new Date(new_end_date_string),
						});
					}
				}
			} else {
				if (end_date_string != null) {
					await this.updateEmployeePayment({
						id: employeePaymentList[i]!.id,
						end_date: null,
					});
				}
			}
		}
		if (
			employeePaymentList[employeePaymentList.length - 1]!.end_date !=
			null
		) {
			await this.updateEmployeePayment({
				id: employeePaymentList[employeePaymentList.length - 1]!.id,
				end_date: null,
			});
		}
	}

	async rescheduleEmployeePaymentByQuitDate(
		emp_no: string,
		period_id: number
	): Promise<void> {
		const period = await this.ehrService.getPeriodById(period_id);
		const quit_date = period.end_date;
		// TODO: why not use the getAll function
		const employeePaymentList = await EmployeePayment.findAll({
			where: { emp_no: emp_no, disabled: false },
			order: [
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});

		for (const empPayment of employeePaymentList) {
			const start_date_string = get_date_string(
				new Date(empPayment.start_date)
			);
			const end_date_string = empPayment.end_date
				? get_date_string(new Date(empPayment.end_date))
				: null;
			if (start_date_string > quit_date) {
				await this.deleteEmployeePayment(empPayment.id);
			} else if (end_date_string == null || end_date_string > quit_date) {
				await this.updateEmployeePayment({
					id: empPayment.id,
					end_date: new Date(quit_date),
				});
			}
		}
	}

	async adjustBaseSalary(base_salary: number, start_date: Date) {
		const employeePaymentList = await this.getAllEmployeePayment();

		const tasks = [];
		for (const empPayment of employeePaymentList) {
			const [before, after] = this.findSurroundingItems(
				empPayment,
				start_date
			);

			if (!before) {
				throw new BaseResponseError(
					"Employee payment format error: Expect at least one entry in the employee payment list"
				);
			}

			tasks.push(async () => {
				await this.updateEmployeePayment({
					id: before?.id,
					end_date: start_date,
				});
				await this.createEmployeePayment({
					...before,
					start_date: start_date,
					base_salary: base_salary,
					end_date: after?.start_date ?? null,
				});
			});
		}

		await Promise.all(tasks.map((task) => task()));
	}

	// TODO: should not be here
	private findSurroundingItems<T extends { start_date: Date }>(
		items: T[],
		targetDate: Date
	): [T | null, T | null] {
		// Sort the items by start_date
		const sortedItems = items.sort(
			(a, b) => a.start_date.getTime() - b.start_date.getTime()
		);

		let beforeItem: T | null = null;
		let afterItem: T | null = null;

		for (const item of sortedItems) {
			if (item.start_date < targetDate) {
				beforeItem = item;
			} else if (item.start_date >= targetDate && afterItem === null) {
				afterItem = item;
				break;
			}
		}

		return [beforeItem, afterItem];
	}

	private async getEmployeePaymentAfterSelectValue({
		id,
		emp_no,
		base_salary,
		food_allowance,
		supervisor_allowance,
		occupational_allowance,
		subsidy_allowance,
		long_service_allowance,
		long_service_allowance_type,
		l_r_self_ratio,
		l_i,
		h_i,
		l_r,
		occupational_injury,
		start_date,
		end_date,
	}: z.infer<typeof updateEmployeePaymentService>): Promise<
		z.infer<typeof employeePaymentCreateService>
	> {
		const employeePayment = await this.getEmployeePaymentById(id);

		if (employeePayment == null) {
			throw new BaseResponseError("Employee Payment does not exist");
		}

		return {
			emp_no: select_value(emp_no, employeePayment.emp_no),
			base_salary: select_value(base_salary, employeePayment.base_salary),
			food_allowance: select_value(
				food_allowance,
				employeePayment.food_allowance
			),
			supervisor_allowance: select_value(
				supervisor_allowance,
				employeePayment.supervisor_allowance
			),
			occupational_allowance: select_value(
				occupational_allowance,
				employeePayment.occupational_allowance
			),
			subsidy_allowance: select_value(
				subsidy_allowance,
				employeePayment.subsidy_allowance
			),
			long_service_allowance: select_value(
				long_service_allowance,
				employeePayment.long_service_allowance
			),
			long_service_allowance_type: select_value(
				long_service_allowance_type,
				employeePayment.long_service_allowance_type
			),
			l_r_self_ratio: select_value(l_r_self_ratio, employeePayment.l_r_self_ratio),
			l_i: select_value(l_i, employeePayment.l_i),
			h_i: select_value(h_i, employeePayment.h_i),
			l_r: select_value(l_r, employeePayment.l_r),
			occupational_injury: select_value(
				occupational_injury,
				employeePayment.occupational_injury
			),
			start_date: select_value(start_date, employeePayment.start_date),
			end_date: select_value(end_date, employeePayment.end_date),
		};
	}

	private async getMatchedLevelEmployeePayment(
		employeePayment: z.infer<typeof employeePaymentCreateService>,
		date: Date
	): Promise<z.infer<typeof employeePaymentCreateService>> {
		const period_id = await this.ehrService.getPeriodIdByDate(date);
		const employeeData = (await this.employeeDataService.getCurrentEmployeeData(period_id)).find((e) => e.emp_no == employeePayment.emp_no);
		if (employeeData == null) {
			throw new BaseResponseError("Employee Data does not exist");
		}

		const salary =
			employeePayment.base_salary +
			employeePayment.food_allowance +
			employeePayment.supervisor_allowance +
			employeePayment.occupational_allowance +
			employeePayment.subsidy_allowance +
			(employeePayment.long_service_allowance_type == LongServiceEnum.Enum.month_allowance
				? employeePayment.long_service_allowance
				: 0) +
			(employeeData.position >= 2 && employeeData.position <= 3 && employeeData.work_type == WorkTypeEnum.Enum.直接人員
				? 2000
				: 0);

		const result = [];
		const levelRangeList =
			await this.levelRangeService.getCurrentLevelRangeByDate(date);
		for (const levelRange of levelRangeList) {
			const level = await this.levelService.getCurrentLevelBySalaryByDate(
				date,
				salary,
				levelRange.level_start_id,
				levelRange.level_end_id
			);
			result.push({
				type: levelRange.type,
				level: level.level,
			});
		}

		const updatedEmployeePayment = {
			...employeePayment,
			l_i: result.find((r) => r.type === "勞保")?.level ?? 0,
			h_i: result.find((r) => r.type === "健保")?.level ?? 0,
			l_r:
				employeeData.work_type != "外籍勞工" &&
					employeeData.work_status != "外籍勞工"
					? result.find((r) => r.type === "勞退")?.level ?? 0
					: 0,
			occupational_injury:
				result.find((r) => r.type === "職災")?.level ?? 0,
		};

		return updatedEmployeePayment;
	}
}
