import { injectable } from "tsyringe";
import { z } from "zod";
import { validateBase, validateEmployeePayment, validateEmployeeTrust } from "../api/types/validate_type";
import { EmployeeDataService } from "./employee_data_service";
import { BaseResponseError } from "../errors/base_response_error";

@injectable()
export class ValidateService {
    constructor(
        private readonly employeeDataService: EmployeeDataService
    ) { }

    async validateBase({ start_date, end_date }: z.infer<typeof validateBase>) {
        // if (start_date != null && start_date < new Date()) {
        //     throw new BaseResponseError("Start date is earlier than current date");
        // }
        if (end_date != null && end_date < (start_date ?? new Date())) {
            throw new BaseResponseError("End date is earlier than start date");
        }
    }

    async validateEmployeeTrust({ emp_no, start_date, end_date }: z.infer<typeof validateEmployeeTrust>) {
        await this.validateBase({ start_date, end_date });
        const quit_date = (await this.employeeDataService.getLatestEmployeeDataByEmpNo(emp_no)).quit_date;
        if (quit_date) {
            throw new Error("Employee has quit");
        }
    }

    async validateEmployeePayment({ emp_no, start_date, end_date }: z.infer<typeof validateEmployeePayment>) {
        await this.validateBase({ start_date, end_date });
        const quit_date = (await this.employeeDataService.getLatestEmployeeDataByEmpNo(emp_no)).quit_date;
        if (quit_date) {
            throw new Error("Employee has quit");
        }
    }
}
