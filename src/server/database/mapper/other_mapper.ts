import { injectable } from "tsyringe";
import { type OtherFEType } from "~/server/api/types/other_type";
import { CalculateService } from "~/server/service/calculate_service";
import { EHRService } from "~/server/service/ehr_service";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";

@injectable()
export class OtherMapper {
	constructor(
		private readonly calculateService: CalculateService,
		private readonly ehrService: EHRService,
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeePaymentService: EmployeePaymentService,
	) { }

	async getOtherFE(
		period_id: number,
		emp_no_list: string[]
	): Promise<OtherFEType[]> {
		const expense_list = await this.ehrService.getExpenseByEmpNoList(
			period_id,
			emp_no_list
		);
		const emp_data_list = await this.employeeDataService.getCurrentEmployeeData(period_id);
		const employee_payment_list = await this.employeePaymentService.getCurrentEmployeePayment(period_id);
		const payset_list = await this.ehrService.getPaysetByEmpNoList(
			period_id,
			emp_no_list
		);
		const allowance_type_list = await this.ehrService.getAllowanceType();
		const expense_class_list = await this.ehrService.getExpenseClass();
		const g_i_deduction_family_id = expense_class_list.find(
			(ec) => ec.name === "團保代扣-眷屬"
		)?.id;
		const l_i_disability_reduction_id = allowance_type_list.find(
			(at) => at.name === "勞保殘障減免"
		)?.id;
		const h_i_subsidy_id = allowance_type_list.find(
			(at) => at.name === "健保補助"
		)?.id;
		const newOtherFE_list = await Promise.all(
			emp_no_list.map(async (emp_no) => {
				const employee_data = emp_data_list?.find(
					(e) => e.emp_no === emp_no
				);
				if (!employee_data) {
					return null;
				}
				const employee_payment = employee_payment_list.find((e) => e.emp_no === emp_no);
				if (!employee_payment) {
					console.log(emp_no, ": ", "employee_payment", employee_payment);	
				}
				const expense_list_by_emp_no = expense_list.filter((e) => e.emp_no === emp_no);
				const work_day =
					payset_list?.find((p) => p.emp_no === emp_no)?.work_day ??
					30;
				return {
					emp_no: emp_no,
					emp_name: employee_data!.emp_name,
					department: employee_data!.department,
					position: employee_data!.position,
					work_day: work_day,
					other_addition:
						await this.calculateService.getOtherAddition(
							expense_list_by_emp_no,
							allowance_type_list
						),
					other_addition_tax:
						await this.calculateService.getOtherAdditionTax(
							expense_list_by_emp_no,
							allowance_type_list
						),
					other_deduction:
						await this.calculateService.getOtherDeduction(
							expense_list_by_emp_no,
							expense_class_list
						),
					other_deduction_tax:
						await this.calculateService.getOtherDeductionTax(
							expense_list_by_emp_no,
							expense_class_list
						),
					dorm_deduction:
						await this.calculateService.getMealDeduction(
							expense_list_by_emp_no,
							expense_class_list
						),
					reissue_salary:
						await this.calculateService.getReissueSalary(
							expense_list_by_emp_no,
							expense_class_list
						),
					g_i_deduction_promotion:
						await this.calculateService.getGroupInsuranceDeductionPromotion(
							expense_list_by_emp_no,
							expense_class_list
						),
					g_i_deduction_family:
						expense_list_by_emp_no.findLast(
							(e) =>
								e.id === g_i_deduction_family_id &&
								e.kind === 1
						)?.amount ?? 0,
					income_tax_deduction:
						await this.calculateService.getIncomeTaxDeduction(
							expense_list_by_emp_no,
							expense_class_list
						),
					l_r_self: await this.calculateService.getLRSelf(
						employee_payment!
					),
					parking_fee: await this.calculateService.getParkingFee(
						expense_list_by_emp_no,
						expense_class_list
					),
					brokerage_fee: await this.calculateService.getBrokerageFee(
						expense_list_by_emp_no,
						expense_class_list
					),
					retirement_income:
						await this.calculateService.getRetirementIncome(
							expense_list_by_emp_no,
							expense_class_list
						),
					l_i_disability_reduction:
						expense_list_by_emp_no.findLast(
							(e) =>
								e.id === l_i_disability_reduction_id &&
								e.kind === 1
						)?.amount ?? 0,
					h_i_subsidy:
						expense_list_by_emp_no.findLast(
							(e) =>
								e.id === h_i_subsidy_id &&
								e.kind === 1
						)?.amount ?? 0,
				};
			})
		);
		return newOtherFE_list.filter((e) => e !== null);
	}
}
