import { z } from "zod";
import { func, metadata } from "./common_type";
import { bonusTypeEnum } from "./bonus_type_enum";

const BonusAllBase = z.object({
    period_id: z.number(),
    bonus_type: bonusTypeEnum,
    multiplier: z.number(),
});

export const bonusAllFE = z
    .object({
        id: z.number(),
    })
    .merge(BonusAllBase)
    .merge(metadata)
    .merge(func);

export type BonusAllFEType = z.infer<typeof bonusAllFE> | null;