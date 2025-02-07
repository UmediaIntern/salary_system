import { Cross2Icon, FileTextIcon, UploadIcon } from "@radix-ui/react-icons";
import {
	ReactElement,
	useState,
	useCallback,
	useEffect,
	useContext,
} from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

/* ShadCN UI */
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";

import { Toaster, toast } from "sonner";

import Dropzone, {
	type DropzoneProps,
	type FileRejection,
} from "react-dropzone";

import { cn } from "~/lib/utils";

import ExcelJS from "exceljs";
import { isDateType, isString } from "~/lib/utils/check_type";
import { displayData } from "~/components/synchronize/utils/display";
import { useTranslation } from "next-i18next";
import { inverse_translate } from "public/locales/utils";
import { formatDate } from "~/lib/utils/format_date";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { parameterToolbarFunctionsContext } from "../function_sheet/parameter_functions_context";
import { FileUploader } from "../../../../components/file_operations/file_upload";

function transposeData(data: any[][]): any[][] {
	const tranposed_data = (data[0] ?? []).map((_, colIndex) =>
		data.map((row) => row[colIndex])
	);
	return tranposed_data.map((row) => row.slice(1));
}

export function recoverData(
	data: any,
	isList: boolean,
	table_name?: string
): Record<string, any>[] | Record<string, any> {
	if (!Array.isArray(data) || data.length === 0) return [];

	// Generate keys by applying inverse_translate to each header
	const keys = data[0].map((original_header: string) =>
		inverse_translate(String(original_header), table_name)
	);



	// Map each row to an object using the keys
	const mappedData = data.slice(1).map((row: any[]) => {
		let obj: Record<string, any> = {}
		for (let i = 0; i < keys.length; i++) {
			if (i < row.length) {
				obj[keys[i]] = row[i];

				if (row[i] !== undefined) {
					if (typeof row[i] === "string") {
						if (row[i].includes("年") && row[i].includes("月") && row[i].includes("日")) {
							// Replace "年", "月", "日" with "/" and construct the date
							const formattedDate = row[i]
								.replace("年", "/")
								.replace("月", "/")
								.replace("日", "");
							const parsedDate = new Date(formattedDate);
	
							// Check if the date is valid
							if (!isNaN(parsedDate.getTime())) {
								obj[keys[i]] = parsedDate;
							} else {
								console.warn("Invalid date:", formattedDate);
							}
						}
					}
				}
			}
			else {
				obj[keys[i]] = null;
			}
		}
		return obj;

	});
	

	// Remove Empty Objects
	while (
		mappedData.length > 0 &&
		(
			Object.keys((mappedData as any)[mappedData.length - 1]).length === 0 ||
			Object.keys((mappedData as any)[mappedData.length - 1]).filter((key) => mappedData[mappedData.length - 1]![key] === null).length === keys.length
		)
	) {
		mappedData.pop();
	}


	if (isList) {
		return mappedData;
	} else {
		return mappedData[0] ?? {};
	}
}

export function ExcelUpload({
	tableType,
	closeDialog,
}: {
	tableType: string;
	closeDialog: () => void;
}) {
	const [view, setView] = useState("upload");
	const [files, setFiles] = useState<File[]>([]);
	const [data, setData] = useState<any[]>([]);

	const notList =
		tableType == "TableAttendance" || tableType == "TableInsurance";
	const isList = !notList;
	const notListData: any = recoverData(data.map((d) => d.slice(1)), false);

	const functions = useContext(parameterToolbarFunctionsContext);
	const createFunction = functions.createFunction!;
	const batchCreateFunction = functions.batchCreateFunction!;
	const { t } = useTranslation("common");

	useEffect(() => {
		setView("preview");
	}, [data]);

	useEffect(() => {
		setView("upload");
	}, []);

	return (
		<>
			<Tabs
				defaultValue="upload"
				value={view}
				onValueChange={setView}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="upload">
						{t("button.excel_upload")}
					</TabsTrigger>
					<TabsTrigger value="preview" disabled={data.length === 0}>
						{t("button.excel_preview")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upload">
					<FileUploader
						onUpload={async (files: File[]) => console.log(files)}
						files={files}
						setFiles={setFiles}
						data={data}
						setData={setData}
					/>
				</TabsContent>

				<TabsContent value="preview">
					{/* <Button onClick={() => console.log(
						recoverData(data.map((d) => d.slice(1)), false)
					)}>Console Log Data</Button> */}

					<div className="max-h-[600px] max-w-full overflow-x-auto border border-gray-300">
						<Table className="w-full table-auto">
							<TableHeader>
								{isList && (
									<TableRow>
										{data[0] &&
											data[0].map(
												(
													header: any,
													index: number
												) => {
													if (index == 0)
														return <></>;
													else
														return (
															<TableHead
																key={index}
															>
																{header}
															</TableHead>
														);
												}
											)}
									</TableRow>
								)}

								{notList && (
									<TableRow>
										<TableHead key={"key"}>
											{t("table.key")}
										</TableHead>
										<TableHead key={"value"}>
											{t("table.value")}
										</TableHead>
									</TableRow>
								)}
							</TableHeader>
							<TableBody>
								{isList &&
									data
										.slice(1)
										.map((row: any, rowIndex: number) => (
											<TableRow key={rowIndex}>
												{row.map(
													(
														cell: any,
														cellIndex: number
													) => {
														if (cellIndex == 0)
															return <></>;
														else
															return (
																<TableCell
																	key={
																		cellIndex
																	}
																>
																	{isDateType(
																		cell
																	)
																		? formatDate(
																				"day",
																				cell
																		  )
																		: cell}
																</TableCell>
															);
													}
												)}
											</TableRow>
										))}

								{notList &&
									Object.keys(notListData).map((key: string) => (
											<TableRow key={key}>
												<TableCell>{t(`table.${key}`)}</TableCell>
												<TableCell>
													{isDateType(notListData[key]) ? formatDate("day", notListData[key]) : notListData[key]}</TableCell>
											</TableRow>
										))}
							</TableBody>
						</Table>
					</div>

					{data[0] && (
						<div className="mt-4 flex justify-end">
							<Button
								className="ml-auto"
								onClick={() => {
									if (notList) {
										createFunction.mutate(
											recoverData(
												data.map((d) => d.slice(1)),
												false
											)
										);
									}
									else {
										console.log(recoverData(data.map((d) => d.slice(1)), isList, tableType))
										batchCreateFunction.mutate(
											recoverData(data.map((d) => d.slice(1)), true, tableType)
										);
									}
									closeDialog();
								}}
							>
								{t("button.excel_upload")}
							</Button>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
