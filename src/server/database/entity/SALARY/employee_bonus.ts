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
	bonusTypeEnum,
	type BonusTypeEnumType,
} from "~/server/api/types/bonus_type_enum";
import { dateCreateF, systemF, systemKeys } from "../../mapper/mapper_utils";
import {
	decodeStringToNumberNullable as dSNN,
	decodeStringToNumber as dSN,
	encodeString,
	encodeStringNullable as eSN,
	decodeStringToStringNullable,
} from "~/server/api/types/z_utils";
import { CurrencyForeignEnumType, currencyForeignEnum } from "~/server/api/types/currency_foreign_enum";

const dbEmployeeBonus = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	emp_no: z.string(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
	currency_foreign: currencyForeignEnum.nullable(),
});

const decFields = z.object({
	id: z.number(),
	special_multiplier: z.number(),
	multiplier: z.number(),
	fixed_amount: z.number(),
	bud_effective_salary: z.number(),
	bud_amount: z.number(),
	// nullable
	sup_performance_level: z.string().nullable(),
	sup_effective_salary: z.number().nullable(),
	sup_amount: z.number().nullable(),
	app_performance_level: z.string().nullable(),
	app_effective_salary: z.number().nullable(),
	app_amount: z.number().nullable(),
	exchange_rate: z.number().nullable(),
	currency_amount_foreign: z.number().nullable(),
	currency_amount_taiwan: z.number().nullable(),
});

const encFields = z.object({
	special_multiplier_enc: z.string(),
	multiplier_enc: z.string(),
	fixed_amount_enc: z.string(),
	bud_effective_salary_enc: z.string(),
	bud_amount_enc: z.string(),
	// nullable
	sup_performance_level_enc: z.string().nullable(),
	sup_effective_salary_enc: z.string().nullable(),
	sup_amount_enc: z.string().nullable(),
	app_performance_level_enc: z.string().nullable(),
	app_effective_salary_enc: z.string().nullable(),
	app_amount_enc: z.string().nullable(),
	exchange_rate_enc: z.string().nullable(),
	currency_amount_foreign_enc: z.string().nullable(),
	currency_amount_taiwan_enc: z.string().nullable(),
});

const encF = dbEmployeeBonus.merge(encFields);
const decF = dbEmployeeBonus.merge(decFields).merge(dateCreateF);
export type EmployeeBonusDecType = z.input<typeof decF>;

export const decEmployeeBonus = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		special_multiplier: dSN.parse(v.special_multiplier_enc),
		multiplier: dSN.parse(v.multiplier_enc),
		fixed_amount: dSN.parse(v.fixed_amount_enc),
		bud_effective_salary: dSN.parse(v.bud_effective_salary_enc),
		bud_amount: dSN.parse(v.bud_amount_enc),
		// nullable
		sup_performance_level: decodeStringToStringNullable.parse(
			v.sup_performance_level_enc
		),
		sup_effective_salary: dSNN.parse(v.sup_effective_salary_enc),
		sup_amount: dSNN.parse(v.sup_amount_enc),
		app_performance_level: decodeStringToStringNullable.parse(
			v.app_performance_level_enc
		),
		app_effective_salary: dSNN.parse(v.app_effective_salary_enc),
		app_amount: dSNN.parse(v.app_amount_enc),
		exchange_rate: dSNN.parse(v.exchange_rate_enc),
		currency_amount_foreign: dSNN.parse(v.currency_amount_foreign_enc),
		currency_amount_taiwan: dSNN.parse(v.currency_amount_taiwan_enc),
	}))
	.pipe(decF);

export const encEmployeeBonus = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		special_multiplier_enc: encodeString.parse(v.special_multiplier),
		multiplier_enc: encodeString.parse(v.multiplier),
		fixed_amount_enc: encodeString.parse(v.fixed_amount),
		bud_effective_salary_enc: encodeString.parse(v.bud_effective_salary),
		bud_amount_enc: encodeString.parse(v.bud_amount),
		// nullable
		sup_performance_level_enc: eSN.parse(v.sup_performance_level),
		sup_effective_salary_enc: eSN.parse(v.sup_effective_salary),
		sup_amount_enc: eSN.parse(v.sup_amount),
		app_performance_level_enc: eSN.parse(v.app_performance_level),
		app_effective_salary_enc: eSN.parse(v.app_effective_salary),
		app_amount_enc: eSN.parse(v.app_amount),
		exchange_rate_enc: eSN.parse(v.exchange_rate),
		currency_amount_foreign_enc: eSN.parse(v.currency_amount_foreign),
		currency_amount_taiwan_enc: eSN.parse(v.currency_amount_taiwan),
	}))
	.pipe(encF);

export class EmployeeBonus extends Model<
	InferAttributes<EmployeeBonus>,
	InferCreationAttributes<EmployeeBonus>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare bonus_type: BonusTypeEnumType;
	declare emp_no: string;
	declare special_multiplier_enc: string;
	declare multiplier_enc: string;
	declare fixed_amount_enc: string;
	declare bud_effective_salary_enc: string;
	declare bud_amount_enc: string;
	declare sup_performance_level_enc: string | null;
	declare sup_effective_salary_enc: string | null;
	declare sup_amount_enc: string | null;
	declare app_performance_level_enc: string | null;
	declare app_effective_salary_enc: string | null;
	declare app_amount_enc: string | null;
	declare currency_foreign: CurrencyForeignEnumType | null;
	declare exchange_rate_enc: string | null;
	declare currency_amount_foreign_enc: string | null;
	declare currency_amount_taiwan_enc: string | null;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initEmployeeBonus(sequelize: Sequelize) {
	EmployeeBonus.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			period_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			bonus_type: {
				type: new DataTypes.STRING(32),
				allowNull: false,
			},
			emp_no: {
				type: new DataTypes.STRING(32),
				allowNull: false,
			},
			special_multiplier_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			multiplier_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			fixed_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			bud_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			bud_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			sup_performance_level_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			sup_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			sup_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			app_performance_level_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			app_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			app_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			currency_foreign: {
				type: new DataTypes.STRING(32),
				allowNull: true,
			},
			exchange_rate_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			currency_amount_foreign_enc: {
				type: new DataTypes.STRING(128),
				allowNull: true,
			},
			currency_amount_taiwan_enc: {
				type: new DataTypes.STRING(128),
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
			tableName: "U_EMPLOYEE_BONUS",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
