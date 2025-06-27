import { z } from "zod";

export const newBonusFE = z.object({
    emp_no: z.string(),
    emp_name: z.string(),
    department: z.string(),
    position: z.number(),
    work_day: z.number(),
    project_bonus: z.number(),
    full_attendance_bonus: z.number(),
})

export const newBonusFEDiff = z.object({
    emp_no: z.string(),
    project_bonus: z.boolean(),
    full_attendance_bonus: z.boolean(),
})

export type BonusFEType = z.infer<typeof newBonusFE>;
export type BonusFEDiffType = z.infer<typeof newBonusFEDiff>;
