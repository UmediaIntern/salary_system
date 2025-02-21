export function getExcelData<T extends Record<string, unknown>>(datas: T[], excludeKeys: string[], includeHeader = true): (unknown)[][] {
    if (datas.length === 0 || !datas[0]) {
        return [];
    }

    const column_names: string[] = Object.keys(datas[0]).filter((key: string) => !excludeKeys.includes(key));

    const rows = datas.map((data: T) => {
        return column_names.map(key => data[key]);
    });

    if (includeHeader) {
        return [column_names, ...rows];
    } else {
        return rows;
    }
}