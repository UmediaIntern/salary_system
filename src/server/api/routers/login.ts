import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as bcrypt from "bcrypt";
import { UserService } from "~/server/service/user_service";
import { container } from "tsyringe";
import { BaseResponseError } from "../../errors/base_response_error";
import { createUserAPI } from "../types/user_type";

export const loginRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ emp_no: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.getUserByEmpNo(input.emp_no);

			if (!user) {
				throw new BaseResponseError("User does not exist");
			} else {
				const match = await bcrypt.compare(input.password, user.hash);
				if (!match) {
					throw new BaseResponseError("Wrong password");
				}
			}

			return user;
		}),

	changePassword: publicProcedure
		.input(z.object({ emp_no: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.getUserByEmpNo(input.emp_no);
			if (!user) {
				throw new BaseResponseError("User does not exist");
			}
			await userService.updateUser({
				emp_no: input.emp_no,
				password: input.password,
			});
		}),

	createUser: publicProcedure
		.input(createUserAPI)
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.createUser(input);
			return user;
		}),

	deleteUser: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.deleteUser(input.id);
		}),
});
