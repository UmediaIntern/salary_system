import {
	createTRPCRouter,
	publicProcedure,
	userProcedure,
} from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseResponseError } from "../../errors/base_response_error";
import {
	createEmployeeDataAPI,
	updateEmployeeDataAPI,
} from "../types/employee_data_type";
import { z } from "zod";
import { EmployeeDataMapper } from "~/server/database/mapper/employee_data_mapper";
import { AccessService } from "~/server/service/access_service";
import { getRoleFromCtx } from "../helper";

export const employeeDataRouter = createTRPCRouter({
	getCurrentEmployeeDataWithInfo: userProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ ctx, input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeeData =
				await employeeDataService.getCurrentEmployeeData(
					input.period_id
				);

			// Filter by access
			const role = getRoleFromCtx(ctx);
			const accessService = container.resolve(AccessService);
			const access = await accessService.getAccessByRole(role);
			if (!access.employees) {
				throw new BaseResponseError("Access denied", 403);
			}
			const accessibleEmpData = employeeData.filter((emp) => {
				return emp.position <= access.employees_r_lv;
			});

			const employee_data_mapper = container.resolve(EmployeeDataMapper);
			const empDataWithInfo =
				await employee_data_mapper.getEmployeeDataWithInfo(
					accessibleEmpData,
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
});
