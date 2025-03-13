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
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";

// Bonus Department Type & Schema
import { type BonusDepartmentFEType } from "~/server/api/types/bonus_department_type";
import { bonusDepartmentSchema } from "../schemas/configurations/bonus_department_schema";
import { BonusFunctionComponent } from "./bonus_function_component";
import { Dialog } from "~/components/ui/dialog";
import { ConfirmDialog } from "~/components/table_functions/confirm_dialog";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";

export type RowItem = {
	id: number;
	department: string;
	multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = ["department", "multiplier"];

export const bonus_department_columns = ({
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
								).toString()}
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

export function bonusDepartmentMapper(
	bonusDepartmentData: BonusDepartmentFEType[]
): RowItem[] {
	return bonusDepartmentData.map((d) => {
		return {
			id: d.id,
			department: d.department,
			multiplier: d.multiplier,
			functions: d.functions,
		};
	});
}

interface BonusDepartmentTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusDepartmentTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusDepartmentTableProps) {
	const { t } = useTranslation(["common"]);
	const {
		data: selectedData,
		open,
		setOpen,
		mode,
	} = useBonusFunctionContext();

	const getBonusDepartment = api.bonus.getBonusDepartment.useQuery({
		period_id,
		bonus_type,
	});
	const { data, isPending, content } = useQueryHandle(getBonusDepartment);

	const filterKey: RowItemKey = "department";

	const ctx = api.useUtils();
	const deleteBonusDepartment = api.bonus.deleteBonusDepartment.useMutation({
		onSuccess: () => {
			void ctx.bonus.getBonusDepartment.invalidate();
		},
	});

	if (isPending) {
		return content;
	}

	return (
		<>
			{!viewOnly ? (
				<BonusToolbarFunctionsProvider
					selectedTableType={"TableBonusDepartment"}
					period_id={period_id}
					bonus_type={bonus_type}
				>
					<Sheet
						open={open && mode !== "delete"}
						onOpenChange={setOpen}
					>
						{bonusDepartmentMapper(data!) && (
							<DataTableWithFunctions
								columns={bonus_department_columns({ t })}
								data={data ? bonusDepartmentMapper(data) : []}
								bonusType={bonus_type}
								filterColumnKey={filterKey}
							/>
						)}
						<FunctionsSheetContent t={t} period_id={period_id}>
							{mode === "create" && (
								<BonusForm
									formSchema={bonusDepartmentSchema.omit({
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
									formSchema={bonusDepartmentSchema}
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
									deleteBonusDepartment.mutate({
										id: selectedData.id,
									});
							}}
							data={
								bonusDepartmentSchema
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
