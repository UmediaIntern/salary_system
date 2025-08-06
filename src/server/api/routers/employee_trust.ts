import { createTRPCRouter, publicProcedure, userProcedure } from "~/server/api/trpc";
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
import { getRoleFromCtx } from "../helper";
import { AccessService } from "~/server/service/access_service";

export const employeeTrustRouter = createTRPCRouter({
	getCurrentEmployeeTrust: userProcedure
		.input(z.object({ period_id: z.number() }))
		.output(z.array(employeeTrustFE))
		.query(async ({ ctx, input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const current_employee_trustFE =
				await employeeTrustService.getCurrentEmployeeTrustFE(
					input.period_id
				);

			// Filter by access
			const role = getRoleFromCtx(ctx);
			const accessService = container.resolve(AccessService);
			const access = await accessService.getAccessByRole(role);
			if (!access.employees) {
				throw new BaseResponseError("Access denied", 403);
			}
			const accessibleEmpData = current_employee_trustFE.filter((emp) => {
				return (emp.position ?? 0) <= access.employees_r_lv;
			});

			return accessibleEmpData;
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

	getAllEmployeeTrust: publicProcedure.query(async () => {
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

	batchCreateEmployeeTrust: publicProcedure
		.input(z.array(employeeTrustCreateAPI))
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const validateService = container.resolve(ValidateService);

			const newdata = [];
			for (const item of input) {
				await validateService.validateEmployeeTrust(item);
				const created = await employeeTrustService.createEmployeeTrust(item);
				newdata.push(created);
			}
			
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
