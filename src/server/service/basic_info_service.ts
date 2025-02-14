import { injectable } from "tsyringe";
import { BaseResponseError } from "../errors/base_response_error";
import { z } from "zod";
import {
	createBasicInfoService,
	updateBasicInfoService,
} from "../api/types/parameters_input_type";
import { BasicInfo } from "../database/entity/SALARY/basic_info";
import { select_value } from "./helper_function";

@injectable()
export class BasicInfoService {
	constructor() {}

	async createBasicInfo({
		issue_date,
		announcement,
	}: z.infer<typeof createBasicInfoService>): Promise<BasicInfo> {
		const newData = await BasicInfo.create({
			issue_date: issue_date,
			announcement: announcement,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBasicInfoById(id: number): Promise<BasicInfo | null> {
		const basicInfo = await BasicInfo.findOne({
			where: {
				id: id,
			},
		});
		return basicInfo;
	}

	async getCurrentBasicInfo(): Promise<BasicInfo | null> {
		const basicInfoList = await this.getAllBasicInfo();
		if (basicInfoList.length > 1) {
			throw new BaseResponseError("more than one active BasicInfo");
		}

		const basicInfo = basicInfoList.length == 1 ? basicInfoList[0]! : null;

		return basicInfo;
	}

	async getAllBasicInfo(): Promise<BasicInfo[]> {
		const basicInfo = await BasicInfo.findAll();
		return basicInfo;
	}

	async updateBasicInfo({
		id,
		issue_date,
		announcement,
	}: z.infer<typeof updateBasicInfoService>): Promise<void> {
		const basicInfo = await this.getBasicInfoById(id!);
		if (basicInfo == null) {
			throw new BaseResponseError("BasicInfo does not exist");
		}

		const affectedCount = await BasicInfo.update(
			{
				issue_date: select_value(issue_date, basicInfo.issue_date),
				announcement: select_value(
					announcement,
					basicInfo.announcement
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBasicInfo(id: number): Promise<void> {
		const destroyedRows = await BasicInfo.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
