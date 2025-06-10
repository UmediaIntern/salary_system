import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { useEmployeeTableContext } from "../../components/context/data_table_context_provider";
import { CurrentView } from "../../components/current_view/current_view";
import { employee_trust_columns } from "./employee_trust_table";
import { useTranslation } from "react-i18next";

export function EmployeeTrustCurrentTable() {
	const { period_id } = useEmployeeTableContext();
	const { t } = useTranslation(["common"]);

	const { isPending, isError, data, error } =
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({
			period_id: period_id,
		});

	if (isPending) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	const tableData = data.filter(item => !item.emp_no.startsWith("F"));
	return <CurrentView columns={employee_trust_columns({ t })} data={tableData} />
}
