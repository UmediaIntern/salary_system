import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createSalaryRaiseSeniorityService,
	updateSalaryRaiseSeniorityService,
} from "../api/types/parameters_input_type";
import { SalaryRaiseSeniority } from "../database/entity/SALARY/salary_raise_seniority";
import { select_value } from "./helper_function";

@injectable()
export class SalaryRaiseSeniorityService {
	constructor() {}

	async createSalaryRaiseSeniority({
		period_id,
		seniority,
		multiplier,
	}: z.infer<typeof createSalaryRaiseSeniorityService>): Promise<SalaryRaiseSeniority> {
		const newData = await SalaryRaiseSeniority.create({
			period_id: period_id,
			seniority: seniority,
			multiplier: multiplier,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}
	async batchCreateSalaryRaiseSeniority(
		data_array: z.infer<typeof createSalaryRaiseSeniorityService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				seniority: data.seniority,
				multiplier: data.multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await SalaryRaiseSeniority.bulkCreate(new_data_array);
	}

	async getSalaryRaiseSeniorityById(id: number): Promise<SalaryRaiseSeniority | null> {
		const salaryRaiseSeniority = await SalaryRaiseSeniority.findOne({
			where: {
				id: id,
			},
		});
		return salaryRaiseSeniority;
	}
	async getMultiplier(
		period_id: number,
		seniority: number
	): Promise<number> {
		//for develop
		const list = await SalaryRaiseSeniority.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		if (list.length == 0) return 1;
		const multiplier = (
			await SalaryRaiseSeniority.findOne({
				where: {
					period_id: period_id,
					seniority: seniority,
					disabled: false,
				},
			})
		)?.multiplier;
		return multiplier ?? 0;
	}
	async getSalaryRaiseSeniorityByPeriodId(
		period_id: number,
		): Promise<SalaryRaiseSeniority[] | null> {
		const salaryRaiseSeniority = await SalaryRaiseSeniority.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		return salaryRaiseSeniority;
	}

	async getAllSalaryRaiseSeniority(): Promise<SalaryRaiseSeniority[] | null> {
		const salaryRaiseSeniority = await SalaryRaiseSeniority.findAll({
			where: { disabled: false },
		});
		return salaryRaiseSeniority;
	}

	async updateSalaryRaiseSeniority({
		id,
		seniority,
		multiplier,
	}: z.infer<typeof updateSalaryRaiseSeniorityService>): Promise<void> {
		const salary_raise_seniority = await this.getSalaryRaiseSeniorityById(id!);
		if (salary_raise_seniority == null) {
			throw new BaseResponseError("SalaryRaiseSeniority does not exist");
		}

		await this.deleteSalaryRaiseSeniority(id);

		await this.createSalaryRaiseSeniority({
			period_id: salary_raise_seniority.period_id,
			seniority: select_value(seniority, salary_raise_seniority.seniority),
			multiplier: select_value(multiplier, salary_raise_seniority.multiplier),
		});
	}

	async deleteSalaryRaiseSeniority(id: number): Promise<void> {
		const destroyedRows = await SalaryRaiseSeniority.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
