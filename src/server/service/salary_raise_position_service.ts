import { injectable } from "tsyringe";
import { SalaryRaisePosition } from "../database/entity/SALARY/salary_raise_position";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createSalaryRaisePositionService,
	updateSalaryRaisePositionService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";

@injectable()
export class SalaryRaisePositionService {
	constructor() { }

	async createSalaryRaisePosition({
		period_id,
		position,
		position_multiplier,
		position_type,
		position_type_multiplier
	}: z.infer<typeof createSalaryRaisePositionService>): Promise<SalaryRaisePosition> {
		const newData = await SalaryRaisePosition.create(
			{
				period_id: period_id,
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
	async batchCreateSalaryRaisePosition(
		data_array: z.infer<typeof createSalaryRaisePositionService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				position: data.position,
				position_multiplier: data.position_multiplier,
				position_type: data.position_type,
				position_type_multiplier: data.position_type_multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await SalaryRaisePosition.bulkCreate(new_data_array);
	}
	async getSalaryRaisePositionById(id: number): Promise<SalaryRaisePosition | null> {
		const salaryRaisePosition = await SalaryRaisePosition.findOne(
			{
				where: { id: id },
			}
		);
		return salaryRaisePosition;
	}

	async getSalaryRaisePositionBySalaryRaiseType(
		period_id: number,
	): Promise<SalaryRaisePosition[] | null> {
		const salaryRaisePosition = await SalaryRaisePosition.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		return salaryRaisePosition;
	}
	async getMultiplier(
		period_id: number,
		position: number,
		position_type: string
	): Promise<number> {
		//for develop
		const list = await SalaryRaisePosition.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		if (list.length == 0) return 1;
		const position_multiplier = (
			await SalaryRaisePosition.findOne({
				where: {
					period_id: period_id,
					position: position,
					position_type: position_type,
					disabled: false,
				},
			})
		)?.position_multiplier;

		const position_type_multiplier = (
			await SalaryRaisePosition.findOne({
				where: {
					period_id: period_id,
					position: position,
					position_type: position_type,
				},
			})
		)?.position_type_multiplier;
		if (position_multiplier == undefined || position_type_multiplier == undefined) {
			return 0;
		}
		return position_multiplier * position_type_multiplier;
	}
	async getAllSalaryRaisePosition(): Promise<SalaryRaisePosition[] | null> {
		const salaryRaisePosition = await SalaryRaisePosition.findAll(
			{
				where: { disabled: false },
			}
		);
		return salaryRaisePosition;
	}

	async updateSalaryRaisePosition({
		id,
		position,
		position_multiplier,
		position_type,
		position_type_multiplier,
	}: z.infer<typeof updateSalaryRaisePositionService>): Promise<void> {
		const salary_raise_position = await this.getSalaryRaisePositionById(id);
		if (salary_raise_position == null) {
			throw new BaseResponseError("SalaryRaisePosition does not exist");
		}

		await this.deleteSalaryRaisePosition(id);

		await this.createSalaryRaisePosition(
			{
				period_id: salary_raise_position.period_id,
				position: select_value(position, salary_raise_position.position),
				position_multiplier: select_value(position_multiplier, salary_raise_position.position_multiplier),
				position_type: select_value(position_type, salary_raise_position.position_type),
				position_type_multiplier: select_value(position_type_multiplier, salary_raise_position.position_type_multiplier),
			}
		);
	}

	async deleteSalaryRaisePosition(id: number): Promise<void> {
		const destroyedRows = await SalaryRaisePosition.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
