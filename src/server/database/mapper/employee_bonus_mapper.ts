import { container, injectable } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { deleteProperties } from "./helper_function";
import { type EmployeeBonusFEType } from "~/server/api/types/employee_bonus_type";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { EmployeeBonusService } from "~/server/service/employee_bonus_service";
import { BaseMapper } from "./base_mapper";
import {
	type EmployeeBonus,
	type EmployeeBonusDecType,
	decEmployeeBonus,
	encEmployeeBonus,
} from "../entity/SALARY/employee_bonus";

@injectable()
export class EmployeeBonusMapper extends BaseMapper<
	EmployeeBonus,
	EmployeeBonusDecType,
	typeof encEmployeeBonus,
	typeof decEmployeeBonus
> {
	constructor() {
		super("Employee Bonus Mapper", encEmployeeBonus, decEmployeeBonus, []);
	}

	// TODO: change to a FE mapper
	async getEmployeeBonusFE(
		employee_bonus: EmployeeBonusDecType
	): Promise<EmployeeBonusFEType> {
		function getRandomStatus(): string {
			const statuses = ["符合資格", "不符合資格", "留停"];
			const randomIndex = Math.floor(Math.random() * statuses.length);
			return statuses[randomIndex]!;
		}

		const employeeBonusService = container.resolve(EmployeeBonusService);
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeePaymentService = container.resolve(EmployeePaymentService);

		const employee = await employeeDataService.getLatestEmployeeDataByEmpNo(
			employee_bonus.emp_no
		);
		const employeePayment =
			await employeePaymentService.getEmployeePaymentByEmpNo(
				employee_bonus.emp_no
			);
		const total_amount =
			employeePayment.base_salary +
			employeePayment.supervisor_allowance +
			employeePayment.subsidy_allowance +
			employeePayment.occupational_allowance +
			employeePayment.food_allowance +
			employeePayment.long_service_allowance;

		const employee_bonus_id = (
			(await employeeBonusService.getEmployeeBonus(
				employee_bonus.period_id,
				employee_bonus.bonus_type
			)) ?? []
		).filter((e) => e.emp_no === employee_bonus.emp_no)[0]!.id;

		const employeeBonusFE: EmployeeBonusFEType = {
			id: employee_bonus_id,
			period_id: employee_bonus.period_id,
			bonus_type: employee_bonus.bonus_type,
			department: employee.department,
			emp_no: employee_bonus.emp_no,
			emp_name: employee.emp_name,
			position: employee.position,
			position_type: employee.position_type,
			residence_permit_start_date: employee.residence_permit_start_date,
			residence_permit_end_date: employee.residence_permit_end_date,
			registration_date: employee.registration_date,
			quit_date: employee.quit_date,
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
			special_multiplier: employee_bonus.special_multiplier,
			multiplier: employee_bonus.multiplier,
			fixed_amount: employee_bonus.fixed_amount,
			bud_effective_salary: employee_bonus.bud_effective_salary,
			bud_amount: employee_bonus.bud_amount,
			sup_performance_level: employee_bonus.sup_performance_level,
			sup_effective_salary: employee_bonus.sup_effective_salary,
			sup_amount: employee_bonus.sup_amount,
			app_performance_level: employee_bonus.app_performance_level,
			app_effective_salary: employee_bonus.app_effective_salary,
			app_amount: employee_bonus.app_amount,
			status: getRandomStatus(),
			functions: {
				creatable: false,
				updatable: true,
				deletable: false,
			},
			create_by: employee_bonus.create_by,
			update_by: employee_bonus.update_by,
			create_date: employee_bonus.create_date,
			update_date: employee_bonus.update_date,
		};

		return deleteProperties(employeeBonusFE, [
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
