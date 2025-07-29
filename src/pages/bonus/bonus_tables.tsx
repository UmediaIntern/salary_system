import { type TableEnum } from "./components/context/data_table_enum";

export type BonusTableEnum = Extract<
	TableEnum,
	(typeof BonusTableEnumValues)[number]
>;

export const BonusTableEnumValues = [
	"TableBonusAll",
	"TableBonusWorkType",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusSeniority",
] as const;
