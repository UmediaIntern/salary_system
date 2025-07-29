import { EmployeeBonusTable } from "../tables/employee_bonus_table_budget";
import { useTranslation } from "react-i18next";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";

export default function BonusBudget() {
	const { selectedPeriod } = usePeriodContext();
	const { selectedBonusType, selectedIssueDate } = useBonusFunctionContext();
	const { t } = useTranslation(["common"]);

	if (!selectedPeriod) {
		return <p>{t("others.select_period")}</p>;
	}

	if (!selectedIssueDate) {
		return <p>{t("others.select_bonus_type_and_issue_date")}</p>;
	}

	return (
		<EmployeeBonusTable
			periodId={selectedPeriod.period_id}
			bonusType={selectedBonusType}
			issueDate={selectedIssueDate}
		/>
	);
}
