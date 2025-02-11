import { type TableEnum } from "./components/context/data_table_enum";

export type ParameterTableEnum = Extract<
	TableEnum,
	(typeof ParameterTableEnumValues)[number]
>;

export const ParameterTableEnumValues = [
	"TableAttendance",
	"TableBankSetting",
	"TableInsurance",
	"TableTrustMoney",
	"TableLevel",
	"TableLevelRange",
	"TableSalaryIncomeTax",
	"TableIncomeTaxSetting",
] as const;
