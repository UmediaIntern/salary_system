import { container, injectable } from "tsyringe";
import {
	BankSetting,
	type BankSettingDecType,
	decBankSetting,
	encBankSetting,
} from "../database/entity/SALARY/bank_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../errors/base_response_error";
import { get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import { EHRService } from "./ehr_service";
import { BaseMapper } from "../database/mapper/base_mapper";
import {
	batchCreateBankSettingService,
	createBankSettingService,
	type updateBankSettingService,
} from "../api/types/bank_setting_type";
import { dateToString } from "../api/types/z_utils";

@injectable()
export class BankSettingService {
	private readonly bankSettingMapper: BaseMapper<
		BankSetting,
		BankSettingDecType,
    typeof encBankSetting,
    typeof decBankSetting
	>;

	constructor() {
		this.bankSettingMapper = new BaseMapper("Bank Setting Mapper", encBankSetting, decBankSetting);
	}

	async createBankSetting(
		data: z.infer<typeof createBankSettingService>
	): Promise<BankSetting> {
		const d = createBankSettingService.parse(data);

		const bankSetting = await this.bankSettingMapper.encode({
			...d,
			bank_code: (typeof d.bank_code === "string") ? d.bank_code.padStart(3, "0") : d.bank_code.toString().padStart(3, "0"),
			org_code: (typeof d.org_code === "string") ? d.org_code.padStart(3, "0") : d.org_code.toString().padStart(3, "0"),
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await BankSetting.create(bankSetting, {
			raw: true,
		});

		return newData;
	}

	async batchCreateBankSetting(
		data: z.infer<typeof batchCreateBankSettingService>
	): Promise<BankSetting[]> {
		const ds = batchCreateBankSettingService.parse(data);

		const newDatas = ds.map(async (d) => {
			const bankSetting = await this.bankSettingMapper.encode({
				...d,
				bank_code: (typeof d.bank_code === "string") ? d.bank_code.padStart(3, "0") : d.bank_code.toString().padStart(3, "0"),
				org_code: (typeof d.org_code === "string") ? d.org_code.padStart(3, "0") : d.org_code.toString().padStart(3, "0"),
				start_date: d.start_date ?? new Date(),
				disabled: false,
				create_by: "system",
				update_by: "system",
			});
	
			return await BankSetting.create(bankSetting, {
				raw: true,
			});
		})

		return Promise.all(newDatas);
	}


	async getBankSettingById(id: number): Promise<BankSettingDecType | null> {
		const bankSetting = await BankSetting.findOne({
			where: { id: id },
		});

		return await this.bankSettingMapper.decode(bankSetting);
	}

	async getCurrentBankSetting(
		period_id: number
	): Promise<BankSettingDecType[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const bankSetting = await BankSetting.findAll({
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
			order: [["bank_code", "ASC"]],
		});

		return await this.bankSettingMapper.decodeList(bankSetting);
	}

	async getAllBankSetting(): Promise<BankSettingDecType[][]> {
		const bankSetting = await BankSetting.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["bank_code", "ASC"],
			],
		});
		const data_array = await this.bankSettingMapper.decodeList(bankSetting);
		const groupedBankSettingRecords: Record<string, BankSettingDecType[]> =
			{};
		data_array.forEach((d) => {
			let key = "";
			if (d.end_date == null) {
				key = get_date_string(d.start_date);
			} else
				key =
					get_date_string(d.start_date) + get_date_string(d.end_date);
			if (!groupedBankSettingRecords[key]) {
				groupedBankSettingRecords[key] = [];
			}
			groupedBankSettingRecords[key]!.push(d);
		});
		const grouped_array = Object.values(groupedBankSettingRecords).sort(
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

	async getAllFutureBankSetting(): Promise<BankSettingDecType[]> {
		const current_date_string = get_date_string(new Date());
		const bankSetting = await BankSetting.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["bank_code", "ASC"],
			],
		});

		return await this.bankSettingMapper.decodeList(bankSetting);
	}

	async updateBankSetting({
		id,
		bank_code,
		bank_name,
		org_code,
		org_name,
		start_date,
		end_date,
	}: z.infer<typeof updateBankSettingService>): Promise<void> {
		const bankSetting = await this.getBankSettingById(id);
		if (bankSetting == null) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		await this.deleteBankSetting(id);

		await this.createBankSetting({
			bank_code: select_value(bank_code, bankSetting.bank_code),
			bank_name: select_value(bank_name, bankSetting.bank_name),
			org_code: select_value(org_code, bankSetting.org_code),
			org_name: select_value(org_name, bankSetting.org_name),
			start_date: select_value(start_date, bankSetting.start_date),
			end_date: select_value(end_date, bankSetting.end_date),
		});
	}

	async deleteBankSetting(id: number): Promise<void> {
		const bankSetting = await this.getBankSettingById(id);
		if (bankSetting == null) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		const destroyedRows = await BankSetting.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
