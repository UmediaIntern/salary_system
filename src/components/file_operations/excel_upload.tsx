import { useState } from "react";
import { useTranslation } from "next-i18next";
import { inverse_translate } from "public/locales/utils";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { FileUploader } from "./file_uploader";
import { Workbook } from "exceljs";

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
	isList: boolean,
	table_name?: string
): Record<string, any>[] | Record<string, any> {
	if (data.length === 0 || !data[0]) return [];

	// Generate keys by applying inverse_translate to each header
	const keys = data[0].map((original_header: string) =>
		inverse_translate(String(original_header), table_name)
	);

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

	if (isList) {
		return mappedData;
	} else {
		return mappedData[0] ?? {};
	}
}

async function extract_data(file: File): Promise<any[][] | null> {
	if (!file) return null;
	try {
		// Read the file as ArrayBuffer
		const arrayBuffer = await file.arrayBuffer();

		// Create a new workbook
		const workbook = new Workbook();
		await workbook.xlsx.load(arrayBuffer);

		// Access the first sheet
		const sheet = workbook.worksheets[0];
		if (!sheet) return null;

		const rows: any[][] = [];

		sheet.eachRow({ includeEmpty: true }, (row) => {
			let rowValues: any[];
			if (Array.isArray(row.values)) {
				rowValues = row.values;
			} else {
				rowValues = Object.values(row.values);
			}
			// Remove empty rows
			if (rowValues.length === 0) return;
			if (rowValues.every((val) => val === undefined || val === null))
				return;

			rows.push(rowValues);
		});

		// TODO: data mapping

		// Update state with the extracted data
		return rows;
	} catch (error) {
		console.error("Error processing file");
		return null;
	}
}

export function ExcelUpload() {
	const [view, setView] = useState("upload");
	const { t } = useTranslation("common");
  const [data, setData] = useState<any[][] | null>(null);

	async function handleFileUpload(files: File[]) {
		console.log(files);
		if (files.length !== 1) {
			throw new Error("Only one file can be uploaded at a time");
		}
		for (const file of files) {
      const data = await extract_data(file);
      if(data) setData(data);
		}
	}

	return (
		<>
			<Tabs
				defaultValue="upload"
				value={view}
				onValueChange={setView}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-1">
					<TabsTrigger value="upload">
						{t("button.excel_upload")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upload">
					<FileUploader onUpload={handleFileUpload} />
				</TabsContent>
			</Tabs>
		</>
	);
}
