import { injectable } from "tsyringe";
import { accessFE, accessFEType, AccessiblePages } from "../api/types/access_page_type";
import { Access } from "../database/entity/SALARY/access";
import "reflect-metadata";
import { BaseResponseError } from "../errors/base_response_error";
import { InternalServerError } from "../errors/internal_server_error";

@injectable()
export class AccessService {
	/* constructor() { } */

	async getAccessByRole(
		role: string | null
	): Promise<accessFEType> {
		if (role === null) {
			throw new BaseResponseError("Role is null", 400);
		}

		const accessSettings = await Access.findOne(
			{
				where: {
					role: role,
					disabled: false,
				},
			}
		);

		if (accessSettings === null) {
			throw new InternalServerError(`Access settings not found for user ${role}`);
		}

		const ret = accessFE.parse(accessSettings);
		return ret;
	}

	async getAllAccess(): Promise<accessFEType[]> {
		const accessSettings = await Access.findAll(
			{
				where: {
					disabled: false,
				},
				raw: true,
			},
		);
		return accessSettings;
	}

	async createAccessData(role: string, access: AccessiblePages) {
		await Access.create(
			{
				...access,
				role: role,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
	}
}
