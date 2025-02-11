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

    // handle same name keys
    if (table_name == "TableLevelRange") {
        if (key == "起") {
            return "level_start";
        }
        if (key == "迄") {
            return "level_end";
        }
    }

    if (table_name == "TableSalaryIncomeTax") {
        if (key == "起") {
            return "salary_start";
        }
        if (key == "迄") {
            return "salary_end";
        }
    }

    return inverse ?? "unknown";
}
