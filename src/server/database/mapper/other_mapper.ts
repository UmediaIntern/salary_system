import { injectable } from "tsyringe";
import { type OtherFEType } from "~/server/api/types/other_type";
import { CalculateService } from "~/server/service/calculate_service";
import { EHRService } from "~/server/service/ehr_service";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { SyncService } from "~/server/service/sync_service";

@injectable()
export class OtherMapper {
	constructor(
		private readonly calculateService: CalculateService,
		private readonly ehrService: EHRService,
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeePaymentService: EmployeePaymentService,
		private readonly syncService: SyncService
	) {}
	async getOtherFE(
		period_id: number,
		emp_no_list: string[]
	): Promise<OtherFEType[]> {
		const previous_period_id = await this.ehrService.getPreviousPeriodId(
			period_id
		);
		const [allowance_type_list, expense_class_list] = await Promise.all([
			this.ehrService.getAllowanceType(),
			this.ehrService.getExpenseClass(),
		]);

		const g_i_deduction_family_id = expense_class_list.find(
			(ec) => ec.name === "團保代扣-眷屬"
		)?.id;
		const l_i_disability_reduction_id = allowance_type_list.find(
			(at) => at.name === "勞保殘障減免"
		)?.id;
		const h_i_subsidy_id = allowance_type_list.find(
			(at) => at.name === "健保補助"
		)?.id;

		const [expense_list, previous_expense_list] = await Promise.all([
			this.ehrService.getExpenseByEmpNoList(period_id, emp_no_list),
			this.ehrService.getExpenseByEmpNoList(
				previous_period_id,
				emp_no_list
			),
		]);

		const [
			emp_data_list,
			previous_emp_data_list,
			employee_payment_list,
			previous_employee_payment_list,
		] = await Promise.all([
			this.employeeDataService.getCurrentEmployeeData(period_id),
			this.employeeDataService.getCurrentEmployeeData(previous_period_id),
			this.employeePaymentService.getCurrentEmployeePayment(period_id),
			this.employeePaymentService.getCurrentEmployeePayment(
				previous_period_id
			),
		]);

		const payset_list = await this.ehrService.getPaysetByEmpNoList(
			period_id,
			emp_no_list
		);
		const previous_payset_list = await this.ehrService.getPaysetByEmpNoList(
			previous_period_id,
			emp_no_list
		);

		const newOtherFE_list = await Promise.all(
			emp_no_list.map(async (emp_no) => {
				const employee_data = emp_data_list.find(
					(e) => e.emp_no === emp_no
				);
				if (!employee_data) return null;
				const previous_employee_data = previous_emp_data_list.find(
					(e) => e.emp_no === emp_no
				);
				const employee_payment = employee_payment_list.find(
					(e) => e.emp_no === emp_no
				);
				const previous_employee_payment =
					previous_employee_payment_list.find(
						(e) => e.emp_no === emp_no
					);

				const expenses = expense_list.filter(
					(e) => e.emp_no === emp_no
				);
				const prev_expenses = previous_expense_list.filter(
					(e) => e.emp_no === emp_no
				);
				const work_day =
					payset_list.find((p) => p.emp_no === emp_no)?.work_day ??
					30;
				const previous_work_day =
					previous_payset_list.find((p) => p.emp_no === emp_no)
						?.work_day ?? 30;

				const getAmt = (id: number | undefined, list: any[]) =>
					list.findLast((e) => e.id === id && e.kind === 1)?.amount ??
					0;

				// 本期數值計算
				const [
					other_add,
					other_add_tax,
					other_ded,
					other_ded_tax,
					dorm_ded,
					reissue,
					promo,
					tax_ded,
					lrs,
					park,
					broker,
					retire,
				] = await Promise.all([
					this.calculateService.getOtherAddition(
						expenses,
						allowance_type_list
					),
					this.calculateService.getOtherAdditionTax(
						expenses,
						allowance_type_list
					),
					this.calculateService.getOtherDeduction(
						expenses,
						expense_class_list
					),
					this.calculateService.getOtherDeductionTax(
						expenses,
						expense_class_list
					),
					this.calculateService.getMealDeduction(
						expenses,
						expense_class_list
					),
					this.calculateService.getReissueSalary(
						expenses,
						expense_class_list
					),
					this.calculateService.getGroupInsuranceDeductionPromotion(
						expenses,
						expense_class_list
					),
					this.calculateService.getIncomeTaxDeduction(
						expenses,
						expense_class_list
					),
					this.calculateService.getLRSelf(employee_payment!),
					this.calculateService.getParkingFee(
						expenses,
						expense_class_list
					),
					this.calculateService.getBrokerageFee(
						expenses,
						expense_class_list
					),
					this.calculateService.getRetirementIncome(
						expenses,
						expense_class_list
					),
				]);
				const g_i_family = getAmt(g_i_deduction_family_id, expenses);
				const l_i_reduction = getAmt(
					l_i_disability_reduction_id,
					expenses
				);
				const h_i_subsidy = getAmt(h_i_subsidy_id, expenses);

				// 上一期數值計算
				const [
					prev_add,
					prev_add_tax,
					prev_ded,
					prev_ded_tax,
					prev_dorm,
					prev_reissue,
					prev_promo,
					prev_tax_ded,
					prev_lrs,
					prev_park,
					prev_broker,
					prev_retire,
				] = await Promise.all([
					this.calculateService.getOtherAddition(
						prev_expenses,
						allowance_type_list
					),
					this.calculateService.getOtherAdditionTax(
						prev_expenses,
						allowance_type_list
					),
					this.calculateService.getOtherDeduction(
						prev_expenses,
						expense_class_list
					),
					this.calculateService.getOtherDeductionTax(
						prev_expenses,
						expense_class_list
					),
					this.calculateService.getMealDeduction(
						prev_expenses,
						expense_class_list
					),
					this.calculateService.getReissueSalary(
						prev_expenses,
						expense_class_list
					),
					this.calculateService.getGroupInsuranceDeductionPromotion(
						prev_expenses,
						expense_class_list
					),
					this.calculateService.getIncomeTaxDeduction(
						prev_expenses,
						expense_class_list
					),
					previous_employee_payment
						? this.calculateService.getLRSelf(
								previous_employee_payment!
						  )
						: 0,
					this.calculateService.getParkingFee(
						prev_expenses,
						expense_class_list
					),
					this.calculateService.getBrokerageFee(
						prev_expenses,
						expense_class_list
					),
					this.calculateService.getRetirementIncome(
						prev_expenses,
						expense_class_list
					),
				]);
				const prev_g_i_family = getAmt(
					g_i_deduction_family_id,
					prev_expenses
				);
				const prev_l_i_reduction = getAmt(
					l_i_disability_reduction_id,
					prev_expenses
				);
				const prev_h_i_subsidy = getAmt(h_i_subsidy_id, prev_expenses);

				// 比較差異
				const difference: string[] = [];
				const comparePairs: [string, any, any][] = [
					[
						"emp_name",
						employee_data.emp_name,
						previous_employee_data?.emp_name,
					],
					[
						"department",
						employee_data.department,
						previous_employee_data?.department,
					],
					[
						"position",
						employee_data.position,
						previous_employee_data?.position,
					],
					["work_day", work_day, previous_work_day],
					["other_addition", other_add, prev_add],
					["other_addition_tax", other_add_tax, prev_add_tax],
					["other_deduction", other_ded, prev_ded],
					["other_deduction_tax", other_ded_tax, prev_ded_tax],
					["dorm_deduction", dorm_ded, prev_dorm],
					["reissue_salary", reissue, prev_reissue],
					["g_i_deduction_promotion", promo, prev_promo],
					["g_i_deduction_family", g_i_family, prev_g_i_family],
					["income_tax_deduction", tax_ded, prev_tax_ded],
					["l_r_self", lrs, prev_lrs],
					["parking_fee", park, prev_park],
					["brokerage_fee", broker, prev_broker],
					["retirement_income", retire, prev_retire],
					[
						"l_i_disability_reduction",
						l_i_reduction,
						prev_l_i_reduction,
					],
					["h_i_subsidy", h_i_subsidy, prev_h_i_subsidy],
				];
				for (const [key, curr, prev] of comparePairs) {
					if (curr !== prev) difference.push(key);
				}

				return {
					emp_no,
					emp_name: employee_data.emp_name,
					department: employee_data.department,
					position: employee_data.position,
					work_day,
					other_addition: other_add,
					other_addition_tax: other_add_tax,
					other_deduction: other_ded,
					other_deduction_tax: other_ded_tax,
					dorm_deduction: dorm_ded,
					reissue_salary: reissue,
					g_i_deduction_promotion: promo,
					g_i_deduction_family: g_i_family,
					income_tax_deduction: tax_ded,
					l_r_self: lrs,
					parking_fee: park,
					brokerage_fee: broker,
					retirement_income: retire,
					l_i_disability_reduction: l_i_reduction,
					h_i_subsidy: h_i_subsidy,
					difference,
				};
			})
		);

		return newOtherFE_list.filter(
			(e): e is NonNullable<typeof e> => e !== null
		);
	}
}
