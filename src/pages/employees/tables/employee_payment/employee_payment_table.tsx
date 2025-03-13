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

const columnHelper = createColumnHelper<PaymentRowItem>();

const columnNames: PaymentRowItemKey[] = [
	"department",
	"emp_no",
	"emp_name",
	"position",
	"position_type",
	"base_salary",
	"food_allowance",
	"supervisor_allowance",
	"occupational_allowance",
	"subsidy_allowance",
	"long_service_allowance",
	"long_service_allowance_type",
	"l_r_self_ratio",
	"l_i",
	"h_i",
	"l_r",
	"occupational_injury",
	"start_date",
	"end_date",
];

export const employee_payment_columns = ({
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
	const { setOpen, setMode, setData } = usePaymentFunctionContext();

	return (
		<FunctionsComponent
			setOpen={setOpen}
			setMode={setMode}
			data={data}
			setData={setData}
		/>
	);
}

export function employeePaymentMapper(
	employeePaymentData: EmployeePaymentFEType[]
): PaymentRowItem[] {
	return employeePaymentData.map((d) => {
		return {
			...d,
			long_service_allowance_type: d.long_service_allowance_type,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
		};
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
