import { injectable } from "tsyringe";
import {
	AttendanceSetting,
	type AttendanceSettingDecType,
	decAttendanceSetting,
	encAttendanceSetting,
} from "../database/entity/SALARY/attendance_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../errors/base_response_error";
import { type z } from "zod";
import { get_date_string, select_value } from "./helper_function";
import {
	createAttendanceSettingService,
	type updateAttendanceSettingService,
} from "../api/types/attendance_setting_type";
import { EHRService } from "./ehr_service";
import { BaseMapper } from "../database/mapper/base_mapper";
import { dateToString } from "../api/types/z_utils";

@injectable()
export class AttendanceSettingService {
	private readonly attendanceMapper: BaseMapper<
		AttendanceSetting,
		AttendanceSettingDecType,
		typeof encAttendanceSetting,
		typeof decAttendanceSetting
	>;

	constructor(private readonly ehrService: EHRService) {
		this.attendanceMapper = new BaseMapper(
			"Attendance Setting Mapper",
			encAttendanceSetting,
			decAttendanceSetting
		);
	}

	async createAttendanceSetting(
		data: z.infer<typeof createAttendanceSettingService>
	): Promise<AttendanceSetting> {
		const d = createAttendanceSettingService.parse(data);

		const attendanceSetting = await this.attendanceMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await AttendanceSetting.create(attendanceSetting, {
			raw: true,
		});

		return newData;
	}

