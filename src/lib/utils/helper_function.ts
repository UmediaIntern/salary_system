import { type I18nType } from "./i18n_type";

export function modeDescription(t: I18nType, mode: string) {
    switch (mode) {
        case "create":
            return t("others.create_msg");
        case "update":
            return t("others.update_msg");
        case "delete":
            return t("others.delete_msg");
        case "adjust_level":
            return t("others.adjust_level_msg");
        default:
            return "";
    }
}
