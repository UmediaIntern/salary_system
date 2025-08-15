import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createBonusSeniorityService,
	updateBonusSeniorityService,
} from "../api/types/parameters_input_type";
import { BonusSeniority } from "../database/entity/SALARY/bonus_seniority";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";
import { Bonus } from "../database/entity/UMEDIA/bonus";
import { Database } from "../database/client";
import { Op } from "sequelize";

@injectable()
export class BonusSeniorityService {
	constructor() { }

	async createBonusSeniority({
		period_id,
		bonus_type,
		seniority,
		multiplier,
	}: z.infer<typeof createBonusSeniorityService>): Promise<BonusSeniority> {
		await BonusSeniority.update(
			{ disabled: true },
			{
				where: {
					period_id: period_id,
					bonus_type: bonus_type,
					seniority: seniority,
				},
			}
		);
		const newData = await BonusSeniority.create({
			period_id: period_id,
			bonus_type: bonus_type,
			seniority: seniority,
			multiplier: multiplier,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}
	async batchCreateBonusSeniority(
		data_array: z.infer<typeof createBonusSeniorityService>[]
	) {
		const t = await container.resolve(Database).connection.transaction();
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				bonus_type: data.bonus_type,
				seniority: data.seniority,
				multiplier: data.multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await BonusSeniority.update(
			{ disabled: true },
			{
				where: {
					period_id: new_data_array[0]!.period_id,
					bonus_type: new_data_array[0]!.bonus_type,
					seniority: { [Op.in]: new_data_array.map((d) => d.seniority) },
				},
				transaction: t,
			}
		);
		await BonusSeniority.bulkCreate(new_data_array, { transaction: t });
		await t.commit();
	}

	async getBonusSeniorityById(id: number): Promise<BonusSeniority | null> {
		const bonusSeniority = await BonusSeniority.findOne({
			where: {
				id: id,
			},
		});
		return bonusSeniority;
	}
	async getMultiplier(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		seniority: number
	): Promise<number> {
		//for develop
		const list = await BonusSeniority.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				disabled: false,
			},
		});
		const dict = list.reduce((acc: { [key: number]: number }, item) => {
			acc[item.seniority] = item.multiplier;
			return acc;
		}, {});
		const multiplier = dict[seniority];
		// const multiplier = (
		// 	await BonusSeniority.findOne({
		// 		where: {
		// 			period_id: period_id,
		// 			bonus_type: bonus_type,
		// 			seniority: seniority,
		// 			disabled: false,
		// 		},
		// 	})
		// )?.multiplier;
		return multiplier ?? 1;
	}
	async getBonusSeniorityByBonusType(
		period_id: number,
		bonus_type: BonusTypeEnumType
	): Promise<BonusSeniority[] | null> {
		const bonusSeniority = await BonusSeniority.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				disabled: false,
			},
			order: [["seniority", "ASC"]],
		});
		return bonusSeniority;
	}

	async getAllBonusSeniority(): Promise<BonusSeniority[] | null> {
		const bonusSeniority = await BonusSeniority.findAll({
			where: { disabled: false },
		});
		return bonusSeniority;
	}

	async updateBonusSeniority({
		id,
		seniority,
		multiplier,
	}: z.infer<typeof updateBonusSeniorityService>): Promise<void> {
		const bonus_seniority = await this.getBonusSeniorityById(id!);
		if (bonus_seniority == null) {
			throw new BaseResponseError("BonusSeniority does not exist");
		}

		await this.deleteBonusSeniority(id);

		await this.createBonusSeniority({
			period_id: bonus_seniority.period_id,
			bonus_type: bonus_seniority.bonus_type,
			seniority: select_value(seniority, bonus_seniority.seniority),
			multiplier: select_value(multiplier, bonus_seniority.multiplier),
		});
	}

	async deleteBonusSeniority(id: number): Promise<void> {
		const destroyedRows = await BonusSeniority.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
