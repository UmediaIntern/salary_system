import {
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../../errors/base_response_error";
import { z } from "zod";
import { SyncService } from "~/server/service/sync_service";
import { FunctionsEnum } from "../types/functions_enum";
import { syncInput } from "../types/sync_type";

export const syncRouter = createTRPCRouter({
	getCandEmployees: publicProcedure
		.input(z.object({ func: FunctionsEnum, period: z.number() }))
		.query(async ({ input }) => {
			const syncService = container.resolve(SyncService);
			const candEmployees = await syncService.getCandPaidEmployees(
				input.func,
				input.period
			);
			if (candEmployees == null) {
				throw new BaseResponseError("candEmployees does not exist");
			}
			return candEmployees;
		}),

	checkEmployeeData: publicProcedure
		.input(z.object({ func: FunctionsEnum, period_id: z.number() }))
		.query(async ({ input }) => {
			const syncService = container.resolve(SyncService);
			const diffDatas = await syncService.checkEmployeeData(
				input.func,
				input.period_id
			);
			return diffDatas;
		}),

	synchronize: publicProcedure
		.input(
			z.object({ period: z.number(), change_emp_list: syncInput.array() })
		)
		.mutation(async ({ input }) => {
			const syncService = container.resolve(SyncService);
			const updatedDatas = await syncService.synchronize(
				input.period,
				input.change_emp_list
			);
			return updatedDatas;
		}),

	getPaidEmployees: publicProcedure
		.input(z.object({ period_id: z.number(), func: FunctionsEnum, }))
		.query(async ({ input }) => {
			const syncService = container.resolve(SyncService);
			const paidEmployees = await syncService.getPaidEmps(input.func, input.period_id);
			return paidEmployees;
		}),
});
