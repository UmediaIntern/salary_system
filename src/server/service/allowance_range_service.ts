import { container, injectable } from "tsyringe";
import { AllowanceRangeMapper } from "../database/mapper/allowance_range_mapper";
import { createAllowanceRangeService, updateAllowanceRangeService } from "../api/types/allowance_range_type";
import { AllowanceRange, AllowanceRangeDecType } from "../database/entity/SALARY/allowance_range";
import { z } from "zod";
import { AllowanceTypeEnumType } from "../api/types/allowance_type_enum";
import { EmployeeDataDecType } from "../database/entity/SALARY/employee_data";
import { EHRService } from "./ehr_service";
import { dateToString } from "../api/types/z_utils";
import { Op } from "sequelize";
import { get_date_string, select_value } from "./helper_function";
import { BaseResponseError } from "../errors/base_response_error";

@injectable()
export class AllowanceRangeService {
	constructor(
		private readonly allowanceRangeMapper: AllowanceRangeMapper,
		readonly ehrService: EHRService
	) { }

	async createAllowanceRange(
		data: z.infer<typeof createAllowanceRangeService>
	): Promise<AllowanceRange> {
		const result = createAllowanceRangeService.safeParse(data);
		if (!result.success) {
			throw new Error(result.error.message);
		}
		const d = result.data;
		const allowance_range = await this.allowanceRangeMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			create_by: "system",
			update_by: "system",
			disabled: false
		});
		const db_newData = await AllowanceRange.create(allowance_range, {
			raw: true,
		});
		return db_newData;
	}

	async batchCreateAllowanceRange(
		data: z.infer<typeof createAllowanceRangeService>[]
	): Promise<AllowanceRange[]> {
		const results = await Promise.all(
			data.map((item) => this.createAllowanceRange(item))
		);
		return results;
	}

	async getAllowanceRangeById(id: number): Promise<AllowanceRangeDecType | null> {
		const allowance_range = await AllowanceRange.findOne({
			where: { id },
		});
		return this.allowanceRangeMapper.decode(allowance_range);
	}

	async getCurrentAllowanceRangeByPositionAndAllowanceType(
		period_id: number,
		position: string,
		position_type: string,
		allowance_type: AllowanceTypeEnumType
	): Promise<AllowanceRangeDecType | null> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const allowance_range = await AllowanceRange.findOne({
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
				position: position,
				position_type: position_type,
				allowance_type: allowance_type,
				disabled: false,
			},
		});
		return this.allowanceRangeMapper.decode(allowance_range);
	}

	async getCurrentAllowanceRange(period_id: number): Promise<AllowanceRangeDecType[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const allowance_range = await AllowanceRange.findAll({
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
			order: [
				["position", "ASC"],
				["position_type", "ASC"],
				["allowance_type", "ASC"],
			]
		});
		return await this.allowanceRangeMapper.decodeList(allowance_range);
	}

	async getAllAllowanceRange(): Promise<AllowanceRangeDecType[][]> {
		const allowanceRange = await AllowanceRange.findAll({
			where: {
				disabled: false,
			},
			order: [
				["start_date", "ASC"],
				["position", "ASC"],
				["position_type", "ASC"],
				["allowance_type", "ASC"],
			],
			raw: true
		});
		const data_array = await this.allowanceRangeMapper.decodeList(allowanceRange);
		const groupedAllowanceRangeRecords: Record<
			string,
			AllowanceRangeDecType[]
		> = {};
		data_array.forEach((d) => {
			let key = "";
			if (d.end_date == null) {
				key = get_date_string(d.start_date);
			} else
				key =
					get_date_string(d.start_date) + get_date_string(d.end_date);
			if (!groupedAllowanceRangeRecords[key]) {
				groupedAllowanceRangeRecords[key] = [];
			}
			groupedAllowanceRangeRecords[key]!.push(d);
		});
		const grouped_array = Object.values(groupedAllowanceRangeRecords).sort(
			(a, b) => {
				if (a[0]!.start_date > b[0]!.start_date) {
					return -1;
				} else if (a[0]!.start_date < b[0]!.start_date) {
					return 1;
				} else if (a[0]!.end_date == null) {
					return -1;
				} else if (b[0]!.end_date == null) {
					return 1;
				} else if (a[0]!.end_date > b[0]!.end_date) {
					return -1;
				} else return 1;
			}
		);

		return grouped_array;
	}

	async getAllFutureAllowanceRange(): Promise<AllowanceRangeDecType[]> {
		const current_date_string = get_date_string(new Date());
		const allowance_range = await AllowanceRange.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["start_date", "ASC"],
				["position", "ASC"],
				["position_type", "ASC"],
				["allowance_type", "ASC"],
			],
			raw: true,
		});
		return await this.allowanceRangeMapper.decodeList(allowance_range);
	}

	async updateAllowanceRange(data: z.infer<typeof updateAllowanceRangeService>): Promise<void> {
		const transData = await this.getAllowanceRangeAfterSelectValue(data);
		await this.createAllowanceRange(transData);
		await this.deleteAllowanceRange(data.id);
	}

	async deleteAllowanceRange(id: number): Promise<void> {
		const destroyedRows = await AllowanceRange.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleAllowanceRange(): Promise<void> {
		const encodedList = await AllowanceRange.findAll({
			where: { disabled: false },
			order: [
				["position", "ASC"],
				["position_type", "ASC"],
				["allowance_type", "ASC"],
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});
		const allowanceRangeList = await this.allowanceRangeMapper.decodeList(
			encodedList
		);
		for (let i = 0; i < allowanceRangeList.length - 1; i += 1) {
			const end_date = allowanceRangeList[i]!.end_date!;
			const start_date = allowanceRangeList[i + 1]!.start_date;
			const new_end_date = new Date(start_date);
			new_end_date.setDate(new_end_date.getDate() - 1);
			if (
				allowanceRangeList[i]!.position ==
				allowanceRangeList[i + 1]!.position &&
				allowanceRangeList[i]!.position_type ==
				allowanceRangeList[i + 1]!.position_type &&
				allowanceRangeList[i]!.allowance_type ==
				allowanceRangeList[i + 1]!.allowance_type
			) {
				if (end_date != new_end_date) {
					if (new_end_date < allowanceRangeList[i]!.start_date) {
						await this.deleteAllowanceRange(allowanceRangeList[i]!.id);
					} else {
						await this.updateAllowanceRange({
							id: allowanceRangeList[i]!.id,
							end_date: new_end_date,
						});
					}
				}
			} else {
				if (allowanceRangeList[i]!.end_date != null) {
					await this.updateAllowanceRange({
						id: allowanceRangeList[i]!.id,
						end_date: null,
					});
				}
			}
		}
		if (allowanceRangeList[allowanceRangeList.length - 1]!.end_date != null) {
			await this.updateAllowanceRange({
				id: allowanceRangeList[allowanceRangeList.length - 1]!.id,
				end_date: null,
			});
		}
	}

	async getCurrentAllowanceRangeByPositionAndAllowanceTypeByDate(
		position: number,
		position_type: string,
		allowance_type: AllowanceTypeEnumType,
		date: Date
	): Promise<AllowanceRangeDecType> {
		const date_str = dateToString.parse(date);

		const allowanceRange = await AllowanceRange.findOne({
			where: {
				start_date: {
					[Op.lte]: date_str,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: date_str },
						{ [Op.eq]: null },
					],
				},
				position: position,
				position_type: position_type,
				allowance_type: allowance_type,
				disabled: false,
			},
			raw: true,
		});
		if (allowanceRange == null) {
			throw new Error(
				`AllowanceRange does not exist position = ${position}, position type = ${position_type}, allowance_type = ${allowance_type}, date = ${date.toDateString()}`
			);
		}
		return await this.allowanceRangeMapper.decode(allowanceRange);
	}

	private async getAllowanceRangeAfterSelectValue({
		id,
		position,
		position_type,
		allowance_type,
		allowance_start,
		allowance_end,
		start_date,
		end_date,
	}: z.infer<typeof updateAllowanceRangeService>): Promise<
		z.infer<typeof createAllowanceRangeService>
	> {
		const alllowanceRange = await this.getAllowanceRangeById(id);

		if (alllowanceRange == null) {
			throw new Error(
				`AllowanceRange does not exist position = ${position} position type = ${position_type}, allowance_type = ${allowance_type}`
			);
		}

		return {
			position: select_value(position, alllowanceRange.position),
			position_type: select_value(position_type, alllowanceRange.position_type),
			allowance_type: select_value(allowance_type, alllowanceRange.allowance_type),
			allowance_start: select_value(allowance_start, alllowanceRange.allowance_start),
			allowance_end: select_value(allowance_end, alllowanceRange.allowance_end),
			start_date: select_value(start_date, alllowanceRange.start_date),
			end_date: select_value(end_date, alllowanceRange.end_date),
		}
	}

	// async getMatchedAllowance(period_id: number,employee_data: EmployeeDataDecType,allowance_type:AllowanceTypeEnumType) {
	// 	const period = await this.ehrService.getPeriodById(period_id);
	// 	const current_date_string = dateToString.parse(period.end_date);
	// 	const allowance_range = await AllowanceRange.findOne({
	// 		where: {
	// 			position: employee_data.position,
	// 			allowance_type: allowance_type,
	// 			start_date: {
	// 				[Op.lte]: current_date_string,
	// 			},
	// 			end_date: {
	// 				[Op.or]: [
	// 					{ [Op.gte]: current_date_string },
	// 					{ [Op.eq]: null },
	// 				],
	// 			},
	// 			disabled: false,
	// 		},
	// 		raw: true,
	// 	});
	// 	return await this.allowanceRangeMapper.decode(allowance_range);
	// }
	async checkAllowanceInRange(cur_allowance_range: AllowanceRangeDecType[], employee_data: EmployeeDataDecType, allowance_type: AllowanceTypeEnumType, amount: number) {
		const allowance_range = cur_allowance_range.find((v) => v.allowance_type === allowance_type && v.position === employee_data.position && v.position_type === employee_data.position_type);
		if (!allowance_range || (allowance_range.allowance_start <= amount && allowance_range.allowance_end >= amount)) {
			return true;
		}
		return false;
	}
}
