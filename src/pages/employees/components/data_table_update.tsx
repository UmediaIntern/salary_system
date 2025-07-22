import { type PropsWithChildren } from "react";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { DataTableToolbarUpdate } from "./data_table_toolbar_update";
import { EmpTabsEnum } from "./context/employee_tabs_enum";
import { type HistoryDataType } from "~/components/data_table/history_data_type";
import { useEmployeeTableContext } from "./context/data_table_context_provider";
import { CurrentViewSelector } from "./current_view/current_view_selector";
import { HistoryViewSelector } from "./history_view/history_view_selector";
import { type HistoryViewEmployeeCommonEmpInfo } from "~/components/data_table/history_view/types";

type DataRow = HistoryViewEmployeeCommonEmpInfo & HistoryDataType;

interface DataTableProps<TData extends DataRow> {
	filterColumnKey?: keyof TData;
}

export function DataTableUpdate<TData extends DataRow>({
	children,
	filterColumnKey,
}: PropsWithChildren<DataTableProps<TData>>) {
	const { selectedTab, setSelectedTab } = useEmployeeTableContext();

	return (
		<Tabs
			defaultValue={selectedTab}
			className="h-full w-full"
			onValueChange={(tab) => {
				setSelectedTab(EmpTabsEnum.parse(tab));
			}}
		>
			<div className="flex h-full w-full flex-col rounded-md border">
				<DataTableToolbarUpdate filterColumnKey={filterColumnKey} />
				<Separator />
				<TabsContent value={EmpTabsEnum.Enum.current} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
						<CurrentViewSelector />
					</div>
				</TabsContent>
				<TabsContent value={EmpTabsEnum.Enum.history} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
						<HistoryViewSelector />
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
