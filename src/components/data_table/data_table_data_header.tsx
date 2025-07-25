import { type Table } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { cn } from "~/lib/utils";

interface DataTableDataHeaderProps<TData> {
	table: Table<TData>;
	dataPerRow: number;
}

export function DataTableDataHeader<TData>({
	table,
	dataPerRow,
}: DataTableDataHeaderProps<TData>) {
	const dataPerRowList = [...Array(dataPerRow).keys()];
	return (
		<TableHeader className="bg-secondary">
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow
					key={headerGroup.id}
					className="sticky top-0 bg-secondary hover:bg-secondary whitespace-nowrap z-10"
				>
					{dataPerRowList.map(() =>
						headerGroup.headers.map((header) => {
							return (
								<TableHead
									key={header.id}
									className={cn(
										"text-center z-10 px-2",
										header.id == "department" ? "sticky left-0 bg-secondary" :
											header.id == "emp_no" ? "sticky left-[108px] bg-secondary" :
												header.id == "emp_name" ? "sticky left-[244px] bg-secondary" :
													""
									)}
									colSpan={header.colSpan}
								>
									{header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
								</TableHead>
							);
						})
					)}
				</TableRow>
			))}
		</TableHeader>
	);
}
