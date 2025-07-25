import { api } from "~/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";
import { type LevelRangeFEType } from "~/server/api/types/level_range_type";
import { formatDate } from "~/lib/utils/format_date";
import { type TFunction } from "i18next";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { levelRangeSchema } from "../schemas/configurations/level_range_schema";
import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { type FunctionsItem } from "../components/context/data_table_context";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { useDataTableContext } from "../components/context/data_table_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { AutoParameterForm } from "../schemas/auto_parameter_form";

export type RowItem = {
	type: string;
	level_start: number;
	level_end: number;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof Omit<RowItem, "functions">;

const columnHelper = createColumnHelper<RowItem>();

export const level_range_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => {
	const f: RowItemKey[] = [
		"type",
		"level_start",
		"level_end",
		"start_date",
		"end_date",
	];
	return [
		...f.map((key) =>
			columnHelper.accessor(key, {
				header: ({ column }) => {
					return (
						<ColumnHeaderComponent column={column}>
							{t(`table.${key}`)}
						</ColumnHeaderComponent>
					);
				},
				cell: ({ row }) => {
					let content = "";
					switch (key) {
						case "start_date":
							content =
								formatDate("day", row.original.start_date) ??
								"";
							break;
						case "end_date":
							content =
								formatDate("day", row.original.end_date) ?? "";
							break;
						default:
							content = row?.original[key]?.toString() ?? "";
					}
					return <ColumnCellComponent>{content}</ColumnCellComponent>;
				},
			})
		),
		columnHelper.accessor("functions", {
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`others.functions`)}
					</ColumnHeaderComponent>
				);
			},
			cell: ({ row }) => {
				return <LevelRangeFunctionComponent data={row.original} />;
			},
		}),
	];
};

function LevelRangeFunctionComponent({ data }: { data: RowItem }) {
	const { setOpenSheet, setOpenDialog, setMode, setData, enableFunctions } =
		useDataTableContext();

	return (
		<FunctionsComponent
			setOpenSheet={setOpenSheet}
			setOpenDialog={setOpenDialog}
			setMode={setMode}
			data={data}
			setData={setData}
			disabled={!enableFunctions}
		/>
	);
}

export function levelRangeMapper(
	levelRangeData: LevelRangeFEType[]
): RowItem[] {
	return levelRangeData.map((d) => {
		return {
			id: d.id,
			type: d.type,
			level_start: d.level_start,
			level_end: d.level_end,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
		};
	});
}

interface LevelRangeTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function LevelRangeTable({ period_id, viewOnly }: LevelRangeTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		mode,
		openSheet,
		setOpenSheet,
		openDialog,
		setOpenDialog,
	} = useDataTableContext();
	const getLevelRange = api.parameters.getCurrentLevelRange.useQuery({
		period_id,
	});
	const { isPending, content, data } = useQueryHandle(getLevelRange);
	const filterKey: RowItemKey = "type";

	if (isPending) {
		return content;
	}

	const columns = level_range_columns({
		t,
	});

	return !viewOnly ? (
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableLevelRange"}
			period_id={period_id}
		>
			<Sheet
				open={openSheet && mode !== "delete"}
				onOpenChange={setOpenSheet}
				aria-hidden={false}
			>
				<DataTableWithFunctions
					columns={columns}
					data={levelRangeMapper(data)}
					filterColumnKey={filterKey}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<AutoParameterForm />
				</FunctionsSheetContent>
			</Sheet>
			<ConfirmDialog
				open={openDialog && mode === "delete"}
				onOpenChange={setOpenDialog}
				schema={levelRangeSchema}
			/>
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={columns}
			data={levelRangeMapper(data)}
			filterColumnKey={filterKey}
		/>
	);
}
