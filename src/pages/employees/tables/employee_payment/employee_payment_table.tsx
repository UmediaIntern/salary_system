import { DataTableUpdate } from "../../components/data_table_update";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeePaymentFEType } from "~/server/api/types/employee_payment_type";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { type TFunction } from "i18next";
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
	usePaymentFunctionContext,
} from "./employee_payment_provider";
import { EmployeePaymentFunctions } from "./employee_payment_functions";
import { useAccessContext } from "~/components/context/access_context_provider";
import { cn } from "~/lib/utils";
import { OctagonAlert, OctagonX } from "lucide-react";

const columnHelper = createColumnHelper<PaymentRowItem>();

const firstThreeColumns: PaymentRowItemKey[] = [
	"department",
	"emp_no",
	"emp_name",
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

function WrappedColumnCellComponent({
	error_flag,
	warning_flag,
	data
}: {
	error_flag: boolean;
	warning_flag: boolean;
	data: string | number;
}) {
	return (
		<ColumnCellComponent
			className={cn(
				"flex justify-center",
				error_flag ? "text-destructive" : warning_flag ? "text-yellow-400" : ""
			)}
			>
			<div className="flex justify-center items-center gap-2">
				{error_flag && <OctagonX />}
				{warning_flag && <OctagonAlert />}
				{data} {/* {row.original.supervisor_allowance} */}
				&nbsp;&nbsp;&nbsp;
			</div>
		</ColumnCellComponent>
	);
}

export const employee_payment_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => [
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
		})
	),
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
							"text-destructive"
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
							"text-destructive"
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
			const positionOrTypeChange = row.original.info.isPositionModified || row.original.info.isPositionTypeModified
			const error_flag =
			positionOrTypeChange &&
				!row.original.info.supervisor.isInRange &&
				!row.original.info.supervisor.isModified;
			const warning_flag =
			positionOrTypeChange &&
				row.original.info.supervisor.isInRange &&
				!row.original.info.supervisor.isModified;
			const data = row.original.supervisor_allowance
			return WrappedColumnCellComponent({ error_flag, warning_flag, data });
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
			const positionOrTypeChange = row.original.info.isPositionModified || row.original.info.isPositionTypeModified
			const error_flag =
				positionOrTypeChange &&
					!row.original.info.supervisor.isInRange &&
					!row.original.info.supervisor.isModified;
			const warning_flag = 
				positionOrTypeChange &&
					row.original.info.supervisor.isInRange &&
					!row.original.info.supervisor.isModified;
			const data = row.original.food_allowance
			return WrappedColumnCellComponent({ error_flag, warning_flag, data });
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
			const positionOrTypeChange = row.original.info.isPositionModified || row.original.info.isPositionTypeModified
			const error_flag =
				positionOrTypeChange &&
					!row.original.info.supervisor.isInRange &&
					!row.original.info.supervisor.isModified;
			const warning_flag =
				positionOrTypeChange &&
					row.original.info.supervisor.isInRange &&
					!row.original.info.supervisor.isModified;
			const data = row.original.occupational_allowance
			return WrappedColumnCellComponent({ error_flag, warning_flag, data });
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
			const positionOrTypeChange = row.original.info.isPositionModified || row.original.info.isPositionTypeModified
			const error_flag =
			positionOrTypeChange &&
				!row.original.info.supervisor.isInRange &&
				!row.original.info.supervisor.isModified;
			const warning_flag =
			positionOrTypeChange &&
				row.original.info.supervisor.isInRange &&
				!row.original.info.supervisor.isModified;
			const data = row.original.subsidy_allowance
			return WrappedColumnCellComponent({ error_flag, warning_flag, data });
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
			const positionOrTypeChange = row.original.info.isPositionModified || row.original.info.isPositionTypeModified
			const error_flag =
			positionOrTypeChange &&
				!row.original.info.supervisor.isInRange &&
				!row.original.info.supervisor.isModified;
			const warning_flag =
			positionOrTypeChange &&
				row.original.info.supervisor.isInRange &&
				!row.original.info.supervisor.isModified;
			const data = row.original.long_service_allowance
			return WrappedColumnCellComponent({ error_flag, warning_flag, data });
		},
	}),
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
							`long_service_allowance_type.${row.original.long_service_allowance_type}`
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
	employeePaymentData: EmployeePaymentFEType[]
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
