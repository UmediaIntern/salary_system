import { useEffect } from "react";
import { api } from "~/utils/api";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";

// Component
import { Sheet } from "~/components/ui/sheet";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import {
	ColumnHeaderBaseComponent,
	ColumnHeaderComponent,
} from "~/components/data_table/column_header_component";

// Type
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

// Bonus Table Context
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";
import { type FunctionsItem } from "../components/context/data_table_context";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";

// Bonus Table Component
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";

// Bonus Position Type & Schema
import { type BonusPositionFEType } from "~/server/api/types/bonus_position_type";
import { bonusPositionSchema } from "../schemas/configurations/bonus_position_schema";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { Dialog } from "~/components/ui/dialog";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";

export type RowItem = {
	id: number;
	position: number;
	position_type: string;
	position_multiplier: number;
	position_type_multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof Omit<RowItem, "functions">;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = [
	"position",
	"position_type",
	"position_multiplier",
	"position_type_multiplier",
];

export const bonus_position_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => [
	...columnNames.map((key) =>
		columnHelper.accessor(key, {
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`table.${key}`)}
					</ColumnHeaderComponent>
				);
			},
			cell: ({ row }) => {
				switch (key) {
					default:
						return (
							<ColumnCellComponent>
								{row.original[key].toString()}
							</ColumnCellComponent>
						);
				}
			},
		})
	),
	columnHelper.accessor("functions", {
		header: () => {
			return (
				<ColumnHeaderBaseComponent>
					{t(`others.functions`)}
				</ColumnHeaderBaseComponent>
			);
		},
		cell: ({ row }) => {
			// TODO: Should use data with Frontend Type instead of data in table?
			return <BonusFunctionComponent data={row.original} />;
		},
	}),
];

function BonusFunctionComponent({ data }: { data: RowItem }) {
	const { setOpenSheet, setOpenDialog, setMode, setData } = useBonusFunctionContext();
	return (
		<FunctionsComponent
			data={data}
			setOpenSheet={setOpenSheet}
			setOpenDialog={setOpenDialog}
			setMode={setMode}
			setData={setData}
		/>
	);
}

export function bonusPositionMapper(
	bonusPositionData: BonusPositionFEType[]
): RowItem[] {
	return bonusPositionData.map((d) => {
		return {
			id: d.id,
			position: d.position,
			position_type: d.position_type,
			position_multiplier: d.position_multiplier,
			position_type_multiplier: d.position_type_multiplier,
			functions: d.functions,
		};
	});
}

interface BonusPositionTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusPositionTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusPositionTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		data: selectedData,
		openSheet,
		setOpenSheet,
		openDialog,
		setOpenDialog,
		mode,
		setData,
	} = useBonusFunctionContext();

	const getBonusPosition = api.bonus.getBonusPosition.useQuery({
		period_id,
		bonus_type,
	});
	const { data, isPending, content } = useQueryHandle(getBonusPosition);

	const ctx = api.useUtils();
	const deleteBonusPosition = api.bonus.deleteBonusPosition.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusPosition.invalidate();
		},
	});

	const filterKey: RowItemKey = "position";

	useEffect(() => {
		if (data) {
			setData(data);
		}
	}, [data, setData, selectedData]);

	if (isPending) {
		return content;
	}

	if (viewOnly) {
		return <></>;
	}

	return (
		<BonusToolbarFunctionsProvider
			selectedTableType={"TableBonusPosition"}
			period_id={period_id}
			bonus_type={bonus_type}
		>
			<Sheet open={openSheet && mode !== "delete"} onOpenChange={setOpenSheet}>
				{bonusPositionMapper(data!) && (
					<DataTableWithFunctions
						columns={bonus_position_columns({ t })}
						data={data ? bonusPositionMapper(data) : []}
						bonusType={bonus_type}
						filterColumnKey={filterKey}
					/>
				)}
				<FunctionsSheetContent t={t} period_id={period_id}>
					{mode === "create" && (
						<BonusForm
							formSchema={bonusPositionSchema.omit({
								id: true,
							})}
							formConfig={undefined}
							mode={mode}
							defaultValue={{ ...selectedData }}
							closeSheet={() => setOpenSheet(false)}
						/>
					)}
					{mode === "update" && (
						<BonusForm
							formSchema={bonusPositionSchema}
							formConfig={[
								{ key: "id", config: { hidden: true } },
							]}
							mode={mode}
							defaultValue={{ ...selectedData }}
							closeSheet={() => setOpenSheet(false)}
						/>
					)}
				</FunctionsSheetContent>
			</Sheet>
			<Dialog
				open={openDialog && mode === "delete"}
				onOpenChange={setOpenDialog}
				aria-hidden={false}
			>
				<ConfirmDialog
					onClick={() => {
						selectedData &&
							deleteBonusPosition.mutate({
								id: selectedData.id,
							});
					}}
					data={
						bonusPositionSchema
							.omit({ id: true })
							.safeParse(selectedData).data
					}
				/>
			</Dialog>
		</BonusToolbarFunctionsProvider>
	);
}
