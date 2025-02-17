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
import { dateToString, dateToStringNullable, stringToDate, stringToDateNullable } from "~/server/api/types/z_utils";

const dbSalaryIncomeTax = z.object({
  salary_start: z.number(),
  salary_end: z.number(),
  dependent: z.number(),
  tax_amount: z.number(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
});

const encF = dbSalaryIncomeTax.merge(dateStringF);
const decF = dbSalaryIncomeTax.merge(decFields).merge(dateF);
export type SalaryIncomeTaxDecType = z.input<typeof decF>;

export const decSalaryIncomeTax = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encSalaryIncomeTax = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);


export class SalaryIncomeTax extends Model<
	InferAttributes<SalaryIncomeTax>,
	InferCreationAttributes<SalaryIncomeTax>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare salary_start: number;
	declare salary_end: number;
	declare dependent: number;
	declare tax_amount: number;
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

export function batchCreateSalaryIncomeTax(sequelize: Sequelize) {
	SalaryIncomeTax.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			salary_start: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			salary_end: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			dependent: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			tax_amount: {
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
			tableName: "U_SALARY_INCOME_TAX",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
