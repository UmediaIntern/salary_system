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
import { type FunctionsItem } from "../components/context/data_table_context";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";

// Bonus Table Component
import { DataTable as DataTableWithFunctions } from "../components/regular/data_table";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { type BonusSeniorityFEType } from "~/server/api/types/bonus_seniority_type";
import { BonusFunctionComponent } from "./bonus_function_component";
import { bonusSenioritySchema } from "../schemas/configurations/bonus_seniority_schema";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";
import { Dialog } from "~/components/ui/dialog";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { useQueryHandle } from "~/components/query_boundary/query_handle";


export type RowItem = {
	id: number;
	seniority: number;
	multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof Omit<RowItem, "functions">;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = ["seniority", "multiplier"];

export const bonus_seniority_columns = ({
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

export function bonusSeniorityMapper(
	bonusSeniorityData: BonusSeniorityFEType[]
): RowItem[] {
	return bonusSeniorityData.map((d) => {
		return {
			id: d.id,
			seniority: d.seniority,
			multiplier: d.multiplier,
			functions: d.functions,
		};
	});
}

interface BonusSeniorityTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusSeniorityTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusSeniorityTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		data: selectedData,
		openSheet,
		setOpenSheet,
		openDialog,
		setOpenDialog,
		mode,
	} = useBonusFunctionContext();

	const getBonusSeniority = api.bonus.getBonusSeniority.useQuery({
		period_id,
		bonus_type,
	});
	const { data, isPending, content } = useQueryHandle(getBonusSeniority);

	const filterKey: RowItemKey = "seniority";

	const ctx = api.useUtils();
	const deleteBonusSeniority = api.bonus.deleteBonusSeniority.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusSeniority.invalidate();
		},
	});

	if (isPending) {
		return content;
	}

	return (
		<>
			{!viewOnly ? (
				<BonusToolbarFunctionsProvider
					selectedTableType={"TableBonusSeniority"}
					period_id={period_id}
					bonus_type={bonus_type}
				>
					<Sheet
						open={openSheet && mode !== "delete"}
						onOpenChange={setOpenSheet}
					>
						{data && bonusSeniorityMapper(data) && (
							<DataTableWithFunctions
								columns={bonus_seniority_columns({ t })}
								data={data ? bonusSeniorityMapper(data) : []}
								bonusType={bonus_type}
								filterColumnKey={filterKey}
							/>
						)}
						<FunctionsSheetContent t={t} period_id={period_id}>
							{mode === "create" && (
								<BonusForm
									formSchema={bonusSenioritySchema.omit({
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
									formSchema={bonusSenioritySchema}
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
									deleteBonusSeniority.mutate({
										id: selectedData.id,
									});
							}}
							data={
								bonusSenioritySchema
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
