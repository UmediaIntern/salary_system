import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "~/components/ui/select";

export const ColumnsSelector = ({
    columns: columns,
    setColumns: setColumns,
    t: t
}: {
    columns: number,
    setColumns: (columns: number) => void,
    t: (t: string | string[]) => string
}) => {
    const availableColumns = [2, 3, 4];

    const [selectedColumns, setSelectedColumns] = useState(columns.toString());

    return <>
        <div>
            <Select
                value={columns.toString()}
                onValueChange={(value) => {
                    setColumns(parseInt(value));
                    setSelectedColumns(value);
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a sheet" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{t("TODO.Columns")}</SelectLabel>
                        {availableColumns.map(
                            (column) => {
                                return (
                                    <SelectItem
                                        key={column}
                                        value={column.toString()}
                                    >
                                        {column} {t(["TODO.columns"])}
                                    </SelectItem>
                                );
                            }
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </>
}