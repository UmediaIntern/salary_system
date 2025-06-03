import { container } from "tsyringe";
import {
	createTRPCRouter,
	userProcedure,
} from "~/server/api/trpc";
import { importFields } from "../types/import_type";
import { ImportService } from "~/server/service/import_service";

export const importTransactionRouter = createTRPCRouter({
	importTransaction: userProcedure
		.input(importFields.array())
		.mutation(async ({ input }) => {
			const importService = container.resolve(ImportService);
			await importService.importTransaction(input);
		}),
});
