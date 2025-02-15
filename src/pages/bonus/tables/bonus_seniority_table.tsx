import { useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { ArrowUpDown } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

// Component
import { Sheet } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/loading";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { ColumnHeaderBaseComponent } from "~/components/data_table/column_header_component";

// Type
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

// Bonus Table Context
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";
import dataTableContext, {FunctionsItem} from "../components/context/data_table_context";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";

// Bonus Table Component
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { BonusSeniorityFEType } from "~/server/api/types/bonus_seniority_type";
import { BonusFunctionComponent } from "./bonus_function_component";
import { bonusSenioritySchema } from "../schemas/configurations/bonus_seniority_schema";

// Bonus Seniority Type & Schema




export type RowItem = {
	id: number;
	seniority: number;
	multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_seniority_columns = ({t}: {t: TFunction<[string], undefined>;}) => [
	...["seniority", "multiplier"].map((key: string) =>
		columnHelper.accessor(key as RowItemKey, {
			header: ({ column }) => {
				return (
					<div className="flex justify-center">
						<div className="text-center font-medium">
							<Button
								variant="ghost"
								onClick={() =>
									column.toggleSorting(
										column.getIsSorted() === "asc"
									)
								}
							>
								{t(`table.${key}`)}
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				);
			},
			cell: ({ row }) => {
				switch (key) {
					default:
						return (
							<div className="text-center font-medium">{`${
								row.original[key as RowItemKey]
							}`}</div>
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
	const { data: selectedData, selectedBonusType, open, setOpen, mode, setMode, setData } = useContext(dataTableContext);

	const { isLoading, isError, data, error } = api.bonus.getBonusSeniority.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "seniority";

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

	return (
		<>
			{!viewOnly ? (
				<BonusToolbarFunctionsProvider selectedTableType={"TableBonusSeniority"} period_id={period_id} bonus_type={bonus_type}>
					<Sheet open={open && mode !== "delete"} onOpenChange={setOpen} >
						{bonusSeniorityMapper(data!) && <DataTableWithFunctions
							columns={bonus_seniority_columns({t})}
							data={data ? bonusSeniorityMapper(data!) : []}
							bonusType={bonus_type}
							filterColumnKey={filterKey}
						/>}
						<FunctionsSheetContent t={t} period_id={period_id}>
							{
								mode === "create" && <BonusForm
									formSchema={bonusSenioritySchema.omit({ id: true })}
									formConfig={undefined}
									mode={mode}
									defaultValue={{...selectedData}}
									closeSheet={() => setOpen(false)}
								/>
							}
							{
								mode === "update" && <BonusForm
									formSchema={bonusSenioritySchema}
									formConfig={[{ key: "id", config: { hidden: true } }]}
									mode={mode}
									defaultValue={{...selectedData}}
									closeSheet={() => setOpen(false)}
								/>
							}
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={bonusSenioritySchema}/>
				</BonusToolbarFunctionsProvider>
			) : (
				<></>
			)}
		</>
	);
}
