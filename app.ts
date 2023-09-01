import { AccountCategoryEnum, AccountGroupEnum, AccountStatusEnum, PaymentMethodEnum } from './src/enums';
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import * as AdminJSSequelize from '@adminjs/sequelize'
import { User } from './src/models/user.entity'
import { Account } from './src/models/account.entity'
import { Category } from './src/models/account-category.entity';
import { Status } from './src/models/account-status-entity';
import { Group } from './src/models/account-group.entity';
import { PaymentMethod } from './src/models/account-payment-method-entity';
import { generateResource, generateType } from './src/utils/resource-utils'
import { encryptPassword, verifyPassword } from './src/utils/bcrypt-utils'
import { sequelize } from './db'
import { isPaid, formatCurrency, carregaCombos } from './src/utils/account-utils'
import * as dotenv from 'dotenv';
import hbs from 'hbs';
import Mail from './src/utils/Mail'
import dashboard from './src/routes/dashboard'
const bodyParser = require('body-parser');

//  session storage
//  import MariaDBStore from 'express-session-mariadb-store'
import session from 'express-session';
const mysqlStore = require('express-mysql-session')(session);




const path = require('node:path');
dotenv.config();

const ROOT_DIR = __dirname;
const email = new Mail(ROOT_DIR);
const PORT = 3330

AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
});

