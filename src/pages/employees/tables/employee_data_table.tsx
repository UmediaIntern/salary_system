import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { formatDate } from "~/lib/utils/format_date";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { type MonthSalaryStatusEnumType } from "~/server/api/types/month_salary_status_enum";
import { useEmployeeTableContext } from "../components/context/data_table_context_provider";
import { convertToKey, WorkStatusEnumType } from "~/server/api/types/work_status_enum";
import { CostCategoryEnumType } from "~/server/api/types/cost_category_type";

// TODO: move to schema
type RowItem = {
	department: string;
	emp_no: string;
	emp_name: string;
	position: number;
	position_type: string;
	group_insurance_type: string;
	cost_category: CostCategoryEnumType;
	work_type: string;
	work_status: string;
	disabilty_level: string | null;
	sex_type: string;
	dependents: number | null;
	healthcare_dependents: number | null;
	residence_permit_start_date: string | null;
	residence_permit_end_date: string | null;
	registration_date: string;
	quit_date: string | null;
	license_id: string | null;
	bank_account_taiwan: string;
	received_elderly_benefits: boolean;
	month_salary_status: MonthSalaryStatusEnumType;
	difference: Array<string>;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = (t: I18nType) => {
	const f: RowItemKey[] = [
		"department",
		"emp_no",
		"emp_name",
		"position",
		"position_type",
		"group_insurance_type",
		"cost_category",
		"work_type",
		"work_status",
		"disabilty_level",
		"sex_type",
		"dependents",
		"healthcare_dependents",
		"residence_permit_start_date",
		"residence_permit_end_date",
		"registration_date",
		"quit_date",
		"license_id",
		"bank_account_taiwan",
		"received_elderly_benefits",
		"month_salary_status",
	];

	return f.map((key: RowItemKey) => {
		return columnHelper.accessor(key, {
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
					case "work_status":
						const work_status = row.original.work_status as WorkStatusEnumType;
						content = t(`work_status.${convertToKey(work_status)}`);
						break;
					case "residence_permit_start_date":
						content = formatDate("day", row.original.residence_permit_start_date) ?? "";
						break;
					case "residence_permit_end_date":
						content = formatDate("day", row.original.residence_permit_end_date) ?? "";
						break;
					case "registration_date":
						content = formatDate("day", row.original.registration_date) ?? "";
						break;
					case "quit_date":
						content = formatDate("day", row.original.quit_date) ?? "";
						break;
					case "received_elderly_benefits":
						content = t(`others.${row.original.received_elderly_benefits}`)
						break;
				}
				return <ColumnCellComponent>
					{ 
						// (row.original.difference.includes(key)) ? 
						// <div className="text-red-500">
						// 	{/* {console.log("RED")} */}
						// 	{content}
						// </div> :
						<>{content}</>
					}
				</ColumnCellComponent>;
			},
			// filterFn: key === "work_status" ? "equalsString" : undefined,
		});
	});
};

export function EmployeeDataTable() {
	const { period_id } = useEmployeeTableContext();
	const { isPending, isError, data, error } =
		api.employeeData.getCurrentEmployeeDataWithInfo.useQuery({ period_id });

	const testData = data ? data!.map((d) => {
		// add difference property to each data
		const difference: string[] = [];
		difference.push("position")
		return {
			...d,
			difference: difference,
		};
	}) : undefined;

	const { t } = useTranslation(["common"]);

	if (isPending) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<>
		{/* <button onClick={() => console.log(testData)}>TEST</button> */}
		<DataTable
			columns={columns(t)}
			data={testData ? testData : []}
			// data = {data}
			initialColumnVisibility={{ month_salary_status: false }}
		/>
		</>
	);
}
