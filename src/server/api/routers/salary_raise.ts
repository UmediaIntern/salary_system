import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { SalaryRaiseService } from "~/server/service/salary_raise_service";
import { bonusTypeEnum } from "../types/bonus_type_enum";
import { EmployeeData } from "~/server/database/entity/SALARY/employee_data";
import { SalaryRaiseWorkTypeService } from "~/server/service/salary_raise_work_type_service";
import { SalaryRaiseSeniorityService } from "~/server/service/salary_raise_seniority_service";
import { SalaryRaiseDepartmentService } from "~/server/service/salary_raise_department_service";
// import { SalaryRaisePositionTypeService } from "~/server/service/bonus_position_type_service";
import { SalaryRaisePositionService } from "~/server/service/salary_raise_position_service";
import {
    batchCreateSalaryRaiseAllAPI,
    batchCreateSalaryRaiseDepartmentAPI,
    batchCreateSalaryRaisePositionAPI,
    // batchCreateSalaryRaisePositionTypeAPI,
    batchCreateSalaryRaiseSeniorityAPI,
    batchCreateSalaryRaiseWorkTypeAPI,
} from "../types/parameters_input_type";
import { workTypeEnum } from "../types/work_type_enum";
import { roundProperties } from "~/server/database/mapper/helper_function";
import { SalaryRaiseMapper } from "~/server/database/mapper/salary_raise_mapper";
import {
    createSalaryRaiseAPI,
    updateSalaryRaiseAPI,
} from "../types/salary_raise_type";
import { SalaryRaiseAllService } from "~/server/service/salary_raise_all_service";
import { EmployeeDataService } from "~/server/service/employee_data_service";

