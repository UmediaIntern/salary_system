import { z } from "zod";
import { Id, dateAll, dateCreate, dateMetaFE } from "./common_type";
import { accessiblePages } from "./access_page_type";

export const user = z.object({
	emp_no: z.string(),
	password: z.string(),
	role: z.string(),
});

export const createUserAPI = user.merge(dateCreate);
export const createUserService = user.merge(dateCreate);
export const updateUserAPI = user.merge(dateAll).partial().merge(Id);
export const updateUserService = user.merge(dateCreate).partial();

export const userAndAccess = z
	.object({
		emp_no: z.string(),
		hash: z.string(),
		disabled: z.boolean(),
		access_id: z.number(),
		access: accessiblePages.merge(z.object({ role: z.string() })),
	})
	.merge(dateMetaFE)
	.merge(Id);
