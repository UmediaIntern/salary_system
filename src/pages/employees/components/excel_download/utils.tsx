import { z } from "zod";
export interface keyDict {
	[key: string]: string[];
}

export function getExcelData(datas: any[], excludeKeys: string[]) {

    if (datas.length == 0) {
        return [];
    }

    // exclude keys
    // const column_names: any[] = Object.keys(datas[0])
    const column_names: any[] = Object.keys(datas[0]).filter((key: string) => !excludeKeys.includes(key));
    const rows = datas.map((data: any, index: number) => {
        return column_names.map((key: string) => {
            return data[key];
        });
    });
    return [column_names].concat(rows);
}

