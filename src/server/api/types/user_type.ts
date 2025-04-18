import { z } from "zod";
import { Id, dateCreate, metadata } from "./common_type";
import { accessFE } from "./access_page_type";
import { stringToDate, stringToDateNullable } from "./z_utils";

export const user = z.object({
	emp_no: z.string(),
	password: z.string(),
	role: z.string(),
});

export const createUserAPI = user.merge(dateCreate);
export const createUserService = user.merge(dateCreate);

export const updateUserService = user.omit({role: true});

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
