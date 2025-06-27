import { injectable } from "tsyringe";
import { Transaction } from "../database/entity/SALARY/transaction";
import { TransactionService } from "./transaction_service";
import { PayTypeEnumType } from "../api/types/pay_type_enum";
import { convertToKey } from "../api/types/work_status_enum";
import { TransactionDepartment, TransactionDepartmentType } from "../api/types/report_transaction_department_type";
import { TransactionIndividual, TransactionIndividualType } from "../api/types/report_transaction_individual_type";

@injectable()
export class ReportService {

    constructor(
        private readonly transactionService: TransactionService,
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
                    console.log(`Processing key: ${key}, type: ${typeof (tx.dataValues as any)[key]}`);
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
}
