import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { isDateType } from "~/lib/utils/check_type";
import { formatDate } from "~/lib/utils/format_date";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface UploadPreviewProps {
	data: any;	// single: any[][], multi: { [key: string]: any[][] }
	multiSheet?: boolean;
	onClick?: () => void;
}

export function UploadPreview({ data, multiSheet, onClick }: UploadPreviewProps) {
	const { t } = useTranslation("common");
	console.log("upload preview", data);

	
	const [selectedSheet, setSelectedSheet] = useState<string>("");
	useEffect(() => {
		if (multiSheet) setSelectedSheet(Object.keys(data)[0]!);
	}, []);



	// if (multiSheet) {
	// 	const first_key: string = Object.keys(data)[0]!;
	// 	data = data[first_key as any]!;
	// }

	function SelectComponent() {
		if (multiSheet) {
			return (
				<Select
					value={selectedSheet}
					onValueChange={setSelectedSheet}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={t("select_sheet")} />
					</SelectTrigger>
					<SelectContent>
						{Object.keys(data).map((key: string) => (
							<SelectItem value={key} key={key}>	
								{key}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		} else {
			return <></>;
		}
	}

	function SingleSheetTable() {
		return <>
				<Table className="">
					<TableHeader>
						<TableRow>
							{(data?.[0] ?? []).map(
								(header: any, index: number) => (index == 0) ? <></> : <TableHead key={index} className="text-center min-w-[100px]">{header}</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.slice(1).map((row: any[], rowIndex: number) => (
								<TableRow key={rowIndex}>
									{row.map(
										(cell: any, cellIndex: number) => {
											if (cellIndex == 0)
												return <></>;
											else
												return (
													<TableCell key={cellIndex} className="text-center">
														{isDateType(cell)? formatDate("day", cell) : cell}
													</TableCell>
												);
										}
									)}
								</TableRow>
							))}
					</TableBody>
			</Table>
		</>;
	}

	function MultiSheetTable() {
		console.log("selectedSheet:", data[selectedSheet]);
		return <>
				<Table className="">
					<TableHeader>
						<TableRow>
							{(data[selectedSheet]?.[0] ?? []).map(
								(header: any, index: number) => (index == 0) ? <></> : <TableHead key={index} className="text-center min-w-[100px]">{header}</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data[selectedSheet]?.slice(1).map((row: any[], rowIndex: number) => (
								<TableRow key={rowIndex}>
									{row.map(
										(cell: any, cellIndex: number) => {
											if (cellIndex == 0)
												return <></>;
											else
												return (
													<TableCell key={cellIndex} className="text-center">
														{isDateType(cell)? formatDate("day", cell) : cell}
													</TableCell>
												);
										}
									)}
								</TableRow>
							))}
					</TableBody>
			</Table>
		</>;
	}

	return (
		<div className="flex h-full w-full flex-col">
				<div className="m-4">
					<SelectComponent />
				</div>
				<div className="flex w-full">			
					<ScrollArea className="max-h-[55vh]">
					{multiSheet ? <MultiSheetTable /> : <SingleSheetTable />}
					<ScrollBar orientation="horizontal" hidden={true} />
					</ScrollArea>
				</div>

			<div className="mt-4 flex justify-end">
				<Button className="ml-auto" onClick={onClick}>
					{t("button.excel_upload")}
				</Button>
			</div>
		</div>
	);
}