import { useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { Sheet } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/loading";

import { ArrowUpDown } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";

import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

import dataTableContext, {
	FunctionsItem,
} from "../components/context/data_table_context";
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";

import { bonusAllSchema } from "../schemas/configurations/bonus_all_schema";
import { ColumnHeaderBaseComponent } from "~/components/data_table/column_header_component";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";
import { FunctionsComponent } from "~/components/data_table/functions_component";


export type RowItem = {
	id: number;
	parameters: string;
	value: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;


const columnHelper = createColumnHelper<RowItem>();


export const bonus_all_columns = (
	{
		t,
	}: {
		t: TFunction<[string], undefined>;
	}
) => [
	...["parameters", "value"].map((key: string) =>
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
			return <BonusAllFunctionComponent data={row.original} />;
		},
	}),
];

function BonusAllFunctionComponent({data}: {data: RowItem}) {
	const { setOpen, setMode, setData } = useBonusFunctionContext();
	return (
		<FunctionsComponent
			setOpen={setOpen}
			setMode={setMode}
			data={data}
			setData={setData}
		/>
	);
}

export function bonusAllMapper(bonusAllData: any, t: TFunction): RowItem {
	return {
		// parameters: t(`table.multiplier`),
		id: bonusAllData?.id,
		parameters: "倍率",
		value: bonusAllData?.multiplier,
		functions: bonusAllData?.functions,
	};
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
	// const [open, setOpen] = useState<boolean>(false);
	// const [mode, setMode] = useState<FunctionMode>("none");
	const { data: selectedData, open, setOpen, mode, setMode, setData } = useContext(dataTableContext);


	const { isLoading, isError, data, error } = api.bonus.getBonusAll.useQuery({
		period_id,
		bonus_type,
	});
	const filterKey: RowItemKey = "parameters";

	useEffect(() => {
		if (data) {
			setData(data);
		}
	}, [data, setData]);


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
				<BonusToolbarFunctionsProvider selectedTableType={"TableBonusAll"} period_id={period_id} bonus_type={bonus_type}>
					<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
						{bonusAllMapper(data!, t) && <DataTableWithFunctions
							columns={bonus_all_columns({
								t,
							})}
							data={data ? [bonusAllMapper(data!, t)] : []}
							bonusType={bonus_type}
							filterColumnKey={filterKey}
						/>}
						<FunctionsSheetContent t={t} period_id={period_id}>
							{
								mode === "create" && <BonusForm
									formSchema={bonusAllSchema.omit({ id: true })}
									formConfig={undefined}
									mode={mode}
									defaultValue={selectedData && {multiplier: selectedData.value}}
									closeSheet={() => setOpen(false)}
								/>
							}
							{
								mode === "update" && <BonusForm
									formSchema={bonusAllSchema}
									formConfig={[{ key: "id", config: { hidden: true } }]}
									mode={mode}
									defaultValue={selectedData && {id: selectedData.id, multiplier: selectedData.value}}
									closeSheet={() => setOpen(false)}
								/>
							}
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog
						open={open && mode === "delete"}
						onOpenChange={setOpen}
						schema={bonusAllSchema}
					/>
				</BonusToolbarFunctionsProvider>
			) : (
				<></>
				// <DataTableWithoutFunctions
				// 	columns={bonus_all_columns({
				// 		t,
				// 		period_id,
				// 		bonus_type,
				// 		setOpen,
				// 		setMode,
				// 		setData,
				// 	})}
				// 	data={bonusAllMapper(data!)}
				// 	bonusType={bonus_type}
				// 	filterColumnKey={filterKey}
				// />
			)}
		</>
	);
}
