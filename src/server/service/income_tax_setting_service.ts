import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../errors/base_response_error";
import { type z } from "zod";
import { get_date_string, select_value } from "./helper_function";
import { EHRService } from "./ehr_service";
import { createIncomeTaxSettingService, updateIncomeTaxSettingService } from "../api/types/income_tax_setting_type";
import { IncomeTaxSetting } from "../database/entity/SALARY/income_tax_setting";
import { dateToString, dateToStringNullable } from "../api/types/z_utils";


@injectable()
export class IncomeTaxSettingService {
	constructor(private readonly ehrService: EHRService) {}
	async createIncomeTaxSetting(
		data: z.infer<typeof createIncomeTaxSettingService>
	): Promise<IncomeTaxSetting> {
		const d = createIncomeTaxSettingService.parse(data);
		const newData = await IncomeTaxSetting.create({
			...d,
			start_date: dateToString.parse(d.start_date ?? new Date()),
			end_date: dateToStringNullable.parse(d.end_date),
			disabled: false,
			create_by: "system",
			update_by: "system",
		}, {raw: true});
		return newData;
	}
	async getCurrentIncomeTaxSetting(
		period_id: number
	): Promise<IncomeTaxSetting | null> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const incomeTaxSettingList = await IncomeTaxSetting.findAll({
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
			order: [["start_date", "DESC"]],
			raw: true,
		});

		if (incomeTaxSettingList.length > 1) {
			throw new BaseResponseError(
				"more than one active InsuranceRateSetting"
			);
		}

		const incomeTaxSetting = incomeTaxSettingList[0]
			? incomeTaxSettingList[0]
			: null;

		return incomeTaxSetting;
	}

	// async getAllInsuranceRateSetting(): Promise<
	// 	InsuranceRateSettingDecType[][]
	// > {
	// 	const insuranceRateSettingList = await InsuranceRateSetting.findAll({
	// 		where: { disabled: false },
	// 		order: [["start_date", "DESC"]],
	// 	});
	// 	const data_array = await this.insuranceMapper.decodeList(
	// 		insuranceRateSettingList
	// 	);
	// 	const groupedRecords: Record<string, InsuranceRateSettingDecType[]> =
	// 		{};
	// 	data_array.forEach((d) => {
	// 		let key = "";
	// 		if (d.end_date == null) {
	// 			key = get_date_string(d.start_date);
	// 		} else
	// 			key =
	// 				get_date_string(d.start_date) + get_date_string(d.end_date);
	// 		if (!groupedRecords[key]) {
	// 			groupedRecords[key] = [];
	// 		}
	// 		groupedRecords[key]!.push(d);
	// 	});
	// 	const grouped_array = Object.values(groupedRecords).sort((a, b) => {
	// 		if (a[0]!.start_date > b[0]!.start_date) {
	// 			return -1;
	// 		} else if (a[0]!.start_date < b[0]!.start_date) {
	// 			return 1;
	// 		} else if (a[0]!.end_date == null) {
	// 			return -1;
	// 		} else if (b[0]!.end_date == null) {
	// 			return 1;
	// 		} else if (a[0]!.end_date > b[0]!.end_date) {
	// 			return -1;
	// 		} else return 1;
	// 	});

	// 	return grouped_array;
	// }

	// async getAllFutureInsuranceRateSetting(): Promise<
	// 	InsuranceRateSettingDecType[]
	// > {
	// 	const current_date_string = get_date_string(new Date());
	// 	const insuranceRateSettingList = await InsuranceRateSetting.findAll({
	// 		where: {
	// 			start_date: {
	// 				[Op.gt]: current_date_string,
	// 			},
	// 			disabled: false,
	// 		},
	// 		order: [["start_date", "DESC"]],
	// 	});
	// 	return await this.insuranceMapper.decodeList(insuranceRateSettingList);
	// }

	async getIncomeTaxSettingById(
		id: number
	): Promise<IncomeTaxSetting | null> {
		const insuranceRateSetting = await IncomeTaxSetting.findOne({
			where: {
				id: id,
			},
		});

		return insuranceRateSetting;
	}

	async updateIncomeTaxSetting(
		data: z.infer<typeof updateIncomeTaxSettingService>
	): Promise<void> {
		const transData = await this.getIncomeTaxSettingAfterSelectValue(
			data
		);
		await this.createIncomeTaxSetting(transData);
		await this.deleteIncomeTaxSetting(data.id);
	}

	async deleteIncomeTaxSetting(id: number): Promise<void> {
		const income_tax_setting = await this.getIncomeTaxSettingById(id);
		if (income_tax_setting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}
		const destroyedRows = await IncomeTaxSetting.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleIncomeTaxSetting(): Promise<void> {
		const incomeTaxSettingList = await IncomeTaxSetting.findAll({
			where: { disabled: false },
			order: [
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});

		for (let i = 0; i < incomeTaxSettingList.length - 1; i += 1) {
			const end_date = incomeTaxSettingList[i]!.end_date ? new Date(incomeTaxSettingList[i]!.end_date!) : null;
			const start_date = new Date(incomeTaxSettingList[i + 1]!.start_date);

			const new_end_date = new Date(start_date);
			new_end_date.setDate(new_end_date.getDate() - 1);

			if (end_date?.getTime() != new_end_date.getTime()) {
				if (new_end_date < new Date(incomeTaxSettingList[i]!.start_date)) {
					await this.deleteIncomeTaxSetting(
						incomeTaxSettingList[i]!.id
					);
				} else {
					await this.updateIncomeTaxSetting({
						id: incomeTaxSettingList[i]!.id,
						end_date: new_end_date,
					});
				}
			}
		}

		if (
			incomeTaxSettingList[incomeTaxSettingList.length - 1]!
				.end_date != null
		) {
			await this.updateIncomeTaxSetting({
				id: incomeTaxSettingList[
					incomeTaxSettingList.length - 1
				]!.id,
				end_date: null,
			});
		}
	}
	private async getIncomeTaxSettingAfterSelectValue({
		id,
		entry_date_threshold,
		multiplier,
		deduction,
		tax_ratio_1,
		tax_ratio_2,
		start_date,
		end_date,
	}: z.infer<typeof updateIncomeTaxSettingService>): Promise<
		z.infer<typeof createIncomeTaxSettingService>
	> {
		const income_tax_setting = await this.getIncomeTaxSettingById(id);

		if (income_tax_setting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}

		return {
			entry_date_threshold: select_value(entry_date_threshold, income_tax_setting.entry_date_threshold),
			multiplier: select_value(multiplier, income_tax_setting.multiplier),
			deduction: select_value(deduction, income_tax_setting.deduction),
			tax_ratio_1: select_value(tax_ratio_1, income_tax_setting.tax_ratio_1),
			tax_ratio_2: select_value(tax_ratio_2, income_tax_setting.tax_ratio_2),
			start_date: select_value(start_date, new Date(income_tax_setting.start_date)),
			end_date: select_value(end_date, income_tax_setting.end_date ? new Date(income_tax_setting.end_date) : null),
		};
	}
}
