import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createPerformanceLevelService,
	updatePerformanceLevelService,
} from "../api/types/parameters_input_type";
import { PerformanceLevel } from "../database/entity/SALARY/performance_level";
import { select_value } from "./helper_function";

@injectable()
export class PerformanceLevelService {
	constructor() {}

	async createPerformanceLevel({
		performance_level,
		multiplier,
	}: z.infer<
		typeof createPerformanceLevelService
	>): Promise<PerformanceLevel> {
		const newData = await PerformanceLevel.create({
			performance_level: performance_level,
			multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getPerformanceLevelById(
		id: number
	): Promise<PerformanceLevel | null> {
		const performanceLevel = await PerformanceLevel.findOne({
			where: {
				id: id,
			},
		});
		return performanceLevel;
	}

	async getCurrentPerformanceLevel(): Promise<PerformanceLevel[]> {
		const performanceLevel = await this.getAllPerformanceLevel();
		return performanceLevel;
	}

	async getAllPerformanceLevel(): Promise<PerformanceLevel[]> {
		const performanceLevel = await PerformanceLevel.findAll();
		return performanceLevel;
	}

	async updatePerformanceLevel({
		id,
		performance_level,
		multiplier,
	}: z.infer<typeof updatePerformanceLevelService>): Promise<void> {
		const performanceLevel = await this.getPerformanceLevelById(id!);
		if (performanceLevel == null) {
			throw new BaseResponseError("PerformanceLevel does not exist");
		}

		const affectedCount = await PerformanceLevel.update(
			{
				performance_level: select_value(
					performance_level,
					performanceLevel.performance_level
				),
				multiplier: select_value(
					multiplier,
					performanceLevel.multiplier
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deletePerformanceLevel(id: number): Promise<void> {
		const destroyedRows = await PerformanceLevel.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
