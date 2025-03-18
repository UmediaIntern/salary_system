import {
	eachMonthOfInterval,
	endOfYear,
} from "date-fns";
import { MonthOverview } from "./month_overview";


export function YearlyCalendarGrid({ yearStart }: { yearStart: string }) {

	const months = eachMonthOfInterval({
		start: yearStart,
		end: endOfYear(yearStart),
	});

	return (
		<div className="grid auto-rows-min grid-cols-3 gap-2 lg:grid-cols-4">
			{months.map((monthStart) => (
				<MonthOverview
					key={monthStart.toString()}
					monthStart={monthStart}
				/>
			))}
		</div>
	);
}
