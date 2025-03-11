import React, { useContext } from "react";
import { type Dayjs } from "dayjs";
import DayView from "./day";
import calendarContext from "../context/calendar_context";

interface MonthViewProps {
	month: Array<Array<Dayjs>>;
	target_date: string;
}

export default function MonthView({
	month,
	target_date,
}: MonthViewProps): JSX.Element {


	return (
		<div className="relative grid h-full w-full grid-cols-7 grid-rows-5">
			{month.map((row, i) => (
				<React.Fragment key={i}>
					{row.map((day, idx) => (
						<DayView
							day={day}
							target_date={target_date}
							key={idx}
							rowIdx={i}
						/>
					))}
				</React.Fragment>
			))}
		</div>
	);
}
