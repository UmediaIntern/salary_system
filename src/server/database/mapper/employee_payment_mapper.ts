import { injectable } from "tsyringe";
import {
	type EmployeePaymentDecType,
	encEmployeePayment,
	decEmployeePayment,
	type EmployeePayment,
} from "../entity/SALARY/employee_payment";
import {
	type EmployeeDataDecType,
} from "../entity/SALARY/employee_data";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseMapper } from "./base_mapper";
import { EmployeePaymentFEType } from "~/server/api/types/employee_payment_type";

@injectable()
export class EmployeePaymentMapper extends BaseMapper<
	EmployeePayment,
	EmployeePaymentDecType,
	typeof encEmployeePayment,
	typeof decEmployeePayment
> {
	constructor(private readonly employeeDataService: EmployeeDataService) {
		super("Employee Payment Mapper", encEmployeePayment, decEmployeePayment, [
			"base_salary_enc",
			"supervisor_allowance_enc",
			"occupational_allowance_enc",
			"subsidy_allowance_enc",
			"food_allowance_enc",
			"long_service_allowance_enc",
			"l_r_self_ratio_enc",
			"l_i_enc",
			"h_i_enc",
			"l_r_enc",
			"occupational_injury_enc",
		]);
	}

	async getEmployeePaymentFE(dec: EmployeePaymentDecType[]): Promise<EmployeePaymentFEType[]> {
		const list = await this.includeEmployee(dec, [
			"department",
			"emp_name",
			"position",
			"position_type",
			"work_type",
		]);
		const employeePaymentFE = await Promise.all(
			list.map(async (e) => {
				return {
					...e,
					functions: {
						creatable: e.base_salary != 0,
						updatable: e.start_date > new Date() || e.base_salary == 0,
						deletable: e.start_date > new Date(),
					},
				};
			})
		);
		return employeePaymentFE;
	}

	private async includeEmployee<
		Data extends EmployeePaymentDecType | EmployeePaymentDecType[],
		K extends Partial<keyof EmployeeDataDecType>
	>(
		data: Data,
		keys: K[]
	): Promise<(EmployeePaymentDecType & Pick<EmployeeDataDecType, K>)[]> {
		const employeeDataRecord: Record<string, EmployeeDataDecType> = {};

		const dataList: EmployeePaymentDecType[] = Array.isArray(data)
			? data
			: [data];

		const uniqueEmpNos = new Set<string>();
		dataList.forEach((item) => {
			uniqueEmpNos.add(item.emp_no);
		});
		const uniqueEmpNoList = Array.from(uniqueEmpNos);
		const employeeDataList = await this.employeeDataService.getLatestEmployeeDataByEmpNoList(uniqueEmpNoList);

		await Promise.all(
			uniqueEmpNoList.map(async (empNo) => {
				const emp = employeeDataList.find((e) => e.emp_no === empNo);
				if (!emp) {
					throw new Error(`Employee ${empNo} not found`);
				}
				employeeDataRecord[empNo] = emp;
			})
		);

		const resultList: (EmployeePaymentDecType &
			Pick<EmployeeDataDecType, K>)[] = dataList.map((d) => {
				const empNo = d.emp_no;
				const emp = employeeDataRecord[empNo];
				const result = { ...d } as EmployeePaymentDecType &
					Pick<EmployeeDataDecType, K>;
				if (emp) {
					keys.forEach((key) => {
						result[key] = emp[key] as any;
					});
				} else {
					throw new Error(`Employee ${empNo} not found`);
				}
				return result;
			});

		return resultList;
	}
}
