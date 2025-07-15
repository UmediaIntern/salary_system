// Hooks
import { TFunction } from "i18next";
import { displayData } from "~/components/synchronize/utils/display";

export const convert2string = (data: any, t: TFunction<[string], undefined>) => {
    return displayData(data, t);
}

export const convertData = (data: any, t: TFunction<[string], undefined>) => {
    return Object.keys(data).map((key) => {
        return {
            key: t([`others.${key}`, `button.${key}`, `TODO.${key}`, `table.${key}`]),
            value: convert2string(data[key], t) as string
        }
});}

export const convertDatas = (datas: any[], t: TFunction<[string], undefined>, columns: number) => {
    return datas.map((data) => {
        const tmpData = convertData(data, t);
        for (let i = 0; i < columns - tmpData.length%columns; i++) {
            tmpData.push({ key: "", value: "" });
        }
        return tmpData;
    });
}

export function splitGroupByKeys(merge_keys: string) {
    return merge_keys.split("+");
}