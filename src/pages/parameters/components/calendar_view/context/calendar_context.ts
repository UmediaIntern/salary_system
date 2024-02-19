import React from "react";
import dayjs from "dayjs";
import { CalendarEvent, CalendarEventLevel } from "../utils/calendar_event";
import { ActionType } from "./calendar_context_provider";

const calendarContext = React.createContext<{
	monthIndex: number,
	setMonthIndex: (index: number) => void,
	mouseDownDate: dayjs.Dayjs | null,
	setMouseDownDate: (date: dayjs.Dayjs) => void,
	mouseUpDate: dayjs.Dayjs | null,
	setMouseUpDate: (date: dayjs.Dayjs) => void,
	openSheet: boolean, 
	setOpenSheet: (open: boolean) => void,
	showEventList: CalendarEventLevel[],
	setEventList: (event: CalendarEvent[]) => void,
	selectedEvent: CalendarEvent | null,
	setSelectedEvent: (event: CalendarEvent) => void,
	resetMouse: () => void
	// dispatchEventList: React.Dispatch<ActionType>,
}>({
	monthIndex: 0,
	setMonthIndex: (index: number) => {},
	mouseDownDate: null,
	setMouseDownDate: (date: dayjs.Dayjs) => {},
	mouseUpDate: null,
	setMouseUpDate: (date: dayjs.Dayjs) => {},
	openSheet: false, 
	setOpenSheet: (open: boolean) => {},
	showEventList: [],
	setEventList: (events: CalendarEvent[]) => {},
	selectedEvent: null,
	setSelectedEvent: (event: CalendarEvent) => {},
	resetMouse: () => {},
	// dispatchEventList: () => {},
	// showEventModal: false,
	// setShowEventModal: () => {},
	// savedEvents: [],
});

export default calendarContext;