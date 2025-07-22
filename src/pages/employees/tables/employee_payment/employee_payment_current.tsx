import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { useEmployeeTableContext } from "../../components/context/data_table_context_provider";
import { CurrentView } from "../../components/current_view/current_view";
import { useTranslation } from "react-i18next";
import {
	employee_payment_columns,
} from "./employee_payment_table";
import { useMemo } from "react";

export function EmployeePaymentCurrentTable() {
	const { period_id } = useEmployeeTableContext();
	const { t } = useTranslation(["common"]);

	const { isPending, isError, data, error } =
		api.employeePayment.getCurrentEmployeePaymentWithInfo.useQuery({
			period_id,
		});

	const columns = useMemo(() => {
		return employee_payment_columns({ t });
	}, [t]);

	if (isPending) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <CurrentView columns={columns} data={data} />;
}
