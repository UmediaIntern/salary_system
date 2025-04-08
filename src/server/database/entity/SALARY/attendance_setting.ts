import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import { z } from "zod";
import { dateF, dateStringF, systemF, systemKeys } from "../../mapper/mapper_utils";
import {
	dateToString,
	dateToStringNullable,
	stringToDate,
	stringToDateNullable,
} from "~/server/api/types/z_utils";

const dbAttendanceSetting = z.object({
	overtime_by_local_workers_1: z.number(),
	overtime_by_local_workers_2: z.number(),
	overtime_by_local_workers_3: z.number(),
	overtime_by_local_workers_4: z.number(),
	overtime_by_local_workers_5: z.number(),
	overtime_by_foreign_workers_1: z.number(),
	overtime_by_foreign_workers_2: z.number(),
	overtime_by_foreign_workers_3: z.number(),
	overtime_by_foreign_workers_4: z.number(),
	overtime_by_foreign_workers_5: z.number(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
});

const encF = dbAttendanceSetting.merge(dateStringF);
const decF = dbAttendanceSetting.merge(decFields).merge(dateF);
export type AttendanceSettingDecType = z.input<typeof decF>;

export const decAttendanceSetting = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encAttendanceSetting = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class AttendanceSetting extends Model<
	InferAttributes<AttendanceSetting>,
	InferCreationAttributes<AttendanceSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	// declare personal_leave_deduction: number;
	// declare sick_leave_deduction: number;
	// declare rate_of_unpaid_leave: number;
	// declare unpaid_leave_compensatory_1: number;
	// declare unpaid_leave_compensatory_2: number;
	// declare unpaid_leave_compensatory_3: number;
	// declare unpaid_leave_compensatory_4: number;
	// declare unpaid_leave_compensatory_5: number;
	declare overtime_by_local_workers_1: number;
	declare overtime_by_local_workers_2: number;
	declare overtime_by_local_workers_3: number;
	declare overtime_by_local_workers_4: number;
	declare overtime_by_local_workers_5: number;
	// declare local_worker_holiday: number;
	declare overtime_by_foreign_workers_1: number;
	declare overtime_by_foreign_workers_2: number;
	declare overtime_by_foreign_workers_3: number;
	declare overtime_by_foreign_workers_4: number;
	declare overtime_by_foreign_workers_5: number;
	// declare foreign_worker_holiday: number;
	declare start_date: string;
	declare end_date: string | null;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initAttendanceSetting(sequelize: Sequelize) {
	AttendanceSetting.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			overtime_by_local_workers_1: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_local_workers_2: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_local_workers_3: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_local_workers_4: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_local_workers_5: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_foreign_workers_1: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_foreign_workers_2: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_foreign_workers_3: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_foreign_workers_4: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_foreign_workers_5: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			// foreign_worker_holiday: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			start_date: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			end_date: {
				type: DataTypes.STRING(128),
				allowNull: true,
			},
			disabled: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			create_date: {
				type: DataTypes.DATE,
			},
			create_by: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			update_date: {
				type: DataTypes.DATE,
			},
			update_by: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "U_ATTENDANCE_SETTING",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}

