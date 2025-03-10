import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    type Sequelize,
} from "sequelize";

export class Notification extends Model<
    InferAttributes<Notification>,
    InferCreationAttributes<Notification>
> {
    // id can be undefined during creation when using `autoIncrement`
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string | null;

    // timestamps!
    // createdAt can be undefined during creation
    declare create_date: CreationOptional<Date>;
    declare create_by: string;
    // updatedAt can be undefined during creation
    declare update_date: CreationOptional<Date>;
    declare update_by: string;
}

export function initNotification(sequelize: Sequelize) {
    Notification.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(1024),
                allowNull: true,
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
            tableName: "U_NOTIFICATION",
            createdAt: "create_date",
            updatedAt: "update_date",
        }
    );
}