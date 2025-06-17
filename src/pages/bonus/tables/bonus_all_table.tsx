import { useContext, useEffect } from "react";
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
import dataTableContext, {
	type FunctionsItem,
} from "../components/context/data_table_context";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";

// Bonus Table Component
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";

// Bonus All Schema
import { bonusAllSchema } from "../schemas/configurations/bonus_all_schema";
import { type BonusAllFEType } from "~/server/api/types/bonus_all_type";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { Dialog } from "~/components/ui/dialog";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";

export type RowItem = {
	id: number;
	parameters: string;
	value: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = ["parameters", "value"];

export const bonus_all_columns = ({
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
								{(
									row.original[key] as string | number
								).toString() ?? ""}
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
			return <BonusAllFunctionComponent data={row.original} />;
		},
	}),
];

function BonusAllFunctionComponent({ data }: { data: RowItem }) {
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

export function bonusAllMapper(bonusAllData: BonusAllFEType): RowItem | undefined {
	return bonusAllData ? {
		id: bonusAllData?.id,
		parameters: "倍率",
		value: bonusAllData?.multiplier,
		functions:bonusAllData?.functions,
	} : undefined;
}

interface BonusAllTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusAllTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusAllTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		data: selectedData,
		openSheet,
		setOpenSheet,
		openDialog,
		setOpenDialog,
		mode,
		setData,
	} = useContext(dataTableContext);

	const getBonusAll = api.bonus.getBonusAll.useQuery({
		period_id,
		bonus_type,
	});

	const ctx = api.useUtils();
	const deleteBonusAll = api.bonus.deleteBonusAll.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusAll.invalidate();
		},
	});

	const filterKey: RowItemKey = "parameters";
	const { data, isPending, content } = useQueryHandle(getBonusAll);

	if (isPending) {
		return content;
	}

	return (
		<>
			{!viewOnly ? (
				<BonusToolbarFunctionsProvider
					selectedTableType={"TableBonusAll"}
					period_id={period_id}
					bonus_type={bonus_type}
				>
					<Sheet
						open={openSheet && mode !== "delete"}
						onOpenChange={setOpenSheet}
					>
						{(
							// <button onClick={() => console.log(data, bonusAllMapper(data))}>	
							// 	TEST
							// </button>
							<DataTableWithFunctions
								columns={bonus_all_columns({ t })}
								data={bonusAllMapper(data) ? [bonusAllMapper(data) as RowItem] : []}
								bonusType={bonus_type}
								filterColumnKey={filterKey}
							/>
						)}
						<FunctionsSheetContent t={t} period_id={period_id}>
							{mode === "create" && (
								<BonusForm
									formSchema={bonusAllSchema.omit({
										id: true,
									})}
									formConfig={undefined}
									mode={mode}
									defaultValue={
										selectedData && {
											multiplier: selectedData.value,
										}
									}
									closeSheet={() => setOpenSheet(false)}
								/>
							)}
							{mode === "update" && (
								<BonusForm
									formSchema={bonusAllSchema}
									formConfig={[
										{ key: "id", config: { hidden: true } },
									]}
									mode={mode}
									defaultValue={
										selectedData && {
											id: selectedData.id,
											multiplier: selectedData.value,
										}
									}
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
							onClick={() =>
								selectedData &&
								deleteBonusAll.mutate({ id: selectedData.id })
							}
							data={
								bonusAllSchema
									.omit({ id: true })
									.safeParse(selectedData).data
							}
						/>
					</Dialog>
				</BonusToolbarFunctionsProvider>
			) : (
				<>
					<p>
						Something Bad Happened
					</p>
				</>
			)}
		</>
	);
}
