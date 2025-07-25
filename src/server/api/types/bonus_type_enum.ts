import { z } from "zod";

export const bonusTypeEnum = z.enum([
	"project_bonus",
	"q1_bonus",
	"q2_bonus",
	"q3_q4_bonus",
	"employee_dividends_bonus",
	"DS_bonus"
]);

export type BonusTypeEnumType = z.infer<typeof bonusTypeEnum>;
export function bonusTypeLabel(bonus_type: BonusTypeEnumType): string {
	switch (bonus_type) {
		case "project_bonus":
			return "專案獎金";
		case "q1_bonus":
			return "Q1獎金";
		case "q2_bonus":
			return "Q2獎金";
		case "q3_q4_bonus":
			return "Q3-Q4獎金";
		case "employee_dividends_bonus":
			return "員工分紅獎金";
		case "DS_bonus":
			return "董監事酬勞";
	}
}

