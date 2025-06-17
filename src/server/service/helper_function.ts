import { type Period } from "../database/entity/UMEDIA/period";

export function check_date(
	start_date: string | null,
	end_date: string | null,
	current_date_string: string
) {
	// if (start_date != null && start_date <= current_date_string) {
	// 	throw new BaseResponseError("Start date is earlier than current date");
	// }
	// if (end_date != null && end_date < (start_date ?? current_date_string)) {
	// 	throw new BaseResponseError("End date is earlier than start date");
	// }
}

export function get_date_string(date: Date): string {
	const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
	const localISOTime = new Date(date.getTime() - tzoffset)
		.toISOString()
		.slice(0, -1);
	return localISOTime.split("T")[0]!;
}

// TODO: fix this function, don't take in string
export function is_date_available(
	period: Period | null,
	start_date: Date,
	end_date: Date 
): boolean {
	if (!period) {
		return false;
	}
	const targetDate = period.end_date;

	if (end_date && end_date < targetDate) {
		return false;
	}
	if (start_date && start_date > targetDate) {
		return false;
	}
	return true;
}

export function select_value<T>(newData: T | undefined, oldData: T): T {
	return newData !== undefined ? newData : oldData;
}

export function Round(num: number, decimals = 0): number {
	return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function Floor(num: number, decimals = 0): number {
	return Math.floor(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
