import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { type z } from "zod";
import {
	createLevelService,
	type updateLevelService,
} from "../api/types/level_type";
import {
	Level,
	type LevelDecType,
	decLevel,
	encLevel,
} from "../database/entity/SALARY/level";
import { get_date_string, select_value } from "./helper_function";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { BaseMapper } from "../database/mapper/base_mapper";
import { LevelRangeService } from "./level_range_service";
import { dateToString, stringToDate, stringToDateNullable } from "../api/types/z_utils";

@injectable()
export class LevelService {
	private readonly levelMapper: BaseMapper<
		Level,
		LevelDecType,
		typeof encLevel,
		typeof decLevel
	>;

	constructor() {
		this.levelMapper = new BaseMapper("Level Mapper", encLevel, decLevel);
	}

	async createLevel(
		data: z.infer<typeof createLevelService>
	): Promise<Level> {
		const d = createLevelService.parse(data);
		const start_date = d.start_date ? new Date(d.start_date) : new Date();
		const start_date_adjust = new Date(
			start_date.setFullYear(start_date.getFullYear(), 0, 1)
		);
		const end_date = new Date(
			start_date.setFullYear(start_date.getFullYear(), 11, 31)
		);
		const level = await this.levelMapper.encode({
			...d,
			start_date: start_date_adjust,
			end_date: end_date,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		const existed_data = await Level.findOne({
			where: {
				level: level.level,
				start_date: level.start_date,
				end_date: level.end_date,
				disabled: false,
			},
		});
		if (existed_data != null) {
			throw new Error(
				`Data already exist type:${
					existed_data.level
				}, start_date: ${start_date.toDateString()}, end_date: ${end_date.toDateString()}`
			);
		}
		const newData = await Level.create(level, {
			raw: true,
		});

		return newData;
	}
	async batchCreateLevel(
		data_array: z.infer<typeof createLevelService>[]
	): Promise<Level[]> {
		const newData = await Promise.all(
			data_array.map(async (d) => await this.createLevel(d))
		);
		return newData;
	}
	async getLevelById(id: number): Promise<LevelDecType | null> {
		const level = await Level.findOne({
			where: {
				id: id,
			},
		});
		return this.levelMapper.decode(level);
	}

	async getLevelByLevel(
		level: number,
		start_date: string
	): Promise<LevelDecType | null> {
		const date = new Date(start_date);
		const start_date_string = get_date_string(
			new Date(date.setFullYear(date.getFullYear(), 0, 1))
		);
		const levelData = await Level.findOne({
			where: {
				level: level,
				start_date: start_date_string,
				disabled: false,
			},
		});
		return this.levelMapper.decode(levelData);
	}

	async getCurrentLevel(period_id: number): Promise<LevelDecType[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const level = await Level.findAll({
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
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		return this.levelMapper.decodeList(level);
	}

	async getAllLevel(): Promise<LevelDecType[][]> {
		const level = await Level.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		const data_array = await this.levelMapper.decodeList(level);
		const groupedRecords: Record<string, LevelDecType[]> = {};
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
	async getAllLevelByStartDate(start_date: Date): Promise<LevelDecType[]> {
		const start_date_string = get_date_string(
			new Date(start_date.setFullYear(start_date.getFullYear(), 0, 1))
		);
		const level = await Level.findAll({
			where: {
				start_date: start_date_string,
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		return this.levelMapper.decodeList(level);
	}
	async getAllFutureLevel(): Promise<LevelDecType[]> {
		const current_date_string = get_date_string(new Date());
		const level = await Level.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		return this.levelMapper.decodeList(level);
	}

	async updateLevel(data: z.infer<typeof updateLevelService>): Promise<void> {
		const levelRangeService = container.resolve(LevelRangeService);
		const transData = await this.getLevelAfterSelectValue(data);
		const newData = await this.createLevel(transData);
		await this.deleteLevel(data.id);
		await levelRangeService.updateLevelRangeId({
			old_id: data.id,
			new_id: newData.id,
		});
	}

	async deleteLevel(id: number): Promise<void> {
		const attendance_setting = await this.getLevelById(id);
		if (attendance_setting == null) {
			throw new BaseResponseError("Level does not exist");
		}
		const destroyedRows = await Level.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async getCurrentLevelBySalaryByDate(
		date: Date,
		salary: number,
		level_start_id: number,
		level_end_id: number
	): Promise<LevelDecType> {
		const minLevel = await this.getLevelById(level_start_id);
		const maxLevel = await this.getLevelById(level_end_id);
		const date_string = get_date_string(date);
		if (minLevel == null || maxLevel == null) {
			throw new BaseResponseError("Level does not exist");
		}
		const levelList = await Level.findAll({
			where: {
				level: {
					[Op.gte]: minLevel.level,
					[Op.lte]: maxLevel.level,
				},
				start_date: {
					[Op.lte]: date_string,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date_string }, { [Op.eq]: null }],
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		const targetLevel = levelList.find((level) => level.level >= salary);
		const result = targetLevel ?? levelList[levelList.length - 1]!;

		return this.levelMapper.decode(result);
	}
	async rescheduleLevel(): Promise<void> {
		const levels = await Level.findAll({
			where: {
				disabled: false,
			},
			order: [
				["start_date", "ASC"],
				["level", "ASC"],
			],
		});

		const groupedLevels = levels.reduce(
			(acc: { [startDate: string]: Level[] }, level) => {
				const startDate = level.start_date;
				if (!acc[startDate]) {
					acc[startDate] = [];
				}
				acc[startDate]!.push(level);
				return acc;
			},
			{}
		);

		const startDates = Object.keys(groupedLevels).sort(
			(a, b) =>
				stringToDate.parse(a).getTime() -
				stringToDate.parse(b).getTime()
		);

		startDates.forEach((startDate, index) => {
			const levels = groupedLevels[startDate];
			levels!.forEach((level) => {
				if (index < startDates.length - 1) {
					const nextStartDate = stringToDate.parse(
						startDates[index + 1]
					);
					level.end_date = dateToString.parse(
						new Date(nextStartDate.getDate() - 1)
					);
				} else {
					level.end_date = null; // or some other default value
				}
			});
		});

		await Promise.all(
			Object.keys(groupedLevels).map((startDate) => {
				return Promise.all(
					groupedLevels[startDate]!.map((level) =>
						this.updateLevel({
							id: level.id,
							start_date: stringToDate.parse(startDate),
							end_date: stringToDateNullable.parse(level.end_date),
							level: level.level,
						})
					)
				);
			})
		);
	}

	private async getLevelAfterSelectValue({
		id,
		level,
		start_date,
		end_date,
	}: z.infer<typeof updateLevelService>): Promise<
		z.infer<typeof createLevelService>
	> {
		const _level = await this.getLevelById(id);

		if (_level == null) {
			throw new BaseResponseError("Level does not exist");
		}

		return {
			level: select_value(level, _level.level),
			start_date: select_value(start_date, _level.start_date),
			end_date: select_value(end_date, _level.end_date),
		};
	}
}
