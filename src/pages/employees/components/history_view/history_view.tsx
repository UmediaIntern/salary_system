import { useCallback, useContext, useEffect, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { DataTable } from "./history_data_table";
import { type HistoryDataType } from "~/components/data_table/history_data_type";
import { type ColumnDef } from "@tanstack/react-table";
import { Separator } from "~/components/ui/separator";
import { EmployeePopoverSelector } from "~/components/popover_selector";
import { HistoryViewMenuItem } from "~/components/data_table/history_view/history_view_menu_item";
import { HistoryViewMenu } from "~/components/data_table/history_view/history_view_menu";
import { buildEmployeeSelectOptions } from "~/components/data_table/history_view/utils";
import { useHistoryState } from "~/components/data_table/history_view/use_history_state";
import { type HistoryViewEmployeeCommonEmpInfo } from "~/components/data_table/history_view/types";
import { usePeriodContext } from "~/components/context/period_context_provider";

// TODO: delete this type and use HistoryViewEmployeeCommonEmpInfo instead
export interface EmployeeHistoryViewCommonEmpInfo {
	emp_name?: string;
	emp_no: string;
}

type DataRow = HistoryViewEmployeeCommonEmpInfo & HistoryDataType;

interface DataTableProps<TData extends DataRow> {
	columns: ColumnDef<TData, any>[];
	data: TData[][];
	defaultColumn?: Partial<ColumnDef<TData, unknown>>;
}

export function HistoryView<TData extends DataRow>({
	data,
	columns,
	defaultColumn
}: DataTableProps<TData>) {
	const { selectedPeriod } = usePeriodContext();

	const [selectedEmpNo, setSelectedEmpNo] = useState<string | null>(null);

	const onLoad = useCallback((d: TData) => {
		setSelectedEmpNo(d.emp_no);
	}, []);

	const {
		selectedData,
		selectedDataList,
		setSelectedData,
		setSelectedDataList,
	} = useHistoryState<TData>(false, data, onLoad);

	useEffect(() => {
		const newList = data?.find(
			(empDataList) => empDataList[0]?.emp_no === selectedEmpNo,
		);
		if (newList) {
			setSelectedDataList(newList);
		}
	}, [selectedEmpNo, data, setSelectedDataList]);

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={25} minSize={15}>
				<EmployeePopoverSelector
					data={buildEmployeeSelectOptions(data)}
					selectedKey={selectedEmpNo}
					setSelectedKey={setSelectedEmpNo}
				/>
				<Separator />
				<HistoryViewMenu>
					{selectedDataList.map((e) => (
						<HistoryViewMenuItem
							key={e.id}
							id={e.id}
							selected={e.id === selectedData?.id}
							period={selectedPeriod}
							startDate={e.start_date!} // TODO: start_date should not be null
							endDate={e.end_date}
							updateBy={e.update_by}
							onClick={() => setSelectedData(e)}
						/>
					))}
				</HistoryViewMenu>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={75}>
				{selectedData ? (
					<DataTable
						columns={columns}
						data={selectedData ? [selectedData] : []}
						defaultColumn={defaultColumn}
					/>
				) : (
					<p>No find selected</p>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
