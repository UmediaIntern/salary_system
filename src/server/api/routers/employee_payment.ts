import {
	createTRPCRouter,
	publicProcedure,
	userProcedure,
} from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../../errors/base_response_error";
import { z } from "zod";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import {
	employeePaymentBatchCreateAPI,
	employeePaymentCreateAPI,
	employeePaymentFE,
	type EmployeePaymentFEType,
	employeePaymentWithInfoFE,
	EmployeePaymentWithInfoFEType,
	updateEmployeePaymentAPI,
	updateEmployeePaymentService,
} from "../types/employee_payment_type";
import { EmployeePaymentMapper } from "~/server/database/mapper/employee_payment_mapper";
import { ValidateService } from "~/server/service/validate_service";
import { getRoleFromCtx } from "../helper";
import { AccessService } from "~/server/service/access_service";
import { EHRService } from "~/server/service/ehr_service";
import { select_value } from "~/server/service/helper_function";

export const employeePaymentRouter = createTRPCRouter({
	getCurrentEmployeePayment: userProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ ctx, input }) => {
			// Filter by access
			const role = getRoleFromCtx(ctx);
			const accessService = container.resolve(AccessService);
			const access = await accessService.getAccessByRole(role);
			if (!access.employees) {
				throw new BaseResponseError("Access denied", 403);
			}

			// Logic
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentFE: EmployeePaymentFEType[] =
				await employeePaymentService.getCurrentEmployeePayment(
					input.period_id
				);

			// Filter by access level
			const accessibleEmpData = employeePaymentFE.filter((emp) => {
				return (emp.position ?? 0) <= access.employees_r_lv;
			});

			return accessibleEmpData;
		}),

	getCurrentEmployeePaymentWithInfo: userProcedure
		.input(z.object({ period_id: z.number() }))
		.output(employeePaymentWithInfoFE.array())
		.query(async ({ ctx, input }) => {
			// Filter by access
			const role = getRoleFromCtx(ctx);
			const accessService = container.resolve(AccessService);
			const access = await accessService.getAccessByRole(role);
			if (!access.employees) {
				throw new BaseResponseError("Access denied", 403);
			}

			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentWithInfoFE: EmployeePaymentWithInfoFEType[] =
				await employeePaymentService.getCurrentEmployeePaymentWithInfo(
					input.period_id
				);

			// Filter by access level
			const accessibleEmpData = employeePaymentWithInfoFE.filter((emp) => {
				return (emp.position ?? 0) <= access.employees_r_lv;
			});

			return accessibleEmpData;
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
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentMapper = container.resolve(
				EmployeePaymentMapper
			);
			const validateService = container.resolve(ValidateService);

			const Promises = input.map(async (i) => {
				const previousEmployeePaymentFE =
					await employeePaymentService.getCurrentEmployeePaymentByEmpNoByDate(
						i.emp_no,
						i.start_date ?? new Date()
					);
				if (!previousEmployeePaymentFE) {
					throw new BaseResponseError(
						`EmployeePayment for emp_no: ${i.emp_no} not exists yet`
					);
				}

				await validateService.validateEmployeePayment({
					...i,
					end_date: null,
				});

				const newData =
					await employeePaymentService.createEmployeePayment({
						...i,
						end_date: null,
					});

				// await employeePaymentService.rescheduleEmployeePayment();
				console.log(await employeePaymentMapper.decode(newData));
				return await employeePaymentMapper.decode(newData);
			});
			const newDatas_before_schedule = await Promise.all(Promises);
			await employeePaymentService.rescheduleEmployeePayment();
			// const newDatas = await employeePaymentService.getAllEmployeePayment();
			return newDatas_before_schedule;
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
			await validateService.validateEmployeePayment({
				emp_no: select_value(input.emp_no, originalEmployeePayment.emp_no),
				start_date: select_value(input.start_date, originalEmployeePayment.start_date),
				end_date: select_value(input.end_date, originalEmployeePayment.end_date),
			});

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

	adjustLevelEmployeePayment: publicProcedure
		.input(z.object({ start_date: z.date() }))
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);

			await employeePaymentService.adjustLevelEmployeePayment(
				input.start_date
			);
			await employeePaymentService.rescheduleEmployeePayment();
		}),

	getFullAttendenceBonusLimit: publicProcedure
		.output(z.object({ full_attendence_bonus_limit: z.number() }))
		.query(async () => {
			const ehrService = container.resolve(EHRService);

			return {
				full_attendence_bonus_limit:
					await ehrService.getFullAttendenceBonusLimit(),
			};
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
