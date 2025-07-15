import { injectable } from "tsyringe";
import { Transaction } from "../database/entity/SALARY/transaction";
import { TransactionService } from "./transaction_service";
import { PayTypeEnumType } from "../api/types/pay_type_enum";
import { convertToKey } from "../api/types/work_status_enum";
import { LevelRangeService } from "./level_range_service";
import { LevelService } from "./level_service";
import { TransactionDepartment, TransactionDepartmentType } from "../api/types/report_transaction_department_type";
import { TransactionIndividual, TransactionIndividualType } from "../api/types/report_transaction_individual_type";
import { SalaryOut, SalaryOutType } from "../api/types/report_salary_out_type";
import { HILevelRange, HILevelRangeType } from "../api/types/report_h_i_level_range_type";
import { LILevelRange, LILevelRangeType } from "../api/types/report_l_i_level_range_type";
import { LRLevelRange, LRLevelRangeType } from "../api/types/report_l_r_level_range_type";
import { HIDetailsOut, HIDetailsOutType } from "../api/types/report_h_i_details_out_range_type";
import { OIInsurance, OIInsuranceType } from "../api/types/report_o_i_insurance_type";
import { Round } from "./helper_function";
import { ReportTotal, ReportTotalType } from "../api/types/report_total_type";
import { ReportDepartmentTotal, ReportDepartmentTotalType } from "../api/types/report_department_total_type";
import { ReportAllTotal, ReportAllTotalType } from "../api/types/report_all_total_type";

@injectable()
export class ReportService {

    constructor(
        private readonly transactionService:  TransactionService,
        private readonly levelService:        LevelService,
        private readonly levelRangeService:   LevelRangeService
    ) { }

