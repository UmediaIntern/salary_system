import { z } from "zod";
import { BonusTypeEnumType, bonusTypeEnum } from "./bonus_type_enum";
import { BonusType } from "~/server/database/entity/UMEDIA/bonus_type";

export const PayTypeEnum = z.enum([
	"month_salary",
	"foreign_15_bonus",
	"Q1_performance",
	"Q2_performance",
	"Q34_performance",
	// "Q4_performance",
	"DS_pay",
]);
export type PayTypeEnumType = z.infer<typeof PayTypeEnum>;
export function payTypeLabel(pay_type: PayTypeEnumType): string {
	switch (pay_type) {
		case "month_salary":
			return "月薪";
		case "foreign_15_bonus":
			return "外勞15日獎金";
		case "Q1_performance":
			return "Q1績效";
		case "Q2_performance":
			return "Q2績效";
		case "Q34_performance":
			return "Q34績效";
		// case "Q4_performance":
		// 	return "Q4績效"
		case "DS_pay":
			return "董監事酬勞";
	}
}

export function getMatchedBonusType(
	pay_type: PayTypeEnumType
): BonusTypeEnumType | null {
	switch (pay_type) {
		case PayTypeEnum.Enum.month_salary:
			return bonusTypeEnum.Enum.project_bonus;
		case PayTypeEnum.Enum.Q1_performance:
			return bonusTypeEnum.Enum.q1_bonus;
		case PayTypeEnum.Enum.Q2_performance:
			return bonusTypeEnum.Enum.q2_bonus;
		case PayTypeEnum.Enum.Q34_performance:
			return bonusTypeEnum.Enum.q3_q4_bonus;
		case PayTypeEnum.Enum.DS_pay:
			return bonusTypeEnum.Enum.DS_bonus;
		case PayTypeEnum.Enum.foreign_15_bonus:
			return null;
	}
}
