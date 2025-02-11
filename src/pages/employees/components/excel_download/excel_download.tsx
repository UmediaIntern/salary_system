import React, { useState } from "react";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

import { useTranslation } from "react-i18next";
import { ExcelDownloader } from "~/components/file_operations/excel_download";

export function ExcelDownload() {
	const { t } = useTranslation();

	const [filename, setFilename] = useState("excel");

	// const { selectedPeriod } = useContext(periodContext);
	// const period_name = selectedPeriod?.period_name ?? "ERROR";

	// const { selectedTable, selectedTableType } = useContext(dataTableContext);

	// useEffect(() => {
	// 	setFilename(
	// 		`${t(`table_name.${getTableName()}`)}_${t(
	// 			`table.${bonus_type}`
	// 		)}_${period_name}.xlsx`
	// 	);
	// }, [table_name]);

	return (
		<DialogContent className="p-8">
			<DialogTitle>{t("button.excel_download")}</DialogTitle>
			<div className="flex flex-row items-center justify-center">
				<Label className="min-w-20">{t("table.filename")}</Label>
				<Input
					id="filename"
					value={filename}
					onChange={(e) => {
						setFilename(e.target.value);
					}}
					className="col-span-3"
				/>
			</div>
			<DialogFooter>
				<Button
					type="submit"
					onClick={() => {
						new ExcelDownloader()
							.setFileName(filename)
							.addSheet({
								buildSheet: (sheet) => {
									sheet.setData([
										[1, 2, 3],
										[4, 5, 6],
									]);
								},
							})
							.download()
							.catch((e) => console.error(e));
					}}
				>
					{t("button.excel_download")}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

// handleExportExcel(
//   getExcelData(
//     selectedTable?.table
//       .getFilteredRowModel()
//       .rows.map((r) => r.original)!,
//     ["id", "functions"]
//   ),
//   filename
// )
