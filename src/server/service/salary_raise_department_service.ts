import { injectable } from "tsyringe";
import { SalaryRaiseDepartment } from "../database/entity/SALARY/salary_raise_department";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createSalaryRaiseDepartmentService, 
	updateSalaryRaiseDepartmentService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
@injectable()
export class SalaryRaiseDepartmentService {
	constructor() { }

	async createSalaryRaiseDepartment({
		period_id,
		department,
		multiplier,
	}: z.infer<typeof createSalaryRaiseDepartmentService>): Promise<SalaryRaiseDepartment> {
		const newData = await SalaryRaiseDepartment.create(
			{
				period_id: period_id,
				department: department,
				multiplier: multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}
	async batchCreateSalaryRaiseDepartment(
		data_array: z.infer<typeof createSalaryRaiseDepartmentService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				department: data.department,
				multiplier: data.multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await SalaryRaiseDepartment.bulkCreate(new_data_array);
	}
	async getMultiplier(
		period_id: number,
		department: string
	): Promise<number> {
		//for develop
		const list = await SalaryRaiseDepartment.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
		});
		if (list.length == 0) return 1;
		const correct_department = department.split("\r")[0]?.split("\n")[0];
		const multiplier = (
			await SalaryRaiseDepartment.findOne(
				{
					where: {
						period_id: period_id,
						department: correct_department,
						disabled: false,
					},
				}
			)
		)?.multiplier;
		return multiplier ?? 0;
	}
	async getSalaryRaiseDepartmentById(id: number): Promise<SalaryRaiseDepartment | null> {
		const bonusDepartment = await SalaryRaiseDepartment.findOne(
			{
				where: { id: id }
			}
		);
		return bonusDepartment;
	}

	async getSalaryRaiseDepartmentBySalaryRaiseType(
		period_id: number,
	): Promise<SalaryRaiseDepartment[] | null> {
		const bonusDepartment = await SalaryRaiseDepartment.findAll(
			{
				where: {
					period_id: period_id,
					disabled: false,
				},
			}
		);
		return bonusDepartment;
	}

	async getAllSalaryRaiseDepartment(): Promise<SalaryRaiseDepartment[] | null> {
		const bonusDepartment = await SalaryRaiseDepartment.findAll(
			{
				where: { disabled: false },
			}
		);
		return bonusDepartment;
	}

	async updateSalaryRaiseDepartment({
		id,
		department,
		multiplier,
	}: z.infer<typeof updateSalaryRaiseDepartmentService>): Promise<void> {
		const bonus_department = await this.getSalaryRaiseDepartmentById(id);
		if (bonus_department == null) {
			throw new BaseResponseError("SalaryRaiseDepartment does not exist");
		}
		await this.deleteSalaryRaiseDepartment(id);

		await this.createSalaryRaiseDepartment(
			{
				period_id: bonus_department.period_id,
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

	async deleteSalaryRaiseDepartment(id: number): Promise<void> {
		const destroyedRows = await SalaryRaiseDepartment.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
