import { api } from "~/utils/api";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";

// Component
import { Sheet } from "~/components/ui/sheet";
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
import { BonusFunctionComponent } from "./bonus_function_component";

// Bonus WorkType Type & Schema
import { type WorkTypeEnumType } from "~/server/api/types/work_type_enum";
import { type BonusWorkTypeFEType } from "~/server/api/types/bonus_work_type_type";
import { bonusWorkTypeSchema } from "../schemas/configurations/bonus_work_type";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { Dialog } from "~/components/ui/dialog";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";

export type RowItem = {
	id: number;
	work_type: WorkTypeEnumType;
	multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof Omit<RowItem, "functions">;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = ["work_type", "multiplier"];

export const bonus_work_type_columns = ({
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
			return <BonusFunctionComponent data={row.original} />;
		},
	}),
];

export function bonusWorkTypeMapper(
	bonusWorkTypeData: BonusWorkTypeFEType[]
): RowItem[] {
	return bonusWorkTypeData.map((d) => {
		return {
			id: d.id,
			work_type: d.work_type,
			multiplier: d.multiplier,
			functions: d.functions,
		};
	});
}

interface BonusWorkTypeTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusWorkTypeTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusWorkTypeTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		data: selectedData,
		open,
		setOpen,
		mode,
	} = useBonusFunctionContext();

	const filterKey: RowItemKey = "work_type";

	const getBonusWorkType = api.bonus.getBonusWorkType.useQuery({
		period_id,
		bonus_type,
	});
	const { data, isPending, content } = useQueryHandle(getBonusWorkType);

	const ctx = api.useUtils();
	const deleteBonusWorkType = api.bonus.deleteBonusWorkType.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusWorkType.invalidate();
		},
	});

	if (isPending) {
		return content;
	}

	return (
		<>
			{!viewOnly ? (
				<BonusToolbarFunctionsProvider
					selectedTableType={"TableBonusWorkType"}
					period_id={period_id}
					bonus_type={bonus_type}
				>
					<Sheet
						open={open && mode !== "delete"}
						onOpenChange={setOpen}
					>
						{bonusWorkTypeMapper(data!) && (
							<DataTableWithFunctions
								columns={bonus_work_type_columns({ t })}
								data={data ? bonusWorkTypeMapper(data) : []}
								bonusType={bonus_type}
								filterColumnKey={filterKey}
							/>
						)}
						<FunctionsSheetContent t={t} period_id={period_id}>
							{mode === "create" && (
								<BonusForm
									formSchema={bonusWorkTypeSchema.omit({
										id: true,
									})}
									formConfig={undefined}
									mode={mode}
									defaultValue={{ ...selectedData }}
									closeSheet={() => setOpen(false)}
								/>
							)}
							{mode === "update" && (
								<BonusForm
									formSchema={bonusWorkTypeSchema}
									formConfig={[
										{ key: "id", config: { hidden: true } },
									]}
									mode={mode}
									defaultValue={{ ...selectedData }}
									closeSheet={() => setOpen(false)}
								/>
							)}
						</FunctionsSheetContent>
					</Sheet>
					<Dialog
						open={open && mode === "delete"}
						onOpenChange={setOpen}
						aria-hidden={false}
					>
						<ConfirmDialog
							onClick={() => {
								selectedData &&
									deleteBonusWorkType.mutate({
										id: selectedData.id,
									});
							}}
							data={
								bonusWorkTypeSchema
									.omit({ id: true })
									.safeParse(selectedData).data
							}
						/>
					</Dialog>
				</BonusToolbarFunctionsProvider>
			) : (
				<></>
			)}
		</>
	);
}