    async getTransaction(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<Transaction[]> {
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        return transactions;
    }

    async getTransactionIndividual(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<TransactionIndividualType[]> {
        const keyOfTransactionIndividual = TransactionIndividual.keyof().options;
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        return transactions.map(tx => {
            const data: TransactionIndividualType = keyOfTransactionIndividual.reduce((acc: any, key) => {
                if (Object.keys(TransactionIndividual.shape).includes(key)) {
                    if (Object.keys(tx.dataValues).includes(key)) {
                        acc[key] = tx.dataValues[key as keyof typeof tx.dataValues];
                    } else {
                        acc[key] = 0;
                    }
                }
                return acc;
            }, {} as TransactionIndividualType);
            return data;
        })
    }

    async getTransactionDepartment(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<TransactionDepartmentType[]> {
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        const departmentMap = new Map<string, TransactionDepartmentType>();

        const keyOfTransactionDepartment = TransactionDepartment.keyof().options;

        for (const tx of transactions) {
            let data: TransactionDepartmentType = keyOfTransactionDepartment.reduce((acc: any, key) => {
                if (Object.keys(tx.dataValues).includes(key) && Object.keys(TransactionDepartment.shape).includes(key)) {
                    acc[key] = tx.dataValues[key as keyof typeof tx.dataValues];
                } else if (Object.keys(TransactionDepartment.shape).includes(key)) {
                    acc[key] = 0;
                }
                return acc;
            }, {} as TransactionDepartmentType);

            const dept          = tx.department;
            const work_type     = tx.work_type;
            const work_status   = tx.work_status;
            const mapKey        = dept + work_type + work_status;

            if (!departmentMap.has(mapKey)) {
                departmentMap.set(mapKey, data);
            } else {
                const aggTx = departmentMap.get(mapKey)!;
                for (const key of keyOfTransactionDepartment) {
                    // console.log(`Processing key: ${key}, type: ${typeof (tx.dataValues as any)[key]}`);
                    // append 0 if key not in tx.dataValues
                    if (Object.keys(tx.dataValues as any).includes(key)) {
                        if (typeof (tx.dataValues as any)[key] === "number") {
                            (aggTx as any)[key] += (tx.dataValues as any)[key];
                        }
                    }
                    else {
                        (aggTx as any)[key] = -9487;
                    }
                }
            }
        }

        const combinedTransactions = Array.from(departmentMap.values()).sort((a, b) => {
            if (a.department > b.department) {
                return 1;
            } else if (a.department < b.department) {
                return -1;
            } else if (a.work_type > b.work_type) {
                return 1;
            } else if (a.work_type < b.work_type) {
                return -1;
            } else if (a.cost_category > b.cost_category) {
                return 1;
            } else if (a.cost_category < b.cost_category) {
                return -1;
            }
            return 0;
        });
        return combinedTransactions;
    }

    async getSalaryOut(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<SalaryOutType[]> {
        const keyOfSalaryOut = SalaryOut.keyof().options;
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        return transactions.map(tx => {
            const data: SalaryOutType = keyOfSalaryOut.reduce((acc: any, key) => {
                if (Object.keys(SalaryOut.shape).includes(key)) {
                    if (Object.keys(tx.dataValues).includes(key)) {
                        acc[key] = tx.dataValues[key as keyof typeof tx.dataValues];
                    } else {
                        acc[key] = "";      // ! 0627 Jerry: 台幣帳號戶名留空、輸出薪轉第一列不吃
                    }
                }
                return acc;
            }, {} as SalaryOutType);
            return data;
        })
    }

    // HILevelRange
    async getHILevelRange(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<HILevelRangeType[]> {
        const keyOfHILevelRange = HILevelRange.keyof().options;
        const transactions      = await this.transactionService.getTransaction(period_id, pay_type);
        const level             = await this.levelService.getCurrentLevel(period_id);
        const levelRange        = await this.levelRangeService.getCurrentLevelRange(period_id);

        const h_i_level_range = levelRange.find(d => d.type == "健保")
        const h_i_level_start = level.find(d => d.id == h_i_level_range?.level_start_id)
        const h_i_level_end   = level.find(d => d.id == h_i_level_range?.level_end_id)
        const h_i_level       = level.filter(d => d.level >= h_i_level_start!.level! && d.level <= h_i_level_end!.level!).map(d => d.level)
        h_i_level.push(0);
        h_i_level.sort((a, b) => a - b);
        
        // If only use existing data
        // const h_i_level = [...new Set(transactions.map(d => d.h_i))].sort((a, b) => a - b);
        
        return h_i_level.map(d => {
            const data: HILevelRangeType = keyOfHILevelRange.reduce((acc: any, key) => {
                const emp_h_i_data = transactions.filter(tx => tx.h_i == d);
                acc['insured_amount'] = d;
                acc['self']         = emp_h_i_data.length;
                acc['family']       = emp_h_i_data.map(tx => tx.healthcare_dependents).reduce((a, b) => a + b, 0);
                acc['self_total']   = emp_h_i_data.map(tx => tx.h_i_deduction).reduce((a, b) => a + b, 0);       // Sum(薪資查詢.健保扣除額) AS 個人應計
                acc['unit_total']   = emp_h_i_data.map(tx => tx.h_i_pay).reduce((a, b) => a + b, 0);       // Sum(薪資查詢.健保費) AS 單位應計
                return acc;
            }, {} as HILevelRangeType);
            return data;
        });
    }

    // LILevelRange
    async getLILevelRange(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<LILevelRangeType[]> {
        const keyOfLILevelRange = LILevelRange.keyof().options;
        const transactions      = await this.transactionService.getTransaction(period_id, pay_type);
        const level             = await this.levelService.getCurrentLevel(period_id);
        const levelRange        = await this.levelRangeService.getCurrentLevelRange(period_id);

        const l_i_level_range = levelRange.find(d => d.type == "勞保")
        const l_i_level_start = level.find(d => d.id == l_i_level_range?.level_start_id)
        const l_i_level_end   = level.find(d => d.id == l_i_level_range?.level_end_id)
        const l_i_level       = level.filter(d => d.level >= l_i_level_start!.level! && d.level <= l_i_level_end!.level!).map(d => d.level)
        l_i_level.push(0);
        l_i_level.sort((a, b) => a - b);
        
        return l_i_level.map(d => {
            const data: LILevelRangeType = keyOfLILevelRange.reduce((acc: any, key) => {
                const emp_l_i_data = transactions.filter(tx => tx.l_i == d);
                acc['insured_salary'] = d;
                acc['self_total'] = emp_l_i_data.map(tx => tx.l_i_deduction).reduce((a, b) => a + b, 0);       // Sum(薪資查詢.勞保扣除額) AS 個人應計
                acc['unit_total'] = emp_l_i_data.map(tx => tx.l_i_pay).reduce((a, b) => a + b, 0);       // Sum(薪資查詢.勞保費) AS 單位應計
                acc['billing_population'] = emp_l_i_data.length;
                return acc;
            }, {} as LILevelRangeType);
            return data;
        });
    }

    // LRLevelRange: // ! TOFIX
    async getLRLevelRange(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<LRLevelRangeType[]> {
        const keyOfLRLevelRange = LRLevelRange.keyof().options;
        const transactions      = await this.transactionService.getTransaction(period_id, pay_type);
        const level             = await this.levelService.getCurrentLevel(period_id);
        const levelRange        = await this.levelRangeService.getCurrentLevelRange(period_id);

        const l_r_level_range = levelRange.find(d => d.type == "勞退")
        const l_r_level_start = level.find(d => d.id == l_r_level_range?.level_start_id)
        const l_r_level_end   = level.find(d => d.id == l_r_level_range?.level_end_id)
        
        
        const l_r_level       = level.filter(d => d.level >= l_r_level_start!.level! && d.level <= l_r_level_end!.level!).map(d => d.level)
        l_r_level.push(0);
        l_r_level.sort((a, b) => a - b);
        
        return l_r_level.map(d => {
            const data: LRLevelRangeType = keyOfLRLevelRange.reduce((acc: any, key) => {
                const emp_l_r_data = transactions.filter(tx => tx.l_r == d);
                acc['l_r_level_range']  = d;
                acc['l_r_contribution'] = emp_l_r_data.map(tx => tx.l_r_contribution).reduce((a, b) => a + b, 0);       // Sum(薪資查詢.勞退金提撥) AS 勞退金提撥
                acc['l_r_headcount']    = emp_l_r_data.length;
                return acc;
            }, {} as LRLevelRangeType);
            return data;
        });
    }

    // ! TOFIX
    async getHIDetailsOut(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<HIDetailsOutType[]> {
        const keyOfHIDetailsOut = HIDetailsOut.keyof().options;
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        return transactions.map(tx => {
            const data: HIDetailsOutType = keyOfHIDetailsOut.reduce((acc: any, key) => {
                acc['department'] = tx.department;
                acc['emp_no'] = tx.emp_no;
                acc['emp_name'] = tx.emp_name;
                acc['identity_number'] = tx.license_id;
                acc['occupational_injury_insured_amount'] = tx.occupational_injury;  // 薪資查詢.職災 AS 職災投保金額
                acc['l_i_deduction'] = tx.l_i_deduction;
                acc['l_i_pay'] = tx.l_i_pay;
                acc['salary_advance'] = tx.salary_advance;
                acc['h_i_insured_amount'] = tx.h_i;      // 薪資查詢.健保 AS 健保投保金額
                acc['healthcare_dependents'] = tx.healthcare_dependents;
                acc['h_i_deduction'] = tx.h_i_deduction;
                acc['h_i_pay'] = tx.h_i_pay;
                acc['l_i_insured_amount'] = tx.l_i;      // 薪資查詢.勞保 AS 勞保投保金額, 
                acc['l_r_self'] = tx.l_r_self;
                acc['l_r_contribution'] = tx.l_r_contribution;
                acc['v_2_h_i'] = tx.v_2_h_i;
                acc['l_i_reduction'] = -9999;           // TODO
                acc['h_i_subsidy'] = -9999;             // TODO
                return acc;
            }, {} as HIDetailsOutType);
            return data;
        })
    }

    async getOccupationalInjuryInsurance(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<OIInsuranceType[]> {
        const keyOfOIInsurance = OIInsurance.keyof().options;
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);

        const salary_range_list = [...new Set(transactions.map(d => d.salary_range))].sort((a, b) => a - b);

        return salary_range_list.map(sr => {
            const data: OIInsuranceType = keyOfOIInsurance.reduce((acc: any, key) => {
                const emp_data = transactions.filter(tx => tx.salary_range == sr);
                const total_salary = emp_data.map(tx => tx.total_salary).reduce((a, b) => a + b, 0);
                const insured_total_salary = emp_data.map(tx => tx.occupational_injury).reduce((a, b) => a + b, 0);
                const multiplier_in = 0.00015;
                const multiplier_out = 0.001;
                acc['salary_range']     = sr;
                // (Sum(薪資查詢.薪資總額)) AS 薪資總額
                acc['total_salary']     = total_salary;       
                acc['people_number']    = emp_data.length;
                acc['insured_total_salary'] = insured_total_salary;       // Sum(薪資查詢.職災) AS 投保總薪資
                // Round(Sum(薪資查詢.職災)*0.00015,0) AS 團保職災_職災級距內
                acc['g_i_o_i_in_range'] = Round(insured_total_salary, 0) * multiplier_in;
                // Round(IIf(Sum(薪資查詢!薪資總額)-Sum(薪資查詢!職災)>0,(Sum(薪資查詢!薪資總額)-Sum(薪資查詢!職災))*0.001),0) AS 團保職災_職災級距外
                if (total_salary - insured_total_salary > 0) {
                    acc['g_i_o_i_out_range'] = Round((total_salary - insured_total_salary) * multiplier_out, 0);
                }
                else {
                    acc['g_i_o_i_out_range'] = 0;
                }
                return acc;
            }, {} as HIDetailsOutType);
            return data;
        })
    }

    async getTotal(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<ReportTotalType[]> {
        const keyOfReportTotal = ReportTotal.keyof().options;
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        
        const getSum = (transactions: Transaction[], key: keyof Transaction, wt: string) => 
            transactions.filter(tx => tx.work_type == wt).map(tx => tx[key]).reduce((a, b) => (a as number) + (b as number), 0);

        const all_work_types = [...new Set(transactions.map(d => d.work_type))].sort((a, b) => a.localeCompare(b));
        return all_work_types.map(wt => {
            const data: ReportTotalType = keyOfReportTotal.reduce((acc: any, key) => {
                const emp_data = transactions.filter(tx => tx.work_type == wt);
                const total_salary = emp_data.map(tx => tx.total_salary).reduce((a, b) => a + b, 0);

                const deadbeaf = -9487;

                // * decide order here
                acc['work_type'] = wt;
                acc['base_salary']                  = getSum(transactions, 'base_salary', wt);
                acc['professional_cert_allowance']  = getSum(transactions, 'professional_cert_allowance', wt);
                acc['supervisor_allowance']         = getSum(transactions, 'supervisor_allowance', wt);
                acc['long_service_allowance']       = getSum(transactions, 'long_service_allowance', wt);
                acc['food_allowance']               = getSum(transactions, 'food_allowance', wt);
                acc['l_i_deduction']                = getSum(transactions, 'l_i_deduction', wt);
                acc['h_i_deduction']                = getSum(transactions, 'h_i_deduction', wt);
                acc['welfare_contribution']         = getSum(transactions, 'welfare_contribution', wt);
                acc['subsidy_allowance']            = getSum(transactions, 'subsidy_allowance', wt);
                acc['weekday_overtime_pay']         = getSum(transactions, 'weekday_overtime_pay', wt);
                acc['vehicle_loan']                 = getSum(transactions, 'vehicle_loan', wt);
                acc['fixed_deposit_amount']         = deadbeaf; // getSum(transactions, 'fixed_deposit_amount', wt);
                acc['full_attendance_bonus']        = getSum(transactions, 'full_attendance_bonus', wt);
                acc['personal_leave']               = deadbeaf; // getSum(transactions, 'personal_leave', wt);
                acc['stock_loan']                   = deadbeaf; // getSum(transactions, 'stock_loan', wt);
                acc['sick_leave']                   = deadbeaf; // getSum(transactions, 'sick_leave', wt);
                // TODO: 假日加班費
                acc['night_fee']                    = deadbeaf; // getSum(transactions, 'night_fee', wt);
                acc['leave_deduction']              = getSum(transactions, 'leave_deduction', wt);
                // TODO: 超時加班
                acc['income_tax']                   = getSum(transactions, 'income_tax', wt);
                acc['bonus_tax']                    = getSum(transactions, 'bonus_tax', wt);
                acc['occupational_allowance']       = getSum(transactions, 'occupational_allowance', wt);
                acc['shift_allowance']              = getSum(transactions, 'shift_allowance', wt);
                acc['non_leave_compensation']        = getSum(transactions, 'non_leave_compensation', wt);
                acc['l_i_pay']                      = getSum(transactions, 'l_i_pay', wt);
                acc['h_i_pay']                      = getSum(transactions, 'h_i_pay', wt);
                acc['net_salary']                   = getSum(transactions, 'net_salary', wt);
                acc['operational_performance_bonus'] = getSum(transactions, 'operational_performance_bonus', wt);
                acc['performance_bonus']            = deadbeaf; // getSum(transactions, 'performance_bonus', wt);
                acc['year_end_bonus']               = deadbeaf; // getSum(transactions, 'year_end_bonus', wt);
                acc['other_deduction']              = getSum(transactions, 'other_deduction', wt);
                acc['other_addition']               = getSum(transactions, 'other_addition', wt);
                acc['meal_deduction']               = deadbeaf; // getSum(transactions, 'meal_deduction', wt);
                acc['other_addition_tax']           = getSum(transactions, 'other_addition_tax', wt);
                acc['other_deduction_tax']          = getSum(transactions, 'other_deduction_tax', wt);
                // TODO: 加班1
                // TODO: 加班2
                // TODO: 假日加班
                acc['reissue_salary']               = getSum(transactions, 'reissue_salary', wt);
                acc['group_insurance_deduction']    = getSum(transactions, 'group_insurance_deduction', wt);
                acc['g_i_deduction_promotion']      = getSum(transactions, 'g_i_deduction_promotion', wt);
                // TODO: 加班1_時數
                // TODO: 加班2_時數
                // TODO: 假日加班時數
                acc['income_tax_deduction']         = getSum(transactions, 'income_tax_deduction', wt);
                acc['l_r_self']                     = getSum(transactions, 'l_r_self', wt);
                acc['parking_fee']                  = getSum(transactions, 'parking_fee', wt);
                acc['brokerage_fee']                = getSum(transactions, 'brokerage_fee', wt);
                acc['salary_income_deduction']      = getSum(transactions, 'salary_income_deduction', wt);
                acc['retirement_income']            = getSum(transactions, 'retirement_income', wt);
                acc['v_2_h_i']                      = getSum(transactions, 'v_2_h_i', wt);
                acc['l_i_reduction']                = deadbeaf; // getSum(transactions, 'l_i_reduction', wt);
                acc['h_i_subsidy']                  = deadbeaf; // getSum(transactions, 'h_i_subsidy', wt);

                acc['emp_trust_reserve']            = getSum(transactions, 'emp_trust_reserve', wt);
                acc['emp_special_trust_incent']     = getSum(transactions, 'emp_special_trust_incent', wt);

                return acc;
            }, {} as ReportTotalType);
            return data;
        })
    }

    async getDepartmentTotal(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<ReportDepartmentTotalType[]> {
        const keyOfReportDepartmentTotal = ReportDepartmentTotal.keyof().options;
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        
        const getSum = (transactions: Transaction[], key: keyof Transaction, department: string, wt: string) => 
            transactions.filter(tx => tx.work_type == wt && tx.department == department).map(tx => tx[key]).reduce((a, b) => (a as number) + (b as number), 0) as number;


        const all_group_keys = [...new Set(transactions.map(d => d.department + "&" + d.work_type))].sort((a, b) => a.localeCompare(b));

        return all_group_keys.map(group_key => {
            const department = group_key.split("&")[0]!;
            const wt = group_key.split("&")[1]!;
            const data: ReportDepartmentTotalType = keyOfReportDepartmentTotal.reduce((acc: any, key) => {
                const emp_data = transactions.filter(tx => tx.work_type == wt && tx.department == department);
                const total_salary = emp_data.map(tx => tx.total_salary).reduce((a, b) => a + b, 0);
                const deadbeaf = -9487;
                
                acc['department']                       = department;
                acc['work_type']                        = wt;
                acc['cost_category']                    = emp_data![0]!.cost_category;
                acc['performance_bonus']                = deadbeaf;     // getSum(transactions, 'performance_bonus', department, wt);
                acc['operational_performance_bonus']    = getSum(transactions, 'operational_performance_bonus', department, wt);
                acc['base_salary']                      = getSum(transactions, 'base_salary', department, wt);
                acc['long_service_allowance']           = getSum(transactions, 'long_service_allowance', department, wt);
                acc['supervisor_allowance']             = getSum(transactions, 'supervisor_allowance', department, wt);
                acc['professional_cert_allowance']      = getSum(transactions, 'professional_cert_allowance', department, wt);
                acc['occupational_allowance']           = getSum(transactions, 'occupational_allowance', department, wt);
                acc['shift_allowance']                  = getSum(transactions, 'shift_allowance', department, wt);
                acc['night_fee']                        = deadbeaf;     // getSum(transactions, 'night_fee', department, wt);
                acc['full_attendance_bonus']            = getSum(transactions, 'full_attendance_bonus', department, wt);
                acc['exceed_overtime']                  = deadbeaf;     // getSum(transactions, 'exceed_overtime', department, wt);
                acc['project_bonus']                    = getSum(transactions, 'project_bonus', department, wt);
                acc['assessment_bonus']                 = deadbeaf;     // getSum(transactions, 'assessment_bonus', department, wt);
                acc['year_end_bonus']                   = deadbeaf;     // getSum(transactions, 'year_end_bonus', department, wt);
                acc['reissue_salary']                   = getSum(transactions, 'reissue_salary', department, wt);
                acc['addition_subtotal']                = getSum(transactions, 'addition_subtotal', department, wt);
                acc['taxable_subtotal']                 = getSum(transactions, 'taxable_subtotal', department, wt);
                acc['food_allowance']                   = getSum(transactions, 'food_allowance', department, wt);
                acc['weekday_overtime_pay']             = getSum(transactions, 'weekday_overtime_pay', department, wt);
                acc['holiday_overtime_pay']             = deadbeaf;     // getSum(transactions, 'holiday_overtime_pay', department, wt);
                acc['subsidy_allowance']                = getSum(transactions, 'subsidy_allowance', department, wt);
                acc['non_leave_compensation']           = getSum(transactions, 'non_leave_compensation', department, wt);
                acc['other_addition']                   = getSum(transactions, 'other_addition', department, wt);
                acc['other_addition_tax']               = getSum(transactions, 'other_addition_tax', department, wt);
                acc['other_deduction']                  = getSum(transactions, 'other_deduction', department, wt);
                acc['income_tax_deduction']             = getSum(transactions, 'income_tax_deduction', department, wt);
                acc['l_r_self']                         = getSum(transactions, 'l_r_self', department, wt);
                acc['parking_fee']                      = getSum(transactions, 'parking_fee', department, wt);
                acc['brokerage_fee']                    = getSum(transactions, 'brokerage_fee', department, wt);
                acc['non_taxable_subtotal']             = getSum(transactions, 'non_taxable_subtotal', department, wt);
                acc['l_i_deduction']                    = getSum(transactions, 'l_i_deduction', department, wt);
                acc['h_i_deduction']                    = getSum(transactions, 'h_i_deduction', department, wt);
                acc['income_tax']                       = getSum(transactions, 'income_tax', department, wt);
                acc['bonus_tax']                        = getSum(transactions, 'bonus_tax', department, wt);
                acc['welfare_contribution']             = getSum(transactions, 'welfare_contribution', department, wt);
                acc['l_i_pay']                          = getSum(transactions, 'l_i_pay', department, wt);
                acc['salary_advance']                   = getSum(transactions, 'salary_advance', department, wt);
                acc['h_i_pay']                          = getSum(transactions, 'h_i_pay', department, wt);
                acc['l_i_h_i_pay']                      = getSum(transactions, 'l_i_pay', department, wt) + getSum(transactions, 'h_i_pay', department, wt);    // (Sum(薪資查詢.勞保費)+Sum(薪資查詢.健保費)) AS 健保費之總合計
                acc['group_insurance_deduction']        = getSum(transactions, 'group_insurance_deduction', department, wt);
                acc['g_i_deduction_promotion']          = getSum(transactions, 'g_i_deduction_promotion', department, wt);
                acc['leave_deduction']                  = getSum(transactions, 'leave_deduction', department, wt);
                acc['special_personal_leave_deduct']    = getSum(transactions, 'special_personal_leave_deduct', department, wt);
                acc['meal_deduction']                   = deadbeaf;     // getSum(transactions, 'meal_deduction', department, wt);
                acc['other_deduction_tax']              = getSum(transactions, 'other_deduction_tax', department, wt);
                acc['vehicle_loan']                     = getSum(transactions, 'vehicle_loan', department, wt);
                acc['fixed_deposit_amount']             = deadbeaf;     // getSum(transactions, 'fixed_deposit_amount', department, wt);
                acc['stock_loan']                       = deadbeaf;     // getSum(transactions, 'stock_loan', department, wt);
                acc['deduction_subtotal']               = getSum(transactions, 'deduction_subtotal', department, wt);
                acc['net_salary']                       = getSum(transactions, 'net_salary', department, wt);
                acc['taxable_income']                   = getSum(transactions, 'taxable_income', department, wt);
                // special_personal_leave: z.number(),			// Round(Sum(薪資查詢.特別事假時數),2) AS 特別事假時數之總計, 
                acc['special_personal_leave']           = deadbeaf;     // getSum(transactions, 'special_personal_leave', department, wt);
                // personal_leave: z.number(),					// Round(Sum(薪資查詢.事假時數),2) AS 事假時數之總計, 
                acc['personal_leave']                   = deadbeaf;     // getSum(transactions, 'personal_leave', department, wt);
                // sick_leave: z.number(),						// Round(Sum(薪資查詢.病假時數),2) AS 病假時數之總計, 
                acc['sick_leave']                       = deadbeaf;     // getSum(transactions, 'sick_leave', department, wt);
                // hours_134: z.number(),						// Round(Sum(薪資查詢.加班1_時數),2) AS 加班1_時數之總計, 
                acc['hours_134']                        = deadbeaf;     // getSum(transactions, 'hours_134', department, wt);
                // hours_167: z.number(),						// Round(Sum(薪資查詢.加班2_時數),2) AS 加班2_時數之總計, 
                acc['hours_167']                        = deadbeaf;     // getSum(transactions, 'hours_167', department, wt);
                // hours_2: z.number(),
                acc['hours_2']                          = deadbeaf;     // getSum(transactions, 'hours_2', department, wt);
                // holiday_hours: z.number(),					// Round(Sum(薪資查詢.假日加班時數),2) AS 假日加班時數之總計, 
                acc['holiday_hours']                    = deadbeaf;     // getSum(transactions, 'holiday_hours', department, wt);
                // overtime_pay: z.number(),					// (Sum(薪資查詢.平日加班費)+Sum(薪資查詢.假日加班費)+Sum(薪資查詢.超時加班)) AS 加班費小計, 
                acc['overtime_pay']                     = deadbeaf;     // getSum(transactions, 'overtime_pay', department, wt);
                // year_award_contribution: z.number(),		// (Sum(薪資查詢.主管津貼)+Sum(薪資查詢.底薪)+Sum(薪資查詢.伙食津貼)+Sum(薪資查詢.補助津貼)+Sum(薪資查詢.職務津貼))*3/12 AS 年獎提撥, 
                acc['year_award_contribution']          = (getSum(transactions, 'base_salary', department, wt) + 
                                                          getSum(transactions, 'food_allowance', department, wt) + 
                                                          getSum(transactions, 'subsidy_allowance', department, wt) + 
                                                          getSum(transactions, 'occupational_allowance', department, wt)) * 3 / 12;
                acc['l_r_contribution']                 = getSum(transactions, 'l_r_contribution', department, wt);
                acc['salary_income_deduction']          = getSum(transactions, 'salary_income_deduction', department, wt);
                acc['retirement_income']                = getSum(transactions, 'retirement_income', department, wt);
                acc['v_2_h_i']                          = getSum(transactions, 'v_2_h_i', department, wt);
                acc['l_i_reduction']                    = deadbeaf;     // getSum(transactions, 'l_i_reduction', department, wt);
                acc['h_i_subsidy']                      = deadbeaf;     // getSum(transactions, 'h_i_subsidy', department, wt);
                acc['emp_trust_reserve_limit']          = deadbeaf;     // getSum(transactions, 'emp_trust_reserve_limit', department, wt);
                acc['emp_special_trust_incent']         = getSum(transactions, 'emp_special_trust_incent', department, wt);
                
                
                return acc;
            }, {} as ReportDepartmentTotalType);
            return data;
        })
    }


    async getAllTotal(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<ReportAllTotalType[]> {
        const keyOfReportAllTotal = ReportAllTotal.keyof().options;
        const deadbeaf = -9487;
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        
        const getSum = (transactions: Transaction[], key: keyof Transaction) => 
            transactions.map(tx => tx[key]).reduce((a, b) => (a as number) + (b as number), 0) as number;

        const acc = {
            'professional_cert_allowance':  getSum(transactions, 'professional_cert_allowance'),
            'supervisor_allowance':         getSum(transactions, 'supervisor_allowance'),
            'base_salary':                  getSum(transactions, 'base_salary'),
            'long_service_allowance':       getSum(transactions, 'long_service_allowance'),
            'food_allowance':               getSum(transactions, 'food_allowance'),
            'l_i_deduction':                getSum(transactions, 'l_i_deduction'),
            'h_i_deduction':                getSum(transactions, 'h_i_deduction'),
            'welfare_contribution':         getSum(transactions, 'welfare_contribution'),
            'subsidy_allowance':            getSum(transactions, 'subsidy_allowance'),
            'weekday_overtime_pay':         getSum(transactions, 'weekday_overtime_pay'),
            'vehicle_loan':                 getSum(transactions, 'vehicle_loan'),
            'fixed_deposit_amount':         deadbeaf,     // getSum(transactions, 'fixed_deposit_amount'),
            'full_attendance_bonus':        getSum(transactions, 'full_attendance_bonus'),
            'stock_loan':                   deadbeaf,     // getSum(transactions, 'stock_loan'),
            'holiday_overtime_pay':         deadbeaf,     // getSum(transactions, 'holiday_overtime_pay'),
            'night_fee':                    deadbeaf,     // getSum(transactions, 'night_fee'),
            'leave_deduction':              getSum(transactions, 'leave_deduction'),
            'exceed_overtime':              deadbeaf,     // getSum(transactions, 'exceed_overtime'),
            'income_tax':                   getSum(transactions, 'income_tax'),
            'bonus_tax':                    getSum(transactions, 'bonus_tax'),
            'occupational_allowance':       getSum(transactions, 'occupational_allowance'),
            'shift_allowance':              getSum(transactions, 'shift_allowance'),
            'non_leave_compensation':       getSum(transactions, 'non_leave_compensation'),
            'l_i_pay':                      getSum(transactions, 'l_i_pay'),
            'h_i_pay':                      getSum(transactions, 'h_i_pay'),
            'net_salary':                   getSum(transactions, 'net_salary'),
            'performance_bonus':            deadbeaf,     // getSum(transactions, 'performance_bonus'),
            'operational_performance_bonus':getSum(transactions, 'operational_performance_bonus'),
            'year_end_bonus':               deadbeaf,     // getSum(transactions, 'year_end_bonus'),
            'other_deduction':              getSum(transactions, 'other_deduction'),
            'other_addition':               getSum(transactions, 'other_addition'),
            'meal_deduction':               deadbeaf,     // getSum(transactions, 'meal_deduction'),
            'other_addition_tax':           getSum(transactions, 'other_addition_tax'),
            'other_deduction_tax':          getSum(transactions, 'other_deduction_tax'),
            'reissue_salary':               getSum(transactions, 'reissue_salary'),
            'group_insurance_deduction':    getSum(transactions, 'group_insurance_deduction'),
            'g_i_deduction_promotion':      getSum(transactions, 'g_i_deduction_promotion'),    
            'income_tax_deduction':         getSum(transactions, 'income_tax_deduction'),
            'l_r_self':                     getSum(transactions, 'l_r_self'),   
            'parking_fee':                  getSum(transactions, 'parking_fee'),
            'brokerage_fee':                getSum(transactions, 'brokerage_fee'),
            'salary_income_deduction':      getSum(transactions, 'salary_income_deduction'),
            'retirement_income':            getSum(transactions, 'retirement_income'),
            'v_2_h_i':                      getSum(transactions, 'v_2_h_i'),
            'l_i_reduction':                deadbeaf,     // getSum(transactions, 'l_i_reduction'),
            'h_i_subsidy':                  deadbeaf,     // getSum(transactions, 'h_i_subsidy'),
            'emp_trust_reserve_limit':      deadbeaf,     // getSum(transactions, 'emp_trust_reserve_limit'),
            'emp_special_trust_incent':     getSum(transactions, 'emp_special_trust_incent'),
        };

        return [acc]
    }
}
