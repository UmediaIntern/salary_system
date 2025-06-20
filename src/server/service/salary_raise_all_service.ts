import { injectable } from "tsyringe";
import { SalaryRaiseAll } from "../database/entity/SALARY/salary_raise_all";
import { BaseResponseError } from "../errors/base_response_error";
import { type z } from "zod";
import {
	type createSalaryRaiseAllService,
	type updateSalaryRaiseAllService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";

@injectable()
export class SalaryRaiseAllService {
	async createSalaryRaiseAll({
		period_id,
		multiplier,
	}: z.infer<typeof createSalaryRaiseAllService>): Promise<SalaryRaiseAll> {
		const salaryRaise = await SalaryRaiseAll.findOne({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		if (salaryRaise != null) {
			throw new BaseResponseError("SalaryRaiseAll already exists");
		}
		const newData = await SalaryRaiseAll.create({
			period_id: period_id,
			multiplier: multiplier,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}
	async batchCreateSalaryRaiseAll(
		data_array: z.infer<typeof createSalaryRaiseAllService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				multiplier: data.multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await SalaryRaiseAll.bulkCreate(new_data_array);
	}
	async getMultiplier(period_id: number): Promise<number> {
		//for develop
		const multiplier = (
			await SalaryRaiseAll.findOne({
				where: {
					period_id: period_id,
					disabled: false,
				},
			})
		)?.multiplier;
		return multiplier ?? 1;
	}
	async getSalaryRaiseAllById(id: number): Promise<SalaryRaiseAll | null> {
		const salaryRaise = await SalaryRaiseAll.findOne({
			where: { id: id },
		});
		return salaryRaise;
	}

	async getSalaryRaiseAllBySalaryRaiseType(
		period_id: number
	): Promise<SalaryRaiseAll[] | null> {
		const salaryRaise = await SalaryRaiseAll.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		return salaryRaise;
	}

	async getAllSalaryRaiseAll(): Promise<SalaryRaiseAll[] | null> {
		const salaryRaise = await SalaryRaiseAll.findAll({
			where: { disabled: false },
		});
		return salaryRaise;
	}

	async updateSalaryRaiseAll({
		id,
		multiplier,
	}: z.infer<typeof updateSalaryRaiseAllService>): Promise<void> {
		const salary_raise = await this.getSalaryRaiseAllById(id);
		if (salary_raise == null) {
			throw new BaseResponseError("SalaryRaiseAll does not exist");
		}
		await this.deleteSalaryRaiseAll(id);

		await this.createSalaryRaiseAll({
			period_id: salary_raise.period_id,
			multiplier: select_value(multiplier, salary_raise.multiplier),
		});
	}

	async deleteSalaryRaiseAll(id: number): Promise<void> {
		const destroyedRows = await SalaryRaiseAll.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
