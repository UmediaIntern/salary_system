import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import {
	employeePaymentBatchCreateAPI,
	employeePaymentCreateAPI,
	employeePaymentFE,
	type EmployeePaymentFEType,
	updateEmployeePaymentAPI,
	updateEmployeePaymentService,
} from "../types/employee_payment_type";
import { EmployeePaymentMapper } from "~/server/database/mapper/employee_payment_mapper";
import { ValidateService } from "~/server/service/validate_service";
import { select_value } from "~/server/service/helper_function";
import { EmployeePayment } from "~/server/database/entity/SALARY/employee_payment";

export const employeePaymentRouter = createTRPCRouter({
	getCurrentEmployeePayment: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentFE: EmployeePaymentFEType[] =
				await employeePaymentService.getCurrentEmployeePayment(
					input.period_id
				);

			return employeePaymentFE;
		}),

	getAllEmployeePayment: publicProcedure
		.output(z.array(z.array(employeePaymentFE)))
		.query(async () => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePayment =
				await employeePaymentService.getAllEmployeePayment();
			if (employeePayment == null) {
				throw new BaseResponseError("EmployeePayment does not exist");
			}

			return employeePayment;
		}),

	// getAllFutureEmployeePayment: publicProcedure
	// 	.output(z.array(z.array(employeePaymentFE)))
	// 	.query(async () => {
	// 		const employeePaymentService = container.resolve(
	// 			EmployeePaymentService
	// 		);
	// 		const employeePayment =
	// 			await employeePaymentService.getAllFutureEmployeePayment();
	// 		if (employeePayment == null) {
	// 			throw new BaseResponseError("EmployeePayment does not exist");
	// 		}

	// 		return employeePayment;
	// 	}),

	createEmployeePayment: publicProcedure
		.input(employeePaymentCreateAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentMapper = container.resolve(
				EmployeePaymentMapper
			);
			const validateService = container.resolve(ValidateService);

			const previousEmployeePaymentFE =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNoByDate(
					input.emp_no,
					input.start_date ?? new Date()
				);
			if (!previousEmployeePaymentFE) {
				throw new BaseResponseError(
					`EmployeePayment for emp_no: ${input.emp_no} not exists yet`
				);
			}

			await validateService.validateEmployeePayment({
				...input,
				end_date: null,
			});

			const newdata = await employeePaymentService.createEmployeePayment({
				...input,
				l_i: previousEmployeePaymentFE.l_i,
				h_i: previousEmployeePaymentFE.h_i,
				l_r: previousEmployeePaymentFE.l_r,
				occupational_injury:
					previousEmployeePaymentFE.occupational_injury,
				end_date: null,
			});

			await employeePaymentService.rescheduleEmployeePayment();

			return await employeePaymentMapper.decode(newdata);
		}),
	
	batchCreateEmployeePayment: publicProcedure
		.input(employeePaymentBatchCreateAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
			const validateService = container.resolve(ValidateService);

			const newDatas = input.map(async(i) => {
				// const previousEmployeePaymentFE =
				// await employeePaymentService.getCurrentEmployeePaymentByEmpNoByDate(
				// 	i.emp_no,
				// 	i.start_date ?? new Date()
				// );
				// if (!previousEmployeePaymentFE) {
				// 	throw new BaseResponseError(
				// 		`EmployeePayment for emp_no: ${i.emp_no} not exists yet`
				// 	);
				// }

				// await validateService.validateEmployeePayment({
				// 	...i,
				// 	end_date: null,
				// });
				
				const newData = await employeePaymentService.createEmployeePayment({
					...i,
					end_date: null,
				})

				// await employeePaymentService.rescheduleEmployeePayment();

				return await employeePaymentMapper.decode(newData);
			})

			return newDatas;
	}),

	updateEmployeePayment: publicProcedure
		.input(updateEmployeePaymentAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const validateService = container.resolve(ValidateService);

			const employeePayment = updateEmployeePaymentService.parse(input);

			const originalEmployeePayment =
				await employeePaymentService.getEmployeePaymentById(input.id);
			if (originalEmployeePayment == null) {
				throw new BaseResponseError("Employee Payment does not exist");
			}
			// await validateService.validateEmployeePayment({
			// 	emp_no: select_value(input.emp_no, originalEmployeePayment.emp_no),
			// 	start_date: select_value(input.start_date, originalEmployeePayment.start_date),
			// 	end_date: select_value(input.end_date, originalEmployeePayment.end_date),
			// });

			await employeePaymentService.updateEmployeePaymentAndMatchLevel(
				employeePayment
			);
			await employeePaymentService.rescheduleEmployeePayment();
		}),

	deleteEmployeePayment: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const validateService = container.resolve(ValidateService);

			const originalEmployeePayment =
				await employeePaymentService.getEmployeePaymentById(input.id);
			if (originalEmployeePayment == null) {
				throw new BaseResponseError("Employee Payment does not exist");
			}
			await validateService.validateEmployeePayment({
				emp_no: originalEmployeePayment.emp_no,
				start_date: originalEmployeePayment.start_date,
				end_date: originalEmployeePayment.end_date,
			});

			await employeePaymentService.deleteEmployeePayment(input.id);
			await employeePaymentService.rescheduleEmployeePayment();
		}),

	autoCalculateEmployeePayment: publicProcedure
		.input(z.object({ start_date: z.date() }))
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);

			await employeePaymentService.autoCalculateEmployeePayment(
				input.start_date
			);
			await employeePaymentService.rescheduleEmployeePayment();
		}),

	adjustBaseSalary: publicProcedure
		.input(z.object({ base_salary: z.number(), start_date: z.date() }))
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			await employeePaymentService.adjustBaseSalary(
				input.base_salary,
				input.start_date
			);
		}),
});
