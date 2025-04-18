import { container } from "tsyringe";
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { UserService } from "~/server/service/user_service";

export const userRouter = createTRPCRouter({
    getAllUser: publicProcedure.query(async () => {
        const userService = container.resolve(UserService);
        const allUsers = await userService.getAllUser();
        return allUsers;
    }),
});
