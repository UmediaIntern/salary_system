import { container } from "tsyringe";
import {
	createTRPCRouter,
	publicProcedure,
	userProcedure,
} from "~/server/api/trpc";
import { AccessService } from "~/server/service/access_service";
import { accessFE, updateAccessAPI } from "../types/access_page_type";
import { z } from "zod";

export const accessRouter = createTRPCRouter({
	accessByRole: userProcedure.output(accessFE).query(async ({ ctx }) => {
		const accessService = container.resolve(AccessService);

		const role = ctx.session?.user.role ?? null;

		return accessService.getAccessByRole(role);
	}),

	getAllAccess: publicProcedure.output(accessFE.array()).query(async () => {
		const accessService = container.resolve(AccessService);
		const allAccess = await accessService.getAllAccess();
		return allAccess;
	}),

	createAccess: userProcedure
		.input(z.object({ role_name: z.string(), is_admin: z.boolean().optional().default(false) }))
		.mutation(async ({ input }) => {
			const accessService = container.resolve(AccessService);
			await accessService.createAccessData(input.role_name, null, input.is_admin);
		}),

	updateAccess: userProcedure
		.input(updateAccessAPI)
		.mutation(async ({ input }) => {
			const accessService = container.resolve(AccessService);
			await accessService.updateAccessData(input);
		}),
  
  deleteAccess: publicProcedure 
    .input(z.object({ role_id: z.number() }))
    .mutation(async ({ input }) => {
			const accessService = container.resolve(AccessService);
			await accessService.deleteAccessData(input.role_id);
    })
});