const start = async () => {
    console.log('Starting AdminJS...')

    const app = express()


    console.log('AdminJSSequelize.Resource', AdminJSSequelize.Resource)
    console.log('AdminJSSequelize.Database', AdminJSSequelize.Database)

    const userlistOrder = ['name', 'username', 'email']
    const usereditOrder = ['name', 'username', 'email', 'password'];
    const usershowOrder = ['name', 'username', 'email'];
    const userfilterOrder = ['name', 'username', 'email'];

    const accountlistOrder = ['nome', 'total', 'vencimento', 'pago', 'categoria', 'grupo', 'status', 'metodoPagamento', 'dataPagamento', 'desconto'];
    const accounteditOrder = ['nome', 'total', 'vencimento', 'pago', 'categoria', 'grupo', 'status', 'metodoPagamento', 'dataPagamento', 'desconto'];
    const accountshowOrder = ['nome', 'total', 'vencimento', 'pago', 'categoria', 'grupo', 'status', 'metodoPagamento', 'dataPagamento', 'desconto'];
    const accountfilterOrder = ['nome', 'pago', 'categoria', 'grupo', 'status', 'metodoPagamento'];

    const admin = new AdminJS({
        rootPath: '/admin',
        resources: [
            {
                resource: Category,
                options: {
                  properties: {
                    createdAt: {
                      type: 'datetime',
                      isVisible: { add: false, edit: false, list: true, show: true, filter: true }
                    },
                    updatedAt: {
                      type: 'datetime',
                      isVisible: { add: false, edit: false, list: true, show: true, filter: true }
                    },
                  },
                  actions:  { new: { isVisible: false }, delete: { isVisible: false }, edit: { isVisible: false } },
                }
              } 
            ,Group,Status,PaymentMethod,
            generateResource(User, {
                id: generateType('number', true, true, true, true, true),
                name: generateType('string', true, true, true, true, true),
                username: generateType('string', true, true, true, true, true),
                email: generateType('string', true, true, true, true, true),
                password: generateType('password', true, false, true, false, false),

            },
                {
                    new: {
                        before: async (request: any) => {
                            await email.sendEmail(request.payload.email, 'Bem vindo ao meu gestor de tarefas', 'password-send', { text: "seja, bem-vindo ao sistema, sua senha é:", name: request.payload.name, password: request.payload.password });
                            return encryptPassword(request);
                        }
                    },
                    edit: {
                        before: async (request: any, context: any) => {
                            if (request.method !== 'post') return request

                            if (request.payload.password !== context.record.params.password) {
                                await email.sendEmail(request.payload.email, 'Alteração de senha', 'password-send', { text: "sua senha sofreu alteração e agora ela é:", name: request.payload.name, password: request.payload.password });
                                return encryptPassword(request);
                            }
                            return request
                        }
                    },
                },
                userlistOrder,
                usereditOrder,
                usershowOrder,
                userfilterOrder),
            generateResource(Account, null,
                //     {
                //     id: generateType('number', true, true, true, true, true),
                //     nome: generateType('string', true, true, true, true, true),
                //     total: generateType('float', true, true, true, true, true),
                //     vencimento: generateType('date', true, true, true, true, true),
                //     pago: generateType('boolean', true, true, true, true, true),
                //     categoria: generateType('string', true, true, true, true, true),
                //     grupo: generateType('string', true, true, true, true, true),
                //     status: generateType('string', true, true, true, true, true),
                //     metodoPagamento: generateType('string', true, true, true, true, true),
                //     dataPagamento: generateType('date', true, true, true, true, true),
                //     desconto: generateType('float', true, true, true, true, true),
                // }, 
                {
                    edit: {
                        before: async (request: any, context: any) => {
                            if (request.method !== 'post') return request;
                            console.log('request method', request.method)
                            return isPaid(request);
                            // formatCurrency(request);
                            // return request;
                        },
                        after: async (response: any, request: any, context: any) => {
                            console.log('after edit response', response)
                            return formatCurrency(response);
                        }
                    },
                    new: {
                        before: async (request: any) => {
                            return carregaCombos(request);
                            // return isPaid(request);
                            // formatCurrency(request);
                            // return request;
                        },
                        after: async (request: any) => {
                            return carregaCombos(request);
                            // return isPaid(request);
                            // formatCurrency(request);
                            // return request;
                        }
                    },
                    list: {
                        before: async (request: any) => {
                            // return carregaCombos(request);
                            return isPaid(request);
                            //AQUI FORMATAR CURRENCY
                            // formatCurrency(request);
                            // return request;
                        },
                        after: async (response: any, request: any, context: any) => {
                            console.log('after list response', response)
                            // return carregaCombos(response);
                            return formatCurrency(response);
                        }
                    },
                    show: {
                        before: async (request: any) => {
                            // return carregaCombos(request);
                            return isPaid(request);
                            // formatCurrency(request);
                            // return request;
                        },
                        after: async (response: any, request: any, context: any) => {
                            console.log('after show response', response)
                            // return carregaCombos(response);
                            return formatCurrency(response);
                        }

                    },
                },
                accountlistOrder,
                accounteditOrder,
                accountshowOrder,
                accountfilterOrder
            ),
            // generateResource(Category, null,
            //     {},
            //     null,
            //     null,
            //     null,
            //     null
            // ),
            // generateResource(Group, null,
            //     {},
            //     null,
            //     null,
            //     null,
            //     null
            // ),
            // generateResource(Status, null,
            //     {},
            //     null,
            //     null,
            //     null,
            //     null
            // ),
            // generateResource(PaymentMethod, null,
            //     {},
            //     null,
            //     null,
            //     null,
            //     null
            // ),
        ],
        branding: {
            favicon: "https://t4.ftcdn.net/jpg/05/06/81/59/360_F_506815935_cvsf1tKw8WuPeHpHSm2efPbbH08Tw8nN.png",
            logo: "https://t4.ftcdn.net/jpg/05/06/81/59/360_F_506815935_cvsf1tKw8WuPeHpHSm2efPbbH08Tw8nN.png",
            companyName: "Meu gestor de contas"
        }
    })

    const sessionStore = new mysqlStore({
        connectionLimit: 10,
        password: process.env.DB_PASS,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        createDatabaseTable: true
    })

    const cookieName = 'adminjs';
    const secret = 'tsiVAtrIm9w6brtVZ7LhheemelWsTWU2';
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate: async (email: string, password: string) => {
                const user = await User.findOne({ where: { email } });

                if (user) {
                    const verifica = await verifyPassword(password, user.getDataValue('password'));
                    if (verifica)
                        return user;
                }
                return false;
            },
            cookieName: cookieName,
            cookiePassword: secret
        },
        null, {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: secret,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: cookieName
    }
    )
    hbs.registerPartials(path.join(ROOT_DIR, 'views'));
    app.set('view engine', '.hbs');
    app.use(admin.options.rootPath, adminRouter)
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/dashboard', dashboard);

    sequelize.sync({ force: false })
        .then(() => {
            console.log('sync OK')
            app.listen(PORT, () => {
                // createTablesAndInsertData();
                console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
            })
        })
        .catch((error) => {
            console.error('Error sync:', error);
        })
}

