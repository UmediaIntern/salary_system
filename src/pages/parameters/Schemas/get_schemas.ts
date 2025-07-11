import { type TableEnum } from "../components/context/data_table_enum";
import { attendanceSchema } from "./configurations/attendance_schema";
import { bankSchema } from "./configurations/bank_schema";
import { insuranceSchema } from "./configurations/insurance_schema";
import { levelSchema } from "./configurations/level_schema";
import { levelRangeSchema } from "./configurations/level_range_schema";
import { trustMoneySchema } from "./configurations/trust_money_schema";
import { salaryIncomeTaxSchema } from "./configurations/salary_income_tax_schema";
import { incomeTaxSchema } from "./configurations/income_tax_schema";
import { allowanceRangeSchema } from "./configurations/allowance_range_schema";

export function getSchema(table: TableEnum) {
	switch (table) {
		case "TableAttendance":
			return attendanceSchema;
		case "TableBankSetting":
			return bankSchema;
		case "TableInsurance":
			return insuranceSchema;
		case "TableTrustMoney":
			return trustMoneySchema;
		// level
		case "TableLevel":
			return levelSchema;
		case "TableLevelRange":
			return levelRangeSchema;
		case "TableTrustMoney":
			return trustMoneySchema;
		case "TableSalaryIncomeTax":
			return salaryIncomeTaxSchema;
		case "TableIncomeTaxSetting":
			return incomeTaxSchema;
		case "TableAllowanceRange":
			return allowanceRangeSchema;
		default:
			throw Error("Table not found");
	}
}
