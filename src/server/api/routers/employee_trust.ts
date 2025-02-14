import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import {
	employeeTrustCreateAPI,
	employeeTrustFE,
	updateEmployeeTrustAPI,
} from "../types/employee_trust_type";
import { EmployeeTrustMapper } from "~/server/database/mapper/employee_trust_mapper";
import { ValidateService } from "~/server/service/validate_service";
import { BaseResponseError } from "../../errors/base_response_error";
import { select_value } from "~/server/service/helper_function";

export const employeeTrustRouter = createTRPCRouter({
	getCurrentEmployeeTrust: publicProcedure
		.input(z.object({ period_id: z.number() }))
    .output(z.array(employeeTrustFE))
		.query(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const current_employee_trustFE =
				await employeeTrustService.getCurrentEmployeeTrustFE(
					input.period_id
				);
			return current_employee_trustFE;
		}),
	
	getCurrentEmployeeTrustByEmpNo: publicProcedure
		.input(z.object({ period_id: z.number(), emp_no: z.string() }))
		.output(z.array(employeeTrustFE))
		.query(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const current_employee_trustFE =
				await employeeTrustService.getCurrentEmployeeTrustFE(
					input.period_id
				);
			return current_employee_trustFE.filter((item) => {
				return item.emp_no === input.emp_no;
			});
		}),

	getAllEmployeeTrust: publicProcedure.query(async ({ input }) => {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const allEmployeeTrustFE =
			await employeeTrustService.getAllEmployeeTrustFE();
		return allEmployeeTrustFE;
	}),

	createEmployeeTrust: publicProcedure
		.input(employeeTrustCreateAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const validateService = container.resolve(ValidateService);

			await validateService.validateEmployeeTrust(input);

			const newdata = await employeeTrustService.createEmployeeTrust(
				input
			);
			await employeeTrustService.rescheduleEmployeeTrust();
			return newdata;
		}),

	updateEmployeeTrust: publicProcedure
		.input(updateEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
			const validateService = container.resolve(ValidateService);

			const originalEmployeeTrust = await employeeTrustService.getEmployeeTrustById(input.id);
			if (originalEmployeeTrust == null) {
				throw new BaseResponseError("Employee Trust does not exist");
			}
			await validateService.validateEmployeeTrust({
				emp_no: select_value(input.emp_no, originalEmployeeTrust.emp_no),
				start_date: select_value(input.start_date, originalEmployeeTrust.start_date),
				end_date: select_value(input.end_date, originalEmployeeTrust.end_date),
			});

			const employeeTrust =
				await employeeTrustMapper.getEmployeeTrustNullable(input);
			await employeeTrustService.updateEmployeeTrust(employeeTrust);
			await employeeTrustService.rescheduleEmployeeTrust();
		}),

	deleteEmployeeTrust: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const validateService = container.resolve(ValidateService);

			const originalEmployeeTrust = await employeeTrustService.getEmployeeTrustById(input.id);
			if (originalEmployeeTrust == null) {
				throw new BaseResponseError("Employee Trust does not exist");
			}
			await validateService.validateEmployeeTrust({
				emp_no: originalEmployeeTrust.emp_no,
				start_date: originalEmployeeTrust.start_date,
				end_date: originalEmployeeTrust.end_date,
			});


			await employeeTrustService.deleteEmployeeTrust(input.id);
			await employeeTrustService.rescheduleEmployeeTrust();
		}),
});
