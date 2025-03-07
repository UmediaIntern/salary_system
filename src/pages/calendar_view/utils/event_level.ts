import { type CalendarEvent, type CalendarEventLevel } from "./calendar_event";

export function getEventLevel(
	events: CalendarEvent<any>[]
): CalendarEventLevel<any>[] {
	const sortedEvents = events
		.map((event) => event.toCalendarEventLevel(0))
		.sort(
			(a, b) => a.getStartDate().getTime() - b.getStartDate().getTime()
		);

	const handledEvents = new Set<CalendarEventLevel<any>>();
	let currentLevel = 0;
	let currentLevelLastEvent: CalendarEventLevel<any> | null = null;

	while (handledEvents.size < sortedEvents.length) {
		for (const currentEvent of sortedEvents) {
			if (!handledEvents.has(currentEvent)) {
				if (
					currentLevelLastEvent &&
					currentEvent.overlapsWith(currentLevelLastEvent)
				) {
					currentEvent.setLevel(currentLevel + 1);
				} else {
					currentEvent.setLevel(currentLevel);
					handledEvents.add(currentEvent);
					currentLevelLastEvent = currentEvent;
				}
			}
		}
		currentLevel++;
		currentLevelLastEvent = null;
	}

	return sortedEvents;
}

export function getMaxLevel(events: CalendarEventLevel<any>[]): number {
	let maxLevel = -1;
	for (const event of events) {
		if (event.getLevel() > maxLevel) {
			maxLevel = event.getLevel();
		}
	}
	return maxLevel;
}