async function createTablesAndInsertData() {
    try {
        // Verifica se as tabelas já existem no banco de dados
        const tablesToCheck = ['categories', 'groups', 'paymentMethods', 'status', 'users', 'accounts'];
        const existingTables = await sequelize.getQueryInterface().showAllTables();

        for (const table of tablesToCheck) {
            if (!existingTables.includes(table)) {
                switch (table) {
                    case 'categories':
                        await Category.sync();
                        await Category.create({ desc: AccountCategoryEnum.CreditCard });
                        await Category.create({ desc: AccountCategoryEnum.Monthly });
                        await Category.create({ desc: AccountCategoryEnum.Extra });
                        await Category.create({ desc: AccountCategoryEnum.Other });
                        console.log('categories created');
                        break;
                    case 'groups':
                        await Group.sync();
                        await Group.create({ desc: AccountGroupEnum.First });
                        await Group.create({ desc: AccountGroupEnum.Second });
                        await Group.create({ desc: AccountGroupEnum.Third });
                        await Group.create({ desc: AccountGroupEnum.Fourth });
                        await Group.create({ desc: AccountGroupEnum.House });
                        await Group.create({ desc: AccountGroupEnum.Family });
                        await Group.create({ desc: AccountGroupEnum.Other });
                        console.log('groups created');
                        break;
                    case 'paymentMethods':
                        await PaymentMethod.sync();
                        await PaymentMethod.create({ desc: PaymentMethodEnum.Pix });
                        await PaymentMethod.create({ desc: PaymentMethodEnum.CreditCard });
                        await PaymentMethod.create({ desc: PaymentMethodEnum.DebitCard });
                        await PaymentMethod.create({ desc: PaymentMethodEnum.Boleto });
                        await PaymentMethod.create({ desc: PaymentMethodEnum.Transfer });
                        await PaymentMethod.create({ desc: PaymentMethodEnum.PayPal });
                        console.log('paymentMethods created');
                        break;
                    case 'status':
                        await Status.sync();
                        await Status.create({ desc: AccountStatusEnum.Upcoming });
                        await Status.create({ desc: AccountStatusEnum.Overdue });
                        await Status.create({ desc: AccountStatusEnum.Paid });
                        await Status.create({ desc: AccountStatusEnum.Future });
                        console.log('status created');
                        break;
                    case 'users':
                        await User.sync();
                        const request = {
                            payload: {
                                password: '1234'
                            }
                        };
                        const response = await encryptPassword(request);
                        const { password } = response.payload;
                        await User.create({
                            name: 'Daniel',
                            username: 'daniel',
                            email: 'dvmguimaraes@gmail.com',
                            password
                        });
                        break
                    case 'accounts':
                        await Account.sync();
                        await Account.create({
                            nome: 'Conta de luz',
                            total: 100,
                            vencimento: new Date(),
                            pago: false,
                            categoria: 1,
                            grupo: 1,
                            status: 1,
                            metodoPagamento: 1,
                            dataPagamento: new Date(),
                            desconto: 0
                        });
                        break
                }
                console.log(`Tabela ${table} criada e dados inseridos com sucesso.`);
            } else {
                console.log(`A tabela ${table} já existe. Nenhuma ação necessária.`);
            }
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}







// sequelize.sync({ force: false })
//     .then(() => {
//         console.log('sync OK')
//         app.listen(PORT, () => {
//             console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
//         })
//     })
//     .catch((error) => {
//         console.error('Error sync:', error);
//     })
// }


start()