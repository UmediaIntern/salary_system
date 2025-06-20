import { stringToDate } from "~/server/api/types/z_utils";
import { get_date_string } from "~/server/service/helper_function";

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
		issue_date: Date, 
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

		const formattedStartDate = stringToDate.parse(START_DATE);
		const formattedEndDate = stringToDate.parse(END_DATE);
		const formattedIssueDate = stringToDate.parse(ISSUE_DATE);

		return new Period(
			PERIOD_ID as number,
			PERIOD_NAME as string,
			formattedStartDate,
			formattedEndDate,
			STATUS as string,
			formattedIssueDate
		);
	}
}
