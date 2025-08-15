import { z } from "zod";
import { dateAll, dateCreate, dateMetaFE, func, Id } from "./common_type";

const incomeTaxSettingBase = z.object({
    entry_date_threshold: z.coerce.number(),
	multiplier: z.coerce.number(),
	deduction: z.coerce.number(),
	tax_ratio_1: z.coerce.number(),
	tax_ratio_2: z.coerce.number(),
});
export const createIncomeTaxSettingAPI = incomeTaxSettingBase.merge(dateCreate).omit({ end_date: true });
export const updateIncomeTaxSettingAPI = incomeTaxSettingBase.merge(dateAll).partial().merge(Id);
export const createIncomeTaxSettingService = incomeTaxSettingBase.merge(dateCreate);
export const updateIncomeTaxSettingService = incomeTaxSettingBase.merge(dateAll).partial().merge(Id);

export const incomeTaxSettingFE = z
    .object({
        id: z.number(),
    })
    .merge(incomeTaxSettingBase)
    .merge(dateAll)
    .merge(func);

export type IncomeTaxSettingFEType = z.infer<typeof incomeTaxSettingFE>;
