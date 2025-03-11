import { type Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import BonusToolbarFunctionsProvider from "./function_sheet/bonus_functions_context";
import { DataTableFunctions } from "./function_sheet/data_table_functions";
import { useContext } from "react";
import dataTableContext from "./context/data_table_context";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import { type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { StatsPanel } from "~/components/data_table/toolbar/stats_panel";
import { DataTableToolbarWrapper } from "~/components/data_table/toolbar/data_table_toolbar_wrapper";
import { usePeriodContext } from "~/components/context/period_context_provider";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	bonusType: BonusTypeEnumType;
	filterColumnKey?: keyof TData;
}

export function DataTableToolbar<TData>({
	table,
	bonusType,
	filterColumnKey,
}: DataTableToolbarProps<TData>) {
	const { selectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = usePeriodContext();

	return (
		<DataTableToolbarWrapper>
			{/* search bar */}
			<div className="flex">
				<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
				<StatsPanel table={table} />
			</div>
			{/* tabs */}
			<div className="flex">
				<DataTableViewOptions table={table} />
				<div className="ml-2 w-12">
					{selectedPeriod && (
						<BonusToolbarFunctionsProvider
							selectedTableType={selectedTableType}
							period_id={selectedPeriod.period_id}
							bonus_type={bonusType}
						>
							<DataTableFunctions tableType={selectedTableType} bonusType={bonusType} />
						</BonusToolbarFunctionsProvider>
					)}
				</div>
			</div>
		</DataTableToolbarWrapper>
	);
}
