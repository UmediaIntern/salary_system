import { ExcelSheetData, SourceExpNode } from "./excel_type";

export class ExcelParser {
	parseSingleSheet<T = any>(data: Record<string, T[][]>): ExcelSheetData<T> {
		const sheetName = Object.keys(data)[0] ?? "Unknown Sheet Name";
		const sheetData = Object.values(data)[0];
		if (sheetData) {
			const rawHeader: any[] | undefined = sheetData[0];
			if (!rawHeader) {
				throw new Error("No header in excel");
			}

			const header: SourceExpNode[] = [];
			rawHeader.forEach((cell, idx) => {
				if (!cell) {
					throw new Error("Empty cell in header");
				}
				if (typeof cell !== "string") {
					throw new Error("Non-string cell in header");
				}
				header.push(new SourceExpNode(cell, idx));
			});

			const excelRows = sheetData.slice(1);

			for (const row of excelRows) {
				if (row.length < header.length) {
					throw new Error("Row length is less than header length");
				}
			}

			const excel = new ExcelSheetData(sheetName, rawHeader, excelRows);
      excel.header = header;

      return excel;
		}

		throw new Error("No data in excel");
	}
}
