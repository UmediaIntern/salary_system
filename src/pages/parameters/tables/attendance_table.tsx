import { api } from "~/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_EndDateStr, c_StartDateStr } from "../constant";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { type AttendanceSettingFEType } from "~/server/api/types/attendance_setting_type";
import { Sheet } from "~/components/ui/sheet";
import { useEffect } from "react";
import { attendanceSchema } from "../schemas/configurations/attendance_schema";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { useDataTableContext } from "../components/context/data_table_context_provider";
import { AutoParameterForm } from "../schemas/auto_parameter_form";

type RowItem = {
	parameters: string;
	value: number | string | Date | null;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const attendance_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => {
	const f: RowItemKey[] = ["parameters", "value"];
	return f.map((key) =>
		columnHelper.accessor(key, {
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`table.${key}`)}
					</ColumnHeaderComponent>
				);
			},
			cell: ({ row }) => {
				if (key === "value") {
					if (
						row.original.parameters === c_StartDateStr ||
						row.original.parameters === c_EndDateStr
					) {
						return (
							<div className="text-center font-medium">
								{formatDate(
									"day",
									row.original.value as Date | null
								) ?? ""}
							</div>
						);
					}
				}
				return (
					<div className="text-center font-medium">{`${row.original[
						key
					]?.toString()}`}</div>
				);
			},
		})
	);
};

export function attendanceMapper(
	attendanceData: AttendanceSettingFEType[]
): RowItem[] {
	// TODO: check assertion
	const data = attendanceData[0]!;
	return [
		{
			parameters: "本勞加班1",
			value: data.overtime_by_local_workers_1,
		},
		{
			parameters: "本勞加班2",
			value: data.overtime_by_local_workers_2,
		},
		{
			parameters: "本勞加班3",
			value: data.overtime_by_local_workers_3,
		},
		{
			parameters: "本勞加班4",
			value: data.overtime_by_local_workers_4,
		},
		{
			parameters: "本勞加班5",
			value: data.overtime_by_local_workers_5,
		},
		{
			parameters: "外勞加班1",
			value: data.overtime_by_foreign_workers_1,
		},
		{
			parameters: "外勞加班2",
			value: data.overtime_by_foreign_workers_2,
		},
		{
			parameters: "外勞加班3",
			value: data.overtime_by_foreign_workers_3,
		},
		{
			parameters: "外勞加班4",
			value: data.overtime_by_foreign_workers_4,
		},
		{
			parameters: "外勞加班5",
			value: data.overtime_by_foreign_workers_5,
		},
		{
			parameters: c_StartDateStr,
			value: data.start_date,
		},
		{
			parameters: c_EndDateStr,
			value: data.end_date,
		},
	];
}

interface AttendanceTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function AttendanceTable({ period_id, viewOnly }: AttendanceTableProps) {
	const { t } = useTranslation(["common"]);
	const getAttendance =
		api.parameters.getCurrentAttendanceSetting.useQuery({ period_id });
	const { isPending, content, data } = useQueryHandle(getAttendance);
	const filterKey: RowItemKey = "parameters";

	const { selectedTab, openSheet, setOpenSheet, openDialog, setOpenDialog, mode, setData } =
		useDataTableContext();

	useEffect(() => {
		if (data && selectedTab === "current") {
			setData(data);
		}
	}, [data, setData, selectedTab]);

	if (isPending) {
		return content;
	}

	return (
		<>
			{!viewOnly ? (
				<ParameterToolbarFunctionsProvider
					selectedTableType={"TableAttendance"}
					period_id={period_id}
				>
					<Sheet
						open={openSheet && mode !== "delete"}
						onOpenChange={setOpenSheet}
					>
						<DataTableWithFunctions
							columns={attendance_columns({ t })}
							data={data ? attendanceMapper([data]) : []}
							filterColumnKey={filterKey}
						/>
						<FunctionsSheetContent t={t} period_id={period_id}>
							<AutoParameterForm mode={mode} />
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog
						open={openDialog && mode === "delete"}
						onOpenChange={setOpenDialog}
						schema={attendanceSchema}
					/>
				</ParameterToolbarFunctionsProvider>
			) : (
				<DataTableWithoutFunctions
					columns={attendance_columns({ t })}
					data={attendanceMapper([data!])}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
