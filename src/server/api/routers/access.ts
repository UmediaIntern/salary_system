import { container } from "tsyringe";
import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";
import { AccessService } from "~/server/service/access_service";
import { accessFE } from "../types/access_page_type";

export const accessRouter = createTRPCRouter({
	accessByRole: userProcedure
		.output(accessFE)
		.query(async ({ ctx }) => {
			const accessService = container.resolve(AccessService);

			const role = ctx.session?.user.role ?? null;

			return accessService.getAccessByRole(role);
		}),
		
	getAllAccess: publicProcedure
		.output(accessFE.array())
		.query(async () => {
			const accessService = container.resolve(AccessService);
			const allAccess = await accessService.getAllAccess();
			return allAccess
		})
});
