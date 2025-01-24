import { z } from "zod";
import { container } from "tsyringe";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	createPerformanceLevelAPI,
	updatePerformanceLevelAPI,
} from "../types/parameters_input_type";
import { BankSettingService } from "~/server/service/bank_setting_service";
import { AttendanceSettingService } from "~/server/service/attendance_setting_service";
import { BaseResponseError } from "../error/BaseResponseError";
import { InsuranceRateSettingService } from "~/server/service/insurance_rate_setting_service";
import { LevelRangeService } from "~/server/service/level_range_service";
import { LevelService } from "~/server/service/level_service";
import { PerformanceLevelService } from "~/server/service/performance_level_service";
import { TrustMoneyService } from "~/server/service/trust_money_service";
import {
	createLevelRangeAPI,
	levelRangeFE,
	LevelRangeFEType,
	updateLevelRangeAPI,
} from "../types/level_range_type";
import { LevelRangeMapper } from "~/server/database/mapper/level_range_mapper";
import { roundProperties } from "~/server/database/mapper/helper_function";
import {
	primary_key,
	SalaryIncomeTaxService,
} from "~/server/service/salary_income_tax_service";
import {
	attendanceSettingFE,
	createAttendanceSettingAPI,
	updateAttendanceSettingAPI,
} from "../types/attendance_setting_type";
import {
	batchCreateBankSettingAPI,
	createBankSettingAPI,
	updateBankSettingAPI,
} from "../types/bank_setting_type";
import {
	createInsuranceRateSettingAPI,
	insuranceRateSettingFE,
	updateInsuranceRateSettingAPI,
} from "../types/insurance_rate_setting_type";
import {
	batchCreateTrustMoneyAPI,
	createTrustMoneyAPI,
	updateTrustMoneyAPI,
} from "../types/trust_money_type";
import {
	batchCreateLevelAPI,
	createLevelAPI,
	updateLevelAPI,
} from "../types/level_type";
import {
	batchCreateSalaryIncomeTaxAPI,
	createSalaryIncomeTaxAPI,
	updateSalaryIncomeTaxAPI,
} from "../types/salary_income_tax";

