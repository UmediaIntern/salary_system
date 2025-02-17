import { TFunction } from "i18next";
import { isDateType } from "~/lib/utils/check_type";
import { formatDate } from "~/lib/utils/format_date";

const long_service_allowance_type = [
	"month_allowance",
	"one_year_allowance",
	"two_year_allowance"
]

export function ifTranslate(t: any, s: string) {
	if (long_service_allowance_type.includes(s)) {
		return t(`long_service_allowance_type.${s}`)
	}
	return s;
}



export function isValidDateString(input: string): string | undefined {
	// Check if the string matches the yyyy/mm/dd format
	const yyyy_mm_ddRegex = /^\d{4}\/\d{2}\/\d{2}$/;

	// Check if the string matches the yyyy-mm-ddThh:mm:ss.xxxZ format
	const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

	if (yyyy_mm_ddRegex.test(input)) return "day";
	if (isoDateTimeRegex.test(input)) return "hour";
	// if (dateFormatRegex.test(input)) return "hour";
	return undefined;
}

export const displayData = (
	data: any,
  t: TFunction<[string], undefined>
) => {
	if (typeof data === "boolean") return data ? "True" : "False";
	if (typeof data === "number") return data;

	if (isDateType(data)) {
		return formatDate("hour", new Date(data));
	}

	if (typeof data === "string") {
		const dateCheck = isValidDateString(data);
		if (dateCheck) return formatDate(dateCheck as "day" | "hour", data);
		return data;
	}


	if (data === null)		return t("table.no_data");
	if (data === undefined)		return t("table.no_data");
};


export const displayDataNoTranslate = (
	data: any,
) => {
	if (typeof data === "boolean") return data ? "True" : "False";
	if (typeof data === "number") return data;

	if (isDateType(data)) {
		return formatDate("hour", new Date(data));
	}

	if (typeof data === "string") {
		const dateCheck = isValidDateString(data);
		if (dateCheck) return formatDate(dateCheck as "day" | "hour", data);
		return data;
	}


	if (data === null)		return "";
	if (data === undefined)		return "";
};

