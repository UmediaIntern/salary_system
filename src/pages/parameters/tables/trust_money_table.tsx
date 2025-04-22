import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { formatDate } from "~/lib/utils/format_date";
import { type TrustMoneyFEType } from "~/server/api/types/trust_money_type";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { trustMoneySchema } from "../schemas/configurations/trust_money_schema";
import { Sheet } from "~/components/ui/sheet";
import {
	type FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { useDataTableContext } from "../components/context/data_table_context_provider";

export type RowItem = {
	position: number;
	position_type: string;
	org_trust_reserve_limit: number;
	org_special_trust_incent_limit: number;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const trust_money_columns = ({
	t,
	setOpen,
	setMode,
	setData,
}: {
	t: TFunction<[string], undefined>;
	setOpen: (open: boolean) => void;
	setMode: (mode: FunctionMode) => void;
	setData: (data: RowItem) => void;
}) => [
	...[
		"position",
		"position_type",
		"org_trust_reserve_limit",
		"org_special_trust_incent_limit",
		"start_date",
		"end_date",
	].map((key: string) =>
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
					case "start_date":
						return (
							<div className="text-center font-medium">{`${
								formatDate("day", row.original.start_date) ?? ""
							}`}</div>
						);
					case "end_date":
						return (
							<div className="text-center font-medium">{`${
								formatDate("day", row.original.end_date) ?? ""
							}`}</div>
						);
					default:
						return (
							<div className="text-center font-medium">{`${row.original[
								key as RowItemKey
							]?.toString()}`}</div>
						);
				}
			},
		})
	),
	columnHelper.accessor("functions", {
		header: () => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">
						{t(`others.functions`)}
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<FunctionsComponent
					setOpen={setOpen}
					setMode={setMode}
					data={row.original}
					setData={setData}
				/>
			);
		},
	}),
];

export function trustMoneyMapper(
	TrustMoneyData: TrustMoneyFEType[]
): RowItem[] {
	return TrustMoneyData.map((d) => ({
		id: d.id,
		position: d.position,
		position_type: d.position_type,
		org_trust_reserve_limit: d.org_trust_reserve_limit,
		org_special_trust_incent_limit: d.org_special_trust_incent_limit,
		start_date: d.start_date,
		end_date: d.end_date,
		functions: d.functions,

		// functions: {
		// 	deletable: true,
		// }
	}));
}

interface TrustMoneyTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function TrustMoneyTable({ period_id, viewOnly }: TrustMoneyTableProps) {
	const { t } = useTranslation(["common"]);
	const { mode, setMode, open, setOpen, setData } = useDataTableContext();

	const getTrustMoney = api.parameters.getCurrentTrustMoney.useQuery({
		period_id,
	});
	const { isPending, content, data } = useQueryHandle(getTrustMoney);
	const filterKey: RowItemKey = "position";

	if (isPending) {
		return content; // TODO: Loading element with toast
	}

	return !viewOnly ? (
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableTrustMoney"}
			period_id={period_id}
		>
			<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
				<DataTableWithFunctions
					columns={trust_money_columns({
						t,
						setOpen,
						setMode,
						setData,
					})}
					data={trustMoneyMapper(data)}
					filterColumnKey={filterKey}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<ParameterForm
						formSchema={trustMoneySchema}
						formConfig={[{ key: "id", config: { hidden: true } }]}
						mode={mode}
						closeSheet={() => {
							setOpen(false);
						}}
					/>
				</FunctionsSheetContent>
			</Sheet>
			<ConfirmDialog
				open={open && mode === "delete"}
				onOpenChange={setOpen}
				schema={trustMoneySchema}
			/>
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={trust_money_columns({ t, setOpen, setMode, setData })}
			data={trustMoneyMapper(data)}
			filterColumnKey={filterKey}
		/>
	);
}
