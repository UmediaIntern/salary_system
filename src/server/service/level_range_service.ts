import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { type z } from "zod";
import {
	LevelRange,
	type LevelRangeDecType,
} from "../database/entity/SALARY/level_range";
import { get_date_string, select_value } from "./helper_function";
import {
	createLevelRangeService,
	type updateLevelRangeService,
} from "../api/types/level_range_type";
import { EHRService } from "./ehr_service";
import { Op } from "sequelize";
import { LevelRangeMapper } from "../database/mapper/level_range_mapper";
import { dateToString, stringToDate } from "../api/types/z_utils";
import { Database } from "../database/client";

@injectable()
export class LevelRangeService {
	constructor(private readonly levelRangeMapper: LevelRangeMapper) {}

	async createLevelRange(
		data: z.infer<typeof createLevelRangeService>
	): Promise<LevelRange> {
		const d = createLevelRangeService.parse(data);
		const levelRange = await this.levelRangeMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		const existed_data = await LevelRange.findOne({
			where: {
				type: levelRange.type,
				start_date: levelRange.start_date,
				end_date: levelRange.end_date,
				disabled: false,
			},
		});
		if (existed_data != null) {
			throw new Error(
				`Data already exist type:${
					existed_data.type
				}, start_date: ${existed_data.start_date}}`
			);
		}
		const newData = await LevelRange.create(levelRange, {
			raw: true,
		});

		return newData;
	}

	async batchCreateLevelRange(
		data_array: z.infer<typeof createLevelRangeService>[]
	): Promise<LevelRange[]> {
		const t = await container.resolve(Database).connection.transaction();
		const levelRangeList = await Promise.all(
			data_array.map(async (data) => {
				const d = createLevelRangeService.parse(data);
				return await this.levelRangeMapper.encode({
					...d,
					start_date: d.start_date ?? new Date(),
					disabled: false,
					create_by: "system",
					update_by: "system",
				});
			})
		);


		for (const data of levelRangeList) {
			await LevelRange.update(
				{ disabled: true },
				{
					where: {
						type: data.type,
						start_date: data.start_date,
					},
					transaction: t,
				}
			);
		}

		const newData = await LevelRange.bulkCreate(levelRangeList, { transaction: t });

		await t.commit();

		return newData;
	}

	async getLevelRangeById(id: number): Promise<LevelRangeDecType | null> {
		const levelRange = await LevelRange.findOne({
			where: { id: id },
		});
		return this.levelRangeMapper.decode(levelRange);
	}

	async getCurrentLevelRange(
		period_id: number
	): Promise<LevelRangeDecType[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const levelRange = await LevelRange.findAll({
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
			raw: true,
		});
		return this.levelRangeMapper.decodeList(levelRange);
	}

	async getCurrentLevelRangeByDate(date: Date): Promise<LevelRangeDecType[]> {
		const date_string = get_date_string(date);
		const levelRange = await LevelRange.findAll({
			where: {
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
		return this.levelRangeMapper.decodeList(levelRange);
	}

	async getAllLevelRange(): Promise<LevelRangeDecType[][]> {
		const levelRange = await LevelRange.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["type", "ASC"],
			],
			raw: true,
		});
		const data_array = await this.levelRangeMapper.decodeList(levelRange);
		const groupedRecords: Record<string, LevelRangeDecType[]> = {};
		data_array.forEach((d) => {
			let key = "";
			if (d.end_date == null) {
				key = get_date_string(d.start_date);
			} else
				key =
					get_date_string(d.start_date) + get_date_string(d.end_date);
			if (!groupedRecords[key]) {
				groupedRecords[key] = [];
			}
			groupedRecords[key]!.push(d);
		});
		const grouped_array = Object.values(groupedRecords).sort((a, b) => {
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
		});

		return grouped_array;
	}

