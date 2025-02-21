import { type TableEnum } from "./components/context/data_table_enum";

export type BonusTableEnum = Extract<
	TableEnum,
	(typeof BonusTableEnumValues)[number]
>;

export const BonusTableEnumValues = [
	// "TableBonusSetting",
	"TableBonusAll",
	"TableBonusWorkType",
	"TableBonusDepartment",
	"TableBonusPosition",
	// "TableBonusPositionType",
	"TableBonusSeniority",
	// "TablePerformanceLevel",
] as const;

// function getTableName(table: BonusTableEnum) {
// 	switch (table) {
// 		case "TableBonusAll":			return "bonusAll";
// 		case "TableBonusWorkType":		return "bonusWorkType";
// 		case "TableBonusDepartment":	return "bonusDepartment";
// 		case "TableBonusPosition":		return "bonusPosition";
// 		case "TableBonusSeniority":	return "bonusSeniority";
// 	}
// }
//
// export function getTableNameKey(table: BonusTableEnum) {
// 	return `table_name.${getTableName(table)}`
// }


  


  
