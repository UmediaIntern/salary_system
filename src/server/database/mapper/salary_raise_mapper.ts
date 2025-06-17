import { container, injectable } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { deleteProperties } from "./helper_function";
import { type SalaryRaiseFEType } from "~/server/api/types/salary_raise_type";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { SalaryRaiseService } from "~/server/service/salary_raise_service";
import { BaseMapper } from "./base_mapper";
import {
	type SalaryRaise,
	type SalaryRaiseDecType,
	decSalaryRaise,
	encSalaryRaise,
} from "../entity/SALARY/salary_raise";

@injectable()
export class SalaryRaiseMapper extends BaseMapper<
	SalaryRaise,
	SalaryRaiseDecType,
  typeof encSalaryRaise,
  typeof decSalaryRaise
> {
	constructor() {
		super("Salary Raise Mapper", encSalaryRaise, decSalaryRaise, []);
	}

	// TODO: change to a FE mapper
	async getSalaryRaiseFE(
		salary_raise: SalaryRaiseDecType
	): Promise<SalaryRaiseFEType> {
		function getRandomStatus(): string {
			const statuses = ["符合資格", "不符合資格", "留停"];
			const randomIndex = Math.floor(Math.random() * statuses.length);
			return statuses[randomIndex]!;
		}

		const salaryRaiseService = container.resolve(SalaryRaiseService);
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeePaymentService = container.resolve(
			EmployeePaymentService
		);

		const employee = await employeeDataService.getLatestEmployeeDataByEmpNo(
			salary_raise.emp_no
		);
		const employeePayment =
			await employeePaymentService.getEmployeePaymentByEmpNo(
				salary_raise.emp_no
			);
		const total_amount =
			employeePayment.base_salary +
			employeePayment.supervisor_allowance +
			employeePayment.subsidy_allowance +
			employeePayment.occupational_allowance +
			employeePayment.food_allowance +
			employeePayment.long_service_allowance;

		const employee_bonus_id = (
			(await salaryRaiseService.getSalaryRaise(
				salary_raise.period_id,
			)) ?? []
		).filter((e) => e.emp_no === salary_raise.emp_no)[0]!.id;

    // TODO: position and position_type are missing
		const salaryRaiseFE: SalaryRaiseFEType = {
			id: employee_bonus_id,
			period_id: salary_raise.period_id,
			department: employee.department,
			emp_no: salary_raise.emp_no,
			emp_name: employee.emp_name,
			registration_date: employee.registration_date,
			seniority: 0,
			position_position_type: `${employee.position}${employee.position_type}`,
			work_status: employee.work_status,
			base_salary: employeePayment.base_salary,
			supervisor_allowance: employeePayment.supervisor_allowance,
			subsidy_allowance: employeePayment.subsidy_allowance,
			occupational_allowance: employeePayment.occupational_allowance,
			food_allowance: employeePayment.food_allowance,
			long_service_allowance: employeePayment.long_service_allowance,
			total: total_amount,
			special_multiplier: salary_raise.special_multiplier,
			multiplier: salary_raise.multiplier,
			fixed_amount: salary_raise.fixed_amount,
			bud_effective_salary: salary_raise.bud_effective_salary,
			bud_amount: salary_raise.bud_amount,
			sup_performance_level: salary_raise.sup_performance_level,
			sup_effective_salary: salary_raise.sup_effective_salary,
			sup_amount: salary_raise.sup_amount,
			app_performance_level: salary_raise.app_performance_level,
			app_effective_salary: salary_raise.app_effective_salary,
			app_amount: salary_raise.app_amount,
			status: getRandomStatus(),
			create_by: salary_raise.create_by,
			update_by: salary_raise.update_by,
			create_date: salary_raise.create_date,
			update_date: salary_raise.update_date,
		};

		return deleteProperties(salaryRaiseFE, [
			"special_multiplier_enc",
			"multiplier_enc",
			"fixed_amount_enc",
			"bud_effective_salary_enc",
			"bud_amount_enc",
			"sup_performance_level_enc",
			"sup_effective_salary_enc",
			"sup_amount_enc",
			"app_performance_level_enc",
			"app_effective_salary_enc",
			"app_amount_enc",
		]);
	}
}
