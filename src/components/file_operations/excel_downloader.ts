import { Workbook, Worksheet } from "exceljs";

class ExcelSheet {
	transpose = false;
	worksheet: Worksheet;
	headers: null | string[] = null;
	data: null | any[][] = null;
	num_cols = 0;

	constructor(worksheet: Worksheet) {
		this.worksheet = worksheet;
	}

	setTranspose() {
		this.transpose = true;
		return this;
	}

	setHeaders(headers: string[]) {
		this.headers = headers;
		this.num_cols = headers.length;
		return this;
	}

	setData(data: any[][]) {
		const valid = this.validateData(data);
		if (!valid) {
			return;
		}
		this.data = data;
		return this;
	}

	finalize() {
		if (!this.data) {
			return;
		}

		if (this.transpose) {
			this.data = this.transposeData(this.data);
		}

		try {
			if (this.headers) {
				this.worksheet.addRow(this.headers);
			}

			this.data.map((row: any[]) => {
				this.worksheet.addRow(row);
			});

			this.worksheet.columns.forEach((column) => {
				column.width = 25;
			});
		} catch {}
	}

	private validateData(data: any[][]): boolean {
		if (data.length === 0 || !data[0]) {
			return false;
		}

		if (this.num_cols === 0) {
			this.num_cols = data[0].length;
		}

		for (const row of data) {
			if (row.length !== this.num_cols) {
				return false;
			}
		}
		return true;
	}

	private transposeData(data: any[][]): any[][] {
		if (data.length === 0 || !data[0] || data[0].length === 0) return [[]];

		const numRows = data.length;
		const numCols = data[0].length;

		const transposedData: any[][] = [];

		for (let col = 0; col < numCols; col++) {
			const new_row: any[] = [];
			for (let row = 0; row < numRows; row++) {
				new_row.push(data[row]?.[col]);
			}
			transposedData.push(new_row);
		}

		return transposedData;
	}
}

export class ExcelDownloader {
	private filename = "excel";
	private workbook = new Workbook();
	private sheets: ExcelSheet[] = [];

	setFileName(filename: string) {
		this.filename = filename;
		return this;
	}

	addSheet({
		name,
		buildSheet,
	}: {
		name?: string;
		buildSheet?: (sheet: ExcelSheet) => void;
	}) {
		const worksheet = this.workbook.addWorksheet(
			name === "" ? "blank" : name
		);
		const sheet = new ExcelSheet(worksheet);
		this.sheets.push(sheet);
		if (buildSheet) buildSheet(sheet);
		sheet.finalize();
		return this;
	}

	async download() {
		// Save the workbook to a file
		const buffer = await this.workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${this.filename}.xlsx`;
		a.click();
		URL.revokeObjectURL(url);
	}
}
