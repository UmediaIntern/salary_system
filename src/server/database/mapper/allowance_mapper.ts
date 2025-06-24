import {
	type NewAllowanceFEType,
	type AllowanceFEType,
	newAllowanceFEDiffType,
} from "~/server/api/types/allowance_type";
import { type AllowanceWithType } from "~/server/service/ehr_service";
import { type EmployeePaymentDecType } from "../entity/SALARY/employee_payment";
import { type EmployeeDataDecType } from "../entity/SALARY/employee_data";
import { type Payset } from "../entity/UMEDIA/payset";

export class AllowanceMapper {
	async getAllowanceFE(
		allowance_with_type: AllowanceWithType,
		employee_data_list: EmployeeDataDecType[],
		payset_list: Payset[]
	): Promise<AllowanceFEType> {
		const employee_data = employee_data_list.find(
			(e) => e.emp_no === allowance_with_type.emp_no
		);
		const payset = payset_list.find(
			(p) => p.emp_no === allowance_with_type.emp_no
		);

		const allowanceFE: AllowanceFEType = {
			...allowance_with_type,
			name: employee_data!.emp_name,
			department: employee_data!.department,
			position: employee_data!.position,
			work_day: payset ? payset.work_day : 30,
			// note: allowance_with_type.note,
		};
		return allowanceFE;
	}

	async getNewAllowanceFE(
		allowanceFE_list: AllowanceFEType[],
		employee_payment_list: EmployeePaymentDecType[],
		employee_data_list: EmployeeDataDecType[],
		payset_list: Payset[]
	): Promise<NewAllowanceFEType[]> {
		const new_allowanceFE_list: NewAllowanceFEType[] = await Promise.all(
			employee_payment_list.map(async (employee_payment) => {
				const shift_allowance =
					allowanceFE_list.findLast(
						(allowanceFE) =>
							allowanceFE.emp_no === employee_payment.emp_no &&
							allowanceFE.allowance_type_name === "輪班津貼"
					)?.amount ?? 0;
				const professional_cert_allowance =
					allowanceFE_list.findLast(
						(allowanceFE) =>
							allowanceFE.emp_no === employee_payment.emp_no &&
							allowanceFE.allowance_type_name === "證照津貼"
					)?.amount ?? 0;
				

				const employee_data = employee_data_list.find(
					(e) => e.emp_no === employee_payment.emp_no
				);
				const payset = payset_list.find(
					(p) => p.emp_no === employee_payment.emp_no
				);
				return {
					...employee_payment,
					emp_no: employee_payment.emp_no,
					emp_name: employee_data!.emp_name,
					department: employee_data!.department,
					position: employee_data!.position,
					work_day: payset ? payset.work_day ?? 30 : 30,
					shift_allowance: shift_allowance,
					professional_cert_allowance:
						professional_cert_allowance,
				};
			})
		);
		return new_allowanceFE_list;
	}
	async getDifference(
		allowanceFE_list: AllowanceFEType[],
		prev_allowanceFE_list: AllowanceFEType[],
		employee_payment_list: EmployeePaymentDecType[],
		prev_employee_payment_list: EmployeePaymentDecType[]
	) {
		const difference: newAllowanceFEDiffType[] = await Promise.all(
			employee_payment_list.map(async (employee_payment) => {
				const prev_employee_payment = prev_employee_payment_list.find(
					(e) => e.emp_no === employee_payment.emp_no
				);
				const shift_allowance =
					allowanceFE_list.findLast(
						(allowanceFE) =>
							allowanceFE.emp_no === employee_payment.emp_no &&
							allowanceFE.allowance_type_name === "輪班津貼"
					)?.amount ?? 0;
				const professional_cert_allowance =
					allowanceFE_list.findLast(
						(allowanceFE) =>
							allowanceFE.emp_no === employee_payment.emp_no &&
							allowanceFE.allowance_type_name === "證照津貼"
					)?.amount ?? 0;
				const prev_shift_allowance =
					prev_allowanceFE_list.findLast(
						(allowanceFE) =>
							allowanceFE.emp_no === employee_payment.emp_no &&
							allowanceFE.allowance_type_name === "輪班津貼"
					)?.amount ?? 0;
				const prev_professional_cert_allowance =
					prev_allowanceFE_list.findLast(
						(allowanceFE) =>
							allowanceFE.emp_no === employee_payment.emp_no &&
							allowanceFE.allowance_type_name === "證照津貼"
					)?.amount ?? 0;
				return {
					emp_no: employee_payment.emp_no,
					supervisor_allowance:
						employee_payment.supervisor_allowance !==
						prev_employee_payment?.supervisor_allowance,
					subsidy_allowance:
						employee_payment.subsidy_allowance !==
						prev_employee_payment?.subsidy_allowance,
					occupational_allowance:
						employee_payment.occupational_allowance !==
						prev_employee_payment?.occupational_allowance,
					food_allowance:
						employee_payment.food_allowance !==
						prev_employee_payment?.food_allowance,
					long_service_allowance:
						employee_payment.long_service_allowance !==
						prev_employee_payment?.long_service_allowance,
					shift_allowance: shift_allowance !== prev_shift_allowance,
					professional_cert_allowance:
						professional_cert_allowance !==
						prev_professional_cert_allowance,
				};
			})
		);
		return difference;
	}
}
