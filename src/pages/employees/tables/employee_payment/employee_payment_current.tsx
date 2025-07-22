import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { useEmployeeTableContext } from "../../components/context/data_table_context_provider";
import { CurrentView } from "../../components/current_view/current_view";
import { useTranslation } from "react-i18next";
import { employee_payment_columns } from "./employee_payment_table";
import { useMemo } from "react";
import { ColumnHeaderComponent } from "~/components/data_table/column_header_component";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

export function EmployeePaymentCurrentTable() {
	const { period_id } = useEmployeeTableContext();
	const { t } = useTranslation(["common"]);

	const q = api.employeePayment.getCurrentEmployeePaymentWithInfo.useQuery({
		period_id,
	});
	const { isPending, content, data } = useQueryHandle(q);

	const columns = useMemo(() => {
		return employee_payment_columns({ t });
	}, [t]);

	if (isPending) {
		return content;
	}

	return (
		<CurrentView
			columns={columns}
			data={data}
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
