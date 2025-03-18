import {
	eachDayOfInterval,
	endOfMonth,
	format,
	getDay,
	isSameMonth,
	isToday,
	startOfToday,
} from "date-fns";
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

export function MonthOverview({ monthStart }: { monthStart: Date }) {
	const today = startOfToday();

	const days = eachDayOfInterval({
		start: monthStart,
		end: endOfMonth(monthStart),
	});

	return (
		<div className="flex w-full max-w-sm flex-col">
			<div className="flex w-full flex-col bg-white p-4">
				<div className="flex items-center overflow-hidden">
					<p
						key={monthStart.toString()}
						className={cn("text-2021 t-lp flex-auto font-bold", isSameMonth(today, monthStart) && "text-primary")}
					>
						{format(monthStart, "MMMM")}
					</p>
				</div>
				<div className="mt-1 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
					<div>Su</div>
					<div>Mo</div>
					<div>Tu</div>
					<div>We</div>
					<div>Th</div>
					<div>Fr</div>
					<div>Sa</div>
				</div>
				<div className="mt-1 grid grid-cols-7 text-sm">
					{days.map((day, dayIdx) => (
						<div
							key={day.toString()}
							className={cn(
								dayIdx === 0 && colStartClasses[getDay(day)],
								"py-0.5"
							)}
						>
							<div
								className={cn(
									isToday(day) && "bg-primary text-primary-foreground",
									"mx-auto flex h-8 w-8 items-center justify-center rounded-full"
								)}
							>
								<time dateTime={format(day, "yyyy-MM-dd")}>
									{format(day, "d")}
								</time>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
