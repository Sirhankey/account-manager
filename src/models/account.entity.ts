import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../db";

interface IAccount {
    id: number;
    nome: string;
    total: number;
    vencimento: Date;
    pago: boolean;
    categoria: number;
    grupo: number;
    status: number;
    metodoPagamento?: number;
    dataPagamento?: Date;
    desconto?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type AccountCreationAttributes = Optional<IAccount, 'id'>;

export class Account extends Model<IAccount, AccountCreationAttributes> implements IAccount {
    declare id: number;
    declare nome: string;
    declare total: number;
    declare vencimento: Date;
    declare pago: boolean;
    declare categoria: number;
    declare grupo: number;
    declare status: number;
    declare metodoPagamento?: number;
    declare dataPagamento?: Date;
    declare desconto?: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Account.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(128),
        allowNull: false,
        field: 'name'
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'amount'
    },
    vencimento: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'dueDate'
    },
    pago: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'isPaid'
    },
    categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'categoryId',
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    grupo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'groupId',
        references: {
            model: 'groups',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'statusId',
        references: {
            model: 'status',
            key: 'id'
        }
    },
    metodoPagamento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'paymentMethodId',
        references: {
            model: 'paymentMethods',
            key: 'id'
        }
    },
    dataPagamento: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'paymentDate'
    },
    desconto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'discount'
    },
    createdAt: {
        type: new DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
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

// Account.belongsTo(Category, { foreignKey: 'categoriaId', as: 'category' });
// Account.belongsTo(Group, { foreignKey: 'grupoId', as: 'group' });
// Account.belongsTo(Status, { foreignKey: 'statusId', as: 'status_' });
// Account.belongsTo(PaymentMethod, { foreignKey: 'metodoPagamentoId', as: 'paymentMethod' });
// Account.hasOne(Group, {
//     foreignKey: 'grupoId',
// })

// Group.belongsTo(Account, {
//     foreignKey: 'grupoId',
//     constraints: true
// })

// Account.hasOne(Status, {
//     foreignKey: 'statusId'
// })

// Status.belongsTo(Account, {
//     foreignKey: 'statusId',
//     constraints: true
// })

// Account.hasOne(Category, {
//     foreignKey: 'categoraiaId'
// })

// Category.belongsTo(Account, {
//     foreignKey: 'categoraiaId',
//     constraints: true
// })

// Account.hasOne(PaymentMethod, {
//     foreignKey: 'metodoPagamentoId'
// })

// PaymentMethod.belongsTo(Account, {
//     foreignKey: 'metodoPagamentoId',
//     constraints: true
// })