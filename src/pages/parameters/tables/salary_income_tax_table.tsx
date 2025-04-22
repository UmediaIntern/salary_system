import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { useTranslation } from "react-i18next";
import { type SalaryIncomeTaxFEType } from "~/server/api/types/salary_income_tax";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { type TFunction } from "i18next";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { salaryIncomeTaxSchema } from "../schemas/configurations/salary_income_tax_schema";
import { Sheet } from "~/components/ui/sheet";
import { type FunctionsItem } from "../components/context/data_table_context";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import { useDataTableContext } from "../components/context/data_table_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

export type RowItem = {
	salary_start: number;
	salary_end: number;
	dependent: number;
	tax_amount: number;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof Omit<RowItem, "functions">;

const columnHelper = createColumnHelper<RowItem>();

const f = [
	"salary_start",
	"salary_end",
	"dependent",
	"tax_amount",
	"start_date",
	"end_date",
] as const;
export const salary_income_tax_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => [
	...f.map((key: RowItemKey) =>
		columnHelper.accessor(key, {
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
			return <SalaryIncomeTaxFunctionComponent data={row.original} />;
		},
	}),
];

function SalaryIncomeTaxFunctionComponent({ data }: { data: RowItem }) {
	const { setOpen, setMode, setData, enableFunctions } =
		useDataTableContext();

	return (
		<FunctionsComponent
			setOpen={setOpen}
			setMode={setMode}
			data={data}
			setData={setData}
			disabled={!enableFunctions}
		/>
	);
}

export function salaryIncomeTaxMapper(
	salaryIncomeTaxData: SalaryIncomeTaxFEType[]
): RowItem[] {
	return salaryIncomeTaxData.map((d) => {
		return {
			id: d.id,
			salary_start: d.salary_start,
			salary_end: d.salary_end,
			dependent: d.dependent,
			tax_amount: d.tax_amount,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
		};
	});
}

interface SalaryIncomeTaxTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function SalaryIncomeTaxTable({
	viewOnly,
	period_id,
}: SalaryIncomeTaxTableProps) {
	const { t } = useTranslation(["common"]);
	const { mode, open, setOpen } = useDataTableContext();

	const getSalaryIncomeTax =
		api.parameters.getCurrentSalaryIncomeTax.useQuery({ period_id });
	const { isPending, content, data } = useQueryHandle(getSalaryIncomeTax);
	const filterKey: RowItemKey = "salary_start";

	if (isPending) {
		return content; // TODO: Loading element with toast
	}
	return !viewOnly ? (
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableSalaryIncomeTax"}
			period_id={period_id}
		>
			<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
				<DataTableWithFunctions
					columns={salary_income_tax_columns({
						t,
					})}
					data={salaryIncomeTaxMapper(data)}
					filterColumnKey={filterKey}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<ParameterForm
						formSchema={salaryIncomeTaxSchema}
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
				schema={salaryIncomeTaxSchema}
			/>
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={salary_income_tax_columns({
				t,
			})}
			data={salaryIncomeTaxMapper(data)}
			filterColumnKey={filterKey}
		/>
	);
}
