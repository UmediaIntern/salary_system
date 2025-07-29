import { useContext } from "react";
import dataTableContext from "../components/context/data_table_context";
import { EmployeeBonusTable } from "../tables/employee_bonus_table_final";
import { usePeriodContext } from "~/components/context/period_context_provider";

export default function BonusFinalCheck() {
    const { selectedPeriod } = usePeriodContext()
    const { selectedBonusType } = useContext(dataTableContext);
    return (
        selectedPeriod ? <EmployeeBonusTable periodId={selectedPeriod.period_id} bonusType={selectedBonusType} viewOnly={true} /> : <></>
    );
}