export const parametersRouter = createTRPCRouter({
	createBankSetting: publicProcedure
		.input(createBankSettingAPI)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			const newdata = await bankService.createBankSetting(input);
			return newdata;
		}),

	batchCreateBankSetting: publicProcedure
		.input(batchCreateBankSettingAPI)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			const newdata = await bankService.batchCreateBankSetting(input);
			return newdata;
		}),

	getCurrentBankSetting: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			const bankSetting = await bankService.getCurrentBankSetting(
				input.period_id
			);
			if (bankSetting.length == 0) {
				// throw new BaseResponseError("BankSetting does not exist");
			}
			const bankSettingFE = await Promise.all(
				bankSetting.map(async (b) => {
					return {
						...b,
						functions: {
							creatable: true,
							updatable: b.start_date > new Date(),
							deletable: b.start_date > new Date(),
						},
					};
				})
			);
			return bankSettingFE;
		}),

	getAllBankSetting: publicProcedure.query(async () => {
		const bankService = container.resolve(BankSettingService);
		const bankSetting = await bankService.getAllBankSetting();
		if (bankSetting.length == 0) {
			// throw new BaseResponseError("BankSetting does not exist");
		}
		const bankSettingFE = bankSetting.map((bank_list) => {
			const list = bank_list.map((b) => {
				return {
					...b,
					functions: {
						creatable: true,
						updatable: b.start_date > new Date(),
						deletable: b.start_date > new Date(),
					},
				};
			});
			return list;
		});
		return bankSettingFE;
	}),

	getAllFutureBankSetting: publicProcedure.query(async () => {
		const bankService = container.resolve(BankSettingService);
		const bankSetting = await bankService.getAllFutureBankSetting();
		return bankSetting;
	}),

	updateBankSetting: publicProcedure
		.input(updateBankSettingAPI)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			const newdata = await bankService.updateBankSetting(input);
			return newdata;
		}),

	deleteBankSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bankService = container.resolve(BankSettingService);
			await bankService.deleteBankSetting(input.id);
		}),

	getCurrentAttendanceSetting: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.output(attendanceSettingFE.nullable())
		.query(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			const attendanceSetting =
				await attendanceService.getCurrentAttendanceSetting(
					input.period_id
				);

			if (attendanceSetting == null) {
				// throw new BaseResponseError("AttendanceSetting does not exist");
				return null;
			}
			const AttendanceSettingFE = {
				...roundProperties(attendanceSetting, 4),
				functions: {
					creatable: true,
					updatable: attendanceSetting.start_date > new Date(),
					deletable: attendanceSetting.start_date > new Date(),
				},
			};

			return AttendanceSettingFE;
		}),

	getAllAttendanceSetting: publicProcedure.query(async () => {
		const attendanceService = container.resolve(AttendanceSettingService);
		const attendanceSetting =
			await attendanceService.getAllAttendanceSetting();
		if (attendanceSetting.length == 0) {
			// throw new BaseResponseError("AttendanceSetting does not exist");
		}
		const AttendanceSettingFE = await Promise.all(
			attendanceSetting.map((attendance_list) => {
				const list = attendance_list.map((a) => {
					return {
						...roundProperties(a, 4),
						functions: {
							creatable: true,
							updatable: a.start_date > new Date(),
							deletable: a.start_date > new Date(),
						},
					};
				});
				return list;
			})
		);
		return AttendanceSettingFE;
	}),

	getAllFutureAttendanceSetting: publicProcedure.query(async () => {
		const attendanceService = container.resolve(AttendanceSettingService);
		const attendanceSetting =
			await attendanceService.getAllFutureAttendanceSetting();
		return attendanceSetting.map((e) => roundProperties(e, 4));
	}),

	createAttendanceSetting: publicProcedure
		.input(createAttendanceSettingAPI)
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			const newdata = await attendanceService.createAttendanceSetting({
				...input,
				end_date: null,
			});
			await attendanceService.rescheduleAttendanceSetting();
			return newdata;
		}),

	updateAttendanceSetting: publicProcedure
		.input(updateAttendanceSettingAPI)
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			await attendanceService.updateAttendanceSetting(input);
			await attendanceService.rescheduleAttendanceSetting();
		}),

	deleteAttendanceSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			await attendanceService.deleteAttendanceSetting(input.id);
			await attendanceService.rescheduleAttendanceSetting();
		}),

	getCurrentInsuranceRateSetting: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			const insuranceRateSetting =
				await insuranceRateService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			if (insuranceRateSetting == null) {
				// throw new BaseResponseError(
				// 	"InsuranceRateSetting does not exist"
				// );
				return null;
			}
			const InsuranceRateSettingFE = {
				...roundProperties(insuranceRateSetting, 4),
				functions: {
					creatable: true,
					updatable: insuranceRateSetting.start_date > new Date(),
					deletable: insuranceRateSetting.start_date > new Date(),
				},
			};
			return InsuranceRateSettingFE;
		}),

	getAllInsuranceRateSetting: publicProcedure
		.output(insuranceRateSettingFE.array().array())
		.query(async () => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			const insuranceRateSetting =
				await insuranceRateService.getAllInsuranceRateSetting();
			if (insuranceRateSetting.length == 0) {
				// throw new BaseResponseError("InsuranceRateSetting does not exist");
			}
			const insuranceRateSettingFE = insuranceRateSetting.map(
				(insurance_rate_setting_list) => {
					const list = insurance_rate_setting_list.map((a) => {
						return {
							...roundProperties(a, 4),
							functions: {
								creatable: true,
								updatable: a.start_date > new Date(),
								deletable: a.start_date > new Date(),
							},
						};
					});
					return list;
				}
			);
			return insuranceRateSettingFE;
		}),

	getAllFutureInsuranceRateSetting: publicProcedure.query(async () => {
		const insuranceRateService = container.resolve(
			InsuranceRateSettingService
		);
		const insuranceRateSetting =
			await insuranceRateService.getAllFutureInsuranceRateSetting();
		return insuranceRateSetting.map((e) => roundProperties(e, 4));
	}),

	createInsuranceRateSetting: publicProcedure
		.input(createInsuranceRateSettingAPI)
		.mutation(async ({ input }) => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			const newdata =
				await insuranceRateService.createInsuranceRateSetting({
					...input,
					end_date: null,
				});
			await insuranceRateService.rescheduleInsuranceRateSetting();
			return newdata;
		}),

	updateInsuranceRateSetting: publicProcedure
		.input(updateInsuranceRateSettingAPI)
		.mutation(async ({ input }) => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			await insuranceRateService.updateInsuranceRateSetting(input);
			await insuranceRateService.rescheduleInsuranceRateSetting();
		}),

	deleteInsuranceRateSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			await insuranceRateService.deleteInsuranceRateSetting(input.id);
			await insuranceRateService.rescheduleInsuranceRateSetting();
		}),

	createLevelRange: publicProcedure
		.input(createLevelRangeAPI)
		.output(levelRangeFE)
		.mutation(async ({ input }) => {
			const levelRangeService = container.resolve(LevelRangeService);
			const levelRangeMapper = container.resolve(LevelRangeMapper);
			// TODO: Fix this
			const levelRange = await levelRangeMapper.getLevelRange(input);
			const newData = await levelRangeService.createLevelRange(
				levelRange
			);
			const levelRangeFE = await levelRangeMapper.getLevelRangeFE({
				...levelRange,
				id: newData.id,
				disabled: newData.disabled,
				update_date: newData.update_date,
				create_date: newData.create_date,
				update_by: newData.update_by,
				create_by: newData.create_by,
				start_date: levelRange.start_date!,
			});
			// await levelRangeService.rescheduleLevelRange();
			return levelRangeFE;
		}),

	batchCreateLevelRange: publicProcedure
		.input(z.array(createLevelRangeAPI))
		.mutation(async ({ input }) => {
			const levelRangeService = container.resolve(LevelRangeService);
			const levelRangeMapper = container.resolve(LevelRangeMapper);
			const levelRange = await Promise.all(
				input.map(async (e) => await levelRangeMapper.getLevelRange(e))
			);
			const newData = await levelRangeService.batchCreateLevelRange(
				levelRange
			);
			// await levelRangeService.rescheduleLevelRange();
			return newData;
		}),

	getCurrentLevelRange: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const levelRangeService = container.resolve(LevelRangeService);
			const levelRangeMapper = container.resolve(LevelRangeMapper);
			const levelRange = await levelRangeService.getCurrentLevelRange(
				input.period_id
			);
			if (levelRange == null) {
				// throw new BaseResponseError("LevelRange does not exist");
			}
			const levelRangeFE = await Promise.all(
				levelRange.map(
					async (e) => await levelRangeMapper.getLevelRangeFE(e)
				)
			);
			return levelRangeFE;
		}),

	getAllLevelRange: publicProcedure.query(async () => {
		const levelRangeService = container.resolve(LevelRangeService);
		const levelRangeMapper = container.resolve(LevelRangeMapper);
		const levelRange = await levelRangeService.getAllLevelRange();
		if (levelRange == null) {
			// throw new BaseResponseError("LevelRange does not exist");
		}
		const levelRangeFE = await Promise.all(
			levelRange.map(async (e_list) => {
				const list = await Promise.all(
					e_list.map(async (e) => {
						return await levelRangeMapper.getLevelRangeFE(e);
					})
				);
				return list;
			})
		);
		return levelRangeFE;
	}),

	getAllFutureLevelRange: publicProcedure.query(async () => {
		const levelRangeService = container.resolve(LevelRangeService);
		const levelRangeMapper = container.resolve(LevelRangeMapper);
		const levelRange = await levelRangeService.getAllFutureLevelRange();
		const levelRangeFE = await Promise.all(
			levelRange.map(
				async (e) => await levelRangeMapper.getLevelRangeFE(e)
			)
		);
		return levelRangeFE;
	}),

	updateLevelRange: publicProcedure
		.input(updateLevelRangeAPI)
		.mutation(async ({ input }) => {
			const levelRangeService = container.resolve(LevelRangeService);
			const levelRangeMapper = container.resolve(LevelRangeMapper);
			const levelRange = await levelRangeMapper.getLevelRangeNullable(
				input
			);
			const newdata = await levelRangeService.updateLevelRange(
				levelRange
			);
			// await levelRangeService.rescheduleLevelRange();
			return newdata;
		}),

	deleteLevelRange: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const levelRangeService = container.resolve(LevelRangeService);
			await levelRangeService.deleteLevelRange(input.id);
			// await levelRangeService.rescheduleLevelRange();
		}),

	createLevel: publicProcedure
		.input(createLevelAPI)
		.mutation(async ({ input }) => {
			const levelService = container.resolve(LevelService);
			const newdata = await levelService.createLevel({
				...input,
				end_date: null,
			});
			// await levelService.rescheduleLevel();
			return newdata;
		}),

	batchCreateLevel: publicProcedure
		.input(batchCreateLevelAPI)
		.mutation(async ({ input }) => {
			const levelService = container.resolve(LevelService);
			const new_input = input.map((e) => ({ ...e, end_date: null }));
			const newdata = await levelService.batchCreateLevel(new_input);
			// await levelService.rescheduleLevel();
			return newdata;
		}),

	getCurrentLevel: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const levelService = container.resolve(LevelService);
			const levelRangeService = container.resolve(LevelRangeService);
			const level = await levelService.getCurrentLevel(input.period_id);
			if (level == null) {
				// throw new BaseResponseError("Level does not exist");
			}
			const levelFE = await Promise.all(
				level.map(async (e) => {
					return {
						...e,
						functions: {
							creatable: true,
							updatable: e.start_date > new Date(),
							deletable:
								e.start_date > new Date() &&
								!(await levelRangeService.isLevelReferenced(
									e.id
								)),
						},
					};
				})
			);
			return levelFE;
		}),

	getAllLevel: publicProcedure.query(async () => {
		const levelService = container.resolve(LevelService);
		const levelRangeService = container.resolve(LevelRangeService);
		const level = await levelService.getAllLevel();
		const levelFE = await Promise.all(
			level.map(async (level_list) => {
				return await Promise.all(
					level_list.map(async (l) => {
						return {
							...l,
							functions: {
								creatable: true,
								updatable: l.start_date > new Date(),
								deletable:
									l.start_date > new Date() &&
									!(await levelRangeService.isLevelReferenced(
										l.id
									)),
							},
						};
					})
				);
			})
		);
		if (level == null) {
			// throw new BaseResponseError("Level does not exist");
		}
		return levelFE;
	}),

	getAllLevelByStartDate: publicProcedure
		.input(z.object({ start_date: z.date() }))
		.query(async ({ input }) => {
			const levelService = container.resolve(LevelService);
			const levelRangeService = container.resolve(LevelRangeService);
			const level = await levelService.getAllLevelByStartDate(
				input.start_date
			);
			const levelFE = await Promise.all(
				level.map(async (l) => {
					return {
						...l,
						functions: {
							creatable: true,
							updatable: l.start_date > new Date(),
							deletable:
								l.start_date > new Date() &&
								!(await levelRangeService.isLevelReferenced(
									l.id
								)),
						},
					};
				})
			);
			if (level == null) {
				// throw new BaseResponseError("Level does not exist");
			}
			return levelFE;
		}),

	getAllFutureLevel: publicProcedure.query(async () => {
		const levelService = container.resolve(LevelService);
		const level = await levelService.getAllFutureLevel();
		return level;
	}),

	updateLevel: publicProcedure
		.input(updateLevelAPI)
		.mutation(async ({ input }) => {
			const levelService = container.resolve(LevelService);
			const newdata = await levelService.updateLevel(input);
			// await levelService.rescheduleLevel();
			return newdata;
		}),

	deleteLevel: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const levelService = container.resolve(LevelService);
			await levelService.deleteLevel(input.id);
			// await levelService.rescheduleLevel();
		}),

	createPerformanceLevel: publicProcedure
		.input(createPerformanceLevelAPI)
		.mutation(async ({ input }) => {
			const performanceLevelService = container.resolve(
				PerformanceLevelService
			);
			const newdata =
				await performanceLevelService.createPerformanceLevel(input);
			return newdata;
		}),

	getCurrentPerformanceLevel: publicProcedure.query(async () => {
		const performanceLevelService = container.resolve(
			PerformanceLevelService
		);
		const performanceLevel =
			await performanceLevelService.getCurrentPerformanceLevel();
		if (performanceLevel == null) {
			// throw new BaseResponseError("PerformanceLevel does not exist");
		}
		return performanceLevel;
	}),

	getAllPerformanceLevel: publicProcedure.query(async () => {
		const performanceLevelService = container.resolve(
			PerformanceLevelService
		);
		const performanceLevel =
			await performanceLevelService.getAllPerformanceLevel();
		if (performanceLevel == null) {
			// throw new BaseResponseError("LevelRange does not exist");
		}
		return performanceLevel;
	}),

	updatePerformanceLevel: publicProcedure
		.input(updatePerformanceLevelAPI)
		.mutation(async ({ input }) => {
			const performanceLevelService = container.resolve(
				PerformanceLevelService
			);
			const newdata =
				await performanceLevelService.updatePerformanceLevel(input);
			return newdata;
		}),

	deletePerformanceLevel: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const performanceLevelService = container.resolve(
				PerformanceLevelService
			);
			await performanceLevelService.deletePerformanceLevel(input.id);
		}),

	createTrustMoney: publicProcedure
		.input(createTrustMoneyAPI)
		.mutation(async ({ input }) => {
			const trustMoneyService = container.resolve(TrustMoneyService);
			const newdata = await trustMoneyService.createTrustMoney({
				...input,
				end_date: null,
			});
			await trustMoneyService.rescheduleTrustMoney();
			return newdata;
		}),

	batchCreateTrustMoney: publicProcedure
		.input(batchCreateTrustMoneyAPI)
		.mutation(async ({ input }) => {
			const trustMoneyService = container.resolve(TrustMoneyService);
			const newdata = await trustMoneyService.batchCreateTrustMoney(
				input.map((item) => ({ ...item, end_date: null }))
			);
			await trustMoneyService.rescheduleTrustMoney();
			return newdata;
		}),

	getCurrentTrustMoney: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const trustMoneyService = container.resolve(TrustMoneyService);
			const trustMoney = await trustMoneyService.getCurrentTrustMoney(
				input.period_id
			);
			if (trustMoney == null) {
				// throw new BaseResponseError("TrustMoney does not exist");
			}
			const trustMoneyFE = await Promise.all(
				trustMoney.map(async (e) => {
					return {
						...e,
						functions: {
							creatable: true,
							updatable: e.start_date > new Date(),
							deletable: e.start_date > new Date(),
						},
					};
				})
			);
			return trustMoneyFE;
		}),

	getAllTrustMoney: publicProcedure.query(async () => {
		const trustMoneyService = container.resolve(TrustMoneyService);
		const trustMoney = await trustMoneyService.getAllTrustMoney();
		if (trustMoney == null) {
			// throw new BaseResponseError("TrustMoney does not exist");
		}
		const trustMoneyFE = await Promise.all(
			trustMoney.map(async (trust_money_list) => {
				const list = trust_money_list.map((d) => {
					return {
						...d,
						functions: {
							creatable: true,
							updatable: d.start_date > new Date(),
							deletable: d.start_date > new Date(),
						},
					};
				});
				return list;
			})
		);
		return trustMoneyFE;
	}),

	getAllFutureTrustMoney: publicProcedure.query(async () => {
		const trustMoneyService = container.resolve(TrustMoneyService);
		const trustMoney = await trustMoneyService.getAllFutureTrustMoney();
		return trustMoney;
	}),

	updateTrustMoney: publicProcedure
		.input(updateTrustMoneyAPI)
		.mutation(async ({ input }) => {
			const trustMoneyService = container.resolve(TrustMoneyService);
			const newdata = await trustMoneyService.updateTrustMoney(input);
			await trustMoneyService.rescheduleTrustMoney();
			return newdata;
		}),

	deleteTrustMoney: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const trustMoneyService = container.resolve(TrustMoneyService);
			await trustMoneyService.deleteTrustMoney(input.id);
			await trustMoneyService.rescheduleTrustMoney();
		}),

	createSalaryIncomeTax: publicProcedure
		.input(createSalaryIncomeTaxAPI)
		.mutation(async ({ input }) => {
			const salaryIncomeTaxService = container.resolve(
				SalaryIncomeTaxService
			);
			const primary_key =
				await salaryIncomeTaxService.createSalaryIncomeTax({
					...input,
					end_date: null,
				});
			if (primary_key)
				await salaryIncomeTaxService.rescheduleSalaryIncomeTax([
					primary_key,
				]);
		}),
	batchCreateSalaryIncomeTax: publicProcedure
		.input(batchCreateSalaryIncomeTaxAPI)
		.mutation(async ({ input }) => {
			const salaryIncomeTaxService = container.resolve(
				SalaryIncomeTaxService
			);
			const unique_primary_keys =
				await salaryIncomeTaxService.batchCreateSalaryIncomeTax(
					input.map((e) => ({
						...e,
						end_date: null,
					}))
				);
			await salaryIncomeTaxService.rescheduleSalaryIncomeTax(
				unique_primary_keys
			);
		}),
	updateSalaryIncomeTax: publicProcedure
		.input(updateSalaryIncomeTaxAPI)
		.mutation(async ({ input }) => {
			const salaryIncomeTaxService = container.resolve(
				SalaryIncomeTaxService
			);
			const unique_primary_keys =
				await salaryIncomeTaxService.updateSalaryIncomeTax(input);
			if (unique_primary_keys)
				await salaryIncomeTaxService.rescheduleSalaryIncomeTax(
					unique_primary_keys
				);
		}),

	deleteSalaryIncomeTax: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const salaryIncomeTaxService = container.resolve(
				SalaryIncomeTaxService
			);
			const primary_key =
				await salaryIncomeTaxService.deleteSalaryIncomeTax(input.id);
			await salaryIncomeTaxService.rescheduleSalaryIncomeTax([
				primary_key,
			]);
		}),

	getCurrentSalaryIncomeTax: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const salaryIncomeTaxService = container.resolve(
				SalaryIncomeTaxService
			);
			const salaryIncomeTax =
				await salaryIncomeTaxService.getCurrentSalaryIncomeTax(
					input.period_id
				);
			if (salaryIncomeTax == null) {
				// throw new BaseResponseError("SalaryIncomeTax does not exist");
			}
			const salaryIncomeTaxFE = await Promise.all(
				salaryIncomeTax.map(async (e) => {
					return {
						...e,
						functions: {
							creatable: true,
							updatable: e.start_date > new Date(),
							deletable: e.start_date > new Date(),
						},
					};
				})
			);
			return salaryIncomeTaxFE;
		}),

	getAllSalaryIncomeTax: publicProcedure.query(async () => {
		const salaryIncomeTaxService = container.resolve(
			SalaryIncomeTaxService
		);
		const salaryIncomeTax =
			await salaryIncomeTaxService.getAllSalaryIncomeTax();
		if (salaryIncomeTax == null) {
			// throw new BaseResponseError("SalaryIncomeTax does not exist");
		}
		const salaryIncomeTaxFE = await Promise.all(
			salaryIncomeTax.map((income_tax_list) => {
				const list = income_tax_list.map((e) => {
					return {
						...e,
						functions: {
							creatable: true,
							updatable: e.start_date > new Date(),
							deletable: e.start_date > new Date(),
						},
					};
				});
				return list;
			})
		);
		return salaryIncomeTaxFE;
	}),

	getAllFutureSalaryIncomeTax: publicProcedure.query(async () => {
		const salaryIncomeTaxService = container.resolve(
			SalaryIncomeTaxService
		);
		const salaryIncomeTax =
			await salaryIncomeTaxService.getAllFutureSalaryIncomeTax();
		return salaryIncomeTax;
	}),
});
