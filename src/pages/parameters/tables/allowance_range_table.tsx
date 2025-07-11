import { api } from "~/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";
import { formatDate } from "~/lib/utils/format_date";
import { type TFunction } from "i18next";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { SelectLevelField } from "../components/function_sheet/form_fields/select_level_field";
import { type FunctionsItem } from "../components/context/data_table_context";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { useDataTableContext } from "../components/context/data_table_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { AllowanceTypeEnumType } from "~/server/api/types/allowance_type_enum";
import { AllowanceRangeFEType } from "~/server/api/types/allowance_range_type";
import { allowanceRangeSchema } from "../schemas/configurations/allowance_range_schema";

export type RowItem = {
	position: number;
	position_type: string;
	allowance_type: AllowanceTypeEnumType;
	allowance_start: number;
	allowance_end: number;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof Omit<RowItem, "functions">;

const columnHelper = createColumnHelper<RowItem>();

export const allowance_range_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => {
	const f: RowItemKey[] = [
		"position",
		"position_type",
		"allowance_type",
		"allowance_start",
		"allowance_end",
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
						case "end_date":
							content =
								formatDate("day", row.original.end_date) ?? "";
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
				return <AllowanceRangeFunctionComponent data={row.original} />;
			},
		}),
	];
};

function AllowanceRangeFunctionComponent({ data }: { data: RowItem }) {
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

export function allowanceRangeMapper(
	allowanceRangeData: AllowanceRangeFEType[]
): RowItem[] {
	return allowanceRangeData.map((d) => {
		return d;
	});
}

interface AllowanceRangeTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function AllowanceRangeTable({
	period_id,
	viewOnly,
}: AllowanceRangeTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		mode,
		openSheet,
		setOpenSheet,
		openDialog,
		setOpenDialog,
		data: dd,
	} = useDataTableContext();
	const getAllowanceRange = api.parameters.getCurrentAllowanceRange.useQuery({
		period_id,
	});
	const { isPending, content, data } = useQueryHandle(getAllowanceRange);

	if (isPending) {
		return content;
	}

	const columns = allowance_range_columns({
		t,
	});

	return !viewOnly ? (
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableAllowanceRange"}
			period_id={period_id}
		>
			<Sheet
				open={openSheet && mode !== "delete"}
				onOpenChange={setOpenSheet}
				aria-hidden={false}
			>
				<DataTableWithFunctions
					columns={columns}
					data={allowanceRangeMapper(data ?? [])}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<ParameterForm
						formSchema={allowanceRangeSchema}
						formConfig={[
							{ key: "id", config: { hidden: true } },
						]}
						mode={mode}
						closeSheet={() => setOpenSheet(false)}
					/>
				</FunctionsSheetContent>
			</Sheet>
			<ConfirmDialog
				open={openDialog && mode === "delete"}
				onOpenChange={setOpenDialog}
				schema={allowanceRangeSchema}
			/>
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={columns}
			data={allowanceRangeMapper(data ?? [])}
		/>
	);
}
