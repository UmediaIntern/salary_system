import { injectable } from "tsyringe";
import {
	type AccessiblePagesType,
	accessiblePages,
} from "../api/types/access_page_type";
import { Access } from "../database/entity/SALARY/access";
import "reflect-metadata";

@injectable()
export class AccessService {
	/* constructor() { } */

	async getAccessByRole(
		role: string | null
	): Promise<AccessiblePagesType> {
		if (role === null) {
			return accessiblePages.parse({});
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
			return accessiblePages.parse({});
		}

		const ret = accessiblePages.parse(accessSettings);
		return ret;
	}

	async createAccessData(role: string, access: AccessiblePagesType) {
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

	async getAllAccess(): Promise<AccessiblePagesType[]> {
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
}
