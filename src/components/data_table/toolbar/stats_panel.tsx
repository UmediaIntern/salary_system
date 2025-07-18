import { type Table, type Column } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { formatDate } from "~/lib/utils/format_date";
import { convertToKey as convertToWorkStatusKey, WorkStatusEnumType } from "~/server/api/types/work_status_enum";
import { convertToKey as convertToWorkTypeKey, WorkTypeEnumType } from "~/server/api/types/work_type_enum";

interface StatsPanelProps<TData> {
    table: Table<TData>;
}

export function StatsPanel<TData>({
    table,
}: StatsPanelProps<TData>) {
    const { t } = useTranslation(['common']);
    return (
        <div className="ml-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto w-40 h-8"
                    >
                        <div className="flex items-center">
                            {t("table.stats_panel")}
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[50%] h-[50%] flex">
                    <StatsPanelContent table={table} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function StatsPanelContent<TData>({ table }: { table: Table<TData> }) {
    const excludedColumns = ['id', 'emp_no', 'emp_name', 'license_id', 'bank_account_taiwan', 'bank_account_foreign', 'month_salary', 'parameters', 'value', 'created_at', 'updated_at', 'functions'];
    const columns = table.getAllColumns().filter((column) => !excludedColumns.includes(column.id));

    if (columns.length === 0) {
        return <div></div>;
    }

    const [selectedColumn, setSelectedColumn] = useState<Column<TData, unknown>>(columns[0]!);

    return (
        <div className="rounded-md border-2 grow">
            <ResizablePanelGroup direction="horizontal">
                {/* left panel */}
                <ResizablePanel defaultSize={25} minSize={10}>
                    <StatsPanelSelector columns={columns} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} />
                </ResizablePanel>
                <ResizableHandle />
                {/* right panel */}
                <ResizablePanel minSize={40}>
                    <ColumnComponent key={selectedColumn.id} column={selectedColumn} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

function StatsPanelSelector<TData>(
    {
        columns,
        selectedColumn,
        setSelectedColumn
    }: {
        columns: Column<TData, unknown>[],
        selectedColumn: Column<TData, unknown>,
        setSelectedColumn: (column: Column<TData, unknown>) => void
    }
) {
    const { t } = useTranslation(['common']);

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-[48px] items-center justify-center text-lg">
                <div>{t("table.column")} </div>
            </div>
            <Separator />
            <div className="h-0 grow">
                <ScrollArea className="h-full">
                    {columns.map((column) => {
                        return (
                            <div
                                key={column.id}
                                className={cn(
                                    "m-2 flex items-center rounded-md border p-1 hover:bg-muted",
                                    column === selectedColumn && "bg-muted"
                                )}
                                onClick={() => {
                                    setSelectedColumn(column);
                                }}
                            >
                                <div className="m-1 line-clamp-1 break-all">
                                    {t(`table.${column.id}`)}
                                </div>
                            </div>
                        );
                    })}
                </ScrollArea>
            </div>
        </div>
    )
}

function ColumnComponent<TData>({ column }: { column: Column<TData, unknown> }) {
    const { t } = useTranslation(['common']);
    const uniqueValues = Array.from(column.getFacetedUniqueValues().entries());
    const displayValue = uniqueValues.reduce<[string | number, number][]>((acc, [key, value]) => {
        if (
            column.id === "start_date"
            || column.id === "end_date"
            || column.id === "residence_permit_start_date"
            || column.id === "residence_permit_end_date"
            || column.id === "registration_date"
            || column.id === "quit_date"
        ) {
            key = formatDate("day", key) ?? "";
        }
        if (column.id === "work_status") {
            key = t(`work_status.${convertToWorkStatusKey(key as WorkStatusEnumType)}`);
        }
        if (column.id === "work_type") {
            key = t(`work_type.${convertToWorkTypeKey(key as WorkTypeEnumType)}`);
        }
        if (column.id === "long_service_allowance_type") {
            key = t(`long_service_allowance_type.${key}`);
        }
        const existing = acc.find(([k]) => k === key);
        if (existing) {
            existing[1] += value;
        } else {
            acc.push([key, value]);
        }
        return acc;
    }, []).sort((a, b) => (a[0] > b[0] ? 1 : -1));
    return (
        <ScrollArea className="h-full">
            <TableRow className="sticky top-0 bg-secondary">
                <TableHead key={"value"} align="center" className="text-center">{t(`table.value`)}</TableHead>
                <TableHead key={"count"} align="center" className="text-center">{t(`table.count`)}</TableHead>
            </TableRow>
            {displayValue.map(([key, value]) =>
                <TableRow>
                    <TableCell key={key} align="center" className="max-w-xs text-center">{key}</TableCell>
                    <TableCell key={value} align="center" className="max-w-xs text-center">{value}</TableCell>
                </TableRow>
            )}
            {typeof uniqueValues[0]?.[0] === 'number' &&
                <TableRow>
                    <TableCell key={"total"} align="center" className="max-w-xs text-center">{t(`table.total`)}</TableCell>
                    <TableCell key={"sum"} align="center" className="max-w-xs text-center">{uniqueValues.reduce((sum, [key, value]) => sum + key * value, 0)}</TableCell>
                </TableRow>
            }
        </ScrollArea>
    );
}