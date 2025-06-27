import { container } from "tsyringe";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { importFields } from "../types/import_type";
import { ImportService } from "~/server/service/import_service";
import { z } from "zod";
import {
	checkImportResult,
	deleteTransactionAndEmpDatas,
} from "../types/import_api_type";

export const importTransactionRouter = createTRPCRouter({
	importTransaction: userProcedure
		.input(importFields.array())
		.mutation(async ({ input }) => {
			const importService = container.resolve(ImportService);
			await importService.importTransaction(input);
		}),

	checkImportTransaction: userProcedure
		.input(z.object({ period_id: z.number() }))
		.output(checkImportResult)
		.query(async ({ input }) => {
			const importService = container.resolve(ImportService);
			const empty = await importService.checkImportTransaction(
				input.period_id
			);
			return checkImportResult.parse({ empty });
		}),

	deleteTransactionPeriod: userProcedure
		.input(z.object({ period_id: z.number() }))
		.output(deleteTransactionAndEmpDatas)
		.mutation(async ({ input }) => {
			const importService = container.resolve(ImportService);
			return await importService.deleteExistingTransactionAndData(
				input.period_id
			);
		}),
});
