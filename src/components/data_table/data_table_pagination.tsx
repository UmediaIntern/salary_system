import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { Input } from "../ui/input";
import { ChevronFirstIcon, ChevronLastIcon } from "lucide-react";

interface DataTablePaginationProps<TData>
	extends React.HTMLAttributes<HTMLDivElement> {
	table: Table<TData>;
	setDataPerRow?: (dataPerRow: number) => void;
}

export function DataTablePagination<TData>({
	table,
	setDataPerRow,
	className,
}: DataTablePaginationProps<TData>) {
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const dataNum = table.getFilteredRowModel().rows.length;
	const [rowNum, setRowNum] = React.useState(10);
	const [columnNum, setColumnNum] = React.useState(1);
	const [displayPageIndex, setDisplayPageIndex] = React.useState(
		(pageIndex + 1).toString()
	);

	useEffect(() => {
		setDisplayPageIndex((pageIndex + 1).toString());
	}, [pageIndex]);

	const { t } = useTranslation(["common"]);

	return (
		<div
			className={cn(
				"flex flex-wrap items-center justify-end gap-y-1 p-2",
				className
			)}
		>
			{/* Showing results */}
			<div className="text-sm text-muted-foreground">
				{
					<div className="min-w-[100px]">
						{t("others.data_num_template")
							.replace(
								"$1",
								(pageIndex * pageSize + 1).toString()
							)
							.replace(
								"$2",
								Math.min(
									(pageIndex + 1) * pageSize,
									dataNum
								).toString()
							)
							.replace("$3", dataNum.toString())}
					</div>
				}
			</div>
			{/* Select data layout */}
			<div className="mx-2 flex flex-1 items-center justify-center text-sm text-muted-foreground">
				<Select
					defaultValue="10"
					onValueChange={(value) => {
						setRowNum(Number(value));
						table.setPageSize(columnNum * Number(value));
					}}
				>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Data Per Row" />
					</SelectTrigger>
					<SelectContent>
						{Array.from({ length: 10 }, (_, i) => i).map(
							(value) => (
								<SelectItem
									key={value}
									value={(value + 1).toString()}
								>
									{t("others.row_template").replace(
										"$1",
										(value + 1).toString()
									)}
								</SelectItem>
							)
						)}
					</SelectContent>
				</Select>
				<div className="w-2" />
				{setDataPerRow && (
					<Select
						defaultValue="1"
						onValueChange={(value) => {
							setColumnNum(Number(value));
							setDataPerRow(Number(value));
							table.setPageSize(rowNum * Number(value));
						}}
					>
						<SelectTrigger className="w-36">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 5 }, (_, i) => i).map(
								(value) => (
									<SelectItem
										key={value}
										value={(value + 1).toString()}
									>
										{t("others.col_template").replace(
											"$1",
											(value + 1).toString()
										)}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				)}
			</div>
			{/* Pagination */}
			<div className="ml-2 flex justify-end">
				<div className=" flex items-center space-x-4">
					<div className="w-30 flex items-center justify-center text-sm font-medium">
						<div>
							{
								t("others.page_template")
									.replace(
										"$2",
										table.getPageCount().toString()
									)
									.split("$1")[0]
							}
						</div>
						<Input
							className="mx-1 flex h-6 w-10 p-0 text-center"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.currentTarget.blur();
								}
							}}
							onBlur={(e) => {
								const page = Number(e.target.value);
								if (isNaN(page) || page <= 0) {
									setDisplayPageIndex("1");
									table.setPageIndex(0);
								}
								if (page >= table.getPageCount()) {
									setDisplayPageIndex(
										table.getPageCount().toString()
									);
									table.setPageIndex(
										table.getPageCount() - 1
									);
								}
							}}
							onChange={(e) => {
								setDisplayPageIndex(e.target.value);
								if (e.target.value === "") return;
								const page = Number(e.target.value);
								if (page > 0 && page <= table.getPageCount()) {
									table.setPageIndex(page - 1);
								}
							}}
							value={displayPageIndex}
						/>
						<div>
							{
								t("others.page_template")
									.replace(
										"$2",
										table.getPageCount().toString()
									)
									.split("$1")[1]
							}
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="h-10 w-10"
							size="icon"
							onClick={() => table.firstPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronFirstIcon />
						</Button>
						<Button
							variant="outline"
							className="h-10 w-10"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeftIcon />
							{/* {t("button.previous_page")} */}
						</Button>
						<Button
							variant="outline"
							className="h-10 w-10"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							{/* {t("button.next_page")} */}
							<ChevronRightIcon />
						</Button>
						<Button
							variant="outline"
							className="h-10 w-10"
							size="icon"
							onClick={() => table.lastPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronLastIcon />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
