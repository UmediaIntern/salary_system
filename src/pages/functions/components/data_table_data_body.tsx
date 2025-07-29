import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "~/components/ui/dialog";

import { Button } from "~/components/ui/button";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/ui/tabs"

import { Table as SimpleTable } from "~/components/ui/table"
import {
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table"
import { cn } from "~/lib/utils";

interface DataTableDataBodyProps<TData> {
	table: Table<TData>;
	dataPerRow: number;
	detailData?: any;
}

export function DataTableDataBody<TData>({
	table,
	dataPerRow,
	detailData,
}: DataTableDataBodyProps<TData>) {

	const [selectedDetailData, setSelectedDetailData] = useState<any>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const rows = table.getRowModel().rows;
	const groupedRows = [];
	for (let i = 0; i < rows.length; i += dataPerRow) {
		groupedRows.push(rows.slice(i, i + dataPerRow));
	}

	return (
		<TableBody>
			{groupedRows?.length ? (
				groupedRows.map((row, rowIdx) => (
					<TableRow
						key={row[0]!.id}
						data-state={row[0]!.getIsSelected() && "selected"}
						className={
							cn(
								detailData
									? "cursor-pointer whitespace-nowrap"
									: "whitespace-nowrap",
							)
						}
						onClick={() => {
							if (detailData) {
								setDialogOpen(true);
								setSelectedDetailData(detailData[rowIdx]);
							}
						}}
					>
						{row.map((data) =>
							data.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									align="center"
									className={cn(
										"max-w-xs",
										cell.id.split("_").slice(1).join("_") == "department" ? "sticky left-[0px] bg-white" :
											cell.id.split("_").slice(1).join("_") == "emp_no" ? "sticky left-[108px] bg-white" :
												cell.id.split("_").slice(1).join("_") == "emp_name" ? "sticky left-[244px] bg-white" :
													""
									)}
								>
									{flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)}
								</TableCell>
							))
						)}
					</TableRow>
				))
			) : (
				<CompNoTableRow cols={table.getAllColumns().length} />
			)}
			<RowDialog />
		</TableBody>
	);

	function getAmountTable(selectedType: string) {
		const { t } = useTranslation(["common"]);

		const amount_list = selectedDetailData ?
			selectedDetailData[selectedType].map((item: any) => item.amount) : [];
		const total = amount_list.reduce((a: number, b: number) => a + b, 0);

		const empty_columns = ["emp_no", "emp_name", "expense_type_name", "amount"];

		return (
			<SimpleTable>
				{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
				<TableHeader>
					<TableRow>
						{selectedDetailData && selectedDetailData[selectedType].length > 0 && Object.keys((selectedDetailData[selectedType][0])).map((key: string) => (
							<TableHead key={`header_${key}`}>{t(`table.${key}`)}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{selectedDetailData && selectedDetailData[selectedType].length > 0 ? (
						selectedDetailData[selectedType].map((item: any, index: number) => (
							<TableRow key={index}>
								{Object.keys(item).map((key: any) => (
									<TableCell key={`row_${index}_${key}`}>{item[key]}</TableCell>
								))}
							</TableRow>
						))
					) : (
						<>
							<TableRow key={"empty_head"}>
								{empty_columns.map((key: any) => (
									<TableHead key={`header_${key}`}>{t(`table.${key}`)}</TableHead>
								))}
							</TableRow>
							<TableRow key={"empty_content"} className="text-center">
								<TableCell colSpan={empty_columns.length} key={`row_${0}_empty"`}>
									{t("table.no_data")}
								</TableCell>
							</TableRow>
						</>
					)}
				</TableBody>
				{
					// selectedDetailData && selectedDetailData.length > 0 && <>
					<>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={3}>{t("table.total")}</TableCell>
								<TableCell className="">{total}</TableCell>
							</TableRow>
						</TableFooter>
					</>
				}
			</SimpleTable>
		);
	}

	function RowDialog() {

		const { t } = useTranslation(["common"]);


		return (
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[50%]">
					<DialogHeader>
						<DialogTitle>{t("table.detail")}</DialogTitle>
						<DialogDescription>
						</DialogDescription>
					</DialogHeader>


					<Tabs defaultValue="other_addition_tax" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="other_addition_tax">{t("table.other_addition_tax")}</TabsTrigger>
							<TabsTrigger value="other_addition">{t("table.other_addition")}</TabsTrigger>
							<TabsTrigger value="other_deduction_tax">{t("table.other_deduction_tax")}</TabsTrigger>
							<TabsTrigger value="other_deduction">{t("table.other_deduction")}</TabsTrigger>

						</TabsList>
						<TabsContent value="other_addition">
							{getAmountTable("other_addition")}
						</TabsContent>
						<TabsContent value="other_addition_tax">
							{getAmountTable("other_addition_tax")}
						</TabsContent>
						<TabsContent value="other_deduction">
							{getAmountTable("other_deduction")}
						</TabsContent>
						<TabsContent value="other_deduction_tax">
							{getAmountTable("other_deduction_tax")}
						</TabsContent>
					</Tabs>
					<DialogFooter></DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}
}

function CompNoTableRow({ cols }: { cols: number }) {
	const { t } = useTranslation(["common"]);
	return (
		<TableRow>
			<TableCell
				colSpan={cols}
				className="h-24 max-w-xs text-center font-medium"
			>
				{t("table.no_data")}
			</TableCell>
		</TableRow>
	);
}
