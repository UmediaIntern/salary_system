import { api } from "~/utils/api";
import { HistoryView } from "../../components/history_view/history_view";
import {
	employee_trust_columns,
	employeeTrustMapper,
} from "./employee_trust_table";
import { useTranslation } from "react-i18next";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

export function EmployeeTrustHistory() {
	const { t } = useTranslation(["common"]);

	const q = api.employeeTrust.getAllEmployeeTrust.useQuery();
	const { data, isPending, content } = useQueryHandle(q);

	if (isPending) {
		return content;
	}

	const tableData = data.map((d) => employeeTrustMapper(d)).filter((item) => !item[0]!.emp_no.startsWith("F"));
	return (
		<HistoryView columns={employee_trust_columns({ t })} data={tableData} />
	);
}
