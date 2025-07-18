import * as React from "react";
import { type Table, type ColumnDef } from "@tanstack/react-table";

import { Separator } from "~/components/ui/separator";

import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "~/components/data_table/default/data_table_standard_body";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

import { useContext } from "react";
import dataTableContext from "../context/data_table_context";
import { DataTableToolbar } from "./data_table_toolbar";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	bonusType: BonusTypeEnumType;
	filterColumnKey?: keyof TData;
}

export function DataTable<TData>({
	columns,
	data,
	bonusType,
	filterColumnKey,
}: DataTableProps<TData>) {
	const { setSelectedTable } = useContext(dataTableContext);
	return WithDataTableStandardState({
		columns: columns,
		data,
		props: { bonusType, filterColumnKey },
		WrappedComponent: DataTableContent,

		onUpdate: (table) => {
			setSelectedTable({ table: table });
		},
	});
}

function DataTableContent<TData>({
	table,
	bonusType,
	filterColumnKey,
}: {
	table: Table<TData>;
	bonusType: BonusTypeEnumType;
	filterColumnKey?: keyof TData;
}) {
	const [dataPerRow, setDataPerRow] = React.useState(1);

	return (
		<div className="flex h-full w-full flex-col rounded-md border">
			<DataTableToolbar table={table} filterColumnKey={filterColumnKey} bonusType={bonusType} />
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

