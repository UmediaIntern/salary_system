import { injectable } from "tsyringe";
import {
	accessFE,
	type AccessFEType,
	accessiblePages,
	type AccessiblePages,
	type updateAccessAPI,
} from "../api/types/access_page_type";
import { Access } from "../database/entity/SALARY/access";
import "reflect-metadata";
import { BaseResponseError } from "../errors/base_response_error";
import { InternalServerError } from "../errors/internal_server_error";
import { type z } from "zod";

@injectable()
export class AccessService {
	/* constructor() { } */

	async getAccessByRole(role: string | null): Promise<AccessFEType> {
		if (role === null) {
			throw new BaseResponseError("Role is null", 400);
		}

		const accessSettings = await Access.findOne({
			where: {
				role: role,
				disabled: false,
			},
		});

		if (accessSettings === null) {
			throw new InternalServerError(
				`Access settings not found for user ${role}`
			);
		}

		const ret = accessFE.parse(accessSettings);
		return ret;
	}

	async getAllAccess(): Promise<AccessFEType[]> {
		const accessSettings = await Access.findAll({
			where: {
				disabled: false,
			},
		});

		const ret = accessFE.array().parse(accessSettings);
		return ret;
	}

	async createAccessData(role: string, access: AccessiblePages | null) {
		let accessibleData = access;
		if (accessibleData === null) {
			accessibleData = accessiblePages.parse({});
		}
		// Force settings to true
		accessibleData.settings = true;
		await Access.create({
			...accessibleData,
			role: role,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
	}

	async updateAccessData(data: z.infer<typeof updateAccessAPI>) {
		// Force settings to true
		data.settings = true;
		await Access.update(
			{
				...data,
			},
			{ where: { id: data.id } }
		);
	}
}