	async getAllFutureLevelRange(): Promise<LevelRangeDecType[]> {
		const current_date_string = get_date_string(new Date());
		const levelRange = await LevelRange.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["type", "ASC"],
			],
			raw: true,
		});
		return this.levelRangeMapper.decodeList(levelRange);
	}

	async updateLevelRange({
		id,
		type,
		level_start_id,
		level_end_id,
		start_date,
		end_date,
	}: z.infer<typeof updateLevelRangeService>): Promise<void> {
		const levelRange = await this.getLevelRangeById(id);
		if (levelRange == null) {
			throw new BaseResponseError("LevelRange does not exist");
		}

		await this.deleteLevelRange(id);

		await this.createLevelRange({
			type: select_value(type, levelRange.type),
			level_start_id: select_value(
				level_start_id,
				levelRange.level_start_id
			),
			level_end_id: select_value(level_end_id, levelRange.level_end_id),
			start_date: select_value(start_date, levelRange.start_date),
			end_date: select_value(end_date, levelRange.end_date),
		});
	}

	async updateLevelRangeId({
		old_id,
		new_id,
	}: {
		old_id: number;
		new_id: number;
	}): Promise<void> {
		const levelRangeList = await LevelRange.findAll({
			where: { disabled: false },
		});
		const promises = levelRangeList.map(async (levelRange) => {
			if (
				levelRange.level_start_id == old_id ||
				levelRange.level_end_id == old_id
			) {
				await this.updateLevelRange({
					id: levelRange.id,
					level_start_id:
						levelRange.level_start_id == old_id
							? new_id
							: levelRange.level_start_id,
					level_end_id:
						levelRange.level_end_id == old_id
							? new_id
							: levelRange.level_end_id,
				});
			}
		});

		await Promise.all(promises);
	}

	async deleteLevelRange(id: number): Promise<void> {
		const destroyedRows = await LevelRange.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async isLevelReferenced(level_id: number): Promise<boolean> {
		const levelList = await LevelRange.findOne({
			where: {
				[Op.or]: [
					{ level_start_id: level_id },
					{ level_end_id: level_id },
				],
				disabled: false,
			},
		});
		return levelList != null;
	}

	async emptyInfluencedLevelRange(
		start_date_string: string,
		end_date_string: string | null
	): Promise<void> {
		if (end_date_string != null) {
			const deleteList = await LevelRange.findAll({
				where: {
					start_date: {
						[Op.between]: [start_date_string, end_date_string],
					},
					disabled: false,
				},
			});
			await Promise.all(
				deleteList.map(async (levelRange) => {
					await this.deleteLevelRange(levelRange.id);
				})
			);
			const rescheduleList = await LevelRange.findAll({
				where: {
					end_date: {
						[Op.between]: [start_date_string, end_date_string],
					},
					disabled: false,
				},
			});
			await Promise.all(
				rescheduleList.map(async (levelRange) => {
					await this.createLevelRange({
						type: levelRange.type,
						level_start_id: levelRange.level_start_id,
						level_end_id: levelRange.level_end_id,
						start_date: stringToDate.parse(levelRange.start_date),
						end_date: stringToDate.parse(start_date_string),
					});
					await this.deleteLevelRange(levelRange.id);
				})
			);
		} else {
			const deleteList = await LevelRange.findAll({
				where: {
					start_date: {
						[Op.gte]: start_date_string,
					},
					disabled: false,
				},
			});
			await Promise.all(
				deleteList.map(async (levelRange) => {
					await this.deleteLevelRange(levelRange.id);
				})
			);
			const rescheduleList = await LevelRange.findAll({
				where: {
					end_date: {
						[Op.gte]: start_date_string,
					},
					disabled: false,
				},
			});
			await Promise.all(
				rescheduleList.map(async (levelRange) => {
					await this.createLevelRange({
						type: levelRange.type,
						level_start_id: levelRange.level_start_id,
						level_end_id: levelRange.level_end_id,
						start_date: stringToDate.parse(levelRange.start_date),
						end_date: stringToDate.parse(start_date_string),
					});
					await this.deleteLevelRange(levelRange.id);
				})
			);
		}
	}
}
