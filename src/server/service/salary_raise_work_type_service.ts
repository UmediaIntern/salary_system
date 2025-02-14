import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createSalaryRaiseWorkTypeService,
	updateSalaryRaiseWorkTypeService,
} from "../api/types/parameters_input_type";
import { SalaryRaiseWorkType } from "../database/entity/SALARY/salary_raise_work_type";
import { select_value } from "./helper_function";
import { WorkTypeEnumType } from "../api/types/work_type_enum";

@injectable()
export class SalaryRaiseWorkTypeService {
	constructor() { }

	async createSalaryRaiseWorkType({
		period_id,
		work_type,
		multiplier,
	}: z.infer<typeof createSalaryRaiseWorkTypeService>): Promise<SalaryRaiseWorkType> {
		const newData = await SalaryRaiseWorkType.create(
			{
				period_id: period_id,
				work_type: work_type,
				multiplier: multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}
	async batchCreateSalaryRaiseWorkType(
		data_array: z.infer<typeof createSalaryRaiseWorkTypeService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				work_type: data.work_type,
				multiplier: data.multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await SalaryRaiseWorkType.bulkCreate(new_data_array);
	}

	async getSalaryRaiseWorkTypeById(id: number): Promise<SalaryRaiseWorkType | null> {
		const salaryRaiseWorkType = await SalaryRaiseWorkType.findOne(
			{
				where: { id: id },
			}
		);
		return salaryRaiseWorkType;
	}

	async getSalaryRaiseWorkTypeBySalaryRaiseType(
		period_id: number,
		
	): Promise<SalaryRaiseWorkType[] | null> {
		const salaryRaiseWorkType = await SalaryRaiseWorkType.findAll(
			{
				where: {
					period_id: period_id,
					disabled: false,
				},
			}
		);
		return salaryRaiseWorkType;
	}
	async getMultiplier(
		period_id: number,
		
		work_type: WorkTypeEnumType
	): Promise<number> {
		//for develop
		const list = await SalaryRaiseWorkType.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		if (list.length == 0) return 1;
		const multiplier = (
			await SalaryRaiseWorkType.findOne(
				{
					where: {
						period_id: period_id,
						work_type: work_type,
						disabled: false,
					},
				}
			)
		)?.multiplier;
		return multiplier ?? 0;
	}
	async getAllSalaryRaiseWorkType(): Promise<SalaryRaiseWorkType[] | null> {
		const salaryRaiseWorkType = await SalaryRaiseWorkType.findAll(
			{
				where: { disabled: false },
			}
		);
		return salaryRaiseWorkType;
	}

	async updateSalaryRaiseWorkType({
		id,
		work_type,
		multiplier,
	}: z.infer<typeof updateSalaryRaiseWorkTypeService>): Promise<void> {
		const salary_raise_work_type = await this.getSalaryRaiseWorkTypeById(id);
		if (salary_raise_work_type == null) {
			throw new BaseResponseError("SalaryRaiseWorkType does not exist");
		}

		await this.deleteSalaryRaiseWorkType(id);

		await this.createSalaryRaiseWorkType(
			{
				period_id: salary_raise_work_type.period_id,
				work_type: select_value(work_type, salary_raise_work_type.work_type),
				multiplier: select_value(
					multiplier,
					salary_raise_work_type.multiplier
				)
			}
		);
	}

	async deleteSalaryRaiseWorkType(id: number): Promise<void> {
		const destroyedRows = await SalaryRaiseWorkType.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
