import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { number, type z } from "zod";
import { get_date_string, select_value } from "./helper_function";
import {
	SalaryIncomeTax,
	type SalaryIncomeTaxDecType,
	decSalaryIncomeTax,
	encSalaryIncomeTax,
} from "../database/entity/SALARY/salary_income_tax";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { BaseMapper } from "../database/mapper/base_mapper";
import {
	createSalaryIncomeTaxService,
	type updateSalaryIncomeTaxService,
} from "../api/types/salary_income_tax";

export interface primary_key {
	salary_start: number;
	salary_end: number;
	dependent: number;
}
@injectable()
export class SalaryIncomeTaxService {
	private readonly salaryIncomeTaxMapper: BaseMapper<
		SalaryIncomeTax,
		SalaryIncomeTaxDecType,
		typeof encSalaryIncomeTax,
		typeof decSalaryIncomeTax
	>;

	constructor() {
		this.salaryIncomeTaxMapper = new BaseMapper(
			"Salary Income Tax Mapper",
			encSalaryIncomeTax,
			decSalaryIncomeTax
		);
	}

	async createSalaryIncomeTax(
		data: z.infer<typeof createSalaryIncomeTaxService>
	): Promise<primary_key | null> {
		const d = createSalaryIncomeTaxService.parse(data);

		const salaryIncomeTax = await this.salaryIncomeTaxMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		// const conflict_data = await SalaryIncomeTax.findOne({
		// 	where: {
		// 		salary_start: salaryIncomeTax.salary_start,
		// 		salary_end: salaryIncomeTax.salary_end,
		// 		dependent: salaryIncomeTax.dependent,
		// 		start_date: salaryIncomeTax.start_date,
		// 		end_date: salaryIncomeTax.end_date,
		// 		disabled: false,
		// 	},
		// });
		// if (conflict_data != null) {
		// 	throw new Error(
		// 		`Detected Conflict Data: salary_start: ${salaryIncomeTax.salary_start}, salary_end: ${salaryIncomeTax.salary_end}, dependent: ${salaryIncomeTax.dependent}, start_date: ${salaryIncomeTax.start_date}, old_tax_amount: ${conflict_data.tax_amount} and new_tax_amount: ${salaryIncomeTax.tax_amount}`
		// 	);
		// }
		const unchangedData = await SalaryIncomeTax.findOne({
			where: {
				salary_start: salaryIncomeTax.salary_start,
				salary_end: salaryIncomeTax.salary_end,
				dependent: salaryIncomeTax.dependent,
				tax_amount: salaryIncomeTax.tax_amount,
				start_date: {
					[Op.lte]: salaryIncomeTax.start_date,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: salaryIncomeTax.start_date },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
		});
		if (unchangedData) {
			return null;
		}
		const newData = await SalaryIncomeTax.create(salaryIncomeTax, {
			raw: true,
		});
		const primary_key: primary_key = {
			salary_start: newData.salary_start,
			salary_end: newData.salary_end,
			dependent: newData.dependent,
		};
		return primary_key;
	}

	async batchCreateSalaryIncomeTax(
		data_array: z.infer<typeof createSalaryIncomeTaxService>[]
	) {
		const salaryIncomeTax_array = (
			await Promise.all(
				data_array.map(async (data) => {
					const d = createSalaryIncomeTaxService.parse(data);
					const salaryIncomeTax =
						await this.salaryIncomeTaxMapper.encode({
							...d,
							start_date: d.start_date ?? new Date(),
							disabled: false,
							create_by: "system",
							update_by: "system",
						});
					const unchangedData = await SalaryIncomeTax.findOne({
						where: {
							salary_start: salaryIncomeTax.salary_start,
							salary_end: salaryIncomeTax.salary_end,
							dependent: salaryIncomeTax.dependent,
							tax_amount: salaryIncomeTax.tax_amount,
							start_date: {
								[Op.lte]: salaryIncomeTax.start_date,
							},
							end_date: {
								[Op.or]: [
									{ [Op.gte]: salaryIncomeTax.start_date },
									{ [Op.eq]: null },
								],
							},
							disabled: false,
						},
					});
					if (unchangedData) return null;
					return salaryIncomeTax;
				})
			)
		).filter((data) => data != null);
		await SalaryIncomeTax.bulkCreate(salaryIncomeTax_array);
		const unique_primary_keys: primary_key[] = [];
		for (const data of salaryIncomeTax_array) {
			const primary_key: primary_key = {
				salary_start: data.salary_start,
				salary_end: data.salary_end,
				dependent: data.dependent,
			};
			if (!unique_primary_keys.includes(primary_key)) {
				unique_primary_keys.push(primary_key);
			}
		}
		return unique_primary_keys;
	}

	async getCurrentSalaryIncomeTax(
		period_id: number
	): Promise<SalaryIncomeTaxDecType[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const salaryIncomeTax = await SalaryIncomeTax.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			order: [
				["dependent", "ASC"],
				["salary_start", "ASC"],
			],
		});
		return await this.salaryIncomeTaxMapper.decodeList(salaryIncomeTax);
	}

	async getAllSalaryIncomeTax(): Promise<SalaryIncomeTaxDecType[][]> {
		const salaryIncomeTax = await SalaryIncomeTax.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["dependent", "ASC"],
				["salary_start", "ASC"],
			],
		});
		const data_array = await this.salaryIncomeTaxMapper.decodeList(
			salaryIncomeTax
		);
		const groupedSalaryIncomeTaxRecords: Record<
			string,
			SalaryIncomeTaxDecType[]
		> = {};
		data_array.forEach((d) => {
			let key = "";
			if (d.end_date == null) {
				key = get_date_string(d.start_date);
			} else
				key =
					get_date_string(d.start_date) + get_date_string(d.end_date);
			if (!groupedSalaryIncomeTaxRecords[key]) {
				groupedSalaryIncomeTaxRecords[key] = [];
			}
			groupedSalaryIncomeTaxRecords[key]!.push(d);
		});
		const grouped_array = Object.values(groupedSalaryIncomeTaxRecords).sort(
			(a, b) => {
				if (a[0]!.start_date > b[0]!.start_date) {
					return -1;
				} else if (a[0]!.start_date < b[0]!.start_date) {
					return 1;
				} else if (a[0]!.end_date == null) {
					return -1;
				} else if (b[0]!.end_date == null) {
					return 1;
				} else if (a[0]!.end_date > b[0]!.end_date) {
					return -1;
				} else return 1;
			}
		);
		return grouped_array;
	}

	async getAllFutureSalaryIncomeTax(): Promise<SalaryIncomeTaxDecType[]> {
		const current_date_string = get_date_string(new Date());
		const salaryIncomeTax = await SalaryIncomeTax.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["dependent", "ASC"],
				["salary_start", "ASC"],
			],
		});
		return this.salaryIncomeTaxMapper.decodeList(salaryIncomeTax);
	}

	async getSalaryIncomeTaxById(
		id: number
	): Promise<SalaryIncomeTaxDecType | null> {
		const salaryIncomeTax = await SalaryIncomeTax.findOne({
			where: {
				id: id,
			},
		});

		if (!salaryIncomeTax) return null;

		return this.salaryIncomeTaxMapper.decode(salaryIncomeTax);
	}

	async getTargetSalaryIncomeTax(
		salary: number,
		dependent: number
	): Promise<SalaryIncomeTaxDecType | null> {
		const salaryIncomeTax = await SalaryIncomeTax.findOne({
			where: {
				salary_start: {
					[Op.lte]: salary,
				},
				salary_end: {
					[Op.gte]: salary,
				},
				dependent: dependent,
				disabled: false,
			},
		});
		if (!salaryIncomeTax) return null;
		return this.salaryIncomeTaxMapper.decode(salaryIncomeTax);
	}

	async updateSalaryIncomeTax({
		id,
		salary_start,
		salary_end,
		dependent,
		tax_amount,
		start_date,
		end_date,
	}: z.infer<typeof updateSalaryIncomeTaxService>) {
		const salaryIncomeTax = await this.getSalaryIncomeTaxById(id);
		if (salaryIncomeTax == null) {
			throw new BaseResponseError("Employee account does not exist");
		}

		const deleted_primary_key = await this.deleteSalaryIncomeTax(id);

		const primary_key = await this.createSalaryIncomeTax({
			salary_start: select_value(
				salary_start,
				salaryIncomeTax.salary_start
			),
			salary_end: select_value(salary_end, salaryIncomeTax.salary_end),
			dependent: select_value(dependent, salaryIncomeTax.dependent),
			tax_amount: select_value(tax_amount, salaryIncomeTax.tax_amount),
			start_date: select_value(start_date, salaryIncomeTax.start_date),
			end_date: select_value(end_date, salaryIncomeTax.end_date),
		});
		if (primary_key == null) {
			const unique_primary_keys = [deleted_primary_key]
			return unique_primary_keys;
		}
		const unique_primary_keys: primary_key[] =
			deleted_primary_key != primary_key
				? [deleted_primary_key, primary_key]
				: [primary_key];
		return unique_primary_keys;
	}

	async deleteSalaryIncomeTax(id: number) {
		const deleted_data = await this.getSalaryIncomeTaxById(id);
		if (deleted_data == null) {
			throw new Error("Trying to delete non-existent data");
		}
		const result = await SalaryIncomeTax.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		const primary_key = {
			salary_start: deleted_data.salary_start,
			salary_end: deleted_data.salary_end,
			dependent: deleted_data.dependent,
		};
		return primary_key;
	}

	async rescheduleSalaryIncomeTax(unique_primary_keys: primary_key[]) {
		for (const primary_key of unique_primary_keys) {
			const encoded_datas = await SalaryIncomeTax.findAll({
				where: {
					salary_start: primary_key.salary_start,
					salary_end: primary_key.salary_end,
					dependent: primary_key.dependent,
					disabled: false,
				},
				order: [
					["start_date", "ASC"],
					["update_date", "ASC"],
				],
			});
			const existed_datas = await this.salaryIncomeTaxMapper.decodeList(
				encoded_datas
			);
			for (let i = 0; i < existed_datas.length - 1; i += 1) {
				const end_date = existed_datas[i]!.end_date;
				const start_date = existed_datas[i + 1]!.start_date;

				const new_end_date = new Date(start_date);
				new_end_date.setDate(new_end_date.getDate() - 1);

				if (end_date?.getTime() != new_end_date.getTime()) {
					if (new_end_date < existed_datas[i]!.start_date) {
						await this.deleteSalaryIncomeTax(existed_datas[i]!.id);
					} else {
						await this.updateSalaryIncomeTax({
							id: existed_datas[i]!.id,
							end_date: new_end_date,
						});
					}
				}
			}
			if (existed_datas[existed_datas.length - 1]!.end_date != null) {
				await this.updateSalaryIncomeTax({
					id: existed_datas[existed_datas.length - 1]!.id,
					end_date: null,
				});
			}
		}
	}
}
