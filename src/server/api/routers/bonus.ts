import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { EmployeeBonusService } from "~/server/service/employee_bonus_service";
import { bonusTypeEnum } from "../types/bonus_type_enum";
import { EmployeeData } from "~/server/database/entity/SALARY/employee_data";
import { BonusWorkTypeService } from "~/server/service/bonus_work_type_service";
import { BonusSeniorityService } from "~/server/service/bonus_seniority_service";
import { BonusDepartmentService } from "~/server/service/bonus_department_service";
// import { BonusPositionTypeService } from "~/server/service/bonus_position_type_service";
import { BonusPositionService } from "~/server/service/bonus_position_service";
import {
	batchCreateBonusAllAPI,
	batchCreateBonusDepartmentAPI,
	batchCreateBonusPositionAPI,
	// batchCreateBonusPositionTypeAPI,
	batchCreateBonusSeniorityAPI,
	batchCreateBonusWorkTypeAPI,
} from "../types/parameters_input_type";
import { WorkTypeEnum } from "../types/work_type_enum";
import { roundProperties } from "~/server/database/mapper/helper_function";
import { EmployeeBonusMapper } from "~/server/database/mapper/employee_bonus_mapper";
import {
	createEmployeeBonusAPI,
	updateEmployeeBonusAPI,
} from "../types/employee_bonus_type";
import { BonusAllService } from "~/server/service/bonus_all_service";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { WorkStatusEnum } from "../types/work_status_enum";

