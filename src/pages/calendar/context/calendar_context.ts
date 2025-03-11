import React from "react";
import type dayjs from "dayjs";
import {
	type CalendarEvent,
	type CalendarEventLevel,
} from "../utils/calendar_event";

interface HasID {
	id: number;
}

export type CalendarEventWithID = CalendarEvent<HasID>;
export type CalendarEventLevelWithID = CalendarEventLevel<HasID>;

const calendarContext = React.createContext<{
	monthIndex: number;
	setMonthIndex: (index: number) => void;
	mouseDownDate: dayjs.Dayjs | null;
	setMouseDownDate: (date: dayjs.Dayjs) => void;
	mouseUpDate: dayjs.Dayjs | null;
	setMouseUpDate: (date: dayjs.Dayjs) => void;
	openSheet: boolean;
	setOpenSheet: (open: boolean) => void;
	updateSheet: boolean;
	setUpdateSheet: (open: boolean) => void;
	showEventList: CalendarEventLevelWithID[];
	setEventList: (event: CalendarEventWithID[]) => void;
	selectedEvent: CalendarEventWithID | null;
	setSelectedEvent: (event: CalendarEventWithID) => void;
	resetMouse: () => void;
	// dispatchEventList: React.Dispatch<ActionType>,
}>({
	monthIndex: 0,
	setMonthIndex: (_: number) => undefined,
	mouseDownDate: null,
	setMouseDownDate: (_: dayjs.Dayjs) => undefined,
	mouseUpDate: null,
	setMouseUpDate: (_: dayjs.Dayjs) => undefined,
	// open sheet
	openSheet: false,
	setOpenSheet: (_: boolean) => undefined,
	// update event
	updateSheet: false,
	setUpdateSheet: (_: boolean) => undefined,
	// event list that will be shown
	showEventList: [],
	setEventList: (_: CalendarEvent<HasID>[]) => undefined,
	selectedEvent: null,
	setSelectedEvent: (_: CalendarEvent<HasID>) => undefined,
	resetMouse: () => undefined,
});

export default calendarContext;
