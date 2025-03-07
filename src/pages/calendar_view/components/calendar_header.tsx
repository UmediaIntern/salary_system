import React, { useContext } from "react";
import calendarContext from "../context/calendar_context";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";

export default function CalendarHeader({
	target_date,
}: {
	target_date: string;
}) {
	const { monthIndex, setMonthIndex } = useContext(calendarContext);
	const { t } = useTranslation(["common"]);

	function handlePrevMonth() {
		setMonthIndex(monthIndex - 1);
	}

	function handleNextMonth() {
		setMonthIndex(monthIndex + 1);
	}

	function handleReset() {
		setMonthIndex(
			monthIndex === dayjs(target_date).month()
				? monthIndex
				: dayjs(target_date).month()
		);
	}

	return (
		<div className="flex items-center gap-x-1 px-4 py-1">
			<p className="mx-4 w-40 text-xl font-bold text-primary">
				{dayjs(new Date(dayjs(target_date).year(), monthIndex)).format(
					`YYYY-MM`
				)}
			</p>

			<Button variant="outline" size="sm" onClick={handlePrevMonth}>
				<ChevronLeftIcon className="h-4 w-4" />
			</Button>
			<Button variant="outline" size="sm" onClick={handleReset}>
				{t("table.current")}
			</Button>
			<Button variant="outline" size="sm" onClick={handleNextMonth}>
				<ChevronRightIcon className="h-4 w-4" />
			</Button>
		</div>
	);
}
