import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectValue } from "~/components/ui/select";
import { useTranslation } from "react-i18next";
import { workTypeEnum } from "~/server/api/types/work_type_enum";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

function resetFilter(table: Table<any>) {
    table.getColumn("work_type")?.setFilterValue("");
}

function getFilterFunctionByValue<TData>(table: Table<TData>, value: string) {
    switch (value) {
        case "all":
            return table.getColumn("work_type")?.setFilterValue("");
        case "foreign_worker":
            return table.getColumn("work_type")?.setFilterValue([workTypeEnum.Enum.外籍勞工]);
        case "normal_worker":
            return table.getColumn("work_type")?.setFilterValue([workTypeEnum.Enum.直接人員, workTypeEnum.Enum.間接人員]);
        default:
            return table.setGlobalFilter("");
    }
}

export function AdvancedFilter<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const { t } = useTranslation(['common']);
    return (
        <Select defaultValue="all" onValueChange={value => {
            resetFilter(table);
            getFilterFunctionByValue(table, value)
        }}>
            <SelectTrigger className="grow rounded-md border mx-2 min-w-[150px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t("table.all")}</SelectItem>
                <SelectItem value="foreign_worker">{t("table.foreign_worker")}</SelectItem>
                <SelectItem value="normal_worker">{t("table.normal_worker")}</SelectItem>
            </SelectContent>
        </Select>
    )
}
