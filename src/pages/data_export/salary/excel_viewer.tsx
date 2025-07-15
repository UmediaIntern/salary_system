import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Baseline, PaintBucket } from "lucide-react";
import { ColorPickerWrapper } from "./color_picker_wrapper";

import { useTranslation } from "react-i18next";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

const DEFAULT_TEXT_COLOR = "#000000";
const DEFAULT_BACKGROUND_COLOR = "#ffffff";
const DEFAULT_HEADER_BACKGROUND_COLOR = "#d0d0d0";
const formatColor = (colorCode: string, colorMode: "text" | "background") => {
	return colorMode == "text" ? `text-[${colorCode}]` : `bg-[${colorCode}]`;
};

interface ExcelSheet {
	sheetName: string;
	data: string[][];
}

interface ExcelSheetWithColor {
	sheetName: string;
	data: Block[][] | null;
}

interface ExcelViewerProps {
	original_sheets: ExcelSheet[];
	selectedSheetIndex: number;
	setSelectedSheetIndex: (index: number) => void;
	filter_component: JSX.Element;
	selected_excel_name: string;
	selectedExcelComponent: JSX.Element;
}

interface Block {
	content: string;
	textColor: string;
	backgroundColor: string;
}

const handleExportExcel = async (
	datas: ExcelSheetWithColor[],
	filename: string,
	Translate: (key: string) => string
) => {
	const workbook = new ExcelJS.Workbook();

	function getCellName(rowIndex: number, colIndex: number): string {
		const columnName = getColumnLetter(colIndex);
		return columnName + (rowIndex + 1);
	}

	function getColumnLetter(colIndex: number): string {
		let columnName = "";
		while (colIndex >= 0) {
			const remainder = colIndex % 26;
			columnName = String.fromCharCode(65 + remainder) + columnName;
			colIndex = Math.floor(colIndex / 26) - 1;
			if (colIndex < 0) {
				break;
			}
		}
		return columnName;
	}

	if (datas) {
		datas.map((sheetdata: ExcelSheetWithColor, _si: number) => {
			const name = sheetdata.sheetName;
			const worksheet = workbook.addWorksheet(
				name === "" ? "blank" : name
			);
			try {
				if (!sheetdata.data) return;
				sheetdata.data.map((row: Block[], i: number) => {
					if (i === 0) {
						worksheet.addRow(
							row.map((cell: Block) =>
								Translate(`table.${cell.content}`)
							)
						);
					} else {
						worksheet.addRow(
							row.map((cell: Block) => cell.content)
						);
					}
				});
			} catch {}

			if (sheetdata.data)
				sheetdata.data.forEach((row: Block[], ri: number) => {
					row.forEach((cellProps: Block, ci: number) => {
						const cellName = getCellName(ri, ci);
						const cell = worksheet.getCell(cellName);

						// Set text color
						if (cellProps.textColor) {
							const textColor = cellProps.textColor.substring(1); // Remove '#' from color code
							cell.font = { color: { argb: textColor } };
						}

						// Set background color
						if (cellProps.backgroundColor) {
							const bgColor =
								cellProps.backgroundColor.substring(1); // Remove '#' from color code
							cell.fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: { argb: bgColor },
							};
						}

						cell.border = {
							top: { style: "thin" },
							left: { style: "thin" },
							bottom: { style: "thin" },
							right: { style: "thin" },
						};
					});
				});
		});
	}

	// Save the workbook to a file
	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
};

