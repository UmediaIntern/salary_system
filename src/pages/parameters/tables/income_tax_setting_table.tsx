import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_EndDateStr, c_StartDateStr } from "../constant";
import { formatDate } from "~/lib/utils/format_date";
import { type TableComponentProps } from "../tables_view";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { useEffect } from "react";
import { Sheet } from "~/components/ui/sheet";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { incomeTaxSchema } from "../schemas/configurations/income_tax_schema";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import { type IncomeTaxSettingFEType } from "~/server/api/types/income_tax_setting_type";
import { useDataTableContext } from "../components/context/data_table_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

const formula = "If (發薪日 - 入境日期) > [外勞入境天數門檻] then\n\tTax=薪資所得稅扣繳總額*[薪資所得扣繳總額比率1]%\nElse\n\tIf 薪資所得稅扣繳總額 < (最低基本工資-免稅額)*[最低工資倍率] then \n\t\tTax=薪資所得稅扣繳總額*[薪資所得扣繳總額比率1]%\n\tElse\n\t\tTax=薪資扣繳總額*[薪資所得扣繳總額比率2]\n\tEnd_If\nEnd_If";

export type RowItem = {
	parameters: string;
	value: number | string | Date | null;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const income_tax_setting_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => [
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
					if (key === "value") {
						if (row.original.parameters === c_StartDateStr || row.original.parameters === c_EndDateStr) {
							return (
								<div className="text-center font-medium">{formatDate("day", row.original.value as Date | null) ?? ""}</div>
							);
						}
					}
					if (row.original.parameters.includes("比率") && key === "value") {
						return (
							<div className="text-center font-medium" title={formula}>{`${row.original[
								key as RowItemKey
							]!.toString()}%`}</div>
						)
					}
					return (
						<div className="text-center font-medium" title={formula}>{`${row.original[
							key as RowItemKey
						]!.toString()}`}</div>
					);
				},
			})
		),
	];

export function incomeTaxSettingMapper(
	incomeTaxSettingData: IncomeTaxSettingFEType[]
): RowItem[] {
	const data = incomeTaxSettingData[0]!;
	return [
		{
			parameters: "外勞入境天數門檻",
			value: data.entry_date_threshold,
		},
		{
			parameters: "最低工資倍率",
			value: data.multiplier,
		},
		{
			parameters: "免稅額",
			value: data.deduction,
		},
		{
			parameters: "薪資所得扣繳總額比率1",
			value: data.tax_ratio_1,
		},
		{
			parameters: "薪資所得扣繳總額比率2",
			value: data.tax_ratio_2,
		},
		{
			parameters: c_StartDateStr,
			value: data.start_date,
		},
		{
			parameters: c_EndDateStr,
			value: data.end_date,
		},
	];
}

interface IncomeTaxSettingTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}
export function IncomeTaxSettingTable({
	period_id,
	viewOnly,
}: IncomeTaxSettingTableProps) {


	const { t } = useTranslation(["common"]);
	const { selectedTab, open, setOpen, mode, setData } =
		useDataTableContext();

	const getIncomeTaxSetting =
		api.incomeTaxSetting.getCurrentIncomeTaxSetting.useQuery({ period_id });
  const { isPending, content, data } = useQueryHandle(getIncomeTaxSetting);
	const filterKey: RowItemKey = "parameters";

	useEffect(() => {
		if (data && selectedTab === "current") {
			setData(data);
		}
	}, [data, selectedTab, setData]);

  if (isPending) {
    return content;
  }

	return (
		<>
			{!viewOnly ? (
				<ParameterToolbarFunctionsProvider
					selectedTableType={"TableIncomeTaxSetting"}
					period_id={period_id}
				>
					<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
						<DataTableWithFunctions
							columns={income_tax_setting_columns({ t })}
							data={data ? incomeTaxSettingMapper([data]) : []}
							filterColumnKey={filterKey}
						/>
						<FunctionsSheetContent t={t} period_id={period_id}>
							<ParameterForm
								formSchema={incomeTaxSchema}
								formConfig={[{ key: "id", config: { hidden: true } }]}
								mode={mode}
								closeSheet={() => {
									setOpen(false);
								}}
							/>
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={incomeTaxSchema} />
				</ParameterToolbarFunctionsProvider>
			) : (
				<DataTableWithoutFunctions
					columns={income_tax_setting_columns({ t })}
					data={incomeTaxSettingMapper([data!])}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
