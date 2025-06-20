import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../errors/base_response_error";
import { type z } from "zod";
import {
	decInsuranceRateSetting,
	encInsuranceRateSetting,
	InsuranceRateSetting,
	type InsuranceRateSettingDecType,
} from "../database/entity/SALARY/insurance_rate_setting";
import { get_date_string, select_value } from "./helper_function";
import { EHRService } from "./ehr_service";
import { BaseMapper } from "../database/mapper/base_mapper";
import {
	createInsuranceRateSettingService,
	type updateInsuranceRateSettingService,
} from "../api/types/insurance_rate_setting_type";
import { dateToString } from "../api/types/z_utils";

@injectable()
export class InsuranceRateSettingService {
	private readonly insuranceMapper: BaseMapper<
		InsuranceRateSetting,
		InsuranceRateSettingDecType,
		typeof encInsuranceRateSetting,
		typeof decInsuranceRateSetting
	>;
	constructor(private readonly ehrService: EHRService) {
		this.insuranceMapper = new BaseMapper(
			"Insurance Rate Setting Mapper",
			encInsuranceRateSetting,
			decInsuranceRateSetting
		);
	}
	async createInsuranceRateSetting(
		data: z.infer<typeof createInsuranceRateSettingService>
	): Promise<InsuranceRateSetting> {
		const d = createInsuranceRateSettingService.parse(data);

		const insuranceRateSetting = await this.insuranceMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await InsuranceRateSetting.create(
			insuranceRateSetting,
			{
				raw: true,
			}
		);

		return newData;
	}
	async getCurrentInsuranceRateSetting(
		period_id: number
	): Promise<InsuranceRateSettingDecType | null> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const insuranceRateSettingList = await InsuranceRateSetting.findAll({
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
		});

		if (insuranceRateSettingList.length > 1) {
			throw new BaseResponseError(
				"more than one active InsuranceRateSetting"
			);
		}

		const insuranceRateSetting = insuranceRateSettingList[0]
			? insuranceRateSettingList[0]
			: null;

