export const TableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableTrustMoney",
	"TableLevel",
	"TableLevelRange",
	"TableBasicInfo",
	"TableSalaryIncomeTax",
	"TableIncomeTaxSetting",
] as const;

export type TableEnum = (typeof TableEnumValues)[number];

function getTableName(table: TableEnum) {
	switch (table) {
		case "TableAttendance":
			return "attendanceSetting";
		case "TableBankSetting":
			return "bankSetting";
		case "TableInsurance":
			return "insuranceRateSetting";
		case "TableTrustMoney":
			return "trustMoney";
		case "TableLevel":
			return "level";
		case "TableLevelRange":
			return "levelRange";
		case "TableBasicInfo":
			return "basicInfo";
		case "TableSalaryIncomeTax":
			return "salaryIncomeTax";
		case "TableIncomeTaxSetting":
			return "incomeTaxSetting";
	}
}

export function getTableNameKey(table: TableEnum) {
  return `table_name.${getTableName(table)}`
}
