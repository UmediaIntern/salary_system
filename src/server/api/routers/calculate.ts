import { BaseResponseError } from "../error/BaseResponseError";
import { CalculateService } from "~/server/service/calculate_service";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { AttendanceSettingService } from "~/server/service/attendance_setting_service";
import { EHRService } from "~/server/service/ehr_service";
import { InsuranceRateSettingService } from "~/server/service/insurance_rate_setting_service";
import { HolidaysTypeService } from "~/server/service/holidays_type_service";


export const calculateRouter = createTRPCRouter({
	//MARK: API for 平日加班費
	calculateWeekdayOvertimePay: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNoByPeriod(input.period_id,input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const overtime_list = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				[input.emp_no],
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			).findLast((data) => data.emp_no === input.emp_no);
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const calculateService = container.resolve(CalculateService);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const weekday_overtime_pay: number =
				await calculateService.getWeekdayOvertimePay(
					employee_data!,
					employee_payment!,
					overtime_list!,
					payset!,
					insurance_rate_setting!,
					full_attendance_bonus
				);
			if (weekday_overtime_pay == null) {
				throw new BaseResponseError(
					"Cannot calculate weekday overtime payment"
				);
			}
			return weekday_overtime_pay;
		}),

	//MARK: API for 假日加班費
	calculateHolidayOvertimePay: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNoByPeriod(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const overtime_list = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				[input.emp_no]
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			).findLast((data) => data.emp_no === input.emp_no);
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const calculateService = container.resolve(CalculateService);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const rest_overtime_pay: number =
				await calculateService.getHolidayOvertimePay(
					employee_data!,
					employee_payment!,
					overtime_list!,
					payset!,
					insurance_rate_setting!,
					full_attendance_bonus
				);
			if (rest_overtime_pay == null) {
				throw new BaseResponseError(
					"Cannot calculate holiday overtime payment"
				);
			}
			return rest_overtime_pay;
		}),
	//MARK: API for 超時加班
		calculateExceedOvertimePay: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNoByPeriod(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const overtime_list = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				[input.emp_no]
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			).findLast((data) => data.emp_no === input.emp_no);
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const calculateService = container.resolve(CalculateService);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const exceed_overtime_pay: number =
				await calculateService.getExceedOvertimePay(
					employee_data!,
					employee_payment!,
					overtime_list!,
					payset!,
					insurance_rate_setting!,
					full_attendance_bonus
				);
			if (exceed_overtime_pay == null) {
				throw new BaseResponseError(
					"Cannot calculate holiday overtime payment"
				);
			}
			return exceed_overtime_pay;
		}),
	//MARK: API for 應發底薪
	calculateGrossSalary: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const ehrService = container.resolve(EHRService);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			).findLast((data) => data.emp_no === input.emp_no);
			const gross_salary = await calculateService.getGrossSalary(
				employee_payment!,
				payset!,
			);
			if (gross_salary == null) {
				throw new BaseResponseError("Cannot calculate gross salary");
			}
			return gross_salary;
		}),
	//MARK: API for 勞保扣除額
	calculateLaborInsuranceDeduction: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employee_data = await employeeDataService.getEmployeeDataByEmpNoByPeriod(
				input.emp_no
			);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const ehrService = container.resolve(EHRService);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			).findLast((data) => data.emp_no === input.emp_no);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				)
			const labor_insurance_deduction = await calculateService.getLaborInsuranceDeduction(
				employee_data!,
				employee_payment!,
				payset!,
				insurance_rate_setting!
			)
			return labor_insurance_deduction
		}),
	//MARK: API for 健保扣除額
	calculateHealthInsuranceDeduction: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employee_data = await employeeDataService.getEmployeeDataByEmpNoByPeriod(
				input.emp_no
			)
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const ehrService = container.resolve(EHRService);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			).findLast((data) => data.emp_no === input.emp_no);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				)
			const health_insurance_deduction = await calculateService.getHealthInsuranceDeduction(
				employee_data!,
				employee_payment!,
				insurance_rate_setting!,
			)
			return health_insurance_deduction
		}),
	//MARK: API for 福利金提撥
	calculateWelfareDeduction: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNoByPeriod(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const full_attendance_bonus = (
				await calculateService.getFullAttendanceBonus(input.period_id, input.emp_no)
			)
			const operational_performance_bonus = (
				await calculateService.getOperationalPerformanceBonus(input.period_id, input.emp_no)
			)
			const welfare_deduction = await calculateService.getWelfareDeduction(
				employee_data!,
				employee_payment!,
				full_attendance_bonus!,
				operational_performance_bonus!
			)
			return welfare_deduction
		}),
	//MARK: API for 請假扣款
	calculateLeaveDeduction: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const holidaysTypeService = container.resolve(HolidaysTypeService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNoByPeriod(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const holiday_list = await ehrService.getHolidayByEmpNoList(
				input.period_id,
				[input.emp_no]
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			)[0];
			const holidays_type = await holidaysTypeService.getCurrentHolidaysType();
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const leave_deduction: number =
				await calculateService.getLeaveDeduction(
					employee_data!,
					employee_payment!,
					holiday_list!,
					payset!,
					holidays_type,
					insurance_rate_setting!,
					full_attendance_bonus,

				);
			if (leave_deduction == null) {
				throw new BaseResponseError("Cannot calculate leave deduction");
			}
			return leave_deduction;
		}),
	//MARK: API for 全勤獎金
	calculateFullAttendanceBonus: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const full_attendance_bonus = await calculateService.getFullAttendanceBonus(
				input.period_id,
				input.emp_no
			)
			return full_attendance_bonus
		}),
	//MARK: API for 團保費代扣
	calculateGroupInsuranceDeduction: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const groupInsuranceDeduction = await calculateService.getGroupInsuranceDeduction(
				input.period_id,
				input.emp_no
			)
			return groupInsuranceDeduction
		}),
	//MARK: API for 補發薪資
	calculateReissueSalary: publicProcedure
		.input(
			z.object({
				emp_no: z.string(),
				period_id: z.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const reissueSalary = await calculateService.getReissueSalary(
				input.period_id,
				input.emp_no
			)
			return reissueSalary
		}),
});
