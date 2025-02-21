import { useContext } from "react";
import { bonusToolbarFunctionsContext } from "../function_sheet/bonus_functions_context";
import { ExcelUploadDialogContent } from "~/components/file_operations/excel_upload_dialog_content";

export function BonusExcelUpload({
	tableType,
	closeDialog,
}: {
	tableType: string;
	closeDialog: () => void;
}) {
	const functions = useContext(bonusToolbarFunctionsContext);
	const singleEntry = tableType == "TableBonusAll";

	const createFunction = functions.createFunction!;
	const batchCreateFunction = functions.batchCreateFunction!;

	return (
		<ExcelUploadDialogContent
			onClick={(data) => {
				console.log("data", data);
			}}
			closeDialog={closeDialog}
		/>
	);
}

// export function recoverData(
// 	data: any,
// 	period_id: number,
// 	bonus_type: string,
// 	isList: boolean,
// 	table_name?: string
// ): Record<string, any>[] | Record<string, any> {
// 	if (!Array.isArray(data) || data.length === 0) return [];

// 	// Generate keys by applying inverse_translate to each header
// 	const keys = data[0].map((original_header: string) =>
// 		inverse_translate(String(original_header), table_name)
// 	);

// 	// Map each row to an object using the keys
// 	const mappedData = data.slice(1).map((row: any[]) => {
// 		return row.reduce(
// 			(obj: Record<string, any>, value: any, index: number) => {
// 				if (keys[index] !== undefined) {
// 					obj[keys[index]] = value;
// 					if (typeof value === "string") {
// 						if (
// 							value.includes("年") &&
// 							value.includes("月") &&
// 							value.includes("日")
// 						) {
// 							// Replace "年", "月", "日" with "/" and construct the date
// 							const formattedDate = value
// 								.replace("年", "/")
// 								.replace("月", "/")
// 								.replace("日", "");
// 							const parsedDate = new Date(formattedDate);

// 							// Check if the date is valid
// 							if (!isNaN(parsedDate.getTime())) {
// 								obj[keys[index]] = parsedDate;
// 							} else {
// 								console.warn("Invalid date:", formattedDate);
// 							}
// 						}
// 					}
// 				}
// 				return obj;
// 			},
// 			{}
// 		);
// 	});

// 	// Remove Empty Objects
// 	while (
// 		mappedData.length > 0 &&
// 		Object.keys((mappedData as any)[mappedData.length - 1]).length === 0
// 	) {
// 		mappedData.pop();
// 	}

// 	if (isList) {
// 		return mappedData.map((row) => {
// 			// add key period_id and bonus_type
// 			return {
// 				...row,
// 				period_id: period_id,
// 				bonus_type: bonus_type,
// 			};
// 		});
// 	} else {
// 		return mappedData[0]
// 			? { ...mappedData[0], period_id: period_id, bonus_type: bonus_type }
// 			: {};
// 	}
// }

// <>
// 			<Tabs
// 				defaultValue="upload"
// 				value={view}
// 				onValueChange={setView}
// 				className="w-full"
// 			>
// 				<TabsList className="grid w-full grid-cols-2">
// 					<TabsTrigger value="upload">
// 						{t("button.excel_upload")}
// 					</TabsTrigger>
// 					<TabsTrigger value="preview" disabled={data.length === 0}>
// 						{t("button.excel_preview")}
// 					</TabsTrigger>
// 				</TabsList>

// 				<TabsContent value="upload">
// 					<FileUploader
// 						onUpload={async (files: File[]) => console.log(files)}
// 						files={files}
// 						setFiles={setFiles}
// 						data={data}
// 						setData={setData}
// 					/>
// 				</TabsContent>

// 				<TabsContent value="preview">
// 					{/* <Button onClick={() => console.log(
// 						recoverData(data.map((d) => d.slice(1)), false)
// 					)}>Console Log Data</Button> */}

// 					<div className="max-h-[600px] max-w-full overflow-x-auto border border-gray-300">
// 						<Table className="w-full table-auto">
// 							<TableHeader>
// 								{isList && (
// 									<TableRow>
// 										{data[0] &&
// 											data[0].map(
// 												(
// 													header: any,
// 													index: number
// 												) => {
// 													if (index == 0)
// 														return <></>;
// 													else
// 														return (
// 															<TableHead
// 																key={index}
// 															>
// 																{header}
// 															</TableHead>
// 														);
// 												}
// 											)}
// 									</TableRow>
// 								)}

// 								{notList && (
// 									<TableRow>
// 										<TableHead key={"key"}>
// 											{t("table.key")}
// 										</TableHead>
// 										<TableHead key={"value"}>
// 											{t("table.value")}
// 										</TableHead>
// 									</TableRow>
// 								)}
// 							</TableHeader>
// 							<TableBody>
// 								{isList &&
// 									data
// 										.slice(1)
// 										.map((row: any, rowIndex: number) => (
// 											<TableRow key={rowIndex}>
// 												{row.map(
// 													(
// 														cell: any,
// 														cellIndex: number
// 													) => {
// 														if (cellIndex == 0)
// 															return <></>;
// 														else
// 															return (
// 																<TableCell
// 																	key={
// 																		cellIndex
// 																	}
// 																>
// 																	{isDateType(
// 																		cell
// 																	)
// 																		? formatDate(
// 																				"day",
// 																				cell
// 																		  )
// 																		: cell}
// 																</TableCell>
// 															);
// 													}
// 												)}
// 											</TableRow>
// 										))}

// 								{notList &&
// 									Object.keys(notListData).map(
// 										(key: string) => (
// 											<TableRow key={key}>
// 												<TableCell>
// 													{t(`table.${key}`)}
// 												</TableCell>
// 												<TableCell>
// 													{isDateType(
// 														notListData[key]
// 													)
// 														? formatDate(
// 																"day",
// 																notListData[key]
// 														  )
// 														: notListData[key]}
// 												</TableCell>
// 											</TableRow>
// 										)
// 									)}
// 							</TableBody>
// 						</Table>
// 					</div>

// 					{data[0] && (
// 						<div className="mt-4 flex justify-end">
// 							<Button
// 								className="ml-auto"
// 								onClick={() => {
// 									// console.log(recoverData(data.map((d) => d.slice(1))))
// 									if (notList)
// 										createFunction.mutate(
// 											recoverData(
// 												data.map((d) => d.slice(1)),
// 												selectedPeriod?.period_id ?? 0,
// 												selectedBonusType,
// 												false,
// 												selectedTableType
// 											)
// 										);
// 									else
// 										batchCreateFunction.mutate(
// 											recoverData(
// 												data.map((d) => d.slice(1)),
// 												selectedPeriod?.period_id ?? 0,
// 												selectedBonusType,
// 												true,
// 												selectedTableType
// 											)
// 										);
// 									closeDialog();
// 								}}
// 							>
// 								{t("button.excel_upload")}
// 							</Button>
// 						</div>
// 					)}
// 				</TabsContent>
// 			</Tabs>
// 		</>