		return insuranceRateSetting ? await this.insuranceMapper.decode(insuranceRateSetting) : null;
	}

	async getAllInsuranceRateSetting(): Promise<
		InsuranceRateSettingDecType[][]
	> {
		const insuranceRateSettingList = await InsuranceRateSetting.findAll({
			where: { disabled: false },
			order: [["start_date", "DESC"]],
		});
		const data_array = await this.insuranceMapper.decodeList(
			insuranceRateSettingList
		);
		const groupedRecords: Record<string, InsuranceRateSettingDecType[]> =
			{};
		data_array.forEach((d) => {
			let key = "";
			if (d.end_date == null) {
				key = get_date_string(d.start_date);
			} else
				key =
					get_date_string(d.start_date) + get_date_string(d.end_date);
			if (!groupedRecords[key]) {
				groupedRecords[key] = [];
			}
			groupedRecords[key]!.push(d);
		});
		const grouped_array = Object.values(groupedRecords).sort((a, b) => {
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
		});

		return grouped_array;
	}

	async getAllFutureInsuranceRateSetting(): Promise<
		InsuranceRateSettingDecType[]
	> {
		const current_date_string = get_date_string(new Date());
		const insuranceRateSettingList = await InsuranceRateSetting.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [["start_date", "DESC"]],
		});
		return await this.insuranceMapper.decodeList(insuranceRateSettingList);
	}

	async getInsuranceRateSettingById(
		id: number
	): Promise<InsuranceRateSettingDecType | null> {
		const insuranceRateSetting = await InsuranceRateSetting.findOne({
			where: {
				id: id,
			},
		});

		return this.insuranceMapper.decode(insuranceRateSetting);
	}

	async updateInsuranceRateSetting(
		data: z.infer<typeof updateInsuranceRateSettingService>
	): Promise<void> {
		const transData = await this.getInsuranceRateSettingAfterSelectValue(
			data
		);
		await this.createInsuranceRateSetting(transData);
		await this.deleteInsuranceRateSetting(data.id);
	}

	async deleteInsuranceRateSetting(id: number): Promise<void> {
		const insurance_rate_setting = await this.getInsuranceRateSettingById(
			id
		);
		if (insurance_rate_setting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}
		const destroyedRows = await InsuranceRateSetting.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleInsuranceRateSetting(): Promise<void> {
		const encodedList = await InsuranceRateSetting.findAll({
			where: { disabled: false },
			order: [
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});
		const insuranceRateSettingList = await this.insuranceMapper.decodeList(
			encodedList
		);
		for (let i = 0; i < insuranceRateSettingList.length - 1; i += 1) {
			const end_date = insuranceRateSettingList[i]!.end_date;
			const start_date = insuranceRateSettingList[i + 1]!.start_date;

			const new_end_date = new Date(start_date);
			new_end_date.setDate(new_end_date.getDate() - 1);

			if (end_date?.getTime() != new_end_date.getTime()) {
				if (new_end_date < insuranceRateSettingList[i]!.start_date) {
					await this.deleteInsuranceRateSetting(
						insuranceRateSettingList[i]!.id
					);
				} else {
					await this.updateInsuranceRateSetting({
						id: insuranceRateSettingList[i]!.id,
						end_date: new_end_date,
					});
				}
			}
		}

		if (
			insuranceRateSettingList[insuranceRateSettingList.length - 1]!
				.end_date != null
		) {
			await this.updateInsuranceRateSetting({
				id: insuranceRateSettingList[
					insuranceRateSettingList.length - 1
				]!.id,
				end_date: null,
			});
		}
	}
	private async getInsuranceRateSettingAfterSelectValue({
		id,
		min_wage,
		l_i_accident_rate,
		l_i_employment_pay_rate,
		l_i_occupational_injury_rate,
		l_i_wage_replacement_rate,
		h_i_standard_rate,
		h_i_avg_dependents_count,
		v2_h_i_supp_pay_rate,
		v2_h_i_deduction_tsx_thres,
		v2_h_i_multiplier,
		start_date,
		end_date,
	}: z.infer<typeof updateInsuranceRateSettingService>): Promise<
		z.infer<typeof createInsuranceRateSettingService>
	> {
		const insurance_rate_setting = await this.getInsuranceRateSettingById(
			id
		);

		if (insurance_rate_setting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}

		return {
			min_wage: select_value(
				min_wage,
				insurance_rate_setting.min_wage
			),
			l_i_accident_rate: select_value(
				l_i_accident_rate,
				insurance_rate_setting.l_i_accident_rate
			),
			l_i_employment_pay_rate: select_value(
				l_i_employment_pay_rate,
				insurance_rate_setting.l_i_employment_pay_rate
			),
			l_i_occupational_injury_rate: select_value(
				l_i_occupational_injury_rate,
				insurance_rate_setting.l_i_occupational_injury_rate
			),
			l_i_wage_replacement_rate: select_value(
				l_i_wage_replacement_rate,
				insurance_rate_setting.l_i_wage_replacement_rate
			),
			h_i_standard_rate: select_value(
				h_i_standard_rate,
				insurance_rate_setting.h_i_standard_rate
			),
			h_i_avg_dependents_count: select_value(
				h_i_avg_dependents_count,
				insurance_rate_setting.h_i_avg_dependents_count
			),
			v2_h_i_supp_pay_rate: select_value(
				v2_h_i_supp_pay_rate,
				insurance_rate_setting.v2_h_i_supp_pay_rate
			),
			v2_h_i_deduction_tsx_thres: select_value(
				v2_h_i_deduction_tsx_thres,
				insurance_rate_setting.v2_h_i_deduction_tsx_thres
			),
			v2_h_i_multiplier: select_value(
				v2_h_i_multiplier,
				insurance_rate_setting.v2_h_i_multiplier
			),
			start_date: select_value(
				start_date,
				insurance_rate_setting.start_date
			),
			end_date: select_value(end_date, insurance_rate_setting.end_date),
		};
	}
}
