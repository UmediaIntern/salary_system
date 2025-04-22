import { useTranslation } from "react-i18next";
import { getExcelData } from "~/components/file_operations/excel_utils";
import { ExcelDownload } from "~/components/file_operations/excel_download";
import { useDataTableContext } from "../context/data_table_context_provider";


function getTableName(table_name: string) {
	if (table_name == "TableAttendance") return "attendanceSetting";
	if (table_name == "TableBankSetting") return "bankSetting";
	if (table_name == "TableInsurance") return "insuranceRateSetting";
	if (table_name == "TableTrustMoney") return "trustMoney";
	if (table_name == "TableLevel") return "level";
	if (table_name == "TableLevelRange") return "levelRange";
	if (table_name == "TableSalaryIncomeTax") return "salaryIncomeTax";

	return table_name;
}


export function ParameterExcelDownloader({
	table_name,
}: {
	table_name: string;
}) {
	const { selectedTable } = useDataTableContext();
	const { t } = useTranslation();

	const shouldTranspose = ["TableInsurance", "TableAttendance"].includes(table_name);
	const filename = `${t(`table_name.${getTableName(table_name)}`)}`;

	return (
		<ExcelDownload
			data={getExcelData(
				selectedTable?.table
					.getFilteredRowModel()
					.rows.map((r) => r.original as Record<string, unknown>) ??
					[],
				["id", "functions", "disabled"],
				!shouldTranspose
			)}
			fileName={filename}
			withHeader={!shouldTranspose}
			transpose={shouldTranspose}
		/>
	);
}
