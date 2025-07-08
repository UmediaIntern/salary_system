import { z } from "zod";

export const checkImportResult = z.object({
	empty: z.boolean(),
});

export const deleteTransactionAndEmpDatas = z.object({
	empDataDeleted: z.number(),
	empPaymentDeleted: z.number(),
	empTrustDeleted: z.number(),
	empBonusDeleted: z.number(),
	transactionDeleted: z.number(),
});
