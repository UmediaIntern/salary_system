import { type ColumnDef, type Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { useDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { useEmployeeTableContext } from "../context/data_table_context_provider";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
	const { setSelectedTable } = useEmployeeTableContext();

	const table = useDataTableStandardState({
		columns: columns,
		data,
	});

	useEffect(() => {
		setSelectedTable({ table: table });
	}, [setSelectedTable, table]);

	return <HistoryViewContent table={table} />;
}

function HistoryViewContent<TData>({ table }: { table: Table<TData> }) {
	const [dataPerRow, setDataPerRow] = useState(1);

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-0 w-full flex-grow flex-col">
				{/* table header and body */}
				<div className="h-0 w-full flex-grow">
					<DataTableStandardBody
						table={table}
						dataPerRow={dataPerRow}
					/>
				</div>
				{/* table pagination */}
				<DataTablePagination
					table={table}
					setDataPerRow={setDataPerRow}
					className="bg-secondary"
				/>
			</div>
		</div>
	);
}
