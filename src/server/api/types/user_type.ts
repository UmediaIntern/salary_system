import { z } from "zod";
import { Id, dateCreate, dateFE, metadata } from "./common_type";
import { accessFE } from "./access_page_type";
import { stringToDate, stringToDateNullable } from "./z_utils";

export const user = z.object({
	emp_no: z.string(),
	password: z.string(),
	role: z.string(),
});

export const createUserAPI = user.merge(dateCreate);
export const createUserService = user.merge(dateCreate);

export const updateUserService = z.object({
	emp_no: z.string(),
	password: z.string(),
});

export const changeUserRoleService = z.object({
	emp_no: z.string(),
	role: z.string(),
});

export const userAndAccess = z
	.object({
		emp_no: z.string(),
		hash: z.string(),
		disabled: z.boolean(),
		access_id: z.number(),
		access: accessFE,
	})
	.merge(
		z.object({
			start_date: stringToDate,
			end_date: stringToDateNullable,
		})
	)
	.merge(metadata)
	.merge(Id);

export const userAndAccessFE = userAndAccess
	.omit({ start_date: true, end_date: true })
	.merge(dateFE);
