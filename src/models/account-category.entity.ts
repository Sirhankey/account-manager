import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../db";

interface ICategory {
    id: number;
    desc: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CategoryCreationAttributes = Optional<ICategory, 'id'>;

export class Category extends Model<ICategory, CategoryCreationAttributes> implements ICategory {

    declare id: number;
    declare desc: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Category.init({
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
    tableName: 'categories',
    modelName: 'category',
});
