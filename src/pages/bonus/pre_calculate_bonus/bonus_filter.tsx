import React, { useContext, useEffect, useState, type ComponentType } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable";
import { cn } from "~/lib/utils";
import {
    Bookmark,
    Briefcase,
    Cake,
    Key,
    type LucideIcon,
    Users,
} from "lucide-react";
import DataTableContextProvider from "../components/context/data_table_context_provider";
import dataTableContext from "../components/context/data_table_context";
import { getTableNameKey } from "../components/context/data_table_enum";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { type BonusTableEnum, BonusTableEnumValues } from "../bonus_tables";
import { BonusDepartmentTable } from "../tables/bonus_department_table";
import { BonusPositionTable } from "../tables/bonus_position_table";
import { BonusSeniorityTable } from "../tables/bonus_seniority_table";
import { BonusWorkTypeTable } from "../tables/bonus_work_type_table";
import { type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { BonusAllTable } from "../tables/bonus_all_table";
import { usePeriodContext } from "~/components/context/period_context_provider";

export type TableComponentProps = {
    period_id: number;
    bonus_type: BonusTypeEnumType;
    globalFilter?: string;
};

type TableComponent = {
    component: ComponentType<TableComponentProps>;
    icon: LucideIcon;
};

function getTableComponent(
    table: BonusTableEnum,
): TableComponent {
    switch (table) {
        case "TableBonusAll":
            return {
                component: BonusAllTable,
                icon: Bookmark,
            };
        case "TableBonusWorkType":
            return {
                component: BonusWorkTypeTable,
                icon: Key,
            };
        case "TableBonusDepartment":
            return {
                component: BonusDepartmentTable,
                icon: Users,
            };
        case "TableBonusPosition":
            return {
                component: BonusPositionTable,
                icon: Briefcase,
            };
        // case "TableBonusPositionType":
        //     return {
        //         component: BonusPositionTypeTable,
        //         icon: Key,
        //     };
        case "TableBonusSeniority":
            return {
                component: BonusSeniorityTable,
                icon: Cake,
            };
        // case "TablePerformanceLevel":
        // 	return {
        // 		component: PerformanceLevelTable,
        // 		icon: TrendingUp,
        // 	};
        default:
            throw new Error(`Invalid table`);
    }
}

export default function BonusFilter() {
    const { selectedBonusType } = useContext(dataTableContext);
    return (
        <DataTableContextProvider>
            <ResizablePanelGroup direction="horizontal" className="rounded-md border-2">
                {/* left panel */}
                <ResizablePanel defaultSize={15} minSize={10}>
                    <CompTablesSelector />
                </ResizablePanel>
                <ResizableHandle />
                {/* right panel */}
                <ResizablePanel minSize={40}>
                    <CompTableView bonus_type={selectedBonusType} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </DataTableContextProvider>
    );
}

function CompTablesSelector() {
    const [selectedTag, setSelectedTag] = useState<BonusTableEnum>(
        BonusTableEnumValues[0]
    );

    const { setSelectedTableType } = useContext(dataTableContext);

    const tableComponentMap: Record<BonusTableEnum, TableComponent> =
        BonusTableEnumValues.reduce((map, table) => {
            map[table] = getTableComponent(table);
            return map;
        }, {} as Record<BonusTableEnum, TableComponent>);

    useEffect(() => {
        setSelectedTableType(selectedTag);
    }, [selectedTag, setSelectedTableType]);

    const { t } = useTranslation(['common']);

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-[48px] items-center justify-center text-lg">
                <div>{t("table.tables")} </div>
            </div>
            <Separator />
            <div className="h-0 grow">
                <ScrollArea className="h-full">
                    {BonusTableEnumValues.map((table) => {
                        const tableComponent = tableComponentMap[table];

                        return (
                            <div
                                key={table}
                                className={cn(
                                    "m-2 flex items-center rounded-md border p-1 hover:bg-muted",
                                    table === selectedTag && "bg-muted"
                                )}
                                onClick={() => {
                                    setSelectedTag(table);
                                }}
                            >
                                <tableComponent.icon
                                    size={18}
                                    className="ml-1 mr-2 flex-shrink-0 cursor-pointer"
                                />
                                <div className="m-1 line-clamp-1 break-all">
                                    {t(getTableNameKey(table))}
                                </div>
                            </div>
                        );
                    })}
                </ScrollArea>
            </div>
        </div>
    );
}

function CompTableView({ bonus_type }: { bonus_type: BonusTypeEnumType }) {
    const { selectedTableType } = useContext(dataTableContext);
    const { selectedPeriod } = usePeriodContext();

    const { t } = useTranslation(['common']);

    return (
        <>
            {BonusTableEnumValues.filter(
                (table) => table === selectedTableType
            ).map((selectedTableType) => {
                return (
                    <div key={selectedTableType} className="flex h-full">
                        {selectedPeriod ? React.createElement<TableComponentProps>(
                            getTableComponent(selectedTableType).component,
                            { period_id: selectedPeriod.period_id, bonus_type: bonus_type }
                        ) : <p>{t("others.select_period")}</p>}
                    </div>
                );
            })}
        </>
    );
}
