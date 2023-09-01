import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../db";

interface IStatus {
    id: number;
    desc: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type StatusCreationAttributes = Optional<IStatus, 'id'>;

export class Status extends Model<IStatus, StatusCreationAttributes> implements IStatus {

    declare id: number;
    declare desc: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Status.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    desc: {
        type: DataTypes.STRING(128),
        allowNull: false,
        field: 'name'
    },
}, {
    sequelize,
    tableName: 'status',
    modelName: 'stat',
    timestamps: true,
});
