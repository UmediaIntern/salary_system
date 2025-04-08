import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import { User } from "./user";

export class Access extends Model<
	InferAttributes<Access>,
	InferCreationAttributes<Access>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare role: string;

	// actions access
	declare functions: boolean;
	declare synchronize: boolean;
	declare employees: boolean;
	declare employees_write: boolean;
	declare employees_r_lv: number;
	declare parameters: boolean;
	declare parameters_write: boolean;
	declare bonus: boolean;
	declare calendar: boolean;
	declare calendar_write: boolean;

	// settings access
	declare settings: boolean;
	declare roles: boolean;
	declare report: boolean;

	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;

	static associate() {
		Access.hasMany(User, {
			foreignKey: "access_id",
		});
	}
}

export function initAccess(sequelize: Sequelize) {
	Access.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			role: {
				type: DataTypes.STRING(128),
				allowNull: false,
				unique: true,
			},
			functions: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			synchronize: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			employees: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			employees_write: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			employees_r_lv: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
			},
			parameters: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			parameters_write: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			bonus: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			calendar: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			calendar_write: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			report: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			roles: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			settings: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
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
			tableName: "U_ACCESS",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
