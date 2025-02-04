import { get_date_string } from "~/server/service/helper_function";

// TODO: date should be date type not string
export class Period {
	declare period_id: number;
	declare period_name: string;
	declare start_date: string;
	declare end_date: string;
	declare status: string;
	declare issue_date: string;

	constructor(
		period_id: number,
		period_name: string,
		start_date: string,
		end_date: string,
		status: string,
		issue_date: string
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

		const formattedStartDate = get_date_string(START_DATE as Date);
		const formattedEndDate = get_date_string(END_DATE as Date);
		const formattedIssueDate = get_date_string(ISSUE_DATE as Date);

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
