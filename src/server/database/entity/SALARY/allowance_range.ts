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
	dateF,
	dateStringF,
	systemF,
	systemKeys,
} from "../../mapper/mapper_utils";
import {
	dateToString,
	dateToStringNullable,
	stringToDate,
	stringToDateNullable,
} from "~/server/api/types/z_utils";
import { allowanceTypeEnum } from "~/server/api/types/allowance_type_enum";

const dbAllowanceRange = z.object({
  position: z.number(),
	position_type: z.string(),
	allowance_type: allowanceTypeEnum,
	allowance_start: z.number(),
	allowance_end: z.number(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
});

const encF = dbAllowanceRange.merge(dateStringF);
const decF = dbAllowanceRange.merge(decFields).merge(dateF);
export type AllowanceRangeDecType = z.input<typeof decF>;

export const decAllowanceRange = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encAllowanceRange = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class AllowanceRange extends Model<
	InferAttributes<AllowanceRange>,
	InferCreationAttributes<AllowanceRange>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare position: number;
	declare position_type: string;
	declare allowance_type: string;
	declare allowance_start: number;
	declare allowance_end: number;
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

export function initAllowanceRange(sequelize: Sequelize) {
	AllowanceRange.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
      position: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			position_type: {
				type: DataTypes.STRING(2),
				allowNull: false,
			},
			allowance_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			allowance_start: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			allowance_end: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
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
			tableName: "U_ALLOWANCE_RANGE",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
