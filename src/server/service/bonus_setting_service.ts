import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { select_value } from "./helper_function";
import { z } from "zod";
import {
	createBonusSettingService,
	updateBonusSettingService,
} from "../api/types/parameters_input_type";
import { BonusSetting } from "../database/entity/SALARY/bonus_setting";

@injectable()
export class BonusSettingService {
	constructor() { }

	async createBonusSetting({
		fixed_multiplier,
		criterion_date,
		base_on,
		type,
	}: z.infer<typeof createBonusSettingService>): Promise<BonusSetting> {
		const newData = await BonusSetting.create(
			{
				fixed_multiplier: fixed_multiplier,
				criterion_date: criterion_date,
				base_on: base_on,
				type: type,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}

	async getBonusSettingById(id: number): Promise<BonusSetting | null> {
		const bonusSetting = await BonusSetting.findOne(
			{
				where: { id: id },
			}
		);

		return bonusSetting;
	}

	async getCurrentBonusSetting(): Promise<BonusSetting | null> {
		const bonusSettingList = await this.getAllBonusSetting();
		if (bonusSettingList.length > 1) {
			throw new BaseResponseError("more than one Bonus setting");
		}
		const bonusSetting =
			bonusSettingList.length == 1 ? bonusSettingList[0]! : null;

		return bonusSetting;
	}

	async getAllBonusSetting(): Promise<BonusSetting[]> {
		const bonusSetting = await BonusSetting.findAll(
			{
				where: { disabled: false },
			}
		);
		return bonusSetting;
	}

	async updateBonusSetting({
		id,
		fixed_multiplier,
		criterion_date,
		base_on,
		type,
	}: z.infer<typeof updateBonusSettingService>): Promise<void> {
		const bonus_setting = await this.getBonusSettingById(id);
		if (bonus_setting == null) {
			throw new BaseResponseError("BonusSetting does not exist");
		}

		await this.deleteBonusSetting(id);

		await this.createBonusSetting(
			{
				fixed_multiplier: select_value(
					fixed_multiplier,
					bonus_setting.fixed_multiplier
				),
				criterion_date: select_value(
					criterion_date,
					bonus_setting.criterion_date
				),
				base_on: select_value(base_on, bonus_setting.base_on),
				type: select_value(type, bonus_setting.type),
			},
		);
	}

	async deleteBonusSetting(id: number): Promise<void> {
		const destroyedRows = await BonusSetting.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
