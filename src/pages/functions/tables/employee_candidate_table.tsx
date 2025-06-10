import { DataTable } from "../components/data_table_advanced_filter";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { formatDate } from "~/lib/utils/format_date";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { ColumnCellComponent } from "~/components/data_table/column_cell_component";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { convertToKey, WorkStatusEnumType } from "~/server/api/types/work_status_enum";

type RowItem = {
	department: string;
	emp_no: string;
	emp_name: string;
	base_salary: number;
	l_i: number;
	h_i: number;
	l_r: number;
	occupational_injury: number;
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
		"base_salary",
		"l_i",
		"h_i",
		"l_r",
		"occupational_injury",
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
					case "work_status":
						const work_status = row.original.work_status as WorkStatusEnumType;
						content = t(`work_status.${convertToKey(work_status)}`);
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
				return <ColumnCellComponent>{content}</ColumnCellComponent>;
			},
			filterFn: key === "work_type" ? "arrIncludesSome" : undefined,
		});
	});
};

interface EmployeeCandidateTableProps {
	period_id: number;
	func: any;
}

export function EmployeeCandidateTable({ period_id, func }: EmployeeCandidateTableProps) {
	const q = api.sync.getPaidEmployees.useQuery({ period_id, func });
	const q2 = api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });
	const { data: employeeData, isPending: isEmployeeDataPending, content: employeeDataContent } = useQueryHandle(q);
	const { data: employeePayment, isPending: isEmployeePaymentPending, content: employeePaymentContent } = useQueryHandle(q2);
	const { t } = useTranslation(["common"]);

	if (isEmployeeDataPending || isEmployeePaymentPending) {
		return <>{employeeDataContent}{employeePaymentContent}</>;
	}

	const tableData = employeeData.map((employee) => {
		const payment = employeePayment.find((p) => p.emp_no === employee.emp_no);
		return {
			...employee,
			base_salary: payment?.base_salary ?? 0,
			l_i: payment?.l_i ?? 0,
			h_i: payment?.h_i ?? 0,
			l_r: payment?.l_r ?? 0,
			occupational_injury: payment?.occupational_injury ?? 0,
		}
	})

	return <DataTable columns={columns(t)} data={tableData} />;
}
