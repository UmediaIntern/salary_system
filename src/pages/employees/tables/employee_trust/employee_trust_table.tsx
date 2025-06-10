import { DataTableUpdate } from "../../components/data_table_update";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeeTrustFEType } from "~/server/api/types/employee_trust_type";
import { formatDate } from "~/lib/utils/format_date";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { type TFunction } from "i18next";
import {
	ColumnHeaderBaseComponent,
	ColumnHeaderComponent,
} from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import {
	EmployeeTrustFunctionContextProvider,
	type TrustRowItem,
	type TrustRowItemKey,
	useTrustFunctionContext,
} from "./employee_trust_provider";
import { EmployeeTrustFunctions } from "./employee_trust_functions";
import { useAccessContext } from "~/components/context/access_context_provider";

const columnHelper = createColumnHelper<TrustRowItem>();

const columnNames: TrustRowItemKey[] = [
	"department",
	"emp_no",
	"emp_name",
	"position",
	"position_type",
	"emp_trust_reserve",
	"org_trust_reserve",
	"emp_special_trust_incent",
	"org_special_trust_incent",
	"start_date",
	"end_date",
];

export const employee_trust_columns = ({
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
				return <TrustFunctionComponent data={row.original} />;
			},
		}),
	];

function TrustFunctionComponent({
	data,
}: {
	data: TrustRowItem;
}) {
	const { setOpenSheet, setOpenDialog, setMode, setData } = useTrustFunctionContext();
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

export function employeeTrustMapper(
	employeeTrustData: EmployeeTrustFEType[]
): TrustRowItem[] {
	return employeeTrustData.map((d) => {
		return {
			...d,
			start_date: d.start_date,
			end_date: d.end_date,
			functions: d.functions,
		};
	});
}

export function EmployeeTrustTable() {
	return (
		<EmployeeTrustFunctionContextProvider>
			<DataTableUpdate />
			<EmployeeTrustFunctions />
		</EmployeeTrustFunctionContextProvider>
	);
}
