import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const attendanceSchema = z.object({
	id: zc.number(),
	// personal_leave_deduction: zc.number().min(0).max(100),
	// sick_leave_deduction: zc.number(),
	// rate_of_unpaid_leave: zc.number(),
	// unpaid_leave_compensatory_1: zc.number(),
	// unpaid_leave_compensatory_2: zc.number(),
	// unpaid_leave_compensatory_3: zc.number(),
	// unpaid_leave_compensatory_4: zc.number(),
	// unpaid_leave_compensatory_5: zc.number(),
	overtime_by_local_workers_1: zc.number(),
	overtime_by_local_workers_2: zc.number(),
	overtime_by_local_workers_3: zc.number(),
	overtime_by_local_workers_4: zc.number(),
	overtime_by_local_workers_5: zc.number(),
	overtime_by_foreign_workers_1: zc.number(),
	overtime_by_foreign_workers_2: zc.number(),
	overtime_by_foreign_workers_3: zc.number(),
	overtime_by_foreign_workers_4: zc.number(),
	overtime_by_foreign_workers_5: zc.number(),
	// local_worker_holiday: zc.number(),
	// foreign_worker_holiday: zc.number(),
	start_date: zodRequiredDate("start_date"),
	// Since backend uses start_date to schedule, the end_date is of no use
	// end_date: zodOptionalDate(),
});
