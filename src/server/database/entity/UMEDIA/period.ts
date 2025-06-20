import { z } from "zod";
import { stringToDate } from "~/server/api/types/z_utils";
import { PeriodModelErrorScope } from "~/server/errors/error_scope";
import { ParserError } from "~/server/errors/parser_error";

// TODO: date should be date type not string
export class Period {
	declare period_id: number;
	declare period_name: string;
	declare start_date: Date;
	declare end_date: Date;
	declare status: string;
	declare issue_date: Date;

	constructor(
		period_id: number,
		period_name: string,
		start_date: Date,
		end_date: Date,
		status: string,
		issue_date: Date
	) {
		this.period_id = period_id;
		this.period_name = period_name;
		this.start_date = start_date;
		this.end_date = end_date;
		this.status = status;
		this.issue_date = issue_date;
	}

	static fromDB(data: any): Period {
		const {
			PERIOD_ID,
			PERIOD_NAME,
			START_DATE,
			END_DATE,
			STATUS,
			ISSUE_DATE,
		} = data;

		let startDate: Date;
		if (START_DATE instanceof Date) {
			startDate = START_DATE;
		} else {
			const { data, error, success } = stringToDate.safeParse(START_DATE);
			if (!success) {
				throw new ParserError(error.message, PeriodModelErrorScope);
			}
			startDate = data;
		}

		let endDate: Date;
		if (END_DATE instanceof Date) {
			endDate = END_DATE;
		} else {
			const { data, error, success } = stringToDate.safeParse(END_DATE);
			if (!success) {
				throw new ParserError(error.message, PeriodModelErrorScope);
			}
			endDate = data;
		}

		let issueDate: Date;
		if (ISSUE_DATE instanceof Date) {
			issueDate = ISSUE_DATE;
		} else {
			const { data, error, success } = stringToDate.safeParse(ISSUE_DATE);
			if (!success) {
				throw new ParserError(error.message, PeriodModelErrorScope);
			}
			issueDate = data;
		}

		return new Period(
			PERIOD_ID as number,
			PERIOD_NAME as string,
			startDate,
			endDate,
			STATUS as string,
			issueDate
		);
	}
}
