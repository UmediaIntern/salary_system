import common from "./zh-TW/common.json";

export function inverse_translate(key: string, table_name?: string) {
    let inverse = undefined;
    Object.keys(common).map((scope: string) => {
        if (scope == "others") return;
        Object.keys((common as any)[scope]).find((k: string) => {
            if ((common as any)[scope][k] === key) {
                // inverse = `${scope}.${k}`;
                inverse = k;
            }
        })
    });

    return inverse ?? "unknown";
}
