import { delay, inject, injectable } from "tsyringe";
import { type z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import {
	type updateEmployeeTrustAPI,
	updateEmployeeTrustService,
	employeeTrustFE,
} from "~/server/api/types/employee_trust_type";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { CryptoHelper } from "~/lib/utils/crypto";
import { TrustMoneyService } from "~/server/service/trust_money_service";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import {
	type EmployeeTrust,
	type EmployeeTrustDecType,
	decEmployeeTrust,
	encEmployeeTrust,
} from "../entity/SALARY/employee_trust";
import { BaseMapper } from "./base_mapper";

type EmployeeTrustServiceType = EmployeeTrustService;

@injectable()
export class EmployeeTrustMapper extends BaseMapper<
	EmployeeTrust,
	EmployeeTrustDecType,
	typeof encEmployeeTrust,
	typeof decEmployeeTrust
> {
	constructor(
		private readonly employeeDataService: EmployeeDataService,
		private readonly trustMoneyService: TrustMoneyService,
		@inject(delay(() => EmployeeTrustService))
		private readonly employeeTrustService: EmployeeTrustServiceType
	) {
		super("Employee Trust Mapper", encEmployeeTrust, decEmployeeTrust);
	}

	async getEmployeeTrustFE(
		employee_trust_list: EmployeeTrustDecType[]
	): Promise<z.infer<typeof employeeTrustFE>[]> {
		const emp_first = employee_trust_list[0];
		if (!emp_first) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		const employee =
			await this.employeeDataService.getLatestEmployeeDataByEmpNo(
				emp_first.emp_no
			);

		if (employee == null) {
			throw new Error(
				`Employee does not exist, emp_no: ${emp_first.emp_no}`
			);
		}

		const trust_money_list = (
			await this.trustMoneyService.getAllTrustMoney()
		).flat();

		// Sort by start date chronologically
		const sorted_employee_trust_list = employee_trust_list.sort(
			(a, b) => a.start_date.getTime() - b.start_date.getTime()
		);
		const start_dates: Date[] = sorted_employee_trust_list.map(
			(d) => d.start_date
		);

		// TODO: don't assert
		const first_start_date = start_dates[0];
		const last_employee_trust = employee_trust_list.at(-1);
		if (!first_start_date || !last_employee_trust) {
			throw new Error("Employee trust records do not exist");
		}
		const last_end_date: Date | null = last_employee_trust.end_date;

		trust_money_list.forEach((trust_money) => {
			const trust_money_start_date = trust_money.start_date;
			if (
				trust_money_start_date > first_start_date &&
				(last_end_date == null ||
					trust_money_start_date <= last_end_date) &&
				!start_dates
					.map((d) => d.getTime())
					.includes(trust_money_start_date.getTime())
			) {
				start_dates.push(trust_money_start_date);
			}
		});
		const sorted_start_dates = start_dates.sort(
			(a, b) => a.getTime() - b.getTime()
		);

		const p_process_FE_employee_trust = sorted_start_dates.map(
			async (start_date, idx) => {
				const employee_trust =
					await this.employeeTrustService.getCurrentEmployeeTrustByEmpNoByDate(
						emp_first.emp_no,
						start_date
					);

				let emp_trust_reserve = 0;
				let org_trust_reserve = 0;
				let emp_special_trust_incent = 0;
				let org_special_trust_incent = 0;

				if (
					employee_trust.start_date.getTime() !==
					new Date("1970-01-01").getTime()
				) {
					const trust_money =
						await this.trustMoneyService.getCurrentTrustMoneyByPositionByDate(
							employee.position,
							employee.position_type,
							start_date
						);
					emp_trust_reserve = employee_trust.emp_trust_reserve;
					org_trust_reserve = Math.min(
						trust_money.org_trust_reserve_limit,
						employee_trust.emp_trust_reserve
					);
					emp_special_trust_incent =
						employee_trust.emp_special_trust_incent;
					org_special_trust_incent = Math.min(
						trust_money.org_special_trust_incent_limit,
						employee_trust.emp_special_trust_incent
					);
				}

				const employeeTrust: z.infer<typeof employeeTrustFE> = {
					...employee_trust,
					id: idx,
					emp_no: employee.emp_no,
					emp_name: employee.emp_name,
					position: employee.position,
					position_type: employee.position_type,
					department: employee.department,

					emp_trust_reserve: emp_trust_reserve,
					org_trust_reserve: org_trust_reserve,
					emp_special_trust_incent: emp_special_trust_incent,
					org_special_trust_incent: org_special_trust_incent,

					start_date: start_date,
					end_date: sorted_start_dates[idx + 1]
						? new Date(
								new Date(sorted_start_dates[idx + 1]!).setDate(
									new Date(
										sorted_start_dates[idx + 1]!
									).getDate() - 1
								)
						  )
						: last_end_date,
					functions: {
						creatable: true,
						updatable: false,
						deletable: false,
					},
				};

				const result = employeeTrustFE.safeParse(employeeTrust);
				if (!result.success) {
					throw new Error(
						"Parse employee trust failed in EmployeeTrustMapper: " +
							result.error.message
					);
				}
				return result.data;
			}
		);

		const employee_trust_FE_list = await Promise.all(
			p_process_FE_employee_trust
		);

		const reduced: z.infer<typeof employeeTrustFE>[] = [];
		const merged_employee_trust_FE_list = employee_trust_FE_list.reduce(
			(acc, cur) => {
				if (acc.length == 0) {
					acc.push(cur);
					return acc;
				}
				const prev = acc.at(-1)!;
				if (
					prev.emp_no == cur.emp_no &&
					prev.emp_trust_reserve == cur.emp_trust_reserve &&
					prev.emp_special_trust_incent ==
						cur.emp_special_trust_incent &&
					prev.org_trust_reserve == cur.org_trust_reserve &&
					prev.org_special_trust_incent ==
						cur.org_special_trust_incent
				) {
					prev.end_date = cur.end_date;
					return acc;
				} else {
					acc.push(cur);
					return acc;
				}
			},
			reduced
		);
		return merged_employee_trust_FE_list;
	}

	async getEmployeeTrustNullable(
		employee_trust: z.infer<typeof updateEmployeeTrustAPI>
	): Promise<z.infer<typeof updateEmployeeTrustService>> {
		const employeeTrust: z.infer<typeof updateEmployeeTrustService> =
			updateEmployeeTrustService.parse(
				// convertDatePropertiesToISOString(
				{
					emp_trust_reserve_enc:
						employee_trust.emp_trust_reserve != undefined
							? CryptoHelper.encrypt(
									employee_trust.emp_trust_reserve.toString()
							  )
							: undefined,
					emp_special_trust_incent_enc:
						employee_trust.emp_special_trust_incent != undefined
							? CryptoHelper.encrypt(
									employee_trust.emp_special_trust_incent.toString()
							  )
							: undefined,
					...employee_trust,
				}
				// )
			);

		return employeeTrust;
	}
}