// 改Enum
export const bonusRouter = createTRPCRouter({
    // getAllSalaryRaise: publicProcedure
    // 	.input(
    // 		z.object({
    // 			period_id: z.number(),
    // 			bonus_type: bonusTypeEnum,
    // 		})
    // 	)
    // 	.query(async ({ input }) => {
    // 		const bonusService = container.resolve(SalaryRaiseService);
    // 		const bonusMapper = container.resolve(SalaryRaiseMapper);
    // 		const result = await bonusService.getAllSalaryRaise(
    // 			input.period_id,
    // 			input.bonus_type
    // 		);
    // 		const employeeSalaryRaiseFE = await Promise.all(
    // 			result.map(
    // 				async (e) =>
    // 					await bonusMapper.getSalaryRaiseFE(e)
    // 			)
    // 		);
    // 		return employeeSalaryRaiseFE.map((e) => roundProperties(e, 2));
    // 	}),
    getExcelSalaryRaise: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .query(async ({ input }) => {
            const bonusService = container.resolve(SalaryRaiseService);
            const bonusMapper = container.resolve(SalaryRaiseMapper);
            const bonusData = await bonusService.getAllSalaryRaise(
                input.period_id
            );

            const employeeSalaryRaiseFE = await Promise.all(
                bonusData.map(
                    async (e) =>
                        await bonusMapper.getSalaryRaiseFE(e)
                )
            );

            return employeeSalaryRaiseFE.map((e) => roundProperties(e, 2)); // Not finished yet
        }),
    getSalaryRaise: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .query(async ({ input }) => {
            const bonusService = container.resolve(SalaryRaiseService);
            const bonusMapper = container.resolve(SalaryRaiseMapper);
            const result = await bonusService.getSalaryRaise(
                input.period_id,
                );
            const employeeSalaryRaiseFE = (
                await Promise.all(
                    result.map(
                        async (e) =>
                            await bonusMapper.getSalaryRaiseFE(
                                e
                            )
                    )
                )
            ).filter((e) => e.special_multiplier > 0);
            return employeeSalaryRaiseFE.map((e) => roundProperties(e, 2));
        }),
    // getExportedSheets: publicProcedure.input(
    // 	z.object({
    // 		period_id: z.number(),
    // 		bonus_type: SalaryRaiseTypeEnum,
    // 	})
    // )
    // .query(async ({ input }) => {
    // 	const bonusService = container.resolve(SalaryRaiseService);
    // 	return await bonusService.getExportedSheets(input.period_id, input.bonus_type);
    // }),

    initCandidateSalaryRaise: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .mutation(async ({ input }) => {
            console.log("\\n\n\ncalled initCandidateSalaryRaise\n\n\n");
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            const empDataService = container.resolve(EmployeeDataService);
            const all_emp_no_list = (await empDataService.getAllEmployeeDataByPeriod(input.period_id))
                .filter((emp) => emp.work_status != "離職人員")
                .map((emp) => emp.emp_no);
            await salaryRaiseService.createSalaryRaiseByEmpNoList(
                input.period_id,
                all_emp_no_list
            );
            await salaryRaiseService.initCandidateSalaryRaise(
                input.period_id,
                );
            return;
        }),
    createSalaryRaise: publicProcedure
        .input(createSalaryRaiseAPI)
        .mutation(async ({ input }) => {
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            const salaryRaiseMapper = container.resolve(SalaryRaiseMapper);
            const result = await salaryRaiseService.createSalaryRaise(input);
            const employeeSalaryRaiseFE = await salaryRaiseMapper.getSalaryRaiseFE(
                { ...input, ...result },
            );
            return roundProperties(employeeSalaryRaiseFE, 2);
        }),
    updateSalaryRaise: publicProcedure
        .input(updateSalaryRaiseAPI)
        .mutation(async ({ input }) => {
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            const result = await salaryRaiseService.updateSalaryRaise(input);
            return result;
        }),
    updateMultipleSalaryRaiseByEmpNoList: publicProcedure
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
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            await salaryRaiseService.updateMultipleSalaryRaiseByEmpNoList(
                input.emp_no_list,
                input.period_id,
                input.multiplier,
                input.fixed_amount
            );
        }),
    updateFromExcel: publicProcedure
        .input(updateSalaryRaiseAPI.array())
        .mutation(async ({ input }) => {
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            const promises = input.map(
                async (e) => await salaryRaiseService.updateFromExcel(false, e)
            );
            const err_emp_no_list = (await Promise.all(promises)).filter(
                (e) => e != null
            );
            return err_emp_no_list;
        }),
    confirmUpdateFromExcel: publicProcedure
        .input(updateSalaryRaiseAPI.array())
        .mutation(async ({ input }) => {
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            const err_emp_no_list = input
                .map(
                    async (e) => await salaryRaiseService.updateFromExcel(true, e)
                )
                .filter((e) => e != null);
            return err_emp_no_list;
        }),
    deleteSalaryRaise: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            const result = await salaryRaiseService.deleteSalaryRaise(input.id);
            return result;
        }),
    autoCalculateSalaryRaise: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
                total_budgets: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const salaryRaiseService = container.resolve(SalaryRaiseService);
            const result = await salaryRaiseService.autoCalculateSalaryRaise(
                input.period_id,
                input.total_budgets
            );
            return result;
        }),
    getSalaryRaiseAll: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .query(async ({ input }) => {
            const bonusAllService = container.resolve(SalaryRaiseAllService);
            const result = await bonusAllService.getSalaryRaiseAllBySalaryRaiseType(
                input.period_id,
                );
            return result?.map((e) => roundProperties(e, 2));
        }),
    getSalaryRaiseWorkType: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .query(async ({ input }) => {
            const bonusWorkTypeService =
                container.resolve(SalaryRaiseWorkTypeService);
            const result =
                await bonusWorkTypeService.getSalaryRaiseWorkTypeBySalaryRaiseType(
                    input.period_id,
                    );
            return result?.map((e) => roundProperties(e, 2));
        }),
    getSalaryRaiseSeniority: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .query(async ({ input }) => {
            const bonusSeniorityService = container.resolve(
                SalaryRaiseSeniorityService
            );
            const result =
                await bonusSeniorityService.getSalaryRaiseSeniorityByPeriodId(
                    input.period_id,
                    );
            return result?.map((e) => roundProperties(e, 2));
        }),
    getSalaryRaiseDepartment: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .query(async ({ input }) => {
            const bonusDepartmentService = container.resolve(
                SalaryRaiseDepartmentService
            );
            const result =
                await bonusDepartmentService.getSalaryRaiseDepartmentBySalaryRaiseType(
                    input.period_id,
                    );
            return result?.map((e) => roundProperties(e, 2));
        }),
    // getSalaryRaisePositionType: publicProcedure
    // 	.input(
    // 		z.object({
    // 			period_id: z.number(),
    // 			bonus_type: SalaryRaiseTypeEnum,
    // 		})
    // 	)
    // 	.query(async ({ input }) => {
    // 		const bonusPositionTypeService = container.resolve(
    // 			SalaryRaisePositionTypeService
    // 		);
    // 		const result =
    // 			await bonusPositionTypeService.getSalaryRaisePositionTypeBySalaryRaiseType(
    // 				input.period_id,
    // 				input.bonus_type
    // 			);
    // 		return result?.map((e) => roundProperties(e, 2));
    // 	}),
    getSalaryRaisePosition: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
            })
        )
        .query(async ({ input }) => {
            const bonusPositionService =
                container.resolve(SalaryRaisePositionService);
            const result =
                await bonusPositionService.getSalaryRaisePositionBySalaryRaiseType(
                    input.period_id,
                    );
            return result?.map((e) => roundProperties(e, 2));
        }),

    createSalaryRaiseAll: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
                multiplier: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusAllService = container.resolve(SalaryRaiseAllService);
            const result = await bonusAllService.createSalaryRaiseAll(input);
            return result;
        }),

    createSalaryRaiseWorkType: publicProcedure
        .input(
            z.object({
                period_id: z.number(),
                bonus_type: bonusTypeEnum,
                work_type: workTypeEnum,
                multiplier: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusWorkTypeService =
                container.resolve(SalaryRaiseWorkTypeService);
            const result = await bonusWorkTypeService.createSalaryRaiseWorkType(
                input
            );
            return result;
        }),
    createSalaryRaiseSeniority: publicProcedure
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
                SalaryRaiseSeniorityService
            );
            const result = await bonusSeniorityService.createSalaryRaiseSeniority(
                input
            );
            return result;
        }),
    createSalaryRaiseDepartment: publicProcedure
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
                SalaryRaiseDepartmentService
            );
            const result = await bonusDepartmentService.createSalaryRaiseDepartment(
                input
            );
            return result;
        }),
    // createSalaryRaisePositionType: publicProcedure
    // 	.input(
    // 		z.object({
    // 			period_id: z.number(),
    // 			bonus_type: SalaryRaiseTypeEnum,
    // 			position_type: z.string(),
    // 			multiplier: z.number(),
    // 		})
    // 	)
    // 	.mutation(async ({ input }) => {
    // 		const bonusPositionTypeService = container.resolve(
    // 			SalaryRaisePositionTypeService
    // 		);
    // 		const result =
    // 			await bonusPositionTypeService.createSalaryRaisePositionType(input);
    // 		return result;
    // 	}),
    createSalaryRaisePosition: publicProcedure
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
                container.resolve(SalaryRaisePositionService);
            const result = await bonusPositionService.createSalaryRaisePosition(
                input
            );
            return result;
        }),

    batchCreateSalaryRaiseAll: publicProcedure
        .input(batchCreateSalaryRaiseAllAPI)
        .mutation(async ({ input }) => {
            const bonusAllService = container.resolve(SalaryRaiseAllService);
            const result = await bonusAllService.batchCreateSalaryRaiseAll(input);
            return result;
        }),

    batchCreateSalaryRaiseWorkType: publicProcedure
        .input(batchCreateSalaryRaiseWorkTypeAPI)
        .mutation(async ({ input }) => {
            const bonusWorkTypeService =
                container.resolve(SalaryRaiseWorkTypeService);
            const result = await bonusWorkTypeService.batchCreateSalaryRaiseWorkType(
                input
            );
            return result;
        }),
    batchCreateSalaryRaiseSeniority: publicProcedure
        .input(batchCreateSalaryRaiseSeniorityAPI)
        .mutation(async ({ input }) => {
            const bonusSeniorityService = container.resolve(
                SalaryRaiseSeniorityService
            );
            const result =
                await bonusSeniorityService.batchCreateSalaryRaiseSeniority(input);
            return result;
        }),
    batchCreateSalaryRaiseDepartment: publicProcedure
        .input(batchCreateSalaryRaiseDepartmentAPI)
        .mutation(async ({ input }) => {
            const bonusDepartmentService = container.resolve(
                SalaryRaiseDepartmentService
            );
            const result =
                await bonusDepartmentService.batchCreateSalaryRaiseDepartment(input);
            return result;
        }),
    // batchCreateSalaryRaisePositionType: publicProcedure
    // 	.input(batchCreateSalaryRaisePositionTypeAPI)
    // 	.mutation(async ({ input }) => {
    // 		const bonusPositionTypeService = container.resolve(
    // 			SalaryRaisePositionTypeService
    // 		);
    // 		const result =
    // 			await bonusPositionTypeService.batchCreateSalaryRaisePositionType(
    // 				input
    // 			);
    // 		return result;
    // 	}),
    batchCreateSalaryRaisePosition: publicProcedure
        .input(batchCreateSalaryRaisePositionAPI)
        .mutation(async ({ input }) => {
            const bonusPositionService =
                container.resolve(SalaryRaisePositionService);
            const result = await bonusPositionService.batchCreateSalaryRaisePosition(
                input
            );
            return result;
        }),

    updateSalaryRaiseAll: publicProcedure
        .input(
            z.object({
                id: z.number(),
                multiplier: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusAllService = container.resolve(SalaryRaiseAllService);
            const result = await bonusAllService.updateSalaryRaiseAll(input);
            return result;
        }),

    updateSalaryRaiseWorkType: publicProcedure
        .input(
            z.object({
                id: z.number(),
                work_type: workTypeEnum,
                multiplier: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusWorkTypeService =
                container.resolve(SalaryRaiseWorkTypeService);
            const result = await bonusWorkTypeService.updateSalaryRaiseWorkType(
                input
            );
            return result;
        }),
    updateSalaryRaiseSeniority: publicProcedure
        .input(
            z.object({
                id: z.number(),
                seniority: z.number(),
                multiplier: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusSeniorityService = container.resolve(
                SalaryRaiseSeniorityService
            );
            const result = await bonusSeniorityService.updateSalaryRaiseSeniority(
                input
            );
            return result;
        }),
    updateSalaryRaiseDepartment: publicProcedure
        .input(
            z.object({
                id: z.number(),
                department: z.string(),
                multiplier: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusDepartmentService = container.resolve(
                SalaryRaiseDepartmentService
            );
            const result = await bonusDepartmentService.updateSalaryRaiseDepartment(
                input
            );
            return result;
        }),
    // updateSalaryRaisePositionType: publicProcedure
    // 	.input(
    // 		z.object({
    // 			id: z.number(),
    // 			position_type: z.string(),
    // 			multiplier: z.number(),
    // 		})
    // 	)
    // 	.mutation(async ({ input }) => {
    // 		const bonusPositionTypeService = container.resolve(
    // 			SalaryRaisePositionTypeService
    // 		);
    // 		const result =
    // 			await bonusPositionTypeService.updateSalaryRaisePositionType(input);
    // 		return result;
    // 	}),
    updateSalaryRaisePosition: publicProcedure
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
                container.resolve(SalaryRaisePositionService);
            const result = await bonusPositionService.updateSalaryRaisePosition(
                input
            );
            return result;
        }),
    deleteSalaryRaiseAll: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusAllService = container.resolve(SalaryRaiseAllService);
            const result = await bonusAllService.deleteSalaryRaiseAll(input.id);
            return result;
        }),
    deleteSalaryRaiseWorkType: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusWorkTypeService =
                container.resolve(SalaryRaiseWorkTypeService);
            const result = await bonusWorkTypeService.deleteSalaryRaiseWorkType(
                input.id
            );
            return result;
        }),
    deleteSalaryRaiseSeniority: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusSeniorityService = container.resolve(
                SalaryRaiseSeniorityService
            );
            const result = await bonusSeniorityService.deleteSalaryRaiseSeniority(
                input.id
            );
            return result;
        }),
    deleteSalaryRaiseDepartment: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusDepartmentService = container.resolve(
                SalaryRaiseDepartmentService
            );
            const result = await bonusDepartmentService.deleteSalaryRaiseDepartment(
                input.id
            );
            return result;
        }),
    // deleteSalaryRaisePositionType: publicProcedure
    // 	.input(
    // 		z.object({
    // 			id: z.number(),
    // 		})
    // 	)
    // 	.mutation(async ({ input }) => {
    // 		const bonusPositionTypeService = container.resolve(
    // 			SalaryRaisePositionTypeService
    // 		);
    // 		const result =
    // 			await bonusPositionTypeService.deleteSalaryRaisePositionType(
    // 				input.id
    // 			);
    // 		return result;
    // 	}),
    deleteSalaryRaisePosition: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const bonusPositionService =
                container.resolve(SalaryRaisePositionService);
            const result = await bonusPositionService.deleteSalaryRaisePosition(
                input.id
            );
            return result;
        }),
});
