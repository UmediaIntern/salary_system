import { type ExcelSheetData } from "./excel_type";

type ProcessResult = { success: boolean; data: ExcelSheetData | null };

export class ExcelProcessor {
	process(excel: ExcelSheetData): ProcessResult {
		console.log("Processing excel:", excel.sheet_name);

		return {
			success: true,
			data: excel,
		};
	}
}
