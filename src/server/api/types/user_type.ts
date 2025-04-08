import { z } from "zod";
import { Id, dateAll, dateCreate } from "./common_type";

export const user = z.object({
	emp_no: z.string(),
	password: z.string(),
	auth_role: z.string(),
});

export const createUserAPI = user.merge(dateCreate);
export const createUserService = user.merge(dateCreate);
export const updateUserAPI = user.merge(dateAll).partial().merge(Id);
export const updateUserService = user.merge(dateCreate).partial();
