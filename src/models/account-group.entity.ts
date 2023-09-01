import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../db";

interface IGroup {
    id: number;
    desc: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type GroupCreationAttributes = Optional<IGroup, 'id'>;

export class Group extends Model<IGroup, GroupCreationAttributes> implements IGroup {

    declare id: number;
    declare desc: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Group.init({
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
    tableName: 'groups',
    modelName: 'group',
    timestamps: true,
});
