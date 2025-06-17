import { ExcelSheetType } from "./excel_type";

export class ExcelParser {
	constructor() {}

	parseSingleSheet<T = any>(data: Record<string, T[][]>): ExcelSheetType<T> {
		const sheetName = Object.keys(data)[0] ?? "Unknown Sheet Name";
		const sheetData = Object.values(data)[0];
		if (sheetData) {
			const header: any[] | undefined = sheetData[0];
			if (!header) {
				throw new Error("No header in excel");
			}

			const excelRows = sheetData.slice(1);

      for (const row of excelRows) {
        if (row.length < header.length) {
          throw new Error("Row length is less than header length");
        }
      }

      return {
        sheet_name: sheetName,
        header: header,
        data: excelRows
      }
		}

    throw new Error("No data in excel");
	}
}
