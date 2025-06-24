import { injectable } from "tsyringe";
import { Transaction } from "../database/entity/SALARY/transaction";
import { TransactionService } from "./transaction_service";
import { PayTypeEnumType } from "../api/types/pay_type_enum";
import { convertToKey } from "../api/types/work_status_enum";

@injectable()
export class ReportService {

    constructor(
        private readonly transactionService: TransactionService,
    ) { }

    async getTransactionIndividual(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<Transaction[]> {
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        return transactions;
    }

    async getTransactionDepartment(
        period_id: number,
        pay_type: PayTypeEnumType,
    ): Promise<Transaction[]> {
        const transactions = await this.transactionService.getTransaction(period_id, pay_type);
        const departmentMap = new Map<string, Transaction>();

        for (const tx of transactions) {
            const dept = tx.department;
            if (!departmentMap.has(dept)) {
                departmentMap.set(dept, tx);
            } else {
                const aggTx = departmentMap.get(dept)!;
                for (const key of Object.keys(tx.dataValues)) {
                    console.log(`Processing key: ${key}, type: ${typeof (tx.dataValues as any)[key]}`);
                    if (typeof (tx.dataValues as any)[key] === "number" && key !== "id") {
                        (aggTx.dataValues as any)[key] += (tx.dataValues as any)[key];
                    }
                }
            }
        }

        const combinedTransactions = Array.from(departmentMap.values());
        return combinedTransactions;
    }
}
