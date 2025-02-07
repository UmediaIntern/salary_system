import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import { useContext } from "react";
import periodContext from "~/components/context/period_context";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmpTabsEnum } from "./context/employee_tabs_enum";
import { useTranslation } from "react-i18next";
import { DataTableToolbarWrapper } from "~/components/data_table/toolbar/data_table_toolbar_wrapper";
import { StatsPanel } from "~/components/data_table/toolbar/stats_panel";
import { useEmployeeTableContext } from "./context/data_table_context_provider";
import { TableFunctionMenuSelector } from "./function_sheet/table_function_selector";
import { Skeleton } from "~/components/ui/skeleton";

interface DataTableToolbarProps<TData> {
	filterColumnKey?: keyof TData;
}

export function DataTableToolbarUpdate<TData>({
	filterColumnKey,
}: DataTableToolbarProps<TData>) {
	const { selectedTable } = useEmployeeTableContext();
	const { selectedPeriod } = useContext(periodContext);

	const { t } = useTranslation(["common"]);

	const table = selectedTable?.table;

	if (!table) {
		return <Skeleton className="h-12 w-full" />; // TODO: Loading element with toast
	}

	return (
		<DataTableToolbarWrapper>
			{/* search bar */}
			<div className="flex">
				<ToolbarFilter
					table={table}
					filterColumnKey={filterColumnKey}
				/>
				<StatsPanel table={table} />
			</div>
			{/* tabs */}
			<TabsList className="grid h-8 w-96 grid-cols-2">
				<TabsTrigger value={EmpTabsEnum.Enum.current} className="h-6">
					{t("table.current")}
				</TabsTrigger>
				<TabsTrigger value={EmpTabsEnum.Enum.history} className="h-6">
					{t("table.history")}
				</TabsTrigger>
			</TabsList>
			{/* functions */}
			<div className="flex">
				<DataTableViewOptions table={table} />
				<div className="ml-2 w-12">
					{selectedPeriod && <TableFunctionMenuSelector />}
				</div>
			</div>
		</DataTableToolbarWrapper>
	);
}
