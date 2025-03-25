import {
	addDays,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	getDay,
	isSameMonth,
	isToday,
	startOfToday,
	startOfWeek,
} from "date-fns";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

const colStartClasses = [
	"",
	"col-start-2",
	"col-start-3",
	"col-start-4",
	"col-start-5",
	"col-start-6",
	"col-start-7",
];

export function getWeekStartDates(firstDayOfMonth: Date): Date[] {
	const weekStartsOn = 0;
	const firstDay = startOfWeek(firstDayOfMonth, { weekStartsOn });
	const days = [firstDay];

	for (let i = 1; i < 6; i++) {
		days.push(addDays(firstDay, i * 7));
	}

	return days;
}

export function MonthGrid({ monthStart }: { monthStart: Date }) {
	const today = startOfToday();

	const weeks = getWeekStartDates(monthStart);

	return (
		<div className="flex h-full w-full flex-col rounded-sm border">
			{/* <div className="flex items-center overflow-hidden"> */}
			{/* 	<p */}
			{/* 		key={monthStart.toString()} */}
			{/* 		className={cn( */}
			{/* 			"flex-auto font-bold", */}
			{/* 			isSameMonth(today, monthStart) && "text-primary" */}
			{/* 		)} */}
			{/* 	> */}
			{/* 		{format(monthStart, "MMMM")} */}
			{/* 	</p> */}
			{/* </div> */}
			<div className="grid grid-cols-7 py-1 text-center text-xs leading-6 text-gray-500">
				<div>Su</div>
				<div>Mo</div>
				<div>Tu</div>
				<div>We</div>
				<div>Th</div>
				<div>Fr</div>
				<div>Sa</div>
			</div>
			<Separator />
			<div className="grid grow grid-rows-6 text-sm">
				{weeks.map((week) => {
					const days = eachDayOfInterval({
						start: week,
						end: endOfWeek(week),
					});
					return (
						<div key={week.toString()} className="grid grid-cols-7">
							{days.map((day, dayIdx) => (
								<div
									key={day.toString()}
									className={cn(
										dayIdx === 0 &&
											colStartClasses[getDay(day)],
										"border py-0.5",
                    !isSameMonth(day, monthStart) && "bg-muted"
									)}
								>
									<div
										className={cn(
											isToday(day) &&
												"bg-primary text-primary-foreground",
											"mx-auto flex h-8 w-8 items-center justify-center rounded-full"
										)}
									>
										<time
											dateTime={format(day, "yyyy-MM-dd")}
										>
											{format(day, "d")}
										</time>
									</div>
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}
