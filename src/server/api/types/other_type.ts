import { z } from "zod";

export const otherFE=z.object({
    emp_no: z.string(),
    emp_name: z.string(),
    department: z.string(),
    position: z.number(),
    work_day: z.number(),
    other_addition: z.number(),
    other_addition_tax: z.number(),
    other_deduction: z.number(),
    other_deduction_tax: z.number(),
    dorm_deduction: z.number(),
    reissue_salary: z.number(),
    g_i_deduction_promotion: z.number(),
    g_i_deduction_family: z.number(),
    income_tax_deduction: z.number(),
    l_r_self: z.number(),
    parking_fee: z.number(),
    brokerage_fee: z.number(),
    retirement_income: z.number(),
    l_i_disability_reduction: z.number(),
    h_i_subsidy: z.number(),
})
export const otherFEDiff=z.object({
    emp_no: z.string(),
    other_addition: z.boolean(),
    other_addition_tax: z.boolean(),
    other_deduction: z.boolean(),
    other_deduction_tax: z.boolean(),
    dorm_deduction: z.boolean(),
    reissue_salary: z.boolean(),
    g_i_deduction_promotion: z.boolean(),
    g_i_deduction_family: z.boolean(),
    income_tax_deduction: z.boolean(),
    l_r_self: z.boolean(),
    parking_fee: z.boolean(),
    brokerage_fee: z.boolean(),
    retirement_income: z.boolean(),
    l_i_disability_reduction: z.boolean(),
    h_i_subsidy: z.boolean(),
})

export type OtherFEType = z.infer<typeof otherFE>
export type OtherFEDiffType = z.infer<typeof otherFEDiff>
