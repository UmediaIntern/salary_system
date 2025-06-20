import { EmployeeData } from "~/server/database/entity/SALARY/employee_data"
import { EmployeePayment, EmployeePaymentDecType } from "~/server/database/entity/SALARY/employee_payment"
import { EmployeeTrust, EmployeeTrustDecType } from "~/server/database/entity/SALARY/employee_trust"
import { Allowance } from "~/server/database/entity/UMEDIA/allowance"
import { Bonus } from "~/server/database/entity/UMEDIA/bonus"
import { Payset } from "~/server/database/entity/UMEDIA/payset"
import { EmployeeDataDecType } from "~/server/database/entity/SALARY/employee_data";
import { Overtime } from "~/server/database/entity/UMEDIA/overtime"
import { Holiday } from "~/server/database/entity/UMEDIA/holiday"
import { Expense } from "~/server/database/entity/UMEDIA/expense"

export function getEmployeeDataList(data: any) {
    const employeeDataList = data.map((d: any, index: number) => {
        const employee_data: EmployeeDataDecType = {
            id: index,
            period_id: d.period_id,
            emp_no: d.emp_no,
            emp_name: d.emp_name,
            position: d.position,
            position_type: d.position_type,
            group_insurance_type: d.group_insurance_type,
            department: d.department,
            cost_category: d.cost_category,
            work_type: d.work_type,
            work_status: d.work_status,
            disabilty_level: d.disabilty_level,
            sex_type: d.sex_type,
            dependents: d.dependents,
            healthcare_dependents: d.healthcare_dependents,
            residence_permit_start_date: d.residence_permit_start_date,
            residence_permit_end_date: d.residence_permit_end_date,
            registration_date: d.registration_date,
            quit_date: d.quit_date,
            license_id: d.license_id,
            bank_account_taiwan: d.bank_account_taiwan,
            received_elderly_benefits: d.received_elderly_benefits,

            create_date: new Date(),
            create_by: "system",
            update_date: new Date(),
            update_by: "system",
        }

        return employee_data;
    })
    return employeeDataList;
}

export function getEmployeePaymentList(data: any) {
    const employeePaymentList = data.map((d: any, index: number) => {
        const employee_payment: EmployeePaymentDecType = {
            id: index,
            emp_no: d.emp_no,
            base_salary: d.base_salary,
            food_allowance: d.food_allowance,
            supervisor_allowance: d.supervisor_allowance,
            occupational_allowance: d.occupational_allowance,
            subsidy_allowance: d.subsidy_allowance,
            long_service_allowance: d.long_service_allowance,
            long_service_allowance_type: d.long_service_allowance_type, 
            // "month_allowance": "月領", 
            // "one_year_allowance": "一年領", 
            // "two_year_allowance": "二年領"
            l_r_self_ratio: d.l_r_self_ratio,
            l_i: d.l_i,
            h_i: d.h_i,
            l_r: d.l_r,
            occupational_injury: d.occupational_injury,
            bank_account_foreign: d.bank_account_foreign ?? null,

            create_by: "system",
            update_by: "system",
            start_date: new Date(777),
            end_date: null,
            create_date: new Date(),
            update_date: new Date(),
            disabled: false
        }
        return employee_payment;
    })
    return employeePaymentList
}

export function getEmployeeTrustList(data: any) {
    const employeeTrustList = data.map((d: any, index: number) => {
        const employee_trust: EmployeeTrustDecType = {
            id: index,
            emp_no: d.emp_no,
            emp_trust_reserve: d.emp_trust_reserve,
            emp_special_trust_incent: d.emp_special_trust_incent,

            create_by: "system",
            update_by: "system",
            start_date: new Date(777),
            end_date: null,
            create_date: new Date(),
            update_date: new Date(),
            disabled: false
        }
        return employee_trust
    });
    return employeeTrustList;
}


export function getAllowanceList(data: any) {
    return data.map((d: any) => {
        return new Allowance(
            d.period_id,  // Added missing period_id
            d.emp_no,
            d.emp_name,
            d.allowance_id,
            d.amount,
            d.note,
            "system",
            new Date(),
            "system",
            new Date(),
            d.pay_delay
        );
    }) ?? []
}


export function getBonusList(data: any) {
    return data.map((d: any) => {
        /*
            period_id: number;
            emp_no: string;
            emp_name: string;
            bonus_id: number;
            amount: number;
            pay: number;
            remark: string | null;
        */
        return new Bonus(
            d.period_id,  // Added missing period_id
            d.emp_no,
            d.emp_name,
            d.bonus_id,
            d.amount,
            d.pay,
            d.note,
        );
    }) ?? []
}


export function getPaysetList(data: any) {
    return data.map((d: any) => {
        /*
            period_id: number;
            period_name: string;
            status: string;
            nid: number;
            emp_no: string;
            name: string;
            country_id: number;
            pay_type: number;
            pay_set: number;
            pay_delay: number;
            work_day: number;
            li_day: number;
            delay_count: number;
        */
        return new Payset(
            d.period_id,  
            "period_name",
            "status",
            0,              // d.nid
            d.emp_no,
            d.emp_name,
            0,              // d.country_id
            d.pay_type,
            0,              // d.pay_set
            0,              // d.pay_delay
            d.payset,
            d.l_i_day,
            0,              // d.delay_count
        );
    }) ?? []
}


export function getOvertimeList(data: any) {
    return data.map((d: any) => {
        
        return new Overtime(
            d.period_id,  
            "period_name",
            d.emp_no,
            d.emp_name,
            1,              //1：5日 2：15日
            0,              // d.type_id
            "days_radio",   // d.days_radio
            "type_name",    // d.type_name
            null,           // d.pay_period
            null,           // d.delay              
            d.hours_1,
            d.hours_134,
            d.hours_167,
            d.hours_267,
            d.hours_2,
            d.hours_134_TAX,
            d.hours_167_TAX,
            d.hours_267_TAX,
            d.hours_2_TAX         
        );
    }) ?? []
}


export function getHolidayList(data: any) {
    return data.map((d: any) => {
        
        return new Holiday(
            d.period_id,  
            "period_name",
            d.emp_no,
            d.emp_name,
            1,                      // d.pay_order
            null,                   // d.pay_period
            null,                   // d.pay_delay
            d.total_hours,
            0,      // d.annual_1,
            0,      // d.compensatory_134,
            0,      // d.compensatory_167,
            0,      // d.compensatory_267,
            0,      // d.compensatory_1,
            0,      // d.compensatory_2
        );
    }) ?? []
}


export function getExpenseList(data: any) {
    return data.map((d: any, index: number) => {
        
        return new Expense(
            d.period_id,  
            d.kind,                 // d.kind
            d.emp_no,
            d.emp_name,
            index,                  
            d.amount,
            d.note,
            
            "system",
            new Date(),
            "system",
            new Date(),
            null,                   // d.pay_delay

        );
    }) ?? []
}