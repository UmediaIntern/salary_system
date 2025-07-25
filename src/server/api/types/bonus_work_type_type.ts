import { z } from "zod";
import { func, metadata } from "./common_type";
import { bonusTypeEnum } from "./bonus_type_enum";
import { workTypeEnum } from "./work_type_enum";

const BonusWorkTypeBase = z.object({
    period_id: z.number(),
    bonus_type: bonusTypeEnum,
    work_type: workTypeEnum,
    multiplier: z.number(),
});

export const bonusWorkTypeFE = z
    .object({
        id: z.number(),
    })
    .merge(BonusWorkTypeBase)
    .merge(metadata)
    .merge(func);

export type BonusWorkTypeFEType = z.infer<typeof bonusWorkTypeFE>;
