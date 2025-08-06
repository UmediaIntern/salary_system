import { DataTableUpdate } from "../../components/data_table_update";
import { createColumnHelper } from "@tanstack/react-table";
import {
	type EmployeePaymentFEType,
} from "~/server/api/types/employee_payment_type";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import {
	ColumnHeaderBaseComponent,
} from "~/components/data_table/column_header_component";
import { formatDate } from "~/lib/utils/format_date";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import {
	EmployeePaymentFunctionContextProvider,
	type PaymentRowItem,
	type PaymentRowItemKey,
	PaymentRowItemWithInfo,
	usePaymentFunctionContext,
} from "./employee_payment_provider";
import { EmployeePaymentFunctions } from "./employee_payment_functions";
import { useAccessContext } from "~/components/context/access_context_provider";
import { cn } from "~/lib/utils";
import { I18nType } from "~/lib/utils/i18n_type";
import { ColumnCellComponentWithInfo } from "./column_cell_with_info";

const columnHelper = createColumnHelper<PaymentRowItemWithInfo>();
const historyColumnHelper = createColumnHelper<PaymentRowItem>();

const firstThreeColumns: PaymentRowItemKey[] = [
	"department",
	"emp_no",
	"emp_name",
];

const infoColumns: PaymentRowItemKey[] = [
	"position",
	"position_type",
	"base_salary",
	"supervisor_allowance",
	"food_allowance",
	"occupational_allowance",
	"subsidy_allowance",
	"long_service_allowance",
];

const columnNames: PaymentRowItemKey[] = [
	"long_service_allowance_type",
	"l_r_self_ratio",
	"l_i",
	"h_i",
	"l_r",
	"occupational_injury",
	"bank_account_foreign",
	"start_date",
	"end_date",
];

const employee_payment_columns_with_info = ({ t }: { t: I18nType }) => [
	columnHelper.accessor("position", {
		cell: ({ row }) => {
			return (
				<ColumnCellComponent
					className={cn(
						row.original.info.isPositionModified &&
						"text-destructive",
					)}
				>
					{row.original.position}
				</ColumnCellComponent>
			);
		},
	}),
	columnHelper.accessor("position_type", {
		cell: ({ row }) => {
			return (
				<ColumnCellComponent
					className={cn(
						row.original.info.isPositionTypeModified &&
						"text-destructive",
					)}
				>
					{row.original.position_type}
				</ColumnCellComponent>
			);
		},
	}),
	columnHelper.accessor("base_salary", {
		cell: ({ row }) => {
			const data = row.original.base_salary;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.base_salary}
				/>
			);
		},
	}),
	columnHelper.accessor("supervisor_allowance", {
		cell: ({ row }) => {
			const data = row.original.supervisor_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.supervisor}
					relatedToPositionChange={true}
				/>
			);
		},
	}),
	columnHelper.accessor("food_allowance", {
		cell: ({ row }) => {
			const data = row.original.food_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.food}
					relatedToPositionChange={true}
				/>
			);
		},
	}),
	columnHelper.accessor("occupational_allowance", {
		cell: ({ row }) => {
			const data = row.original.occupational_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.occupational}
					relatedToPositionChange={true}
				/>
			);
		},
	}),
	columnHelper.accessor("subsidy_allowance", {
		cell: ({ row }) => {
			const data = row.original.subsidy_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.subsidy}
					relatedToPositionChange={true}
				/>
			);
		},
	}),
	columnHelper.accessor("long_service_allowance", {
		cell: ({ row }) => {
			const data = row.original.long_service_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.longService}
					relatedToPositionChange={true}
				/>
			);
		},
	}),
];

export const employee_payment_columns = ({ t }: { t: I18nType }) => [
	...firstThreeColumns.map((key) =>
		columnHelper.accessor(key, {
			cell: ({ row }) => {
				return (
					<ColumnCellComponent>
						{row.original[key]?.toString()}
					</ColumnCellComponent>
				);
			},
		}),
	),
	...employee_payment_columns_with_info({ t }),
	...columnNames.map((key) =>
		columnHelper.accessor(key, {
			cell: ({ row }) => {
				let content = row.original[key]?.toString() ?? "";
				switch (key) {
					case "long_service_allowance_type":
						content = t(
							`long_service_allowance_type.${row.original.long_service_allowance_type}`,
						);
						break;
					case "start_date":
						content = `${formatDate("day", row.original.start_date) ?? ""
							}`;
						break;
					case "end_date":
						content = `${formatDate("day", row.original.end_date) ?? ""
							}`;
						break;
					case "l_i":
					case "h_i":
					case "l_r":
					case "occupational_injury":
						return <ColumnCellComponentWithInfo
							data={content}
							info={row.original.info}
							range={row.original.info[key]}
						/>
				}
				return <ColumnCellComponent>{content}</ColumnCellComponent>;
			},
		}),
	),
	columnHelper.accessor("functions", {
		cell: ({ row }) => {
			return <PaymentFunctionComponent data={row.original} />;
		},
	}),
];

export const employee_payment_history_columns = ({ t }: { t: I18nType }) => [
	...[...firstThreeColumns, ...infoColumns].map((key) =>
		historyColumnHelper.accessor(key, {
			cell: ({ row }) => {
				return (
					<ColumnCellComponent>
						{row.original[key]?.toString()}
					</ColumnCellComponent>
				);
			},
		}),
	),
	...columnNames.map((key) =>
		historyColumnHelper.accessor(key, {
			cell: ({ row }) => {
				let content = row.original[key]?.toString() ?? "";
				switch (key) {
					case "long_service_allowance_type":
						content = t(
							`long_service_allowance_type.${row.original.long_service_allowance_type}`,
						);
						break;
					case "start_date":
						content = `${formatDate("day", row.original.start_date) ?? ""
							}`;
						break;
					case "end_date":
						content = `${formatDate("day", row.original.end_date) ?? ""
							}`;
						break;
				}
				return <ColumnCellComponent>{content}</ColumnCellComponent>;
			},
		}),
	),
	historyColumnHelper.accessor("functions", {
		header: () => {
			return (
				<ColumnHeaderBaseComponent>
					{t(`others.functions`)}
				</ColumnHeaderBaseComponent>
			);
		},
		cell: ({ row }) => {
			return <PaymentFunctionComponent data={row.original} />;
		},
	}),
];

function PaymentFunctionComponent({ data }: { data: PaymentRowItem }) {
	const { setOpenSheet, setOpenDialog, setMode, setData } =
		usePaymentFunctionContext();
	const { access } = useAccessContext();

	return (
		<FunctionsComponent
			setOpenSheet={setOpenSheet}
			setOpenDialog={setOpenDialog}
			setMode={setMode}
			data={data}
			setData={setData}
			disabled={!access.employees_write}
		/>
	);
}

export function employeePaymentMapper(
	employeePaymentData: EmployeePaymentFEType[],
): PaymentRowItem[] {
	return employeePaymentData.map((d) => {
		return d;
	});
}

export function EmployeePaymentTable() {
	return (
		<EmployeePaymentFunctionContextProvider>
			<DataTableUpdate />
			<EmployeePaymentFunctions />
		</EmployeePaymentFunctionContextProvider>
	);
}
