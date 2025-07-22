import { api } from "~/utils/api";
import { DataTable as DataTableWithFunctions } from "../components/regular/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { useTranslation } from "react-i18next";
import { useContext, useEffect } from "react";
import dataTableContext from "../components/context/data_table_context";
import { EmployeeBonusFEType } from "~/server/api/types/employee_bonus_type";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TFunction } from "i18next";

export type RowItem = EmployeeBonusFEType;
type RowItemKey = keyof RowItem;
const columnHelper = createColumnHelper<RowItem>();

interface EmployeeBonusTableProps extends TableComponentProps {
    period_id: number;
    bonus_type: BonusTypeEnumType;
    globalFilter?: string;
    viewOnly?: boolean;
}

const employee_bonus_final_columns = ({ t }: { t: TFunction<[string], undefined> }) => [
    ...[
        "department",
        "emp_no",
        "emp_name",
        // "special_multiplier",
        // "multiplier",
        // "fixed_amount",
        "bud_effective_salary",
        "bud_amount",
        // "sup_performance_level",
        "sup_effective_salary",
        "sup_amount",
        // "app_performance_level",
        "app_effective_salary",
        "app_amount",
    ].map(
        (key: string) => columnHelper.accessor(key as RowItemKey, {
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <div className="text-center font-medium">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc"
                                    )
                                }
                            >
                                {t(`table.${key}`)}
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                );
            },
            cell: ({ row }) => {
                switch (key) {
                    default:
                        return <div className="text-center font-medium">{`${row.original[key as RowItemKey] ?? ""}`}</div>
                }
            }
        })),
]

export function EmployeeBonusTable({ period_id, bonus_type, viewOnly }: EmployeeBonusTableProps) {
    const { t } = useTranslation(["common"]);

    const { isLoading, isError, data, error } =
        api.bonus.getEmployeeBonus.useQuery({ period_id, bonus_type });
    const filterKey: RowItemKey = "emp_no";
    const { setSelectedTableType } = useContext(dataTableContext);

    useEffect(() => {
        setSelectedTableType("TableEmployeeBonus");
    }, []);

    if (isLoading) {
        return (
            <div className="flex grow items-center justify-center">
                <LoadingSpinner />
            </div>
        ); // TODO: Loading element with toast
    }

    if (isError) {
        return <span>Error: {error.message}</span>; // TODO: Error element with toast
    }

    return (
        <>
            {!viewOnly ? (
                <DataTableWithFunctions
                    columns={employee_bonus_final_columns({ t })}
                    data={data!}
                    bonusType={bonus_type}
                    filterColumnKey={filterKey}
                />
            ) : (
                <DataTableWithoutFunctions
                    columns={employee_bonus_final_columns({ t })}
                    data={data!}
                    filterColumnKey={filterKey}
                />
            )}
        </>
    );
}