	async getCurrentAttendanceSetting(
		period_id: number
	): Promise<AttendanceSettingDecType | null> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = dateToString.parse(period.end_date);
		const attendanceSettingList = await AttendanceSetting.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			order: [["start_date", "DESC"]],
		});

		if (attendanceSettingList.length > 1) {
			throw new BaseResponseError(
				"more than one active AttendanceSetting"
			);
		}

		const attendanceSetting = attendanceSettingList[0]
			? attendanceSettingList[0]
			: null;

		return attendanceSetting ? await this.attendanceMapper.decode(attendanceSetting) : null;
	}

	async getAllAttendanceSetting(): Promise<AttendanceSettingDecType[][]> {
		const attendanceSettingList = await AttendanceSetting.findAll({
			where: { disabled: false },
			order: [["start_date", "DESC"]],
		});
		const data_array = await this.attendanceMapper.decodeList(
			attendanceSettingList
		);
		const groupedRecords: Record<string, AttendanceSettingDecType[]> = {};
		data_array.forEach((d) => {
			let key = "";
			if (d.end_date == null) {
				key = get_date_string(d.start_date);
			} else
				key =
					get_date_string(d.start_date) + get_date_string(d.end_date);
			if (!groupedRecords[key]) {
				groupedRecords[key] = [];
			}
			groupedRecords[key]!.push(d);
		});
		const grouped_array = Object.values(groupedRecords).sort((a, b) => {
			if (a[0]!.start_date > b[0]!.start_date) {
				return -1;
			} else if (a[0]!.start_date < b[0]!.start_date) {
				return 1;
			} else if (a[0]!.end_date == null) {
				return -1;
			} else if (b[0]!.end_date == null) {
				return 1;
			} else if (a[0]!.end_date > b[0]!.end_date) {
				return -1;
			} else return 1;
		});

		return grouped_array;
	}

	async getAllFutureAttendanceSetting(): Promise<AttendanceSettingDecType[]> {
		const current_date_string = get_date_string(new Date());
		const attendanceSettingList = await AttendanceSetting.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [["start_date", "DESC"]],
		});

		return await this.attendanceMapper.decodeList(attendanceSettingList);
	}

	async getAttendanceSettingById(
		id: number
	): Promise<AttendanceSettingDecType | null> {
		const attendanceSetting = await AttendanceSetting.findOne({
			where: { id: id },
		});

		return this.attendanceMapper.decode(attendanceSetting);
	}

	async updateAttendanceSetting(
		data: z.infer<typeof updateAttendanceSettingService>
	): Promise<void> {
		const transData = await this.getAttendanceSettingAfterSelectValue(data);
		await this.createAttendanceSetting(transData);
		await this.deleteAttendanceSetting(data.id);
	}

	async deleteAttendanceSetting(id: number): Promise<void> {
		const attendance_setting = await this.getAttendanceSettingById(id);
		if (attendance_setting == null) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}
		const destroyedRows = await AttendanceSetting.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleAttendanceSetting(): Promise<void> {
		const encodedList = await AttendanceSetting.findAll({
			where: { disabled: false },
			order: [
				["start_date", "ASC"],
				["update_date", "ASC"],
			],
		});

		const attendanceSettingList = await this.attendanceMapper.decodeList(
			encodedList
		);
		for (let i = 0; i < attendanceSettingList.length - 1; i += 1) {
			const end_date = attendanceSettingList[i]!.end_date;
			const start_date = attendanceSettingList[i + 1]!.start_date;

			const new_end_date = new Date(start_date);
			new_end_date.setDate(new_end_date.getDate() - 1);

			if (end_date?.getTime() != new_end_date.getTime()) {
				if (new_end_date < attendanceSettingList[i]!.start_date) {
					await this.deleteAttendanceSetting(
						attendanceSettingList[i]!.id
					);
				} else {
					await this.updateAttendanceSetting({
						id: attendanceSettingList[i]!.id,
						end_date: new_end_date,
					});
				}
			}
		}
		if (
			attendanceSettingList[attendanceSettingList.length - 1]!.end_date !=
			null
		) {
			await this.updateAttendanceSetting({
				id: attendanceSettingList[attendanceSettingList.length - 1]!.id,
				end_date: null,
			});
		}
	}

	private async getAttendanceSettingAfterSelectValue({
		id,
		overtime_by_local_workers_1,
		overtime_by_local_workers_2,
		overtime_by_local_workers_3,
		overtime_by_local_workers_4,
		overtime_by_local_workers_5,
		overtime_by_foreign_workers_1,
		overtime_by_foreign_workers_2,
		overtime_by_foreign_workers_3,
		overtime_by_foreign_workers_4,
		overtime_by_foreign_workers_5,
		start_date,
		end_date,
	}: z.infer<typeof updateAttendanceSettingService>): Promise<
		z.infer<typeof createAttendanceSettingService>
	> {
		const attendance_setting = await this.getAttendanceSettingById(id);

		if (attendance_setting == null) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}

		return {
			overtime_by_local_workers_1: select_value(
				overtime_by_local_workers_1,
				attendance_setting.overtime_by_local_workers_1
			),
			overtime_by_local_workers_2: select_value(
				overtime_by_local_workers_2,
				attendance_setting.overtime_by_local_workers_2
			),
			overtime_by_local_workers_3: select_value(
				overtime_by_local_workers_3,
				attendance_setting.overtime_by_local_workers_3
			),
			overtime_by_local_workers_4: select_value(
				overtime_by_local_workers_4,
				attendance_setting.overtime_by_local_workers_4
			),
			overtime_by_local_workers_5: select_value(
				overtime_by_local_workers_5,
				attendance_setting.overtime_by_local_workers_5
			),
			overtime_by_foreign_workers_1: select_value(
				overtime_by_foreign_workers_1,
				attendance_setting.overtime_by_foreign_workers_1
			),
			overtime_by_foreign_workers_2: select_value(
				overtime_by_foreign_workers_2,
				attendance_setting.overtime_by_foreign_workers_2
			),
			overtime_by_foreign_workers_3: select_value(
				overtime_by_foreign_workers_3,
				attendance_setting.overtime_by_foreign_workers_3
			),
			overtime_by_foreign_workers_4: select_value(
				overtime_by_foreign_workers_4,
				attendance_setting.overtime_by_foreign_workers_4
			),
			overtime_by_foreign_workers_5: select_value(
				overtime_by_foreign_workers_5,
				attendance_setting.overtime_by_foreign_workers_5
			),
			start_date: select_value(start_date, attendance_setting.start_date),
			end_date: select_value(end_date, attendance_setting.end_date),
		};
	}
}
