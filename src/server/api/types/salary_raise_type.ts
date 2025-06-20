import { z } from "zod";
import { dateAll, dateCreate, empData, Id } from "./common_type";
import { optionalNumDefaultZero } from "./z_utils";

const salaryRaiseBase = z.object({
    period_id: z.number(),
    emp_no: z.string(),
    special_multiplier: z.number(),
    multiplier: z.number(),
    fixed_amount: z.number(),
    bud_effective_salary: z.number(),
    bud_amount: z.number(),
    sup_performance_level: z.string().nullable(),
    sup_effective_salary: z.number().nullable(),
    sup_amount: z.number().nullable(),
    app_performance_level: z.string().nullable(),
    app_effective_salary: z.number().nullable(),
    app_amount: z.number().nullable(),
});

const salaryRaiseUpdate = z
    .object({
        period_id: z.number(),
        emp_no: z.string(),
        special_multiplier: optionalNumDefaultZero,
        multiplier: optionalNumDefaultZero,
        fixed_amount: optionalNumDefaultZero,
        bud_effective_salary: optionalNumDefaultZero,
        bud_amount: optionalNumDefaultZero,
        sup_performance_level: z.string().nullable(),
        sup_effective_salary: optionalNumDefaultZero,
        sup_amount: optionalNumDefaultZero,
        app_performance_level: z.string().nullable(),
        app_effective_salary: optionalNumDefaultZero,
        app_amount: optionalNumDefaultZero,
    })
    .merge(dateAll);

const salaryRaiseCreate = salaryRaiseBase.merge(dateCreate);


// Exposed Types
// Create Types
export const createSalaryRaiseAPI = salaryRaiseCreate;
export const createSalaryRaiseService = salaryRaiseCreate;

// Update Types
export const updateSalaryRaiseAPI = salaryRaiseUpdate.partial().merge(Id);
export const updateSalaryRaiseService = salaryRaiseUpdate
    .partial()
    .merge(Id);

// Frontend
const salaryRaiseFE = z
    .object({
        residence_permit_start_date: z.coerce.string().nullable(),
        residence_permit_end_date: z.coerce.string().nullable(),
        registration_date: z.coerce.string(),
        quit_date: z.coerce.string().nullable(),
        seniority: z.coerce.number(),
        position_position_type: z.coerce.string(),
        work_status: z.coerce.string(),
        base_salary: z.coerce.number(),
        supervisor_allowance: z.coerce.number().nullable(),
        subsidy_allowance: z.coerce.number(),
        occupational_allowance: z.coerce.number(),
        food_allowance: z.coerce.number(),
        long_service_allowance: z.coerce.number(),
        total: z.coerce.number(),
        status: z.coerce.string(),
    })
    .merge(salaryRaiseBase)
    .merge(Id)
    .merge(empData)
    .merge(dateAll)
    .omit({ start_date: true, end_date: true });

export type SalaryRaiseFEType = z.infer<typeof salaryRaiseFE>;
