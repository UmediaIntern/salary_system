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
                        (aggTx as any)[key] = 0;
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

    // HILevelRange: // ! TOFIX
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
        
        return h_i_level.map(d => {
            const data: HILevelRangeType = keyOfHILevelRange.reduce((acc: any, key) => {
                const emp_h_i_data = transactions.filter(tx => tx.h_i == d);
                acc['insured_amount'] = d;
                acc['self'] = emp_h_i_data.length;
                acc['family'] = emp_h_i_data.map(tx => tx.healthcare_dependents).reduce((a, b) => a + b, 0);
                acc['self_total'] = -999;       // TODO
                acc['unit_total'] = -999;       // TODO
                return acc;
            }, {} as HILevelRangeType);
            return data;
        });
    }

    // LILevelRange: // ! TOFIX
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
                acc['self_total'] = -999;       // TODO
                acc['unit_total'] = -999;       // TODO
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
                acc['l_r_contribution'] = -999;       // TODO
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
                acc['occupational_injury_insured_amount'] = -9999;  // TODO
                acc['l_i_deduction'] = tx.l_i_deduction;
                acc['l_i_pay'] = tx.l_i_pay;
                acc['salary_advance'] = tx.salary_advance;
                acc['h_i_insured_amount'] = -9999;      // TODO
                acc['healthcare_dependents'] = tx.healthcare_dependents;
                acc['h_i_deduction'] = tx.h_i_deduction;
                acc['h_i_pay'] = tx.h_i_pay;
                acc['l_i_insured_amount'] = -9999;      // TODO
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
}
