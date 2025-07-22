import { api } from "~/utils/api";
import { useEmployeeTableContext } from "../../components/context/data_table_context_provider";
import { CurrentView } from "../../components/current_view/current_view";
import { employee_trust_columns } from "./employee_trust_table";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

export function EmployeeTrustCurrentTable() {
	const { period_id } = useEmployeeTableContext();
	const { t } = useTranslation(["common"]);

	const q = api.employeeTrust.getCurrentEmployeeTrust.useQuery({
		period_id: period_id,
	});
	const { isPending, content, data } = useQueryHandle(q);

	const columns = useMemo(() => {
		return employee_trust_columns({ t });
	}, [t]);

	if (isPending) {
		return content;
	}

	const tableData = data.filter((item) => !item.emp_no.startsWith("F"));
	return <CurrentView columns={columns} data={tableData} />;
}
