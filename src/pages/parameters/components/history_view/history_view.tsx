import React, { useCallback, useContext, useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import ApiFunctionsProvider, {
	apiFunctionsContext,
} from "../context/api_context_provider";
import dataTableContext from "../context/data_table_context";
import { getTableColumn, getTableMapper } from "../../tables/table_columns";
import { DataTable } from "./data_table";
import { useTranslation } from "react-i18next";
import {
	type HistoryDataType,
	type ParameterHistoryQueryFunctionType,
} from "~/components/data_table/history_data_type";
import { formatDate } from "~/lib/utils/format_date";
import { Separator } from "~/components/ui/separator";
import { DateStringPopoverSelector } from "~/components/popover_selector";
import { HistoryViewMenuItem } from "~/components/data_table/history_view/history_view_menu_item";
import { HistoryViewMenu } from "~/components/data_table/history_view/history_view_menu";
import { useHistoryState } from "~/components/data_table/history_view/use_history_state";
import { buildDateSelectOptions } from "~/components/data_table/history_view/utils";
import { usePeriodContext } from "~/components/context/period_context_provider";

export default function HistoryView() {
	const { selectedTableType } = useContext(dataTableContext);

	return (
		<>
			<ApiFunctionsProvider selectedTableType={selectedTableType}>
				<CompHistoryView />
			</ApiFunctionsProvider>
		</>
	);
}

function CompHistoryView() {
	const { t } = useTranslation(["common"]);
	const { selectedTableType, setOpen, setMode, setData } =
		useContext(dataTableContext);

	const queryFunctions = useContext(apiFunctionsContext);
	const queryFunction =
		queryFunctions.queryFunction! as ParameterHistoryQueryFunctionType;

	const filterKey = "name";

	const { isLoading, isError, data, error } = queryFunction();

	const { selectedPeriod } = usePeriodContext();

	const [selectedDateString, setSelectedDateString] = useState<string | null>(
		null
	);

	const onLoad = useCallback(
		(d: HistoryDataType) => {
			setData(d);
			setSelectedDateString(
				formatDate("day", d.start_date) ?? t("others.now")
			);
		},
		[t, setData]
	);

	const {
		selectedData,
		selectedDataList,
		setSelectedData,
		setSelectedDataList,
	} = useHistoryState<HistoryDataType>(isLoading, data, onLoad);

	useEffect(() => {
		const newList = data
			?.filter(
				(e) =>
					e[0] &&
					formatDate("day", e[0].start_date) === selectedDateString
			)
			.map((e) => e[0]!);
		if (newList) {
			setSelectedDataList(newList);
			setData(newList[0]);
		}
	}, [data, setData, setSelectedDataList, selectedDateString]);

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (!data) {
		return <div />;
	}

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={30} minSize={15}>
				<DateStringPopoverSelector
					data={buildDateSelectOptions(data, t("others.now"))}
					selectedKey={selectedDateString}
					setSelectedKey={setSelectedDateString}
				/>
				<Separator />
				<HistoryViewMenu>
					{selectedDataList.map((e) => (
						<HistoryViewMenuItem
							key={e.id}
							id={e.id}
							selected={e.id === selectedData?.id}
							period={selectedPeriod}
							startDate={e.start_date!} // TODO: fix start date type
							endDate={e.end_date}
							updateBy={e.update_by}
							onClick={() => {
								setSelectedData(e);
								setData(e);
							}}
						/>
					))}
				</HistoryViewMenu>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={70}>
				{data.filter((e) => e[0]?.id === selectedData?.id).length >
				0 ? (
					<DataTable
						columns={getTableColumn(
							selectedTableType,
							t,
							selectedPeriod!.period_id,
							setOpen,
							setMode,
							setData
						)}
						data={getTableMapper(selectedTableType)!(
							data.filter(
								(e) => e[0]?.id === selectedData?.id
							)[0]! as any[]
						)}
						filterColumnKey={filterKey}
					/>
				) : (
					<></>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