// 改Enum
export const bonusRouter = createTRPCRouter({
	// getAllEmployeeBonus: publicProcedure
	// 	.input(
	// 		z.object({
	// 			period_id: z.number(),
	// 			bonus_type: bonusTypeEnum,
	// 		})
	// 	)
	// 	.query(async ({ input }) => {
	// 		const bonusService = container.resolve(EmployeeBonusService);
	// 		const bonusMapper = container.resolve(EmployeeBonusMapper);
	// 		const result = await bonusService.getAllEmployeeBonus(
	// 			input.period_id,
	// 			input.bonus_type
	// 		);
	// 		const employeeBonusFE = await Promise.all(
	// 			result.map(
	// 				async (e) =>
	// 					await bonusMapper.getEmployeeBonusFE(e)
	// 			)
	// 		);
	// 		return employeeBonusFE.map((e) => roundProperties(e, 2));
	// 	}),
	getExcelEmployeeBonus: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const bonusService = container.resolve(EmployeeBonusService);
			const bonusMapper = container.resolve(EmployeeBonusMapper);
			const bonusData = await bonusService.getAllEmployeeBonusByPeriodIdByBonusType(
				input.period_id,
				input.bonus_type
			);

			const employeeBonusFE = await Promise.all(
				bonusData.map(
					async (e) => await bonusMapper.getEmployeeBonusFE(e)
				)
			);

			return employeeBonusFE.map((e) => roundProperties(e, 2)); // Not finished yet
		}),
	getEmployeeBonus: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const bonusService = container.resolve(EmployeeBonusService);
			const bonusMapper = container.resolve(EmployeeBonusMapper);
			const result = await bonusService.getEmployeeBonus(
				input.period_id,
				input.bonus_type
			);
			const employeeBonusFE = (
				await Promise.all(
					result.map(
						async (e) => await bonusMapper.getEmployeeBonusFE(e)
					)
				)
			).filter((e) => e.special_multiplier > 0);
			return employeeBonusFE.map((e) => roundProperties(e, 2));
		}),
	// getExportedSheets: publicProcedure.input(
	// 	z.object({
	// 		period_id: z.number(),
	// 		bonus_type: BonusTypeEnum,
	// 	})
	// )
	// .query(async ({ input }) => {
	// 	const bonusService = container.resolve(EmployeeBonusService);
	// 	return await bonusService.getExportedSheets(input.period_id, input.bonus_type);
	// }),

	initCandidateEmployeeBonus: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.mutation(async ({ input }) => {
			console.log("\\n\n\ncalled initCandidateEmployeeBonus\n\n\n");
			const empBonusService = container.resolve(EmployeeBonusService);
			const empDataService = container.resolve(EmployeeDataService);
			const all_emp_no_list = (
				await empDataService.getAllEmployeeDataByPeriod(input.period_id)
			)
				.filter(
					(emp) =>
						emp.work_status !=
						WorkStatusEnum.Values.ResignedEmployee
				)
				.map((emp) => emp.emp_no);
			await empBonusService.createEmployeeBonusByEmpNoList(
				input.period_id,
				input.bonus_type,
				all_emp_no_list
			);
			await empBonusService.initCandidateEmployeeBonus(
				input.period_id,
				input.bonus_type
			);
			return;
		}),
	createEmployeeBonus: publicProcedure
		.input(createEmployeeBonusAPI)
		.mutation(async ({ input }) => {
			const empBonusService = container.resolve(EmployeeBonusService);
			const empBonusMapper = container.resolve(EmployeeBonusMapper);
			const result = await empBonusService.createEmployeeBonus(input);
			const employeeBonusFE = await empBonusMapper.getEmployeeBonusFE({
				...input,
				...result,
			});
			return roundProperties(employeeBonusFE, 2);
		}),
	updateEmployeeBonus: publicProcedure
		.input(updateEmployeeBonusAPI)
		.mutation(async ({ input }) => {
			const empBonusService = container.resolve(EmployeeBonusService);
			const result = await empBonusService.updateEmployeeBonus(input);
			return result;
		}),
	updateMultipleBonusByEmpNoList: publicProcedure
		.input(
			z.object({
				emp_no_list: z.array(z.string()),
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
				multiplier: z.number(),
				fixed_amount: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const empBonusService = container.resolve(EmployeeBonusService);
			await empBonusService.updateMultipleBonusByEmpNoList(
				input.emp_no_list,
				input.period_id,
				input.bonus_type,
				input.multiplier,
				input.fixed_amount
			);
		}),
	updateFromExcel: publicProcedure
		.input(updateEmployeeBonusAPI.array())
		.mutation(async ({ input }) => {
			const empBonusService = container.resolve(EmployeeBonusService);
			const promises = input.map(
				async (e) => await empBonusService.updateFromExcel(false, e)
			);
			const err_emp_no_list = (await Promise.all(promises)).filter(
				(e) => e != null
			);
			return err_emp_no_list;
		}),
	confirmUpdateFromExcel: publicProcedure
		.input(updateEmployeeBonusAPI.array())
		.mutation(async ({ input }) => {
			const empBonusService = container.resolve(EmployeeBonusService);
			const err_emp_no_list = input
				.map(
					async (e) => await empBonusService.updateFromExcel(true, e)
				)
				.filter((e) => e != null);
			return err_emp_no_list;
		}),
	deleteEmployeeBonus: publicProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const empBonusService = container.resolve(EmployeeBonusService);
			const result = await empBonusService.deleteEmployeeBonus(input.id);
			return result;
		}),
	autoCalculateEmployeeBonus: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
				total_budgets: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const empBonusService = container.resolve(EmployeeBonusService);
			const result = await empBonusService.autoCalculateEmployeeBonus(
				input.period_id,
				input.bonus_type,
				input.total_budgets
			);
			return result;
		}),
	getBonusAll: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const bonusAllService = container.resolve(BonusAllService);
			const result = await bonusAllService.getBonusAllByBonusType(
				input.period_id,
				input.bonus_type
			);
			return result
				? roundProperties(
						{
							...result.dataValues,
							functions: {
								creatable: false,
								updatable: true,
								deletable: true,
							},
						},
						2
				  )
				: null;
		}),
	getBonusWorkType: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const bonusWorkTypeService =
				container.resolve(BonusWorkTypeService);
			const result =
				await bonusWorkTypeService.getBonusWorkTypeByBonusType(
					input.period_id,
					input.bonus_type
				);
			return result?.map((e) =>
				roundProperties(
					{
						...e.dataValues,
						functions: {
							creatable: true,
							updatable: true,
							deletable: true,
						},
					},
					2
				)
			);
		}),
	getBonusSeniority: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			const result =
				await bonusSeniorityService.getBonusSeniorityByBonusType(
					input.period_id,
					input.bonus_type
				);
			return result?.map((e) =>
				roundProperties(
					{
						...e.dataValues,
						functions: {
							creatable: true,
							updatable: true,
							deletable: true,
						},
					},
					2
				)
			);
		}),
	getBonusDepartment: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			const result =
				await bonusDepartmentService.getBonusDepartmentByBonusType(
					input.period_id,
					input.bonus_type
				);
			return result?.map((e) =>
				roundProperties(
					{
						...e.dataValues,
						functions: {
							creatable: true,
							updatable: true,
							deletable: true,
						},
					},
					2
				)
			);
		}),
	// getBonusPositionType: publicProcedure
	// 	.input(
	// 		z.object({
	// 			period_id: z.number(),
	// 			bonus_type: BonusTypeEnum,
	// 		})
	// 	)
	// 	.query(async ({ input }) => {
	// 		const bonusPositionTypeService = container.resolve(
	// 			BonusPositionTypeService
	// 		);
	// 		const result =
	// 			await bonusPositionTypeService.getBonusPositionTypeByBonusType(
	// 				input.period_id,
	// 				input.bonus_type
	// 			);
	// 		return result?.map((e) => roundProperties(e, 2));
	// 	}),
	getBonusPosition: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const bonusPositionService =
				container.resolve(BonusPositionService);
			const result =
				await bonusPositionService.getBonusPositionByBonusType(
					input.period_id,
					input.bonus_type
				);
			return result?.map((e) =>
				roundProperties(
					{
						...e.dataValues,
						functions: {
							creatable: true,
							updatable: true,
							deletable: true,
						},
					},
					2
				)
			);
		}),

	createBonusAll: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusAllService = container.resolve(BonusAllService);
			const result = await bonusAllService.createBonusAll(input);
			return result;
		}),

	createBonusWorkType: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
				work_type: WorkTypeEnum,
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusWorkTypeService =
				container.resolve(BonusWorkTypeService);
			const result = await bonusWorkTypeService.createBonusWorkType(
				input
			);
			return result;
		}),
	createBonusSeniority: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
				seniority: z.number(),
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			const result = await bonusSeniorityService.createBonusSeniority(
				input
			);
			return result;
		}),
	createBonusDepartment: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
				department: z.string(),
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			const result = await bonusDepartmentService.createBonusDepartment(
				input
			);
			return result;
		}),
	// createBonusPositionType: publicProcedure
	// 	.input(
	// 		z.object({
	// 			period_id: z.number(),
	// 			bonus_type: BonusTypeEnum,
	// 			position_type: z.string(),
	// 			multiplier: z.number(),
	// 		})
	// 	)
	// 	.mutation(async ({ input }) => {
	// 		const bonusPositionTypeService = container.resolve(
	// 			BonusPositionTypeService
	// 		);
	// 		const result =
	// 			await bonusPositionTypeService.createBonusPositionType(input);
	// 		return result;
	// 	}),
	createBonusPosition: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				bonus_type: bonusTypeEnum,
				position: z.number(),
				position_multiplier: z.number(),
				position_type: z.string(),
				position_type_multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusPositionService =
				container.resolve(BonusPositionService);
			const result = await bonusPositionService.createBonusPosition(
				input
			);
			return result;
		}),

	batchCreateBonusAll: publicProcedure
		.input(batchCreateBonusAllAPI)
		.mutation(async ({ input }) => {
			const bonusAllService = container.resolve(BonusAllService);
			const result = await bonusAllService.batchCreateBonusAll(input);
			return result;
		}),

	batchCreateBonusWorkType: publicProcedure
		.input(batchCreateBonusWorkTypeAPI)
		.mutation(async ({ input }) => {
			const bonusWorkTypeService =
				container.resolve(BonusWorkTypeService);
			const result = await bonusWorkTypeService.batchCreateBonusWorkType(
				input
			);
			return result;
		}),
	batchCreateBonusSeniority: publicProcedure
		.input(batchCreateBonusSeniorityAPI)
		.mutation(async ({ input }) => {
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			const result =
				await bonusSeniorityService.batchCreateBonusSeniority(input);
			return result;
		}),
	batchCreateBonusDepartment: publicProcedure
		.input(batchCreateBonusDepartmentAPI)
		.mutation(async ({ input }) => {
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			const result =
				await bonusDepartmentService.batchCreateBonusDepartment(input);
			return result;
		}),
	// batchCreateBonusPositionType: publicProcedure
	// 	.input(batchCreateBonusPositionTypeAPI)
	// 	.mutation(async ({ input }) => {
	// 		const bonusPositionTypeService = container.resolve(
	// 			BonusPositionTypeService
	// 		);
	// 		const result =
	// 			await bonusPositionTypeService.batchCreateBonusPositionType(
	// 				input
	// 			);
	// 		return result;
	// 	}),
	batchCreateBonusPosition: publicProcedure
		.input(batchCreateBonusPositionAPI)
		.mutation(async ({ input }) => {
			const bonusPositionService =
				container.resolve(BonusPositionService);
			const result = await bonusPositionService.batchCreateBonusPosition(
				input
			);
			return result;
		}),

	updateBonusAll: publicProcedure
		.input(
			z.object({
				id: z.number(),
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusAllService = container.resolve(BonusAllService);
			const result = await bonusAllService.updateBonusAll(input);
			return result;
		}),

	updateBonusWorkType: publicProcedure
		.input(
			z.object({
				id: z.number(),
				work_type: WorkTypeEnum,
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusWorkTypeService =
				container.resolve(BonusWorkTypeService);
			const result = await bonusWorkTypeService.updateBonusWorkType(
				input
			);
			return result;
		}),
	updateBonusSeniority: publicProcedure
		.input(
			z.object({
				id: z.number(),
				seniority: z.number(),
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			const result = await bonusSeniorityService.updateBonusSeniority(
				input
			);
			return result;
		}),
	updateBonusDepartment: publicProcedure
		.input(
			z.object({
				id: z.number(),
				department: z.string(),
				multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			const result = await bonusDepartmentService.updateBonusDepartment(
				input
			);
			return result;
		}),
	// updateBonusPositionType: publicProcedure
	// 	.input(
	// 		z.object({
	// 			id: z.number(),
	// 			position_type: z.string(),
	// 			multiplier: z.number(),
	// 		})
	// 	)
	// 	.mutation(async ({ input }) => {
	// 		const bonusPositionTypeService = container.resolve(
	// 			BonusPositionTypeService
	// 		);
	// 		const result =
	// 			await bonusPositionTypeService.updateBonusPositionType(input);
	// 		return result;
	// 	}),
	updateBonusPosition: publicProcedure
		.input(
			z.object({
				id: z.number(),
				position: z.number(),
				position_multiplier: z.number(),
				position_type: z.string(),
				position_type_multiplier: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusPositionService =
				container.resolve(BonusPositionService);
			const result = await bonusPositionService.updateBonusPosition(
				input
			);
			return result;
		}),
	deleteBonusAll: publicProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusAllService = container.resolve(BonusAllService);
			const result = await bonusAllService.deleteBonusAll(input.id);
			return result;
		}),
	deleteBonusWorkType: publicProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusWorkTypeService =
				container.resolve(BonusWorkTypeService);
			const result = await bonusWorkTypeService.deleteBonusWorkType(
				input.id
			);
			return result;
		}),
	deleteBonusSeniority: publicProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			const result = await bonusSeniorityService.deleteBonusSeniority(
				input.id
			);
			return result;
		}),
	deleteBonusDepartment: publicProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			const result = await bonusDepartmentService.deleteBonusDepartment(
				input.id
			);
			return result;
		}),
	// deleteBonusPositionType: publicProcedure
	// 	.input(
	// 		z.object({
	// 			id: z.number(),
	// 		})
	// 	)
	// 	.mutation(async ({ input }) => {
	// 		const bonusPositionTypeService = container.resolve(
	// 			BonusPositionTypeService
	// 		);
	// 		const result =
	// 			await bonusPositionTypeService.deleteBonusPositionType(
	// 				input.id
	// 			);
	// 		return result;
	// 	}),
	deleteBonusPosition: publicProcedure
		.input(
			z.object({
				id: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const bonusPositionService =
				container.resolve(BonusPositionService);
			const result = await bonusPositionService.deleteBonusPosition(
				input.id
			);
			return result;
		}),
});
