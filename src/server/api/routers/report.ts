import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../../errors/base_response_error";
import { z } from "zod";
import { ReportService } from "~/server/service/report_service";
import { PayTypeEnum } from "../types/pay_type_enum";
import { roundProperties } from "~/server/database/mapper/helper_function";

export const reportRouter = createTRPCRouter({
    getTransactionIndividual: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const transactions = await reportService.getTransactionIndividual(
                input.period_id,
                input.pay_type
            );
            if (transactions == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "transactions", data: transactions.map(e => roundProperties(e, 2)) }];
        }),

    getTransactionDepartment: publicProcedure
        .input(z.object({ period_id: z.number(), pay_type: PayTypeEnum }))
        .query(async ({ input }) => {
            const reportService = container.resolve(ReportService);
            const transactions = await reportService.getTransactionDepartment(
                input.period_id,
                input.pay_type
            );
            if (transactions == null) {
                throw new BaseResponseError("Transactions does not exist");
            }
            return [{ name: "transactions", data: transactions.map(e => roundProperties(e, 2)) }];
        })
});
