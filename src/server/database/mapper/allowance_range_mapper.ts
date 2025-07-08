import { injectable } from "tsyringe";
import {
	type AttendanceSetting,
	type AttendanceSettingDecType,
	type decAttendanceSetting,
	type encAttendanceSetting,
} from "../entity/SALARY/attendance_setting";
import { BaseMapper } from "./base_mapper";

@injectable()
export class AllowanceRangeMapper extends BaseMapper<
	AttendanceSetting,
	AttendanceSettingDecType,
	typeof encAttendanceSetting,
	typeof decAttendanceSetting
> {}
