import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../db";

interface IPaymentMethod {
    id: number;
    desc: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type PaymentMethodCreationAttributes = Optional<IPaymentMethod, 'id'>;

export class PaymentMethod extends Model<IPaymentMethod, PaymentMethodCreationAttributes> implements IPaymentMethod {

    declare id: number;
    declare desc: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

PaymentMethod.init({
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
    tableName: 'paymentMethods',
    modelName: 'paymentMethod',
    timestamps: true,
});
