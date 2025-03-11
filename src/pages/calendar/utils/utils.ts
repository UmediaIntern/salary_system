import dayjs from "dayjs";

export function getDayInMonth(
	target_date: string,
	mon: number | null
): Array<Array<dayjs.Dayjs>> {
	let month = mon ?? new Date(target_date).getMonth();
	month = Number(month);
	const year = dayjs(target_date).year();
	const firstDayOfTheMonth = dayjs(target_date)
		.year(year)
		.month(month)
		.date(1)
		.day();
	let currentMonthCount = -firstDayOfTheMonth;
	const daysMatrix = Array.from({ length: 5 }, () => {
		return new Array(7).fill(null).map(() => {
			currentMonthCount++;
			return dayjs(target_date)
				.year(year)
				.month(month)
				.date(currentMonthCount);
		});
	});
	return daysMatrix;
}
