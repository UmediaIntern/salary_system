import { container } from "tsyringe";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EHRService } from "~/server/service/ehr_service";
import { PayTypeEnum } from "../types/pay_type_enum";
import { AllowanceMapper } from "~/server/database/mapper/allowance_mapper";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { OtherMapper } from "~/server/database/mapper/other_mapper";
import { BonusMapper } from "~/server/database/mapper/bonus_mapper";
import { CalculateService } from "~/server/service/calculate_service";
import { OvertimeMapper } from "~/server/database/mapper/overtime_mapper";
import { HolidayMapper } from "~/server/database/mapper/holiday_mapper";
import { PaysetMapper } from "~/server/database/mapper/payset_mapper";
import { type AllowanceFEType } from "../types/allowance_type";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { zPeriod } from "~/server/database/entity/UMEDIA/period";

export const functionRouter = createTRPCRouter({
	getPeriod: publicProcedure.output(zPeriod.array()).query(async () => {
		const ehrService = container.resolve(EHRService);
		const period = await ehrService.getPeriod();

		return period;
	}),

	getHolidayByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const holiday = await ehrService.getHolidayByEmpNoList(
				input.period_id,
				input.emp_no_list,
			);

			return holiday;
		}),
	getHolidayWithTypeByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const holiday_mapper = container.resolve(HolidayMapper);

			await ehrService.getHolidayWithTypeByEmpNoList(
				input.period_id,
				input.emp_no_list,
			);

			const holiday_list = await ehrService.getHolidayByEmpNoList(
				input.period_id,
				input.emp_no_list,
			);
			const employee_data_list =
				await employeeDataService.getEmployeeDataByEmpNoListByPeriod(
					input.period_id,
					input.emp_no_list,
				);
			const payset_list = await ehrService.getPaysetByEmpNoList(
				input.period_id,
				input.emp_no_list,
			);

			return await holiday_mapper.getHolidayFE(
				holiday_list,
				employee_data_list,
				payset_list,
			);
		}),

	getOvertimeByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
				pay_type: PayTypeEnum,
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const overtime_mapper = container.resolve(OvertimeMapper);

			const overtime_list = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				input.emp_no_list,
				input.pay_type,
			);
			const employee_data_list =
				await employeeDataService.getEmployeeDataByEmpNoListByPeriod(
					input.period_id,
					input.emp_no_list,
				);
			const payset_list = await ehrService.getPaysetByEmpNoList(
				input.period_id,
				input.emp_no_list,
			);

			return await overtime_mapper.getOvertimeFE(
				overtime_list,
				employee_data_list,
				payset_list,
			);
		}),

	getPaysetByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const payset_mapper = container.resolve(PaysetMapper);
			const payset = await ehrService.getPaysetByEmpNoList(
				input.period_id,
				input.emp_no_list,
			);

			return await payset_mapper.getPaysetFE(payset, input.period_id);
		}),
	getNewBonusFEByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
				pay_type: PayTypeEnum,
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const bonus_with_type_list =
				await ehrService.getBonusWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list,
					input.pay_type,
				);
			const bonus_mapper = container.resolve(BonusMapper);
			const new_bonusFE_list = await bonus_mapper.getBonusFE(
				input.period_id,
				bonus_with_type_list,
				input.emp_no_list,
			);
			return new_bonusFE_list;
		}),
	getNewBonusFEDiffByEmpNoList: publicProcedure
		.input(
			z.object({
				cur_period_id: z.number(),
				emp_no_list: z.string().array(),
				pay_type: PayTypeEnum,
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const bonus_with_type_list =
				await ehrService.getBonusWithTypeByEmpNoList(
					input.cur_period_id,
					input.emp_no_list,
					input.pay_type,
				);
			const previous_period_id = await ehrService.getPreviousPeriodId(
				input.cur_period_id,
			);
			const prev_bonus_with_type_list =
				await ehrService.getBonusWithTypeByEmpNoList(
					previous_period_id,
					input.emp_no_list,
					input.pay_type,
				);
			const bonus_mapper = container.resolve(BonusMapper);
			const difference = await bonus_mapper.getDifference(
				input.cur_period_id,
				prev_bonus_with_type_list,
				bonus_with_type_list,
				input.emp_no_list,
			);
			return difference;
		}),
	getNewOtherFEByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const otherMapper = container.resolve(OtherMapper);
			const newOther_list = await otherMapper.getOtherFE(
				input.period_id,
				input.emp_no_list,
			);
			return newOther_list;
		}),
	getNewOtherFEDiffByEmpNoList: publicProcedure
		.input(
			z.object({
				cur_period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const otherMapper = container.resolve(OtherMapper);
			const difference = await otherMapper.getDifference(
				input.cur_period_id,
				input.emp_no_list,
			);
			return difference;
		}),
	getOtherDetailsByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const calculate_service = container.resolve(CalculateService);
			const expense_with_type_list =
				await ehrService.getExpenseWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list,
				);
			const allowance_type_list = await ehrService.getAllowanceType();
			const expense_class_list = await ehrService.getExpenseClass();
			const other_addition_list =
				await calculate_service.getOtherAdditionDetail(
					expense_with_type_list,
					allowance_type_list,
				);
			const other_addition_tax_list =
				await calculate_service.getOtherAdditionTaxDetail(
					expense_with_type_list,
					allowance_type_list,
				);
			const other_deduction_list =
				await calculate_service.getOtherDeductionDetail(
					expense_with_type_list,
					expense_class_list,
				);
			const other_deduction_tax_list =
				await calculate_service.getOtherDeductionTaxDetail(
					expense_with_type_list,
					expense_class_list,
				);
			const result = input.emp_no_list.map((emp_no) => {
				return {
					emp_no: emp_no,
					other_addition: (other_addition_list ?? []).filter(
						(a) => a.emp_no === emp_no,
					),
					other_addition_tax: (other_addition_tax_list ?? []).filter(
						(a) => a.emp_no === emp_no,
					),
					other_deduction: (other_deduction_list ?? []).filter(
						(d) => d.emp_no === emp_no,
					),
					other_deduction_tax: (
						other_deduction_tax_list ?? []
					).filter((d) => d.emp_no === emp_no),
				};
			});
			return result;
		}),

	getNewAllowanceFEByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService,
			);
			const allowance_mapper = container.resolve(AllowanceMapper);
			const allowance_with_type_list =
				await ehrService.getAllowanceWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list,
				);
			const employee_data_list =
				await employeeDataService.getEmployeeDataByEmpNoListByPeriod(
					input.period_id,
					input.emp_no_list,
				);
			const employee_payment_list =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNoList(
					input.emp_no_list,
					input.period_id,
				);

			const payset_list = await ehrService.getPaysetByEmpNoList(
				input.period_id,
				input.emp_no_list,
			);

			const allowanceFE_list: AllowanceFEType[] = [];
			const promises = allowance_with_type_list.map(async (allowance) => {
				allowanceFE_list.push(
					await allowance_mapper.getAllowanceFE(
						allowance,
						employee_data_list,
						payset_list,
					),
				);
			});
			await Promise.all(promises);
			const newAllowanceFE_list = allowance_mapper.getNewAllowanceFE(
				allowanceFE_list,
				employee_payment_list,
				employee_data_list,
				payset_list,
			);
			return newAllowanceFE_list;
		}),
	getNewAllowanceFEDiffByEmpNoList: publicProcedure
		.input(
			z.object({
				cur_period_id: z.number(),
				emp_no_list: z.string().array(),
			}),
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService,
			);
			const allowance_mapper = container.resolve(AllowanceMapper);

			const previous_period_id = await ehrService.getPreviousPeriodId(
				input.cur_period_id,
			);
			const allowance_with_type_list =
				await ehrService.getAllowanceWithTypeByEmpNoList(
					input.cur_period_id,
					input.emp_no_list,
				);
			const prev_allowance_with_type_list =
				await ehrService.getAllowanceWithTypeByEmpNoList(
					previous_period_id,
					input.emp_no_list,
				);
			const employee_data_list =
				await employeeDataService.getEmployeeDataByEmpNoListByPeriod(
					input.cur_period_id,
					input.emp_no_list,
				);
			const employee_payment_list =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNoList(
					input.emp_no_list,
					input.cur_period_id,
				);
			const prev_employee_payment_list =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNoList(
					input.emp_no_list,
					previous_period_id,
				);
			const payset_list = await ehrService.getPaysetByEmpNoList(
				input.cur_period_id,
				input.emp_no_list,
			);

			const allowanceFE_list: AllowanceFEType[] = [];
			const prev_allowanceFE_list: AllowanceFEType[] = [];
			const promises = allowance_with_type_list.map(async (allowance) => {
				allowanceFE_list.push(
					await allowance_mapper.getAllowanceFE(
						allowance,
						employee_data_list,
						payset_list,
					),
				);
			});
			await Promise.all(promises);
			const promises2 = prev_allowance_with_type_list.map(
				async (prev_allowance) => {
					prev_allowanceFE_list.push(
						await allowance_mapper.getAllowanceFE(
							prev_allowance,
							employee_data_list,
							payset_list,
						),
					);
				},
			);
			await Promise.all(promises2);
			const Difference = allowance_mapper.getDifference(
				allowanceFE_list,
				prev_allowanceFE_list,
				employee_payment_list,
				prev_employee_payment_list,
			);
			return Difference;
		}),
});
