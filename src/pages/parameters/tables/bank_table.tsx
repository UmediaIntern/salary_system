import { api } from "~/utils/api";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { type BankSettingFEType } from "~/server/api/types/bank_setting_type";
import { bankSchema } from "../schemas/configurations/bank_schema";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { Sheet } from "~/components/ui/sheet";
import { type FunctionsItem } from "../components/context/data_table_context";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import {
	ColumnHeaderBaseComponent,
	ColumnHeaderComponent,
} from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { useDataTableContext } from "../components/context/data_table_context_provider";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { AutoParameterForm } from "../schemas/auto_parameter_form";

export type RowItem = {
	bank_name: string;
	bank_code: string;
	org_name: string;
	org_code: string;
	start_date: Date | null;
	end_date: Date | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();
const f = ["bank_name", "org_name", "start_date", "end_date"] as const;

export const bank_columns = ({ t }: { t: TFunction<[string], undefined> }) => [
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
					case "bank_name":
						content = `(${row.original.bank_code})${row.original.bank_name}`;
						break;
					case "org_name":
						content = `(${row.original.org_code})${row.original.org_name}`;
						break;
					case "start_date":
						content = `${
							formatDate("day", row.original.start_date) ?? ""
						}`;
						break;
					case "end_date":
						content = `${
							formatDate("day", row.original.end_date) ?? ""
						}`;
						break;
				}
				return <ColumnCellComponent>{content}</ColumnCellComponent>;
			},
		}),
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
			return <BankSettingFunctionComponent data={row.original} />;
		},
	}),
];

function BankSettingFunctionComponent({ data }: { data: RowItem }) {
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

export function bankSettingMapper(
	bankSettingData: BankSettingFEType[],
): RowItem[] {
	return bankSettingData.map((d) => {
		return {
			id: d.id,
			bank_name: d.bank_name,
			bank_code: d.bank_code.toString(),
			org_name: d.org_name,
			org_code: d.org_code.toString(),
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
			// functions: {
			// 	deletable: true,
			// }
		};
	});
}

interface BankTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BankTable({ period_id, viewOnly }: BankTableProps) {
	const { t } = useTranslation(["common"]);
	const { openSheet, setOpenSheet, openDialog, setOpenDialog, mode } =
		useDataTableContext();

	const getBankSetting = api.parameters.getCurrentBankSetting.useQuery({
		period_id,
	});
	const { isPending, content, data } = useQueryHandle(getBankSetting);
	const filterKey: RowItemKey = "bank_name";

	if (isPending) {
		return content;
	}

	return !viewOnly ? (
		<ParameterToolbarFunctionsProvider
			selectedTableType={"TableBankSetting"}
			period_id={period_id}
		>
			<Sheet
				open={openSheet && mode !== "delete"}
				onOpenChange={setOpenSheet}
			>
				<DataTableWithFunctions
					columns={bank_columns({ t })}
					data={bankSettingMapper(data)}
					filterColumnKey={filterKey}
					original_columns={[
						"bank_name",
						"bank_code",
						"org_name",
						"org_code",
						"start_date",
						"end_date",
					]}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<AutoParameterForm />
				</FunctionsSheetContent>
			</Sheet>
			<ConfirmDialog
				open={openDialog && mode === "delete"}
				onOpenChange={setOpenDialog}
				schema={bankSchema}
			/>
		</ParameterToolbarFunctionsProvider>
	) : (
		<DataTableWithoutFunctions
			columns={bank_columns({ t })}
			data={bankSettingMapper(data)}
			filterColumnKey={filterKey}
		/>
	);
}
