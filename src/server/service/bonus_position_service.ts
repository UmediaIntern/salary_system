import { container, injectable } from "tsyringe";
import { BonusPosition } from "../database/entity/SALARY/bonus_position";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createBonusPositionService,
	updateBonusPositionService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";
import { Database } from "../database/client";
import { Op } from "sequelize";

@injectable()
export class BonusPositionService {
	constructor() { }

	async createBonusPosition({
		period_id,
		bonus_type,
		position,
		position_multiplier,
		position_type,
		position_type_multiplier
	}: z.infer<typeof createBonusPositionService>): Promise<BonusPosition> {
		await BonusPosition.update(
			{ disabled: true },
			{
				where: {
					period_id: period_id,
					bonus_type: bonus_type,
					position: position,
					position_type: position_type,
				},
			}
		);
		const newData = await BonusPosition.create(
			{
				period_id: period_id,
				bonus_type: bonus_type,
				position: position,
				position_multiplier: position_multiplier,
				position_type: position_type,
				position_type_multiplier: position_type_multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}
	async batchCreateBonusPosition(
		data_array: z.infer<typeof createBonusPositionService>[]
	) {
		const t = await container.resolve(Database).connection.transaction();
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				bonus_type: data.bonus_type,
				position: data.position,
				position_multiplier: data.position_multiplier,
				position_type: data.position_type,
				position_type_multiplier: data.position_type_multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		for (const data of new_data_array) {
			await BonusPosition.update(
				{ disabled: true },
				{
					where: {
						period_id: data.period_id,
						bonus_type: data.bonus_type,
						position: data.position,
						position_type: data.position_type,
					},
					transaction: t,
				}
			);
		}
		await BonusPosition.bulkCreate(new_data_array, { transaction: t });
		await t.commit();
	}
	async getBonusPositionById(id: number): Promise<BonusPosition | null> {
		const bonusPosition = await BonusPosition.findOne(
			{
				where: { id: id },
			}
		);
		return bonusPosition;
	}

	async getBonusPositionByBonusType(
		period_id: number,
		bonus_type: BonusTypeEnumType
	): Promise<BonusPosition[] | null> {
		const bonusPosition = await BonusPosition.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				disabled: false,
			},
			order: [["position", "ASC"], ["position_type", "ASC"]],
		});
		return bonusPosition;
	}
	async getMultiplier(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		position: number,
		position_type: string
	): Promise<number> {
		//for develop
		// const list = await BonusPosition.findAll({
		// 	where: {
		// 		period_id: period_id,
		// 		bonus_type: bonus_type,
		// 		disabled: false,
		// 	},
		// });
		// if (list.length == 0) return 1;
		const bonus_position = await BonusPosition.findOne({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				position: position,
				position_type: position_type,
				disabled: false,
			},
		});

		const position_multiplier = bonus_position?.position_multiplier;
		const position_type_multiplier = bonus_position?.position_type_multiplier;

		return (position_multiplier || 1) * (position_type_multiplier || 1);
	}
	async getAllBonusPosition(): Promise<BonusPosition[] | null> {
		const bonusPosition = await BonusPosition.findAll(
			{
				where: { disabled: false },
			}
		);
		return bonusPosition;
	}

	async updateBonusPosition({
		id,
		position,
		position_multiplier,
		position_type,
		position_type_multiplier,
	}: z.infer<typeof updateBonusPositionService>): Promise<void> {
		const bonus_position = await this.getBonusPositionById(id);
		if (bonus_position == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}

		await this.deleteBonusPosition(id);

		await this.createBonusPosition(
			{
				period_id: bonus_position.period_id,
				bonus_type: bonus_position.bonus_type,
				position: select_value(position, bonus_position.position),
				position_multiplier: select_value(position_multiplier, bonus_position.position_multiplier),
				position_type: select_value(position_type, bonus_position.position_type),
				position_type_multiplier: select_value(position_type_multiplier, bonus_position.position_type_multiplier),
			}
		);
	}

	async deleteBonusPosition(id: number): Promise<void> {
		const destroyedRows = await BonusPosition.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
