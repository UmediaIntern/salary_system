import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import { z } from "zod";
import {
	LongServiceEnum,
	type LongServiceEnumType,
} from "~/server/api/types/long_service_enum";
import {
	encodeString,
	decodeStringToNumber as dSN,
	stringToDate,
	stringToDateNullable,
	dateToString,
	dateToStringNullable,
} from "~/server/api/types/z_utils";
import {
	dateF,
	dateStringF,
	systemF,
	systemKeys,
} from "../../mapper/mapper_utils";

const dbEmployeePayment = z.object({
	emp_no: z.string(),
	long_service_allowance_type: LongServiceEnum,
	bank_account_foreign: z.string().nullable(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
	base_salary: z.number(),
	food_allowance: z.number(),
	supervisor_allowance: z.number(),
	occupational_allowance: z.number(),
	subsidy_allowance: z.number(),
	long_service_allowance: z.number(),
	l_r_self_ratio: z.number(),
	l_i: z.number(),
	h_i: z.number(),
	l_r: z.number(),
	occupational_injury: z.number(),
});

const encFields = z.object({
	base_salary_enc: z.string(),
	food_allowance_enc: z.string(),
	supervisor_allowance_enc: z.string(),
	occupational_allowance_enc: z.string(),
	subsidy_allowance_enc: z.string(),
	long_service_allowance_enc: z.string(),
	l_r_self_ratio_enc: z.string(),
	l_i_enc: z.string(),
	h_i_enc: z.string(),
	l_r_enc: z.string(),
	occupational_injury_enc: z.string(),
});

const encF = dbEmployeePayment.merge(encFields).merge(dateStringF);
const decF = dbEmployeePayment.merge(decFields).merge(dateF);
export type EmployeePaymentDecType = z.input<typeof decF>;

export const decEmployeePayment = encF
	.merge(systemF)
	.transform((v) => {
		return {
			...v,
			id: v.id,
			base_salary: dSN.parse(v.base_salary_enc),
			food_allowance: dSN.parse(v.food_allowance_enc),
			supervisor_allowance: dSN.parse(v.supervisor_allowance_enc),
			occupational_allowance: dSN.parse(v.occupational_allowance_enc),
			subsidy_allowance: dSN.parse(v.subsidy_allowance_enc),
			long_service_allowance: dSN.parse(v.long_service_allowance_enc),
			l_r_self_ratio: dSN.parse(v.l_r_self_ratio_enc),
			l_i: dSN.parse(v.l_i_enc),
			h_i: dSN.parse(v.h_i_enc),
			l_r: dSN.parse(v.l_r_enc),
			occupational_injury: dSN.parse(v.occupational_injury_enc),
			start_date: stringToDate.parse(v.start_date),
			end_date: stringToDateNullable.parse(v.end_date),
		};
	})
	.pipe(decF);

export const encEmployeePayment = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		base_salary_enc: encodeString.parse(v.base_salary),
		food_allowance_enc: encodeString.parse(v.food_allowance),
		supervisor_allowance_enc: encodeString.parse(v.supervisor_allowance),
		occupational_allowance_enc: encodeString.parse(
			v.occupational_allowance
		),
		subsidy_allowance_enc: encodeString.parse(v.subsidy_allowance),
		long_service_allowance_enc: encodeString.parse(
			v.long_service_allowance
		),
		l_r_self_ratio_enc: encodeString.parse(v.l_r_self_ratio),
		l_i_enc: encodeString.parse(v.l_i),
		h_i_enc: encodeString.parse(v.h_i),
		l_r_enc: encodeString.parse(v.l_r),
		occupational_injury_enc: encodeString.parse(v.occupational_injury),
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class EmployeePayment extends Model<
	InferAttributes<EmployeePayment>,
	InferCreationAttributes<EmployeePayment>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare base_salary_enc: string;
	declare food_allowance_enc: string;
	declare supervisor_allowance_enc: string;
	declare occupational_allowance_enc: string;
	declare subsidy_allowance_enc: string;
	declare long_service_allowance_enc: string;
	declare long_service_allowance_type: LongServiceEnumType;
	declare l_r_self_ratio_enc: string;
	declare l_i_enc: string;
	declare h_i_enc: string;
	declare l_r_enc: string;
	declare occupational_injury_enc: string;
	declare bank_account_foreign: string | null;
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

export function initEmployeePayment(sequelize: Sequelize) {
	EmployeePayment.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			emp_no: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			base_salary_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			food_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			supervisor_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			occupational_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			subsidy_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			long_service_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			long_service_allowance_type: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_r_self_ratio_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_i_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			h_i_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_r_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			occupational_injury_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			bank_account_foreign: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
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
			tableName: "U_EMPLOYEE_PAYMENT",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
