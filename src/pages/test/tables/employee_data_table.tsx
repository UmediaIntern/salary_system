import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType} from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const columns = (t: I18nType) => [
	"emp_no",
	"emp_name",
	"position",
	"position_type",
	"group_insurance_type",
	"department",
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
].map((key) => {
	return {
		accessorKey: key,
		header: t(`table.${key}`),
	};
});

interface EmployeeDataTableProps {
	period_id: number;
	func: any;
}

export function EmployeeDataTable({ period_id, func }: EmployeeDataTableProps) {
	const { isLoading, isError, data, error } =
		api.sync.getPaidEmployees.useQuery({ period_id, func });

  const { t } = useTranslation(['common']);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

  if (data) {
    return <DataTable columns={columns(t)} data={data} />;
  }
  return <div/>;
}
