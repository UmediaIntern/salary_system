import { z } from "zod";

export function getExcelData<T extends Record<string, unknown>>(datas: T[], excludeKeys: string[]): (unknown)[][] {
    if (datas.length === 0 || !datas[0]) {
        return [];
    }

    const column_names: string[] = Object.keys(datas[0]).filter((key: string) => !excludeKeys.includes(key));

    const rows = datas.map((data: T) => {
        return column_names.map(key => data[key]);
    });

    return [column_names, ...rows];
}

