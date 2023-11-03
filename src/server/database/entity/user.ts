import {
	Association,
	DataTypes,
	HasManyAddAssociationMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManySetAssociationsMixin,
	HasManyAddAssociationsMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	Model,
	ModelDefined,
	Optional,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../client";

export class User extends Model<
	InferAttributes<User>,
	InferCreationAttributes<User>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_id: string;
	declare hash: string; // for nullable fields
	declare auth_level: number;
	declare start_date: Date;
	declare end_date: Date | null;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		emp_id: {
			type: DataTypes.STRING(128),
			unique: true,
			allowNull: false,
		},
		hash: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		auth_level: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		create_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		update_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "U_USER",
	}
);
