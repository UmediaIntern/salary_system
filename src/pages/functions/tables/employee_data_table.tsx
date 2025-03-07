import { DataTable } from "../components/data_table_advanced_filter";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { formatDate } from "~/lib/utils/format_date";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

type RowItem = {
	department: string;
	emp_no: string;
	emp_name: string;
	position: number;
	position_type: string;
	group_insurance_type: string;
	work_type: string;
	work_status: string;
	disabilty_level: string | null;
	sex_type: string;
	dependents: number | null;
	healthcare_dependents: number | null;
	registration_date: string;
	quit_date: string | null;
	license_id: string | null;
	bank_account_taiwan: string;
	bank_account_foreign: string | null;
	received_elderly_benefits: boolean;
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
		"work_type",
		"work_status",
		"disabilty_level",
		"sex_type",
		"dependents",
		"healthcare_dependents",
		"registration_date",
		"quit_date",
		"license_id",
		"bank_account_taiwan",
		"bank_account_foreign",
		"received_elderly_benefits",
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
					case "registration_date":
						content =
							formatDate("day", row.original.registration_date) ??
							"";
						break;
					case "quit_date":
						content =
							formatDate("day", row.original.quit_date) ?? "";
						break;
				}
				return <ColumnCellComponent>{content}</ColumnCellComponent>;
			},
			filterFn: key === "work_type" ? "arrIncludesSome" : undefined,
		});
	});
};

interface EmployeeDataTableProps {
	period_id: number;
	func: any;
}

export function EmployeeDataTable({ period_id, func }: EmployeeDataTableProps) {
	const q = api.sync.getPaidEmployees.useQuery({ period_id, func });
	const { data, isPending, content } = useQueryHandle(q);
	const { t } = useTranslation(["common"]);

	if (isPending) {
		return content;
	}

	return <DataTable columns={columns(t)} data={data} />;
}
