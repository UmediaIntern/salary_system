export const TableEnumValues = [
	"TableBonusAll",
	"TableBonusWorkType",
	"TableBonusDepartment",
	"TableBonusPosition",
	"TableBonusSeniority",
] as const;

export type TableEnum = (typeof TableEnumValues)[number];

function getTableName(table: TableEnum) {
	switch (table) {
		case "TableBonusAll":
			return "bonusAll";
		case "TableBonusWorkType":
			return "bonusWorkType";
		case "TableBonusDepartment":
			return "bonusDepartment";
		case "TableBonusPosition":
			return "bonusPosition";
		case "TableBonusSeniority":
			return "bonusSeniority";
	}
}

export function getTableNameKey(table: TableEnum) {
	return `table_name.${getTableName(table)}`
}
