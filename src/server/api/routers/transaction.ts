import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { TransactionService } from "~/server/service/transaction_service";
import { PayTypeEnum } from "~/server/api/types/pay_type_enum";
import { dateToString } from "../types/z_utils";

export const transactionRouter = createTRPCRouter({
	createTransaction: publicProcedure
		.input(
			z.object({
				emp_no_list: z.string().array(),
				period_id: z.number(),
				issue_date: z.date(),
				pay_type: PayTypeEnum,
				note: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const transactionService = container.resolve(TransactionService);
			const commonParameters =
				await transactionService.getCommonParameters(
					input.period_id,
					input.pay_type,
					input.emp_no_list
				);

			const promises = input.emp_no_list.map(async (emp_no) => {
				// if (emp_no != "U093051") return;		// ~ Pony's Test
				const exist_transaction =
					await transactionService.getUniqueTransaction(
						input.period_id,
						emp_no,
						input.pay_type
					);
				if (exist_transaction != null) {
					await transactionService.deleteTransaction(
						exist_transaction.id
					);
				}

				await transactionService.createTransaction(
					emp_no,
					input.period_id,
					dateToString.parse(input.issue_date), // TODO: shitty code
					input.pay_type,
					input.note,
					commonParameters
				);
			});

			// console.log(commonParameters.expense_class_list);	// ~ Pony's Test

			await Promise.all(promises);
		}),
});
