import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { DateTimeInput } from "./date-time-input";


export function DatePicker({
	className,
	date,
	setDate,
	...props
}: {
	date?: Date;
	setDate: (date?: Date) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<Popover {...props} modal>
			<div className="relative w-full">
				<DateTimeInput
					hideCalendarIcon
					value={date}
					onChange={(x) => setDate(x)}
					format="yyyy/MM/dd"
				/>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"absolute right-0 top-[50%] translate-y-[-50%] rounded-l-none font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				{/* 	<Button */}
				{/* 		variant={"outline"} */}
				{/* 		className={cn( */}
				{/* 			"w-full justify-start text-left font-normal", */}
				{/* 			!date && "text-muted-foreground" */}
				{/* 		)} */}
				{/* 	> */}
				{/* 		<CalendarIcon className="mr-2 h-4 w-4" /> */}
				{/* 	</Button> */}
			</div>
			<PopoverContent className={cn("w-auto p-0", className)}>
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					defaultMonth={date}
					fixedWeeks
					captionLayout="dropdown-buttons"
					fromYear={new Date().getFullYear() - 30}
					toYear={new Date().getFullYear() + 30}
				/>
			</PopoverContent>
		</Popover>
	);
}
