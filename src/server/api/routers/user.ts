import { container } from "tsyringe";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { UserService } from "~/server/service/user_service";
import { userAndAccessFE } from "../types/user_type";
import { z } from "zod";

export const userRouter = createTRPCRouter({
	getAllUser: publicProcedure
		.output(userAndAccessFE.array())
		.query(async () => {
			const userService = container.resolve(UserService);
			const allUsers = await userService.getAllUser();
			return allUsers;
		}),
	updateUserRole: publicProcedure
		.input(z.object({ emp_no: z.string(), role: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.changeUserRole({
				emp_no: input.emp_no,
				role: input.role,
			});
		}),
});
