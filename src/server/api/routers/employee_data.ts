import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseResponseError } from "../../errors/base_response_error";
import {
	createEmployeeDataAPI,
	updateEmployeeDataAPI,
} from "../types/employee_data_type";
import { z } from "zod";
import { EmployeeDataMapper } from "~/server/database/mapper/employee_data_mapper";
import { EHRService } from "~/server/service/ehr_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import { LongServiceEnum } from "../types/long_service_enum";
import { EmpAll } from "~/server/database/entity/UMEDIA/emp_all";
import { WorkStatusEnum } from "../types/work_status_enum";
var XLSX = require("xlsx");

export const employeeDataRouter = createTRPCRouter({
	getCurrentEmployeeDataWithInfo: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeeData =
				await employeeDataService.getCurrentEmployeeData(
					input.period_id
				);
			const employee_data_mapper = container.resolve(EmployeeDataMapper);
			const empDataWithInfo =
				await employee_data_mapper.getEmployeeDataWithInfo(
					employeeData,
					input.period_id
				);
			return empDataWithInfo;
		}),

	getAllEmployeeDataWithInfo: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeeData = await employeeDataService.getAllEmployeeData();
			if (employeeData == null) {
				throw new BaseResponseError("EmployeeData does not exist");
			}
			const employee_data_mapper = container.resolve(EmployeeDataMapper);
			const empDataWithInfo =
				await employee_data_mapper.getEmployeeDataWithInfo(
					employeeData,
					input.period_id
				);
			return empDataWithInfo;
		}),

	getAllEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeeData = await employeeDataService.getAllEmployeeData();
		return employeeData;
	}),

	createEmployeeData: publicProcedure
		.input(createEmployeeDataAPI)
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const newdata = await employeeDataService.createEmployeeData({
				...input,
			});
			return newdata;
		}),

	updateEmployeeData: publicProcedure
		.input(updateEmployeeDataAPI)
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			await employeeDataService.updateEmployeeData({
				...input,
			});
		}),

	deleteEmployeeData: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			await employeeDataService.deleteEmployeeData(input.id);
		}),

	initEmployees: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.mutation(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeeTrustService =
				container.resolve(EmployeeTrustService);

			const period = await ehrService.getPeriodById(input.period_id);
			// DB
			// const empAllList = await ehrService.initEmployeeData(input.period_id);

			// Excel
			const workbook = XLSX.readFile(
				"D:/salary_system-develop/salary_system-develop/TEST.xls"
			);
			const sheet = workbook.Sheets["員工基本資料"];
			// const workbook = XLSX.readFile("C:/Users/USER/Desktop/test/init.xls");
			// const sheet = workbook.Sheets['薪資查詢明細'];
			const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

			const empAllList: EmpAll[] = data.map(
				(data: { [x: string]: any }): EmpAll => {
					return {
						emp_no: data["員工編號"],
						emp_name: data["姓名"],
						position: Number(data["職等"]),
						position_type: data["職級"],
						group_insurance_type: data["團保類別"],
						department: data["部門"],
						work_type: data["工作類別"],
						work_status: WorkStatusEnum.Values.RegularEmployee, // TODO: type  data["工作形態"],
						disabilty_level: "正常", // data["殘障等級"] != "正常" ? data["殘障等級"] : null // TODO: what is the default
						sex_type: data["性別"],
						dependents: 0, // Number(data["扶養人數"]) != 0 ? Number(data["扶養人數"]) : null // TODO: what is the default
						healthcare_dependents: 0, // Number(data["健保眷口數"]) != 0 ? Number(data["健保眷口數"]) : null// TODO: what is the default
						registration_date: data["到職日期"],
						quit_date: data["離職日期"] ?? null,
						license_id: data["身份字號"],
						bank_account_taiwan:  "abcd", // data["帳號2"] ?? // TODO: what is the default
						bank_account_foreign: data["外幣帳號"] ?? "", // TODO: what is the default
						received_elderly_benefits: false,
					};
				}
			);

			// return empAllList

			const employeeDataList = empAllList.map(async (data) => {
				await employeeDataService.createEmployeeData({
					...data,
					period_id: input.period_id,
				});
				await employeePaymentService.createEmployeePayment({
					emp_no: data.emp_no,
					long_service_allowance_type:
						LongServiceEnum.Enum.month_allowance,
					start_date: new Date(period.start_date),
					end_date: null,
					base_salary: 0,
					food_allowance: 0,
					supervisor_allowance: 0,
					occupational_allowance: 0,
					subsidy_allowance: 0,
					long_service_allowance: 0,
					l_r_self_ratio: 0,
					l_i: 0,
					h_i: 0,
					l_r: 0,
					occupational_injury: 0,
				});

				await employeeTrustService.createEmployeeTrust({
					emp_no: data.emp_no,
					emp_trust_reserve: 0,
					emp_special_trust_incent: 0,
					start_date: new Date(0),
					end_date: null,
				});

				if (data.quit_date) {
					await employeePaymentService.rescheduleEmployeePaymentByQuitDate(
						data.emp_no,
						input.period_id
					);
					await employeeTrustService.rescheduleEmployeeTrustByQuitDate(
						data.emp_no,
						input.period_id
					);
				}
			});

			await Promise.all(employeeDataList);

			const list1 = (
				await employeePaymentService.getCurrentEmployeePayment(
					input.period_id
				)
			).map((e) => e.emp_no);
			const list2 = (
				await employeeTrustService.getCurrentEmployeeTrustFE(
					input.period_id
				)
			).map((e) => e.emp_no);

			const list = list1.filter((e) => !list2.includes(e));
			console.log(list);

			return employeeDataList;
		}),
});
