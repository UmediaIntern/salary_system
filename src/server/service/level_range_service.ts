import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createLevelRangeInput,
	updateLevelRangeInput,
} from "../api/input_type/parameters_input";
import { LevelRange } from "../database/entity/level_range";

@injectable()
export class LevelRangeService {
	constructor() {}

	async createLevelRange({
		type,
		level_start,
		level_end,
	}: z.infer<typeof createLevelRangeInput>): Promise<LevelRange> {
		const newData = await LevelRange.create({
			type: type,
			level_start: level_start,
			level_end: level_end,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getLevelRangeById(id: number): Promise<LevelRange | null> {
		const levelRange = await LevelRange.findOne({
			where: {
				id: id,
			},
		});
		return levelRange;
	}

	async getCurrentLevelRange(): Promise<LevelRange[]> {
		const levelRange = await this.getAllLevelRange();
		return levelRange;
	}

	async getAllLevelRange(): Promise<LevelRange[]> {
		const levelRange = await LevelRange.findAll();
		return levelRange;
	}

	async updateLevelRange({
		id,
		type,
		level_start,
		level_end,
	}: z.infer<typeof updateLevelRangeInput>): Promise<void> {
		const levelRange = await this.getLevelRangeById(id!);
		if (levelRange == null) {
			throw new BaseResponseError("LevelRange does not exist");
		}

		const affectedCount = await LevelRange.update(
			{
				type: type ?? levelRange.type,
				level_start: level_start ?? levelRange.level_start,
				level_end: level_end ?? levelRange.level_end,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteLevelRange(id: number): Promise<void> {
		const destroyedRows = await LevelRange.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}