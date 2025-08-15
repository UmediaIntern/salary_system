import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";
import z from "zod";
import { dateF, dateStringF, systemF, systemKeys } from "../../mapper/mapper_utils";
import { dateToString, dateToStringNullable, stringToDate, stringToDateNullable } from "~/server/api/types/z_utils";

const dbIncomeTaxSetting = z.object({
	entry_date_threshold: z.number(),
	multiplier: z.number(),
	deduction: z.number(),
	tax_ratio_1: z.number(),
	tax_ratio_2: z.number(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
});

const encF = dbIncomeTaxSetting.merge(dateStringF);
const decF = dbIncomeTaxSetting.merge(decFields).merge(dateF);
export type IncomeTaxSettingDecType = z.input<typeof decF>;

export const decIncomeTaxSetting= encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encIncomeTaxSetting = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class IncomeTaxSetting extends Model<
	InferAttributes<IncomeTaxSetting>,
	InferCreationAttributes<IncomeTaxSetting>
> {
	declare id: CreationOptional<number>;

	// 天數 = 183
	declare entry_date_threshold: number;
	// 倍率 = 1.5
	declare multiplier: number;
	// 扣款 = 2400 (伙食津貼)
	declare deduction: number;
	// 薪資所得扣繳總額比率 = 6%, 18%
	declare tax_ratio_1: number;
	declare tax_ratio_2: number;


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

export function initIncomeTaxSetting(sequelize: Sequelize) {
	IncomeTaxSetting.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			entry_date_threshold: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			multiplier: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			deduction: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			tax_ratio_1: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			tax_ratio_2: {
				type: DataTypes.FLOAT,
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
			tableName: "U_INCOME_TAX_SETTING",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}