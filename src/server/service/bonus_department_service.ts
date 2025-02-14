import { injectable } from "tsyringe";
import { BonusDepartment } from "../database/entity/SALARY/bonus_department";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createBonusDepartmentService,
	updateBonusDepartmentService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class BonusDepartmentService {
	constructor() { }

	async createBonusDepartment({
		period_id,
		bonus_type,
		department,
		multiplier,
	}: z.infer<typeof createBonusDepartmentService>): Promise<BonusDepartment> {
		const newData = await BonusDepartment.create(
			{
				period_id: period_id,
				bonus_type: bonus_type,
				department: (typeof department === "number") ? department.toString() : department,
				multiplier: multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}
	async batchCreateBonusDepartment(
		data_array: z.infer<typeof createBonusDepartmentService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				bonus_type: data.bonus_type,
				department: (typeof data.department === "number") ? data.department.toString() : data.department,
				multiplier: data.multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await BonusDepartment.bulkCreate(new_data_array);
	}
	async getMultiplier(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		department: string
	): Promise<number> {
		//for develop
		const list = await BonusDepartment.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				disabled: false,
			},
		});
		if (list.length == 0) return 1;
		const correct_department = department.split("\r")[0]?.split("\n")[0];
		const multiplier = (
			await BonusDepartment.findOne(
				{
					where: {
						period_id: period_id,
						bonus_type: bonus_type,
						department: correct_department,
						disabled: false,
					},
				}
			)
		)?.multiplier;
		return multiplier ?? 0;
	}
	async getBonusDepartmentById(id: number): Promise<BonusDepartment | null> {
		const bonusDepartment = await BonusDepartment.findOne(
			{
				where: { id: id }
			}
		);
		return bonusDepartment;
	}

	async getBonusDepartmentByBonusType(
		period_id: number,
		bonus_type: BonusTypeEnumType
	): Promise<BonusDepartment[] | null> {
		const bonusDepartment = await BonusDepartment.findAll(
			{
				where: {
					period_id: period_id,
					bonus_type: bonus_type,
					disabled: false,
				},
			}
		);
		return bonusDepartment;
	}

	async getAllBonusDepartment(): Promise<BonusDepartment[] | null> {
		const bonusDepartment = await BonusDepartment.findAll(
			{
				where: { disabled: false },
			}
		);
		return bonusDepartment;
	}

	async updateBonusDepartment({
		id,
		department,
		multiplier,
	}: z.infer<typeof updateBonusDepartmentService>): Promise<void> {
		const bonus_department = await this.getBonusDepartmentById(id);
		if (bonus_department == null) {
			throw new BaseResponseError("BonusDepartment does not exist");
		}
		await this.deleteBonusDepartment(id);

		await this.createBonusDepartment(
			{
				period_id: bonus_department.period_id,
				bonus_type: bonus_department.bonus_type,
				department: select_value(
					department,
					bonus_department.department
				),
				multiplier: select_value(
					multiplier,
					bonus_department.multiplier
				),
			}
		);
	}

	async deleteBonusDepartment(id: number): Promise<void> {
		const destroyedRows = await BonusDepartment.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
