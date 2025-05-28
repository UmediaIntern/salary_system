import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { FileUploader } from "./file_uploader";
import { UploadPreview } from "./upload_preview";
import { extractData, recoverMultiSheetData } from "./excel_upload_utils";

interface ExcelUploadProps {
  // Single sheet 
  // Obj[]
  // Multiple sheet
  // sheet_name -> Obj[]
	onClick?: (data: any) => void;
}

export function ExcelUpload({ onClick }: ExcelUploadProps) {
	const [view, setView] = useState("upload");
	const { t } = useTranslation("common");
	const [data, setData] = useState<Record<string, any[][]> | null>(null);

	async function handleFileUpload(files: File[]) {
		if (files.length !== 1) {
			throw new Error("Only one file can be uploaded at a time");
		}
		for (const file of files) {
			const data = await extractData(file);
			console.log("extracted data", data);
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
				<TabsList className="mb-2 grid w-full grid-cols-2">
					<TabsTrigger value="upload">
						{t("button.excel_upload")}
					</TabsTrigger>
					<TabsTrigger value="preview" disabled={!data}>
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
								// datas: sheet_name -> Obj[]
								const datas = recoverMultiSheetData(data);
								const sheet_names = Object.keys(datas);
								// Single sheet
								if (
									sheet_names.length === 1 &&
									sheet_names[0]
								) {
									const firstEntry = datas[sheet_names[0]];
									if (firstEntry) {
										// Obj[]
										onClick?.(firstEntry);
									}
								} else {
									// Multiple sheet
									// sheet_name -> Obj[]
									onClick?.(datas);
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
