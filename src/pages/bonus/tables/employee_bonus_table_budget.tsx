import { api } from "~/utils/api";
import { DataTable as DataTableWithFunctions } from "../components/budget/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeeBonusFEType } from "~/server/api/types/employee_bonus_type";
import { type TFunction } from "i18next";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { employeeBonusSchema } from "../schemas/configurations/employee_bonus_schema";

import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import { type FunctionsItem } from "../components/context/data_table_context";
import {
	ColumnHeaderBaseComponent,
	ColumnHeaderComponent,
} from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";
import { BonusFunctionComponent } from "./bonus_function_component";
import { Dialog } from "~/components/ui/dialog";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

export type RowItem = EmployeeBonusFEType & {
	functions: FunctionsItem;
};
type RowItemKey = keyof Omit<RowItem, "functions">;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = [
	"department",
	"emp_no",
	"emp_name",
	"base_salary",
	"food_allowance",
	"supervisor_allowance",
	"occupational_allowance",
	"subsidy_allowance",
	"long_service_allowance",
	"special_multiplier",
	"multiplier",
	"fixed_amount",
	"bud_effective_salary",
	"bud_amount",
	"issue_date",
];

const employee_bonus_budget_columns = ({
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
								{row.original[key]?.toString() ?? ""}
							</ColumnCellComponent>
						);
				}
			},
		}),
	),
	columnHelper.accessor("functions", {
		header: ({}) => {
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

export function employeeBonusMapper(
	employeeBonusData: EmployeeBonusFEType[],
): RowItem[] {
	return employeeBonusData.map((d) => {
		return {
			...d,
			id: d.id,
			functions: d.functions,
		};
	});
}

interface EmployeeBonusTableProps extends TableComponentProps {
	periodId: number;
	bonusType: BonusTypeEnumType;
	issueDate: Date;
	globalFilter?: string;
	viewOnly?: boolean;
}

const filterKey: RowItemKey = "emp_no";

export function EmployeeBonusTable({
	periodId: period_id,
	bonusType: bonus_type,
	issueDate: issue_date,
	viewOnly,
}: EmployeeBonusTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		data: selectedData,
		openSheet,
		setOpenSheet,
		openDialog,
		setOpenDialog,
		mode,
	} = useBonusFunctionContext();
	const { setSelectedTableType } = useBonusFunctionContext();

	const ctx = api.useUtils();
	const initFunction = api.bonus.initCandidateEmployeeBonus.useMutation({
		onSuccess: () => {
			void ctx.bonus.getEmployeeBonus.invalidate();
		},
	});

	const deleteEmployeeBonus = api.bonus.deleteEmployeeBonus.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusWorkType.invalidate();
		},
	});

	const getBonus = api.bonus.getEmployeeBonus.useQuery({
		period_id,
		bonus_type,
	});
	const { data, isPending, content } = useQueryHandle(getBonus);


	useEffect(() => {
		setSelectedTableType("TableEmployeeBonus");
		initFunction.mutate({ period_id, bonus_type, issue_date });
	}, []);


	if (initFunction.isPending || isPending) {
		return content;
	}

	if (viewOnly) {
		return (
			<DataTableWithoutFunctions
				columns={employee_bonus_budget_columns({
					t,
				})}
				data={employeeBonusMapper(data)}
				filterColumnKey={filterKey}
			/>
		);
	}

	return (
		<BonusToolbarFunctionsProvider
			selectedTableType={"TableEmployeeBonus"}
			period_id={period_id}
			bonus_type={bonus_type}
		>
			<Sheet
				open={openSheet && mode !== "delete"}
				onOpenChange={setOpenSheet}
			>
				<DataTableWithFunctions
					columns={employee_bonus_budget_columns({
						t,
					})}
					data={employeeBonusMapper(data)}
					bonusType={bonus_type}
					filterColumnKey={filterKey}
				/>
				<FunctionsSheetContent t={t} period_id={period_id}>
					<BonusForm
						formSchema={employeeBonusSchema}
						formConfig={[{ key: "id", config: { hidden: true } }]}
						mode={mode}
						closeSheet={() => {
							setOpenSheet(false);
						}}
					/>
				</FunctionsSheetContent>
			</Sheet>
			<Dialog
				open={openDialog && mode === "delete"}
				onOpenChange={setOpenDialog}
				aria-hidden={false}
			>
				<ConfirmDialog
					onClick={() => {
						// TODO: is the the right function to call?
						selectedData &&
							deleteEmployeeBonus.mutate({
								id: selectedData.id,
							});
					}}
					data={
						employeeBonusSchema
							.omit({ id: true })
							.safeParse(selectedData).data
					}
				/>
			</Dialog>
		</BonusToolbarFunctionsProvider>
	);
}
