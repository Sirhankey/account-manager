import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../db";
import { AccountCategory, AccountGroup, AccountStatus, PaymentMethod } from "../enums";

interface IAccount {
    id: number;
    name: string;
    amount: number;
    dueDate: Date;
    isPaid: boolean;
    category: AccountCategory;
    group: AccountGroup;
    status: AccountStatus;
    paymentMethod?: PaymentMethod;
    paymentDate?: Date;
    discount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type AccountCreationAttributes = Optional<IAccount, 'id'>;

export class Account extends Model<IAccount, AccountCreationAttributes> implements IAccount {
    declare id: number;
    declare name: string;
    declare amount: number;
    declare dueDate: Date;
    declare isPaid: boolean;
    declare category: AccountCategory;
    declare group: AccountGroup;
    declare status: AccountStatus;
    declare paymentMethod?: PaymentMethod;
    declare paymentDate?: Date;
    declare discount?: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Account.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    category: {
        type: DataTypes.ENUM,
        values: Object.values(AccountCategory),
        allowNull: false,
    },
    group: {
        type: DataTypes.ENUM,
        values: Object.values(AccountGroup),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(AccountStatus),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.ENUM,
        values: Object.values(PaymentMethod),
        allowNull: true,
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    createdAt: {
        type: new DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    updatedAt: {
        type: new DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
}, {
    sequelize,
    tableName: 'accounts',
    modelName: 'account',
});

