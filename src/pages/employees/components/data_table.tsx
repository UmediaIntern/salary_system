import * as React from "react";
import { type VisibilityState, type ColumnDef, type Table } from "@tanstack/react-table";
import { Separator } from "~/components/ui/separator";

import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { useDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { DataTableToolbar } from "./data_table_toolbar";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey?: keyof TData;
	initialColumnVisibility?: VisibilityState;
}

export function DataTable<TData>({
	columns,
	data,
	filterColumnKey,
	initialColumnVisibility,
}: DataTableProps<TData>) {
  const table = useDataTableStandardState({
		columns,
		data,
		initialColumnVisibility,
  })

  return <DataTableContent table={table} filterColumnKey={filterColumnKey}/>
}

function DataTableContent<TData>({
	table,
	filterColumnKey,
}: {
	table: Table<TData>;
	filterColumnKey?: keyof TData;
}) {
	const [dataPerRow, setDataPerRow] = React.useState(1);

	return (
		<div className="flex h-full w-full flex-col rounded-md border">
			<DataTableToolbar
				table={table}
				filterColumnKey={filterColumnKey}
			/>
			<Separator />
			<div className="h-0 flex-grow">
				<DataTableStandardBody table={table} dataPerRow={dataPerRow} />
			</div>
			<DataTablePagination
				table={table}
				setDataPerRow={setDataPerRow}
				className="bg-secondary"
			/>
		</div>
	);
}
