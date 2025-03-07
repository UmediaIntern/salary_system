export class CalendarEvent<T> {
	private startDate: Date;
	private endDate: Date;
	private data: T | null;

	constructor(startDate: Date, endDate: Date, data: T | null = null) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.data = data;
	}

	getStartDate(): Date {
		return this.startDate;
	}

	setStartDate(startDate: Date): void {
		this.startDate = startDate;
	}

	getEndDate(): Date {
		return this.endDate;
	}

	setEndDate(endDate: Date): void {
		this.endDate = endDate;
	}

	getData(): T | null {
		return this.data;
	}

	setData(data: any): void {
		this.data = data;
	}

	overlapsWith(otherEvent: CalendarEvent<any>): boolean {
		return (
			this.startDate <= otherEvent.getEndDate() &&
			this.endDate >= otherEvent.getStartDate()
		);
	}

	equals(otherEvent: CalendarEvent<any>): boolean {
		return (
			this.startDate.getTime() === otherEvent.getStartDate().getTime() &&
			this.endDate.getTime() === otherEvent.getEndDate().getTime() &&
			this.data === otherEvent.getData()
		);
	}

	toCalendarEventLevel(level: number): CalendarEventLevel<T> {
		return new CalendarEventLevel<T>(
			this.startDate,
			this.endDate,
			level,
			this.data
		);
	}
}

export class CalendarEventLevel<T> extends CalendarEvent<T> {
	private level: number;

	constructor(
		startDate: Date,
		endDate: Date,
		level: number,
		data: T | null = null
	) {
		super(startDate, endDate, data);
		this.level = level;
	}

	getLevel(): number {
		return this.level;
	}

	setLevel(level: number): void {
		this.level = level;
	}
}
