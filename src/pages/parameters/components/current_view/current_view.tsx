import React, { useContext, useState } from "react";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { type ColumnDef, type Table } from "@tanstack/react-table";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { useDataTableContext } from "../context/data_table_context_provider";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	
	original_columns?: Array<string>;
}
export default function CurrentView<TData>({
	columns,
	data,
	original_columns,
}: DataTableProps<TData>) {
	const { setSelectedTable } = useDataTableContext(); 

	return WithDataTableStandardState({
		columns: columns,
		data,
		props: {},
		original_columns,
		WrappedComponent: CurrentViewContent,
		onUpdate: (table) => {
			setSelectedTable({ table: table });
		},
	});
}

function CurrentViewContent<TData>({ table }: { table: Table<TData> }) {
	const [dataPerRow, setDataPerRow] = useState(1);

	return (
		<>
			{/* table header and body */}
			<div className="h-0 w-full flex-grow">
				<DataTableStandardBody table={table} dataPerRow={dataPerRow} />
			</div>
			{/* table pagination */}
			<DataTablePagination
				table={table}
				setDataPerRow={setDataPerRow}
				className="bg-secondary"
			/>
		</>
	);
}
