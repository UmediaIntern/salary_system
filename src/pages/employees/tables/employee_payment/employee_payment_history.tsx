import { api } from "~/utils/api";
import { HistoryView } from "../../components/history_view/history_view";
import { useTranslation } from "react-i18next";
import {
	employee_payment_history_columns,
	employeePaymentMapper,
} from "./employee_payment_table";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";

export function EmployeePaymentHistory() {
	const { t } = useTranslation(["common"]);

	const q = api.employeePayment.getAllEmployeePayment.useQuery();
	const { data, isPending, content } = useQueryHandle(q);

	if (isPending) {
		return content;
	}

	const tableData = data.map((d) => employeePaymentMapper(d));
	return (
		<HistoryView
			columns={employee_payment_history_columns({ t })}
			data={tableData}
			defaultColumn={{
				header: ({ column }) => {
					return (
						<ColumnHeaderComponent column={column}>
							{t(`table.${column.id}`)}
						</ColumnHeaderComponent>
					);
				},
			}}
		/>
	);
}
