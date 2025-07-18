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
	convertFromDBWorkStatusEnum,
	convertToDBWorkStatusEnum,
	DBWorkStatusEnum,
	type DBWorkStatusEnumType,
	WorkStatusEnum,
} from "~/server/api/types/work_status_enum";
import {
	DBWorkTypeEnum,
	DBWorkTypeEnumType,
	WorkTypeEnum,
	convertFromDBWorkTypeEnum,
	convertToDBWorkTypeEnum,
	type WorkTypeEnumType,
} from "~/server/api/types/work_type_enum";
import { dateCreateF, systemF, systemKeys } from "../../mapper/mapper_utils";
import { CostCategoryEnum, CostCategoryEnumType } from "~/server/api/types/cost_category_type";

const dbEmployeeData = z.object({
	period_id: z.number(),
	emp_no: z.string(), //員工編號
	emp_name: z.string(), //員工姓名
	position: z.number(), //職等
	position_type: z.string(), //職級
	group_insurance_type: z.string(), //團保類別
	department: z.string(), //部門
	cost_category: CostCategoryEnum, //成本分類
	// work_type: WorkTypeEnum, //工作類別
	disabilty_level: z.string().nullable(), //殘障等級
	sex_type: z.string(), //性別
	dependents: z.number().nullable(), //扶養人數
	healthcare_dependents: z.number().nullable(), //健保眷口數
	residence_permit_start_date: z.string().nullable(), //居留證開始日期
	residence_permit_end_date: z.string().nullable(), //居留證截止日期
	registration_date: z.string(), //到職日期
	quit_date: z.string().nullable(), //離職日期
	license_id: z.string().nullable(), //身分證字號
	bank_account_taiwan: z.string(), //台幣帳號
	received_elderly_benefits: z.coerce.boolean(), // TODO: is this okay?
	create_by: z.string(),
	update_by: z.string(),
});

const decFields = z.object({
	id: z.number(),
	work_type: WorkTypeEnum,
	work_status: WorkStatusEnum,
});

const encFields = z.object({
	work_type: DBWorkTypeEnum,
	work_status: DBWorkStatusEnum,
});

const encF = dbEmployeeData.merge(encFields);
const decF = dbEmployeeData.merge(decFields).merge(dateCreateF);
export type EmployeeDataDecType = z.input<typeof decF>;

export const decEmployeeData = encF
	.merge(systemF)
	.transform((v) => {
		return {
			...v,
			id: v.id,
			work_type: convertFromDBWorkTypeEnum(v.work_type),
			work_status: convertFromDBWorkStatusEnum(v.work_status),
		};
	})
	.pipe(decF);

export const encEmployeeData = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		work_type: convertToDBWorkTypeEnum(v.work_type),
		work_status: convertToDBWorkStatusEnum(v.work_status),
	}))
	.pipe(encF);

export class EmployeeData extends Model<
	InferAttributes<EmployeeData>,
	InferCreationAttributes<EmployeeData>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare emp_no: string; // 員工編號
	declare emp_name: string; // 員工姓名
	declare position: number; // 職等
	declare position_type: string; // 職級
	declare group_insurance_type: string; // 團保類別
	declare department: string; // 部門
	declare cost_category: CostCategoryEnumType; // 成本分類
	declare work_type: DBWorkTypeEnumType; // 工作類別
	declare work_status: DBWorkStatusEnumType; // 工作型態
	declare disabilty_level: string | null; // 殘障等級
	declare sex_type: string; // 性別
	declare dependents: number | null; // 扶養人數
	declare healthcare_dependents: number | null; // 健保眷口數
	declare residence_permit_start_date: string | null; // 居留證開始日期
	declare residence_permit_end_date: string | null; // 居留證截止日期
	declare registration_date: string; // 到職日期
	declare quit_date: string | null; // 離職日期
	declare license_id: string | null; // 身分證字號
	declare bank_account_taiwan: string; // 台幣帳號
	declare probation_period_over: boolean; // 試用期滿
	declare received_elderly_benefits: boolean; //是否領取老年給付
	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initEmployeeData(sequelize: Sequelize) {
	EmployeeData.init(
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
			emp_no: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			emp_name: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			cost_category: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			work_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			work_status: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			disabilty_level: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			department: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			position: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			position_type: {
				type: DataTypes.STRING(2),
				allowNull: false,
			},
			sex_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			group_insurance_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			dependents: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			healthcare_dependents: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			residence_permit_start_date: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
			residence_permit_end_date: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
			registration_date: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			quit_date: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
			license_id: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
			bank_account_taiwan: {
				type: DataTypes.STRING(32),
			},
			probation_period_over: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			received_elderly_benefits: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
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
			tableName: "U_EMPLOYEE_DATA",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
