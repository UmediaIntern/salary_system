import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createBonusWorkTypeService,
	updateBonusWorkTypeService,
} from "../api/types/parameters_input_type";
import { BonusWorkType } from "../database/entity/SALARY/bonus_work_type";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";
import { WorkTypeEnumType } from "../api/types/work_type_enum";

@injectable()
export class BonusWorkTypeService {
	constructor() { }

	async createBonusWorkType({
		period_id,
		bonus_type,
		work_type,
		multiplier,
	}: z.infer<typeof createBonusWorkTypeService>): Promise<BonusWorkType> {
		const newData = await BonusWorkType.create(
			{
				period_id: period_id,
				bonus_type: bonus_type,
				work_type: work_type,
				multiplier: multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}
	async batchCreateBonusWorkType(
		data_array: z.infer<typeof createBonusWorkTypeService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				bonus_type: data.bonus_type,
				work_type: data.work_type,
				multiplier: data.multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await BonusWorkType.bulkCreate(new_data_array);
	}

	async getBonusWorkTypeById(id: number): Promise<BonusWorkType | null> {
		const bonusWorkType = await BonusWorkType.findOne(
			{
				where: { id: id },
			}
		);
		return bonusWorkType;
	}

	async getBonusWorkTypeByBonusType(
		period_id: number,
		bonus_type: BonusTypeEnumType
	): Promise<BonusWorkType[] | null> {
		const bonusWorkType = await BonusWorkType.findAll(
			{
				where: {
					period_id: period_id,
					bonus_type: bonus_type,
					disabled: false,
				},
			}
		);
		return bonusWorkType;
	}
	async getMultiplier(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		work_type: WorkTypeEnumType
	): Promise<number> {
		//for develop
		const list = await BonusWorkType.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				disabled: false,
			},
		});
		if (list.length == 0) return 1;
		const dict = list.reduce((acc:{[key:string]:number}, item) => {
			acc[item.work_type] = item.multiplier;
			return acc;
		  }, {});
		const multiplier = dict[work_type];
		return multiplier ?? 0;
	}
	async getAllBonusWorkType(): Promise<BonusWorkType[] | null> {
		const bonusWorkType = await BonusWorkType.findAll(
			{
				where: { disabled: false },
			}
		);
		return bonusWorkType;
	}

	async updateBonusWorkType({
		id,
		work_type,
		multiplier,
	}: z.infer<typeof updateBonusWorkTypeService>): Promise<void> {
		const bonus_work_type = await this.getBonusWorkTypeById(id);
		if (bonus_work_type == null) {
			throw new BaseResponseError("BonusWorkType does not exist");
		}

		await this.deleteBonusWorkType(id);

		await this.createBonusWorkType(
			{
				period_id: bonus_work_type.period_id,
				bonus_type: bonus_work_type.bonus_type,
				work_type: select_value(work_type, bonus_work_type.work_type),
				multiplier: select_value(
					multiplier,
					bonus_work_type.multiplier
				)
			}
		);
	}

	async deleteBonusWorkType(id: number): Promise<void> {
		const destroyedRows = await BonusWorkType.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
