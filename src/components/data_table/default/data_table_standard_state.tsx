import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type Table,
	type VisibilityState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { type ComponentType, useEffect, useState } from "react";

import { RowData } from "@tanstack/table-core";
declare module "@tanstack/table-core" {
	interface TableMeta<TData extends RowData> {
		original_columns: Array<string> | undefined;
	}
}

type WithTableProps<TableT, P> = { table: TableT } & P;

interface DataTableStandardStateProps<TData> {
	columns: ColumnDef<TData, unknown>[];
	data: TData[];
	defaultColumn?: Partial<ColumnDef<TData, unknown>>;
	originalColumns?: Array<string>;
	initialColumnVisibility?: VisibilityState;
}

interface WithDataTableStandardStateProps<TData, P> extends DataTableStandardStateProps<TData> {
	WrappedComponent: ComponentType<WithTableProps<Table<TData>, P>>;
	onUpdate?: (table: Table<TData>) => void;
	props: P;
}

export function useDataTableStandardState<TData>({
	columns,
	data,
	originalColumns,
	defaultColumn,
	initialColumnVisibility = {},
}: DataTableStandardStateProps<TData>) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialColumnVisibility
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		defaultColumn,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),

		meta: {
			original_columns: originalColumns,
		},
	});

	return table;
}

export function WithDataTableStandardState<TData, P>({
	columns,
	data,
	WrappedComponent,
	onUpdate,
	props,
	originalColumns: original_columns,
	initialColumnVisibility = {},
}: WithDataTableStandardStateProps<TData, P>) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialColumnVisibility
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),

		meta: {
			original_columns: original_columns,
		},
	});

	useEffect(() => {
		onUpdate && onUpdate(table);
	}, [columnVisibility, table]);

	return <WrappedComponent {...props} table={table} />;
}
