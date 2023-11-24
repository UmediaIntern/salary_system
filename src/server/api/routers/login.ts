import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import * as bcrypt from "bcrypt";
import { UserService } from "~/server/service/user_service";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { createUserInput } from "../input_type/parameters_input";

export const loginRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.getUser(input.emp_id);

			if (!user) {
				throw new BaseResponseError("User does not exist");
			} else {
				const match = await bcrypt.compare(input.password, user.hash);
				if (!match) {
					throw new BaseResponseError("Wrong password");
				} else {
					await userService.updateUser({
						emp_id: input.emp_id,
						password: input.password,
					});
				}
			}

			return user;
		}),

	changePassword: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.updateUser({
				emp_id: input.emp_id,
				password: input.password,
			});
		}),

	createUser: publicProcedure
		.input(createUserInput)
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.createUser(input);

			return user;
		}),

	deleteUser: publicProcedure
		.input(z.object({ emp_id: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.deleteUser(input.emp_id);
		}),
});
