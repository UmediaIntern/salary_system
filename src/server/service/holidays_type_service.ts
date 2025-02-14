import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { select_value } from "./helper_function";
import { z } from "zod";
import {
	createHolidaysTypeService,
	updateHolidaysTypeService,
} from "../api/types/parameters_input_type";
import { HolidaysType } from "../database/entity/SALARY/holidays_type";

@injectable()
export class HolidaysTypeService {
	constructor() { }

	async createHolidaysType({
		pay_id,
		holidays_name,
		multiplier,
		pay_type
	}: z.infer<typeof createHolidaysTypeService>): Promise<HolidaysType> {
		const newData = await HolidaysType.create(
			{
				pay_id,
				holidays_name,
				multiplier,
				pay_type,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}

	async getHolidaysTypeById(id: number): Promise<HolidaysType | null> {
		const holidaysType = await HolidaysType.findOne(
			{
				where: { id: id },
			}
		);
		return holidaysType;
	}

	async getCurrentHolidaysType(): Promise<HolidaysType[]> {
		const holidaysType = await HolidaysType.findAll(
			{
				where: { disabled: false },
			}
		);
		return holidaysType;
	}

	async getAllHolidaysType(): Promise<HolidaysType[]> {
		const holidaysType = await HolidaysType.findAll(
			{
				where: { disabled: false },
			}
		);
		return holidaysType;
	}

	async updateHolidaysType({
		id,
		pay_id,
		holidays_name,
		multiplier,
		pay_type,
	}: z.infer<typeof updateHolidaysTypeService>): Promise<void> {
		const holidaysType = await this.getHolidaysTypeById(id);
		if (holidaysType == null) {
			throw new BaseResponseError("HolidaysType does not exist");
		}

		await this.deleteHolidaysType(id);

		await this.createHolidaysType(
			{
				pay_id: select_value(pay_id, holidaysType.pay_id),
				holidays_name: select_value(holidays_name, holidaysType.holidays_name),
				multiplier: select_value(multiplier, holidaysType.multiplier),
				pay_type: select_value(pay_type, holidaysType.pay_type),

			},
		);
	}

	async deleteHolidaysType(id: number): Promise<void> {
		const destroyedRows = await HolidaysType.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
