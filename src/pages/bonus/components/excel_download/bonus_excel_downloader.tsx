import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import dataTableContext from "../context/data_table_context";
import { ExcelDownload } from "~/components/file_operations/excel_download";
import { getExcelData } from "~/components/file_operations/excel_utils";

function getTableName(table_name: string) {
	if (table_name == "TableBonusAll") return "bonusAll";
	if (table_name == "TableBonusWorkType") return "bonusWorkType";
	if (table_name == "TableBonusDepartment") return "bonusDepartment";
	if (table_name == "TableBonusPosition") return "bonusPosition";
	if (table_name == "TableBonusPositionType") return "bonusPositionType";
	if (table_name == "TableBonusSeniority") return "bonusSeniority";
	if (table_name == "TableEmployeeBonus") return "employeeBonus";
	return table_name;
}

export function BonusExcelDownloader({
	table_name,
	bonus_type,
	setOpenDialog,
}: {
	table_name: string;
	bonus_type: string;
	setOpenDialog: (open: boolean) => void;
}) {
	const { selectedTable } = useContext(dataTableContext);
	const { t } = useTranslation();

	const shouldTranspose = ["TableBonusAll"].includes(table_name);
	const filename = `${t(`table_name.${getTableName(table_name)}`)}_${t(
		`table.${bonus_type}`
	)}`;

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
			setOpenDialog={setOpenDialog}
		/>
	);
}
