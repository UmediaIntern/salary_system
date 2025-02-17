import { z } from "zod";
import { container } from "tsyringe";
import { PayTypeEnum } from "~/server/api/types/pay_type_enum";
import { TransactionService } from "~/server/service/TEST_transaction_service";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EHRService } from "~/server/service/ehr_service";
import { Allowance } from "~/server/database/entity/UMEDIA/allowance";


export const testTransactionRouter = createTRPCRouter({
    testCreateTransaction: publicProcedure
        .input(
            z.object({
                emp_no_list: z.string().array(),
                period_id: z.number(),
                issue_date: z.string(),
                pay_type: PayTypeEnum,
                data: z.any().array(),

                // arbitrary employee data
                allowanceList: z.any().array(),
                bonusList: z.any().array(),
                paysetList: z.any().array(),
                employeeDataList: z.any().array(),
                employeePaymentList: z.any().array(),
                employeeTrustList: z.any().array(),
                overtimeList: z.any().array(),
                holidayList: z.any().array(),
                expenseList: z.any().array(),
            })
        )
        .mutation(async ({ input }) => {
            const testTransactionService = container.resolve(TransactionService);
            const commonParameters = await testTransactionService.getCommonParameters(
                input.period_id, 
                input.pay_type,
                input.allowanceList,
                input.bonusList,
                input.paysetList,
                input.employeeDataList,
                input.employeePaymentList,
                input.employeeTrustList,
                input.overtimeList,
                input.holidayList,
                input.expenseList
            );
            
            const promises = input.data.map(async (d) => {
                const result = await testTransactionService.testCreateTransaction(
                    d.emp_no,
                    input.period_id,
                    input.issue_date,
                    input.pay_type,
                    d.note,
                    commonParameters,
                );
                return result;
            })

            return await Promise.all(promises);
        }),
    getAllowanceType: publicProcedure.query(async () => {
        const ehrService = container.resolve(EHRService);
        return await ehrService.getAllowanceType();
    }),
    getBonusType: publicProcedure.query(async () => {
        const ehrService = container.resolve(EHRService);
        return await ehrService.getBonusType();
    }),
});
