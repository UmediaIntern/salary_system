import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { inverse_translate } from "public/locales/utils";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { FileUploader } from "./file_uploader";
import { Workbook } from "exceljs";
import { UploadPreview } from "./upload_preview";

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

function recoverMultiSheetData(
	data: Record<string, any[][]>,
	table_name?: string
): Record<string, Record<string, unknown>[]> {
	const datas: Record<string, Record<string, unknown>[]> = {};
	Object.keys(data).forEach((key) => {
		datas[key] = recoverData(data[key]!, table_name);
	});
	return datas;
}

async function extract_data(
	file: File,
): Promise<Record<string, any[][]> | null> {
	if (!file) return null;
	try {
		// Read the file as ArrayBuffer
		const arrayBuffer = await file.arrayBuffer();

		// Create a new workbook
		const workbook = new Workbook();
		await workbook.xlsx.load(arrayBuffer);

		const datas: Record<string, any[][]> = {};
		for (const sheet of workbook.worksheets) {
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

        rowValues = Array.from<any[], unknown[]>(rowValues, x => x ?? "");
				rows.push(rowValues);
			});


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

interface ExcelUploadProps {
	onClick?: (data: any) => void;
	multiSheet?: boolean;
}

export function ExcelUpload({ onClick, multiSheet }: ExcelUploadProps) {
	const [view, setView] = useState("upload");
	const { t } = useTranslation("common");
	const [data, setData] = useState<Record<string, any[][]> | null>(null);

	async function handleFileUpload(files: File[]) {
		if (files.length !== 1) {
			throw new Error("Only one file can be uploaded at a time");
		}
		for (const file of files) {
			const data = await extract_data(file);
			if (data) setData(data);
		}
	}

	useEffect(() => {
		if (data) setView("preview");
	}, [data]);

	return (
		<>
			<Tabs
				defaultValue="upload"
				value={view}
				onValueChange={setView}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-2 mb-2">
					<TabsTrigger value="upload">
						{t("button.excel_upload")}
					</TabsTrigger>
					<TabsTrigger
						value="preview"
						disabled={!data}
					>
						{t("button.excel_preview")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upload">
					<FileUploader onUpload={handleFileUpload} />
				</TabsContent>

				<TabsContent value="preview">
					{data ? (
						<UploadPreview
							datas={data}
							onClick={() => {
								if (multiSheet) {
									onClick?.(recoverMultiSheetData(data));
								} else {
									onClick?.(recoverData(data));
								}
							}}
						/>
					) : (
						<div />
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
