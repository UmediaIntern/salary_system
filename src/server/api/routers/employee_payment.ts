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
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { SyncService } from "~/server/service/sync_service";
import { FunctionsEnum } from "../types/functions_enum";
import { EHRService } from "~/server/service/ehr_service";
import { allowanceTypeEnum } from "../types/allowance_type_enum";
import { Allowance } from "~/server/database/entity/UMEDIA/allowance";
import { AllowanceRangeService } from "~/server/service/allowance_range_service";

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
				EmployeePaymentService,
			);
			const employeePaymentFE: EmployeePaymentFEType[] =
				await employeePaymentService.getCurrentEmployeePayment(
					input.period_id,
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

			const period_id = input.period_id;
			const ehrService = container.resolve(EHRService);
			const previous_period_id =
				await ehrService.getPreviousPeriodId(period_id);
			const allowance_range_service = container.resolve(
				AllowanceRangeService,
			);
			const cur_allowance_range =
				await allowance_range_service.getCurrentAllowanceRange(
					period_id,
				);

			const employeePaymentService = container.resolve(
				EmployeePaymentService,
			);
			const employeePaymentFE: EmployeePaymentFEType[] =
				await employeePaymentService.getCurrentEmployeePayment(
					period_id,
				);
			const previousEmployeePaymentFE: EmployeePaymentFEType[] =
				await employeePaymentService.getCurrentEmployeePayment(
					previous_period_id,
				);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeeData =
				await employeeDataService.getAllEmployeeDataByPeriod(
					previous_period_id,
				);

			const syncService = container.resolve(SyncService);
			const cand_paid_emps = await syncService.getCandPaidEmployees(
				FunctionsEnum.Values.month_salary,
				period_id,
			); // 獲取候選需支付員工數據
			const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no); // 提取候選員工的員工編號列表
			const differences =
				await syncService.compareEhrWithSalaryEmployeeData(
					period_id,
					employeeData,
					cand_emp_no_list,
				);

			console.log(differences);
			const employeePaymentWithInfos: EmployeePaymentWithInfoFEType[] =
				[];
			for (const employeePayment of employeePaymentFE) {
				const emp_data = employeeData.find(
					(emp) => emp.emp_no == employeePayment.emp_no,
				)!;
				const emp_diff = differences.find(
					(diff) =>
						diff.emp_no.salary_value == employeePayment.emp_no ||
						diff.emp_no.ehr_value == employeePayment.emp_no,
				);

				let isPositionModified = false;
				let isPositionTypeModified = false;
				if (emp_diff) {
					isPositionModified =
						emp_diff.comparisons.find(
							(cmp) => cmp.key == "position",
						)?.is_different ?? false;
					isPositionTypeModified =
						emp_diff.comparisons.find(
							(cmp) => cmp.key == "position_type",
						)?.is_different ?? false;
				}
				// Compare with previous period's payment to determine isModified
				let isSupervisorInRange =
					await allowance_range_service.checkAllowanceInRange(
						cur_allowance_range,
						emp_data,
						allowanceTypeEnum.Enum.supervisor_allowance,
						employeePayment.supervisor_allowance,
					);
				let isOccupationalInRange =
					await allowance_range_service.checkAllowanceInRange(
						cur_allowance_range,
						emp_data,
						allowanceTypeEnum.Enum.occupational_allowance,
						employeePayment.occupational_allowance,
					);
				let isLongServiceInRange =
					await allowance_range_service.checkAllowanceInRange(
						cur_allowance_range,
						emp_data,
						allowanceTypeEnum.Enum.long_service_allowance,
						employeePayment.long_service_allowance,
					);
				let isSubsidyInRange =
					await allowance_range_service.checkAllowanceInRange(
						cur_allowance_range,
						emp_data,
						allowanceTypeEnum.Enum.subsidy_allowance,
						employeePayment.subsidy_allowance,
					);
				let isFoodInRange =
					await allowance_range_service.checkAllowanceInRange(
						cur_allowance_range,
						emp_data,
						allowanceTypeEnum.Enum.food_allowance,
						employeePayment.food_allowance,
					);

				let isSupervisorModified = false;
				let isOccupationalModified = false;
				let isLongServiceModified = false;
				let isSubsidyModified = false;
				let isFoodModified = false;

				const previousEmployeePayment = previousEmployeePaymentFE.find(
					(prevEmp) => prevEmp.emp_no == employeePayment.emp_no,
				);
				if (previousEmployeePayment) {
					isSupervisorModified =
						employeePayment.supervisor_allowance !=
						previousEmployeePayment.supervisor_allowance;
					isOccupationalModified =
						employeePayment.occupational_allowance !=
						previousEmployeePayment.occupational_allowance;
					isLongServiceModified =
						employeePayment.long_service_allowance !=
						previousEmployeePayment.long_service_allowance;
					isSubsidyModified =
						employeePayment.subsidy_allowance !=
						previousEmployeePayment.subsidy_allowance;
					isFoodModified =
						employeePayment.food_allowance !=
						previousEmployeePayment.food_allowance;
				} else {
					isSupervisorModified =
						employeePayment.supervisor_allowance != 0;
					isOccupationalModified =
						employeePayment.occupational_allowance != 0;
					isLongServiceModified =
						employeePayment.long_service_allowance != 0;
					isSubsidyModified = employeePayment.subsidy_allowance != 0;
					isFoodModified = employeePayment.food_allowance != 0;
				}
				employeePaymentWithInfos.push({
					...employeePayment,
					info: {
						isPositionModified,
						isPositionTypeModified,
						supervisor: {
							isInRange: isSupervisorInRange,
							isModified: isSupervisorModified,
						},
						occupational: {
							isInRange: isOccupationalInRange,
							isModified: isOccupationalModified,
						},
						longService: {
							isInRange: isLongServiceInRange,
							isModified: isLongServiceModified,
						},
						subsidy: {
							isInRange: isSubsidyInRange,
							isModified: isSubsidyModified,
						},
						food: {
							isInRange: isFoodInRange,
							isModified: isFoodModified,
						},
					},
				});
			}

			// Filter by access level
			if (!access.employees) {
				throw new BaseResponseError("Access denied", 403);
			}
			const accessibleEmpData = employeePaymentWithInfos.filter((emp) => {
				return (emp.position ?? 0) <= access.employees_r_lv;
			});

			return accessibleEmpData;
		}),

	getAllEmployeePayment: publicProcedure
		.output(z.array(z.array(employeePaymentFE)))
		.query(async () => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService,
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
				EmployeePaymentService,
			);
			const employeePaymentMapper = container.resolve(
				EmployeePaymentMapper,
			);
			const validateService = container.resolve(ValidateService);

			const previousEmployeePaymentFE =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNoByDate(
					input.emp_no,
					input.start_date ?? new Date(),
				);
			if (!previousEmployeePaymentFE) {
				throw new BaseResponseError(
					`EmployeePayment for emp_no: ${input.emp_no} not exists yet`,
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
				EmployeePaymentService,
			);
			const employeePaymentMapper = container.resolve(
				EmployeePaymentMapper,
			);
			const validateService = container.resolve(ValidateService);

			const Promises = input.map(async (i) => {
				const previousEmployeePaymentFE =
					await employeePaymentService.getCurrentEmployeePaymentByEmpNoByDate(
						i.emp_no,
						i.start_date ?? new Date(),
					);
				if (!previousEmployeePaymentFE) {
					throw new BaseResponseError(
						`EmployeePayment for emp_no: ${i.emp_no} not exists yet`,
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
				EmployeePaymentService,
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
				employeePayment,
			);
			await employeePaymentService.rescheduleEmployeePayment();
		}),

	deleteEmployeePayment: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService,
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
				EmployeePaymentService,
			);

			await employeePaymentService.autoCalculateEmployeePayment(
				input.start_date,
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
				EmployeePaymentService,
			);
			await employeePaymentService.adjustBaseSalary(
				input.base_salary,
				input.start_date,
			);
		}),
});
