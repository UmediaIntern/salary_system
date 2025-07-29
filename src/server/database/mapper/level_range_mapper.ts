import { container, injectable } from "tsyringe";
import { type z } from "zod";
import { BaseResponseError } from "~/server/errors/base_response_error";
import {
	type createLevelRangeAPI,
	createLevelRangeService,
	levelRangeFE,
	type LevelRangeFEType,
	type updateLevelRangeAPI,
	updateLevelRangeService,
} from "~/server/api/types/level_range_type";
import { LevelService } from "~/server/service/level_service";
import { deleteProperties } from "./helper_function";
import { get_date_string } from "~/server/service/helper_function";
import { BaseMapper } from "./base_mapper";
import {
	type LevelRange,
	type LevelRangeDecType,
	decLevelRange,
	encLevelRange,
} from "../entity/SALARY/level_range";

@injectable()
export class LevelRangeMapper extends BaseMapper<
	LevelRange,
	LevelRangeDecType,
	typeof encLevelRange,
	typeof decLevelRange
> {
	constructor() {
		super("Level Rnage Mapper", encLevelRange, decLevelRange);
	}

	async getLevelRange(
		level_range: z.infer<typeof createLevelRangeAPI>
	): Promise<z.infer<typeof createLevelRangeService>> {
		const levelService = container.resolve(LevelService);
		const level_start = await levelService.getLevelByLevel(
			level_range.level_start,
			get_date_string(level_range.start_date ?? new Date())
		);
		const level_end = await levelService.getLevelByLevel(
			level_range.level_end,
			get_date_string(level_range.start_date ?? new Date())
		);
		if (level_start == null || level_end == null) {
			throw new BaseResponseError("Level does not exist");
		}
		const levelRange: z.infer<typeof createLevelRangeService> =
			createLevelRangeService.parse({
				...level_range,
				level_start_id: level_start.id,
				level_end_id: level_end.id,
				end_date: level_start.end_date,
			});

		return levelRange;
	}

	async getLevelRangeFE(
		level_range: LevelRangeDecType
	): Promise<LevelRangeFEType> {
		const levelService = container.resolve(LevelService);
		const level_start = await levelService.getLevelById(
			level_range.level_start_id
		);
		const level_end = await levelService.getLevelById(
			level_range.level_end_id
		);
		if (level_start == null || level_end == null) {
			throw new BaseResponseError("Level does not exist");
		}

		const result: LevelRangeFEType = levelRangeFE.parse({
			level_start: level_start.level,
			level_end: level_end.level,
			functions: {
				creatable: true,
				updatable: level_range.start_date > new Date(),
				deletable: level_range.start_date > new Date(),
			},
			...level_range,
		});

		return result;
	}

	async getLevelRangeNullable(
		level_range_FE: z.infer<typeof updateLevelRangeAPI>
	): Promise<z.infer<typeof updateLevelRangeService>> {
		const levelService = container.resolve(LevelService);
		const level_start =
			level_range_FE.level_start == null
				? null
				: await levelService.getLevelByLevel(
					level_range_FE.level_start,
					get_date_string(level_range_FE.start_date ?? new Date())
				);
		const level_end =
			level_range_FE.level_end == null
				? null
				: await levelService.getLevelByLevel(
					level_range_FE.level_end,
					get_date_string(level_range_FE.start_date ?? new Date())
				);
		if (level_start == null || level_end == null) {
			throw new BaseResponseError("Level does not exist");
		}

		const levelRange: z.infer<typeof updateLevelRangeService> =
			updateLevelRangeService.parse(
				deleteProperties(
					{
						level_start_id: level_start.id,
						level_end_id: level_end.id,
						...level_range_FE,
					},
					["level_start", "level_end"]
				)
			);

		return levelRange;
	}
}
