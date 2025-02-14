import {
	type NewAllowanceFEType,
	type AllowanceFEType,
} from "~/server/api/types/allowance_type";
import {
	type AllowanceWithType,
} from "~/server/service/ehr_service";
import { type EmployeePaymentDecType } from "../entity/SALARY/employee_payment";
import { type EmployeeDataDecType } from "../entity/SALARY/employee_data";
import { type Payset } from "../entity/UMEDIA/payset";

export class AllowanceMapper {

	async getAllowanceFE(
		allowance_with_type: AllowanceWithType,
		employee_data_list: EmployeeDataDecType[],
		payset_list: Payset[]
	): Promise<AllowanceFEType> {
		const employee_data = employee_data_list.find((e) => e.emp_no === allowance_with_type.emp_no);
		const payset = payset_list.find((p) => p.emp_no === allowance_with_type.emp_no);

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
				const employee_data = employee_data_list.find((e) => e.emp_no === employee_payment.emp_no);
				const payset = payset_list.find((p) => p.emp_no === employee_payment.emp_no);
				return {
					...employee_payment,
					emp_no: employee_payment.emp_no,
					emp_name: employee_data!.emp_name,
					department: employee_data!.department,
					position: employee_data!.position,
					work_day: payset ? payset.work_day ?? 30 : 30,
					shift_allowance:
						allowanceFE_list.findLast(
							(allowanceFE) =>
								allowanceFE.emp_no ===
								employee_payment.emp_no &&
								allowanceFE.allowance_type_name === "輪班津貼"
						)?.amount ?? 0,
					professional_cert_allowance:
						allowanceFE_list.findLast(
							(allowanceFE) =>
								allowanceFE.emp_no ===
								employee_payment.emp_no &&
								allowanceFE.allowance_type_name === "證照津貼"
						)?.amount ?? 0,
				};
			})
		);
		return new_allowanceFE_list;
	}
}
