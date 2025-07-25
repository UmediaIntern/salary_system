import { useContext } from "react";
import { EmployeeBonusTable } from "../tables/employee_bonus_table_budget";
import dataTableContext from "../components/context/data_table_context";
import { useTranslation } from "react-i18next";
import { usePeriodContext } from "~/components/context/period_context_provider";

export default function BonusBudget() {
    const { selectedPeriod } = usePeriodContext()
    const { selectedBonusType, selectedIssueDate } = useContext(dataTableContext);
    const { t } = useTranslation(["common"]);

    if (!selectedPeriod) {
        return <p>{t("others.select_period")}</p>;
    }

    if (!selectedIssueDate) {
        return <p>{t("others.select_bonus_type_and_issue_date")}</p>;
    }

    return (
        <EmployeeBonusTable period_id={selectedPeriod.period_id} bonus_type={selectedBonusType} issue_date={selectedIssueDate} />
    );
}