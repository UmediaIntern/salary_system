import { container, injectable } from "tsyringe";
import { type z } from "zod";
import { SalaryRaise } from "../database/entity/SALARY/salary_raise";
import { BaseResponseError } from "../errors/base_response_error";
import { Round, select_value } from "./helper_function";
import { EHRService } from "./ehr_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { SalaryRaiseMapper } from "../database/mapper/salary_raise_mapper";
import {
	createSalaryRaiseService,
	type updateSalaryRaiseService,
} from "../api/types/salary_raise_type";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { EmployeeDataService } from "./employee_data_service";
import { SalaryRaiseAllService } from "./salary_raise_all_service";
import { SalaryRaiseWorkTypeService } from "./salary_raise_work_type_service";
import { SalaryRaisePositionService } from "./salary_raise_position_service";
import { SalaryRaiseSeniorityService } from "./salary_raise_seniority_service";
import { SalaryRaiseDepartmentService } from "./salary_raise_department_service";

@injectable()
export class SalaryRaiseService {
	constructor(
		private readonly salaryRaiseMapper: SalaryRaiseMapper
	) {}

	async createSalaryRaise(
		data: z.input<typeof createSalaryRaiseService>
	): Promise<SalaryRaise> {
		const d = createSalaryRaiseService.parse(data);
		const salaryRaise = await this.salaryRaiseMapper.encode({
			...d,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await SalaryRaise.create(salaryRaise, {
			raw: true,
		});

		return newData;
	}

	async createSalaryRaiseByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	) {
		const salaryRaise = await this.getAllSalaryRaise(
			period_id,
		);
		console.log("\n\n\nCalled Create By List\n\n\n")
		console.log(emp_no_list)
		const promises = emp_no_list.map(async (emp_no) => {
			if (salaryRaise.find((e) => e.emp_no === emp_no)) {
				return;
			}
			console.log(`\n\n\n\ncreate${emp_no}`)
			await this.createSalaryRaise({
				period_id: period_id,
				emp_no: emp_no,
				special_multiplier: 0,
				multiplier: 0,
				fixed_amount: 0,
				bud_effective_salary: 0,
				bud_amount: 0,
				sup_performance_level: null,
				sup_effective_salary: null,
				sup_amount: null,
				app_performance_level: null,
				app_effective_salary: null,
				app_amount: null,
				start_date: null,
				end_date: null,
			});
		});

		await Promise.all(promises);
	}

	async getSalaryRaiseById(id: number) {
		const result = await SalaryRaise.findByPk(id);
		return await this.salaryRaiseMapper.decode(result);
	}

	async getSalaryRaiseByEmpNoByType(
		period_id: number,
		emp_no: string
	) {
		const result = await SalaryRaise.findOne({
			where: {
				period_id: period_id,
				emp_no: emp_no,
				disabled: false,
			},
			raw: true,
		});
		if (result === null) {
			return null;
		}
		return await this.salaryRaiseMapper.decode(result);
	}

	async getSalaryRaiseByEmpNo(period_id: number, emp_no: string) {
		const empList = await SalaryRaise.findAll({
			where: {
				period_id: period_id,
				emp_no: emp_no,
				disabled: false,
			},
		});

		return await this.salaryRaiseMapper.decodeList(empList);
	}

	async getAllSalaryRaise(
		period_id: number,
	) {
		const result = await SalaryRaise.findAll({
			where: {
				period_id: period_id,
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
		});
		return await this.salaryRaiseMapper.decodeList(result);
	}

	async getSalaryRaise(period_id: number) {
		const result = await SalaryRaise.findAll({
			where: {
				period_id: period_id,
				// special_multiplier: {
				// 	[Op.gt]: 0,
				// },
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
		});
		return await this.salaryRaiseMapper.decodeList(result);
	}

	async initCandidateSalaryRaise(
		period_id: number
	) {
		const all_salary_raise_list = await this.getAllSalaryRaise(
			period_id,
		);
		const salary_raise_all_service = container.resolve(SalaryRaiseAllService);
		const salary_raise_work_type_service = container.resolve(SalaryRaiseWorkTypeService);
		const salary_raise_position_service = container.resolve(SalaryRaisePositionService);
		// const salary_raise_position_type_service = container.resolve(
		// 	SalaryRaisePositionTypeService
		// );
		const salary_raise_seniority_service = container.resolve(
			SalaryRaiseSeniorityService
		);
		const salary_raise_department_service = container.resolve(
			SalaryRaiseDepartmentService
		);
		const ehr_service = container.resolve(EHRService);
		const employee_data_service = container.resolve(EmployeeDataService);
		const issue_date = (await ehr_service.getPeriodById(period_id))
			.issue_date;

		const promises = all_salary_raise_list.map(async (emp) => {
			const employee_data =
				await employee_data_service.getEmployeeDataByEmpNoByPeriod(
					period_id,
					emp.emp_no
				);
			if (!employee_data) {
				return;
			}
			const special_multiplier =
				(await salary_raise_all_service.getMultiplier(period_id)) *
				(await salary_raise_work_type_service.getMultiplier(
					period_id,
					employee_data.work_type
				)) *
				(await salary_raise_position_service.getMultiplier(
					period_id,
					employee_data.position,
					employee_data.position_type
				)) *
				(await salary_raise_seniority_service.getMultiplier(
					period_id,
					Math.floor(
						(issue_date.getTime() -
							new Date(
								employee_data.registration_date
							).getTime()) /
							(1000 * 60 * 60 * 24 * 365)
					)
				)) *
				(await salary_raise_department_service.getMultiplier(
					period_id,
					employee_data.department
				));
			if (special_multiplier != emp.special_multiplier) {
				await this.updateSalaryRaise({
					id: emp.id,
					special_multiplier: special_multiplier,
				});
			}
		});

		await Promise.all(promises);
	}

	async deleteSalaryRaise(id: number) {
		const result = await SalaryRaise.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		return result;
	}

	async updateSalaryRaise({
		id,
		period_id,
		emp_no,
		special_multiplier,
		multiplier,
		fixed_amount,
		bud_effective_salary,
		bud_amount,
		sup_performance_level,
		sup_effective_salary,
		sup_amount,
		app_performance_level,
		app_effective_salary,
		app_amount,
	}: z.infer<typeof updateSalaryRaiseService>) {
		const salaryRaise = await this.getSalaryRaiseById(id);
		if (salaryRaise == null) {
			throw new BaseResponseError("Employee account does not exist");
		}

		await this.deleteSalaryRaise(id);

		await this.createSalaryRaise({
			emp_no: select_value(emp_no, salaryRaise.emp_no),
			period_id: select_value(period_id, salaryRaise.period_id),
			special_multiplier: select_value(
				special_multiplier,
				salaryRaise.special_multiplier
			),
			multiplier: select_value(multiplier, salaryRaise.multiplier),
			fixed_amount: select_value(
				fixed_amount,
				salaryRaise.fixed_amount
			),
			bud_effective_salary: select_value(
				bud_effective_salary,
				salaryRaise.bud_effective_salary
			),
			bud_amount: select_value(bud_amount, salaryRaise.bud_amount),
			sup_performance_level: select_value(
				sup_performance_level,
				salaryRaise.sup_performance_level
			),
			sup_effective_salary: select_value(
				sup_effective_salary,
				salaryRaise.sup_effective_salary
			),
			sup_amount: select_value(sup_amount, salaryRaise.sup_amount),
			app_performance_level: select_value(
				app_performance_level,
				salaryRaise.app_performance_level
			),
			app_effective_salary: select_value(
				app_effective_salary,
				salaryRaise.app_effective_salary
			),
			app_amount: select_value(app_amount, salaryRaise.app_amount),
			start_date: null,
			end_date: null,
		});
	}

	async updateMultipleSalaryRaiseByEmpNoList(
		emp_no_list: string[],
		period_id: number,
		multiplier: number,
		fixed_amount: number
	): Promise<void> {
		await Promise.all(
			emp_no_list.map(async (emp_no) => {
				const salary_raise = await this.getSalaryRaiseByEmpNoByType(
					period_id,
					emp_no
				);
				if (!salary_raise) {
					throw new BaseResponseError(
						"Salary Raise does not exist"
					);
				}
				await this.updateSalaryRaise({
					id: salary_raise.id,
					multiplier: multiplier,
					fixed_amount: fixed_amount,
				});
			})
		);
	}

	async updateFromExcel(
		force: boolean,
		{
			period_id,
			emp_no,
			sup_performance_level,
			sup_effective_salary,
			sup_amount,
			app_performance_level,
			app_effective_salary,
			app_amount,
		}: z.infer<typeof updateSalaryRaiseService>
	) {
		let error = false;
		const salaryRaise = await this.getSalaryRaiseByEmpNoByType(
			period_id!,
			emp_no!
		);
		if (!salaryRaise) {
			throw new BaseResponseError("Salary Raise does not exist");
		}
		const salary_raise_mapper = container.resolve(SalaryRaiseMapper);
		const salary_raise_fe =
			await salary_raise_mapper.getSalaryRaiseFE({
				...salaryRaise,
				sup_performance_level: sup_performance_level!,
				sup_effective_salary: sup_effective_salary!,
				sup_amount: sup_amount!,
				app_performance_level: app_performance_level!,
				app_effective_salary: app_effective_salary!,
				app_amount: app_amount!,
			});
		if (
			salary_raise_fe.sup_performance_level ??
			salary_raise_fe.sup_effective_salary ??
			salary_raise_fe.sup_amount ??
			salary_raise_fe.app_performance_level ??
			salary_raise_fe.app_effective_salary ??
			salary_raise_fe.app_amount
		) {
			error = true;
		}
		if (force || !error) {
			await this.updateSalaryRaise({
				id: salaryRaise.id,
				sup_performance_level: select_value(
					sup_performance_level,
					salaryRaise.sup_performance_level
				),
				sup_effective_salary:
					select_value(
						sup_effective_salary,
						salaryRaise.sup_effective_salary
					) ?? undefined,
				sup_amount:
					select_value(sup_amount, salaryRaise.sup_amount) ??
					undefined,
				app_performance_level: select_value(
					app_performance_level,
					salaryRaise.app_performance_level
				),
				app_effective_salary:
					select_value(
						app_effective_salary,
						salaryRaise.app_effective_salary
					) ?? undefined,
				app_amount:
					select_value(app_amount, salaryRaise.app_amount) ??
					undefined,
			});
		}
		return error ? emp_no : null;
	}

	async autoCalculateSalaryRaise(
		period_id: number,
		total_budgets: number
	) {
		const budget_amount_list: {
			emp_no: string;
			bud_effective_salary: number;
			budget_amount: number;
		}[] = [];
		const emp_no_list = (
			await this.getAllSalaryRaise(period_id)
		).map((e) => e.emp_no);
		const promises = emp_no_list.map(async (emp_no) => {
			const employee_payment_service = container.resolve(
				EmployeePaymentService
			);

			const employee_payment_dec =
				await employee_payment_service.getCurrentEmployeePaymentByEmpNo(
					emp_no,
					period_id
				);
			if (!employee_payment_dec) {
				return;
			}

			const salary_raise = await this.getSalaryRaiseByEmpNoByType(
				period_id,
				emp_no
			);
			if (!salary_raise) {
				return;
			}

			const salary_raise_fe =
				await this.salaryRaiseMapper.getSalaryRaiseFE(
					salary_raise
				);

			const budget_amount =
				(employee_payment_dec.base_salary +
					employee_payment_dec.food_allowance +
					employee_payment_dec.supervisor_allowance +
					employee_payment_dec.occupational_allowance +
					employee_payment_dec.subsidy_allowance +
					(employee_payment_dec.long_service_allowance_type ==
					LongServiceEnum.enum.month_allowance
						? employee_payment_dec.long_service_allowance
						: 0)) *
					salary_raise_fe.special_multiplier *
					salary_raise_fe.multiplier +
				salary_raise_fe.fixed_amount;
			if (budget_amount <= 0) {
				budget_amount_list.push({
					emp_no: emp_no,
					bud_effective_salary: 0,
					budget_amount: 0,
				});
			} else {
				budget_amount_list.push({
					emp_no: emp_no,
					bud_effective_salary: Round(
						budget_amount /
							(employee_payment_dec.base_salary +
								employee_payment_dec.food_allowance +
								employee_payment_dec.supervisor_allowance +
								employee_payment_dec.occupational_allowance +
								employee_payment_dec.subsidy_allowance),
						3
					),
					budget_amount: budget_amount,
				});
			}
		});

		await Promise.all(promises);

		const total_budget_amount = budget_amount_list
			.map((e) => e.budget_amount)
			.reduce((a, b) => a + b, 0);
		if (total_budget_amount > 0) {
			const ratio = total_budgets / total_budget_amount;
			budget_amount_list.forEach((e) => {
				e.budget_amount = Round(e.budget_amount * ratio, 1);
				e.bud_effective_salary = Round(
					e.bud_effective_salary * ratio,
					2
				);
			});
		}

		const promises2 = budget_amount_list.map(async (e) => {
			const salary_raise = await this.getSalaryRaiseByEmpNoByType(
				period_id,
				e.emp_no
			);
			if (!salary_raise) {
				return;
			}

			await this.updateSalaryRaise({
				id: salary_raise.id,
				bud_effective_salary: e.bud_effective_salary,
				bud_amount: e.budget_amount,
			});
		});

		await Promise.all(promises2);

		return budget_amount_list;
	}
}
