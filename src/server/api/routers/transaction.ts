import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { TransactionService } from "~/server/service/transaction_service";
import { PayTypeEnum } from "~/server/api/types/pay_type_enum";

export const transactionRouter = createTRPCRouter({
	getAllTransaction: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const transactionService = container.resolve(TransactionService);
			const transactions = await transactionService.getAllTransaction(
				input.period_id
			);
			if (transactions == null) {
				throw new BaseResponseError("Transactions does not exist");
			}
			return [{ name: "transactions", data: transactions }];
		}),

	createTransaction: publicProcedure
		.input(
			z.object({
				emp_no_list: z.string().array(),
				period_id: z.number(),
				issue_date: z.string(),
				pay_type: PayTypeEnum,
				note: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const transactionService = container.resolve(TransactionService);
			const commonParameters = await transactionService.getCommonParameters(input.period_id, input.pay_type);
			
			const promises = input.emp_no_list.map(async (emp_no) => {
				// if (emp_no != "U102028") return
				const exist_transaction =
					await transactionService.getUniqueTransaction(
						input.period_id,
						emp_no,
						input.pay_type
					);
				if (exist_transaction != null) {
					await transactionService.deleteTransaction(exist_transaction.id);
				}
				
				await transactionService.createTransaction(
					emp_no,
					input.period_id,
					input.issue_date,
					input.pay_type,
					input.note,
					commonParameters
				);
			})

			console.log(commonParameters.expense_class_list);


			await Promise.all(promises);
		}),
});
