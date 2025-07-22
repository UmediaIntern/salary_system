import { DataTableUpdate } from "../../components/data_table_update";
import { createColumnHelper } from "@tanstack/react-table";
import {
	type EmployeePaymentFEType,
} from "~/server/api/types/employee_payment_type";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import {
	ColumnHeaderBaseComponent,
	ColumnHeaderComponent,
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

const allowanceColumns: PaymentRowItemKey[] = [
	"position",
	"position_type",
	"supervisor_allowance",
	"food_allowance",
	"occupational_allowance",
	"subsidy_allowance",
	"long_service_allowance",
];

const columnNames: PaymentRowItemKey[] = [
	"base_salary",
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
		header: ({ column }) => {
			return (
				<ColumnHeaderComponent column={column}>
					{t(`table.position`)}
				</ColumnHeaderComponent>
			);
		},
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
		header: ({ column }) => {
			return (
				<ColumnHeaderComponent column={column}>
					{t(`table.position_type`)}
				</ColumnHeaderComponent>
			);
		},
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
	columnHelper.accessor("supervisor_allowance", {
		header: ({ column }) => {
			return (
				<ColumnHeaderComponent column={column}>
					{t(`table.supervisor_allowance`)}
				</ColumnHeaderComponent>
			);
		},
		cell: ({ row }) => {
			const data = row.original.supervisor_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.supervisor}
				/>
			);
		},
	}),
	columnHelper.accessor("food_allowance", {
		header: ({ column }) => {
			return (
				<ColumnHeaderComponent column={column}>
					{t(`table.food_allowance`)}
				</ColumnHeaderComponent>
			);
		},
		cell: ({ row }) => {
			const data = row.original.food_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.food}
				/>
			);
		},
	}),
	columnHelper.accessor("occupational_allowance", {
		header: ({ column }) => {
			return (
				<ColumnHeaderComponent column={column}>
					{t(`table.occupational_allowance`)}
				</ColumnHeaderComponent>
			);
		},
		cell: ({ row }) => {
			const data = row.original.occupational_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.occupational}
				/>
			);
		},
	}),
	columnHelper.accessor("subsidy_allowance", {
		header: ({ column }) => {
			return (
				<ColumnHeaderComponent column={column}>
					{t(`table.subsidy_allowance`)}
				</ColumnHeaderComponent>
			);
		},
		cell: ({ row }) => {
			const data = row.original.subsidy_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.subsidy}
				/>
			);
		},
	}),
	columnHelper.accessor("long_service_allowance", {
		header: ({ column }) => {
			return (
				<ColumnHeaderComponent column={column}>
					{t(`table.long_service_allowance`)}
				</ColumnHeaderComponent>
			);
		},
		cell: ({ row }) => {
			const data = row.original.long_service_allowance;
			return (
				<ColumnCellComponentWithInfo
					data={data}
					info={row.original.info}
					range={row.original.info.longService}
				/>
			);
		},
	}),
];

export const employee_payment_columns = ({ t }: { t: I18nType }) => [
	...firstThreeColumns.map((key) =>
		columnHelper.accessor(key, {
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`table.${key}`)}
					</ColumnHeaderComponent>
				);
			},
			cell: ({ row }) => {
				return (
					<ColumnCellComponent>
						{row.original[key]?.toString()}
					</ColumnCellComponent>
				);
			},
		}),
	),
	...employee_payment_columns_with_info({t}),
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
				let content = row.original[key]?.toString() ?? "";
				switch (key) {
					case "long_service_allowance_type":
						content = t(
							`long_service_allowance_type.${row.original.long_service_allowance_type}`,
						);
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
			return <PaymentFunctionComponent data={row.original} />;
		},
	}),
];

export const employee_payment_history_columns = ({ t }: { t: I18nType }) => [
	...[...firstThreeColumns, ...allowanceColumns].map((key) =>
		historyColumnHelper.accessor(key, {
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`table.${key}`)}
					</ColumnHeaderComponent>
				);
			},
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
			header: ({ column }) => {
				return (
					<ColumnHeaderComponent column={column}>
						{t(`table.${key}`)}
					</ColumnHeaderComponent>
				);
			},
			cell: ({ row }) => {
				let content = row.original[key]?.toString() ?? "";
				switch (key) {
					case "long_service_allowance_type":
						content = t(
							`long_service_allowance_type.${row.original.long_service_allowance_type}`,
						);
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
