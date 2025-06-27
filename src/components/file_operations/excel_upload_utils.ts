import { inverse_translate } from "public/locales/utils";
import { CellValue, ValueType, Workbook } from "exceljs";

function trimRightEmptyValues(arr: any[]): any[] {
	let end = arr.length;
	while (end > 0 && (!arr[end - 1] || arr[end - 1] === "")) {
		end--;
	}
	return arr.slice(0, end);
}


function padArray(arr: any[], targetLength: number, padValue: any): any[] {
	if (arr.length >= targetLength) {
		return arr;
	}
	const padding = new Array(targetLength - arr.length).fill(padValue);
	return arr.concat(padding);
}


function excelMapDate(cell: any): Date | null {
	if (typeof cell === "string") {
		if (cell.includes("年") && cell.includes("月") && cell.includes("日")) {
			// Replace "年", "月", "日" with "/" and construct the date
			const formattedDate = cell
				.replace("年", "/")
				.replace("月", "/")
				.replace("日", "");
			const parsedDate = new Date(formattedDate);

			// Check if the date is valid
			if (!isNaN(parsedDate.getTime())) {
				return parsedDate;
			} else {
				console.warn("Invalid date:", formattedDate);
				throw new Error("Invalid date");
			}
		}
	}
	return null;
}

function recoverData(
	data: any[][],
	table_name?: string
): Record<string, unknown>[] {
	if (data.length === 0 || !data[0]) return [];

	// Generate keys by applying inverse_translate to each header
	const keys = data[0].map((original_header: string) =>
		inverse_translate(String(original_header), table_name)
	);
	console.log("keys", keys);

	// Map each row to an object using the keys
	const mappedData = data.slice(1).map((row: any[]) => {
		const obj: Record<string, any> = {};
		keys.forEach((key, idx) => {
			const cell = row[idx];
			if (idx < row.length) {
				obj[key] = cell;

				if (cell !== undefined) {
					const date = excelMapDate(cell);
					if (date) {
						obj[key] = date;
					}
				}
			} else {
				obj[key] = null;
			}
		});
		return obj;
	});

	return mappedData;
}

export function recoverMultiSheetData(
	data: Record<string, any[][]>,
	table_name?: string
): Record<string, Record<string, unknown>[]> {
	const datas: Record<string, Record<string, unknown>[]> = {};
	Object.entries(data).forEach(([sheet_name, value]) => {
		datas[sheet_name] = recoverData(value, table_name);
	});
	return datas;
}

export async function extractData(
	file: File
): Promise<Record<string, any[][]> | null> {
	if (!file) return null;
	try {
		// Read the file as ArrayBuffer
		const arrayBuffer = await file.arrayBuffer();

		// Create a new workbook
		const workbook = new Workbook();
		await workbook.xlsx.load(arrayBuffer);

		const datas: Record<string, any[][]> = {};
		let maxLen = 0;
		for (const sheet of workbook.worksheets) {
			const rows: any[][] = [];

			sheet.eachRow({ includeEmpty: true }, (row) => {
				const rowValues: any[] = [];

				row.eachCell({ includeEmpty: true }, (cell) => {
          let value: CellValue = cell.value; 
          if (cell.type === ValueType.Formula) {
            value = cell.result;
          }
          if (cell.type === ValueType.RichText) {
            value = cell.text;
          }
					rowValues.push(value);
				});

				// Remove empty rows
				if (rowValues.length === 0) return;
				if (rowValues.every((val) => val === undefined || val === null))
					return;

				// Remove empty on the right
				const trimmedValues = trimRightEmptyValues(rowValues);

				const cleanedValues = Array.from<any[], unknown[]>(
					trimmedValues,
					(x) => x ?? null 
				);

				if (cleanedValues.length > maxLen) {
					maxLen = cleanedValues.length;
				}
				rows.push(cleanedValues);
			});

			// Pad each row
            for (let row of rows) {
                row = padArray(row, maxLen, '')
            }
            
			const sheetName = sheet.name;
			datas[sheetName] = rows;
		}

		// TODO: data mapping
		return datas;
	} catch (error) {
		console.error("Error processing file");
		return null;
	}
}
