import { injectable } from "tsyringe";
import { type RolesEnumType } from "../api/types/role_type";
import {
	type AccessiblePagesType,
	accessiblePages,
} from "../api/types/access_page_type";
import { AccessSetting } from "../database/entity/SALARY/access_setting";
import "reflect-metadata";

@injectable()
export class AccessService {
	/* constructor() { } */

	async getAccessByRole(
		role: RolesEnumType | null
	): Promise<AccessiblePagesType> {
		if (role === null) {
			return accessiblePages.parse({});
		}

		const accessSettings = await AccessSetting.findOne(
			{
				where: {
					auth_l: role,
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

	async createAccessData(role: RolesEnumType, access: AccessiblePagesType) {
		await AccessSetting.create(
			{
				...access,
				auth_l: role,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
	}

	async getAllAccess(): Promise<AccessiblePagesType[]> {
		const accessSettings = await AccessSetting.findAll(
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
