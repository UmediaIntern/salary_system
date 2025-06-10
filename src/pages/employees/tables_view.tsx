import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmployeeDataTable } from "./tables/employee_data_table";
import { EmployeePaymentTable } from "./tables/employee_payment/employee_payment_table";
import { EmployeeTrustTable } from "./tables/employee_trust/employee_trust_table";
import { EmployeeTableContextProvider, useEmployeeTableContext } from "./components/context/data_table_context_provider";
import { useTranslation } from "react-i18next";
import {
    EmployeeTableEnumValues,
    type EmployeeTableEnum,
    getTableNameKey,
} from "./employee_tables";
import { TabMountGuard } from "./components/context/tab_mount_guard";
import { usePeriodContext } from "~/components/context/period_context_provider";
import { SelectPeriodAlert } from "~/components/select_period_alert";

export default function TablesView() {

    const { selectedPeriod } = usePeriodContext();
    if (selectedPeriod === null) {
        return (
            <div className="m-4 grow">
                <SelectPeriodAlert />
            </div>
        );
    }

    return (
        <EmployeeTableContextProvider period_id={selectedPeriod.period_id}>
            <CompTableView />
        </EmployeeTableContextProvider>
    )
}

function CompTableView() {
    const { setSelectedTableType } = useEmployeeTableContext();
    const { t } = useTranslation(["common", "nav"]);

    function getTable(table_type: EmployeeTableEnum) {
        switch (table_type) {
            case "TableEmployee":
                return <EmployeeDataTable />;
            case "TableEmployeePayment":
                return <EmployeePaymentTable />;
            case "TableEmployeeTrust":
                return <EmployeeTrustTable />;
            default:
                return <p>No implement</p>;
        }
    }

    return (
        <Tabs
            defaultValue={EmployeeTableEnumValues[0]}
            className="flex h-full flex-col"
        >
            <TabsList className={"grid w-full grid-cols-3"}>
                {EmployeeTableEnumValues.map((option) => {
                    return (
                        <TabsTrigger
                            key={option}
                            value={option}
                            onClick={() => setSelectedTableType(option)}
                        >
                            {t(getTableNameKey(option))}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
            <div className="mt-2 h-0 grow">
                {EmployeeTableEnumValues.map((option) => {
                    return (
                        <TabsContent
                            key={option}
                            value={option}
                            className="h-full"
                        >
                            <TabMountGuard tableType={option}>
                                {getTable(option)}
                            </TabMountGuard>
                        </TabsContent>
                    );
                })}
            </div>
        </Tabs>
    );
}