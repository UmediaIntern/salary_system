import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
	type ForeignKey,
	type NonAttribute,
	type Association,
} from "sequelize";
import { Access } from "./access";

export class User extends Model<
	InferAttributes<User>,
	InferCreationAttributes<User>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare hash: string; // for nullable fields
	declare start_date: string;
	declare end_date: string | null;
	declare disabled: boolean;

	// relations
	declare access_id: ForeignKey<Access["id"]>;
	declare access?: NonAttribute<Access>;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;

	static associate() {
		User.belongsTo(Access, {
			foreignKey: "access_id",
			targetKey: "id",
			as: "access",
		});
	}
	declare static associations: {
		access: Association<User, Access>;
	};
}

export function initUser(sequelize: Sequelize) {
	User.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			emp_no: {
				type: DataTypes.STRING(128),
				unique: true,
				allowNull: false,
			},
			hash: {
				type: DataTypes.STRING(128),
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
			tableName: "U_USER",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
