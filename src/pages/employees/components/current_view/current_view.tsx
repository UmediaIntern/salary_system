import { type ColumnDef } from "@tanstack/react-table";
import { useDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { useEmployeeTableContext } from "../context/data_table_context_provider";
import { CurrentViewTable } from "~/components/data_table/current_view/current_view_table";
import { useEffect } from "react";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	defaultColumn?: Partial<ColumnDef<TData, unknown>>;
}

export function CurrentView<TData>({
	columns,
	data,
	defaultColumn,
}: DataTableProps<TData>) {
	const { setSelectedTable } = useEmployeeTableContext();

	const table = useDataTableStandardState({
		columns,
		data,
		defaultColumn,
	});

	useEffect(() => {
		setSelectedTable({ table: table });
	}, [setSelectedTable, table]);

	return <CurrentViewTable table={table} />;
}