export function ExcelViewer({
	original_sheets,
	selectedSheetIndex,
	setSelectedSheetIndex,
	filter_component,
	selected_excel_name,
	selectedExcelComponent,
}: ExcelViewerProps) {
	const [mode, setMode] = useState("view");
	const [selectedCell, setSelectedCell] = useState<{
		rowIndex: number;
		colIndex: number;
	}>({ rowIndex: -1, colIndex: -1 });

	const [sheets, setSheets] = useState<ExcelSheetWithColor[]>([]);

	const { t } = useTranslation(["common"]);

	useEffect(() => {
		const tmpSheets: ExcelSheetWithColor[] = [];
		original_sheets.map((s: ExcelSheet) => {
			const tmpSheetName = s.sheetName;
			const tmpSheetData: Block[][] | null = s.data
				? s.data.map((row: string[], row_index: number) => {
						return row.map((cell: string, _col_index: number) => {
							if (row_index === 0) {
								return {
									content: cell,
									textColor: DEFAULT_TEXT_COLOR,
									backgroundColor:
										DEFAULT_HEADER_BACKGROUND_COLOR,
								};
							} else
								return {
									content: cell,
									textColor: DEFAULT_TEXT_COLOR,
									backgroundColor: DEFAULT_BACKGROUND_COLOR,
								};
						});
				  })
				: null;
			tmpSheets.push({
				sheetName: tmpSheetName,
				data: tmpSheetData,
			});
		});
		setSheets(tmpSheets);
	}, [original_sheets]);

	const setSelectedIndexWithName = (queryName: string) => {
		let selectedIndex = -1;
		sheets.map((sheet: ExcelSheetWithColor, index: number) => {
			if (sheet.sheetName === queryName) selectedIndex = index;
		});
		setSelectedSheetIndex(selectedIndex);
	};

	function SelectSheetComponent() {
		const selectedSheet = sheets[selectedSheetIndex]!;
		return (
			<>
				{selectedSheet && (
					<Select
						value={selectedSheet.sheetName}
						onValueChange={(value) => {
							setSelectedIndexWithName(value);
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a sheet" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Sheets</SelectLabel>
								{sheets.map(
									(sheetdata: ExcelSheetWithColor) => {
										return (
											<SelectItem
												key={sheetdata.sheetName}
												value={sheetdata.sheetName}
											>
												{sheetdata.sheetName}
											</SelectItem>
										);
									}
								)}
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			</>
		);
	}

	function changeSheets(
		sheetIndex: number,
		rowIndex: number,
		colIndex: number,
		key: "content" | "textColor" | "backgroundColor",
		newValue: string
	) {
		const tmpSheets: ExcelSheetWithColor[] = [];
		sheets.map((s: ExcelSheetWithColor, si: number) => {
			const tmpSheetName = s.sheetName;
			const tmpSheetData: Block[][] | null = s.data
				? s.data.map((row: Block[], ri: number) => {
						return row.map((cell: Block, ci: number) => {
							if (
								si === sheetIndex &&
								ri === rowIndex &&
								ci === colIndex
							)
								return {
									content:
										key === "content"
											? newValue
											: cell.content,
									textColor:
										key === "textColor"
											? newValue
											: cell.textColor,
									backgroundColor:
										key === "backgroundColor"
											? newValue
											: cell.backgroundColor,
								};
							else return cell;
						});
				  })
				: null;
			tmpSheets.push({
				sheetName: tmpSheetName,
				data: tmpSheetData,
			});
		});
		setSheets(tmpSheets);
	}

	function SheetTable() {
		const selectedSheet = sheets[selectedSheetIndex]!;
		return (
			selectedSheet?.data?.[0] && (
				<table className="w-full border-collapse border">
					<thead>
						<tr>
							{selectedSheet.data[0].map((cell, index) => (
								<th
									key={index}
									className={`inset-0 truncate border px-4 py-2 leading-6`}
									style={{
										backgroundColor: cell.backgroundColor,
									}}
								>
									<div
										style={{
											color: cell.textColor,
										}}
									>
										{/* {t(`table.${cell.content}`)} */}
										{t([`table.${cell.content}`, `others.${cell.content}`, `TODO.${cell.content}`])}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{selectedSheet.data.slice(1).map((row, rowIndex) => (
							<tr key={rowIndex}>
								{row.map((cell, cellIndex) => (
									<td
										key={cellIndex}
										className={`relative truncate px-4 py-2 leading-6 ${formatColor(
											cell.textColor,
											"text"
										)} ${formatColor(
											cell.backgroundColor,
											"background"
										)}`}
										onClick={() => {
											setSelectedCell({
												rowIndex: rowIndex + 1,
												colIndex: cellIndex,
											});
										}}
										style={{
											color: cell.textColor,
											backgroundColor:
												cell.backgroundColor,
										}}
									>
										<div
											className={cn(
												"absolute inset-0 border",
												selectedCell.rowIndex - 1 ===
													rowIndex &&
													selectedCell.colIndex ===
														cellIndex &&
													mode === "edit" &&
													"border-2 border-primary"
											)}
										></div>
										<div className="relative z-10">
											{typeof cell.content == "string"
												? cell.content
												: typeof cell.content ==
												  "boolean"
												? cell.content
													? "Y"
													: "N"
												: cell.content}
										</div>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)
		);
	}

	function BgColorControlComponent() {
		const [openSignal, setOpenSignal] = useState(false);
		return (
			<>
				<Popover open={openSignal} onOpenChange={setOpenSignal}>
					<PopoverTrigger asChild>
						<Button variant={"ghost"}>
							<PaintBucket className="hover:cursor-pointer" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<ColorPickerWrapper
							initialColor={
								(sheets[selectedSheetIndex]!.data ?? [])
									.findLast(
										(rows, r_idx) =>
											r_idx === selectedCell.rowIndex
									)
									?.findLast(
										(cols, c_idx) =>
											c_idx === selectedCell.colIndex
									)?.backgroundColor ??
								DEFAULT_BACKGROUND_COLOR
							}
							setFinalColor={(newColor: string) => {
								changeSheets(
									selectedSheetIndex,
									selectedCell.rowIndex,
									selectedCell.colIndex,
									"backgroundColor",
									newColor
								);
								setOpenSignal(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	}

	function TextColorControlComponent() {
		const [openSignal, setOpenSignal] = useState(false);
		return (
			<>
				<Popover open={openSignal} onOpenChange={setOpenSignal}>
					<PopoverTrigger asChild>
						<Button variant={"ghost"}>
							<Baseline className="hover:cursor-pointer" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<ColorPickerWrapper
							initialColor={
								(sheets[selectedSheetIndex]!.data ?? [])
									.findLast(
										(rows, r_idx) =>
											r_idx === selectedCell.rowIndex
									)
									?.findLast(
										(cols, c_idx) =>
											c_idx === selectedCell.colIndex
									)?.textColor ?? DEFAULT_BACKGROUND_COLOR
							}
							setFinalColor={(newColor: string) => {
								changeSheets(
									selectedSheetIndex,
									selectedCell.rowIndex,
									selectedCell.colIndex,
									"textColor",
									newColor
								);
								setOpenSignal(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	}

	function ColorControlComponent() {
		return (
			mode == "edit" && (
				<>
					<div className="">
						<BgColorControlComponent />
					</div>
					<div className="mr-2">
						<TextColorControlComponent />
					</div>
				</>
			)
		);
	}

	function EditButton() {
		return (
			<Button
				className="mr-2"
				variant={mode === "view" ? "outline" : "destructive"}
				onClick={() => {
					if (mode === "view") {
						setMode("edit");
					} else if (mode === "edit") {
						setMode("view");
					}
					setSelectedCell({
						rowIndex: -1,
						colIndex: -1,
					});
				}}
			>
				{mode === "view" ? t("button.edit") : t("button.done")}
			</Button>
		);
	}

	function DownloadButton({ defaultFilename }: { defaultFilename: string }) {
		const [filename, setFilename] = useState(t(`others.${defaultFilename}`));
		return (
			<div className={mode != "view" ? "cursor-not-allowed" : ""}>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant={"outline"} disabled={mode !== "view"}>
							{t("button.download")}
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[625px]">
						<DialogHeader>
							<DialogTitle>{t("others.excel_download_title")}</DialogTitle>
							<DialogDescription>
								{/* You may change the text and background color in
								each cell before download. */}
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-5 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									{t("others.excel_export_filename")}
								</Label>
								<Input
									id="filename"
									value={filename}
									onChange={(e) => {
										setFilename(e.target.value);
									}}
									className="col-span-3"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="submit"
								onClick={() => {
									handleExportExcel(
										sheets,
										`${filename}.xlsx`,
										t
									);
								}}
							>
								{t("button.download")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<>
			<div className="mb-4 flex flex-row justify-between">
				<div className="flex space-x-4">
					{selectedExcelComponent}
					<SelectSheetComponent />
					{filter_component}
				</div>
				<div className="flex">
					<ColorControlComponent />
					<EditButton />
					<DownloadButton defaultFilename={selected_excel_name} />
				</div>
			</div>
			<div className="relative min-h-0 w-full grow rounded-md bg-muted">
				<ScrollArea className="h-full w-full p-4">
					<SheetTable />
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</>
	);
}
