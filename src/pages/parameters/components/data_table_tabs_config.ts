import { type ParameterTableEnum } from "../parameter_tables";

export function hasHistory(tableType: ParameterTableEnum): boolean {
	switch (tableType) {
		case "TableAttendance":
		case "TableBankSetting":
		case "TableInsurance":
		case "TableLevelRange":
		case "TableLevel":
		case "TableTrustMoney":
		case "TableSalaryIncomeTax":
		case "TableIncomeTaxSetting":
		case "TableAllowanceRange":
			return true;
		default:
			return false;
	}
}
