import { z } from "zod";
import { dateAll, dateCreate, dateMetaFE, func, Id } from "./common_type";

const insuranceRateSettingBase = z.object({
    min_wage: z.number(),
    l_i_accident_rate: z.number(),
    l_i_employment_pay_rate: z.number(),
    l_i_occupational_injury_rate: z.number(),
    l_i_wage_replacement_rate: z.number(),
    h_i_standard_rate: z.number(),
    h_i_avg_dependents_count: z.number(),
    v2_h_i_supp_pay_rate: z.number(),
    v2_h_i_deduction_tsx_thres: z.number(),
    v2_h_i_multiplier: z.number(),
});
export const createInsuranceRateSettingAPI =
    insuranceRateSettingBase.merge(dateCreate).omit({ end_date: true });
export const createInsuranceRateSettingService =
    insuranceRateSettingBase.merge(dateCreate);
export const updateInsuranceRateSettingAPI = insuranceRateSettingBase.merge(dateAll).partial().merge(Id);
export const updateInsuranceRateSettingService = insuranceRateSettingBase.merge(dateAll).partial().merge(Id);

export const insuranceRateSettingFE = z
    .object({
        id: z.number(),
    })
    .merge(insuranceRateSettingBase)
    .merge(dateMetaFE)
    .merge(func);

export type InsuranceRateSettingFEType = z.infer<typeof insuranceRateSettingFE>;
