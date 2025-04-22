import { type ColumnDef } from "@tanstack/react-table";
import { DataTableToolbar } from "./data_table_toolbar";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { TabsEnum } from "./context/tabs_enum";
import CompHistoryView from "./history_view/history_view";
import CurrentView from "./current_view/current_view";
import { hasHistory } from "./data_table_tabs_config";
import { useDataTableContext } from "./context/data_table_context_provider";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey?: keyof TData;
	showTabs?: boolean;
	original_columns?: Array<string>;
}

export function DataTable<TData>({
	columns,
	data,
	showTabs,
	original_columns
}: DataTableProps<TData>) {

	const { selectedTab, setSelectedTab, selectedTableType } =
		useDataTableContext()

	return (
		<Tabs
			defaultValue={
				selectedTab !== TabsEnum.Enum.current &&
				!hasHistory(selectedTableType)
					? TabsEnum.Enum.current
					: selectedTab
			}
			className="h-full w-full"
			onValueChange={(tab) => {
				setSelectedTab(TabsEnum.parse(tab));
			}}
		>
			<div className="flex h-full flex-col">
				<DataTableToolbar
					showTabs={showTabs}
				/>
				<Separator />
				<TabsContent value={TabsEnum.Enum.current} asChild>
					<div className="flex h-0 w-full flex-grow flex-col">
						<CurrentView columns={columns} data={data} original_columns={original_columns}/>
					</div>
				</TabsContent>
				<TabsContent
					value={TabsEnum.Enum.history}
					asChild
					className="m-0"
				>
					<div className="flex h-0 w-full flex-grow flex-col">
						<CompHistoryView />
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
