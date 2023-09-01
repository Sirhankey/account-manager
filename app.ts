import { AccountCategoryEnum, AccountGroupEnum, AccountStatusEnum, PaymentMethodEnum } from './src/enums';
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import * as AdminJSSequelize from '@adminjs/sequelize'
import { PaymentMethod } from './src/models/account-payment-method.entity';
import { generateResource, generateType } from './src/utils/resource-utils'
import { encryptPassword, verifyPassword } from './src/utils/bcrypt-utils'
import { sequelize } from './db'
import * as dotenv from 'dotenv';
import hbs from 'hbs';
import Mail from './src/utils/Mail'
import dashboard from './src/routes/dashboard'
const bodyParser = require('body-parser');
import session from 'express-session';
import { Account, Category, Group, Status, User } from './src/models';
import { getDataComOffset } from './src/utils/date';
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

    const accountsOrder = ['nome', 'total', 'vencimento', 'pago', 'categoria', 'grupo', 'status', 'metodoPagamento', 'dataPagamento', 'desconto'];
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
                    actions: { new: { isVisible: false }, delete: { isVisible: false }, edit: { isVisible: false }, show: { isVisible: false } },
                }
            }
            //  TODO:    [?] Eu tive que declarar essas tabelas como recursos para que a combo de relacionamento funcionasse, mas não quero que elas apareçam no menu
            , Group, Status, PaymentMethod,
            generateResource(User, {
                id: generateType('number'),
                name: generateType('string'),
                username: generateType('string'),
                email: generateType('string'),
                password: generateType('password', true, false, true, false, false),

            },
                {
                    new: {
                        before: async (request: any) => {
                            await email.sendEmail(request.payload.email, 'Bem vindo ao meu gestor de tarefas', 'password-send', { text: "seja, bem-vindo ao sistema, sua senha é:", name: request.payload.name, password: request.payload.password });
                            encryptPassword(request);
                            return request
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
                {
                    edit: {
                        before: async (request: any, context: any) => {
                            if (request.method !== 'post') return request;
                            console.log('request method', request.method)
                            // TODO:    [ ] Filtrar campos quando a conta não estiver sido paga
                            // return isPaid(request);
                            // TODO:    [ ] Formatar campos para moeda 
                            // formatCurrency(request);
                            // TODO:    [ ] Carregar combos (categorias, grupos, status e métodos de pagamento)
                            // return carregaCombos(request);
                            return request;
                        },
                        after: async (response: any, request: any, context: any) => {
                            console.log('after edit response', response)
                            // isPaid(request);
                            // formatCurrency(request);
                            // carregaCombos(request);
                            return response;

                        }
                    },
                    new: {
                        before: async (request: any) => {
                            console.log('before new request', request)
                            // isPaid(request);
                            // formatCurrency(request);
                            // carregaCombos(request);
                            return request;
                        },
                        after: async (request: any) => {
                            console.log('after new request', request)
                            // isPaid(request);
                            // formatCurrency(request);
                            // carregaCombos(request);
                            return request;
                        }
                    },
                    list: {
                        before: async (request: any) => {
                            console.log('before list request', request)
                            // isPaid(request);
                            // formatCurrency(request);
                            // carregaCombos(request);
                            return request;
                        },
                        after: async (response: any, request: any, context: any) => {
                            console.log('after list response', response)
                            // isPaid(request);
                            // formatCurrency(request);
                            // carregaCombos(request);
                            return response;
                        }
                    },
                    show: {
                        before: async (request: any) => {
                            console.log('before show response', request)
                            // isPaid(request);
                            // formatCurrency(request);
                            // carregaCombos(request);
                            return request;
                        },
                        after: async (response: any, request: any, context: any) => {
                            console.log('after show response', response)
                            // isPaid(request);
                            // formatCurrency(request);
                            // carregaCombos(request);
                            return response;
                        }

                    },
                },
                accountsOrder,
                accountsOrder,
                accountsOrder,
                accountfilterOrder
            ),
        ],
        branding: {
            favicon: "https://img.favpng.com/9/2/25/goku-dragon-ball-icon-png-favpng-znckeLFeWjMvpcpshsM0qbkeC.jpg",
            logo: "https://w7.pngwing.com/pngs/908/298/png-transparent-space-invaders-video-game-pong-space-invaders-rectangle-logo-video-game.png",
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
                // TODO:    [!] Caso as migrations não funcionem, descomentar a linha abaixo...lembre apenas de logo após retornar a comentar
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
                                password: '123'
                            }
                        };
                        const response = await encryptPassword(request);
                        const { password } = response.payload;
                        await User.create({
                            name: 'Admin',
                            username: 'admin',
                            email: 'email@email.com',
                            password
                        });
                        break
                    case 'accounts':
                        await Account.sync();
                        await Account.create({
                            nome: 'Conta de luz',
                            total: 268.90,
                            vencimento: getDataComOffset(true),
                            pago: false,
                            categoria: 1,
                            grupo: 1,
                            status: 1,
                        });
                        await Account.create({
                            nome: 'Conta de água',
                            total: 60,
                            vencimento: getDataComOffset(false),
                            pago: true,
                            categoria: 1,
                            grupo: 1,
                            status: 1,
                            metodoPagamento: 1,
                            dataPagamento: new Date(),
                            desconto: 0
                        });
                        await Account.create({
                            nome: 'Conta de telefone',
                            total: 110,
                            vencimento: getDataComOffset(false),
                            pago: true,
                            categoria: 1,
                            grupo: 1,
                            status: 1,
                            metodoPagamento: 1,
                            dataPagamento: new Date(),
                            desconto: 0
                        });
                        await Account.create({
                            nome: 'Conta de internet',
                            total: 88,
                            vencimento: getDataComOffset(true),
                            pago: false,
                            categoria: 1,
                            grupo: 1,
                            status: 1
                        });
                        await Account.create({
                            nome: 'Conta de gás',
                            total: 110,
                            vencimento: getDataComOffset(false),
                            pago: true,
                            categoria: 1,
                            grupo: 1,
                            status: 1,
                            metodoPagamento: 1,
                            dataPagamento: new Date(),
                            desconto: 0
                        });
                        await Account.create({
                            nome: 'Conta de cartão de crédito',
                            total: 335.90,
                            vencimento: getDataComOffset(false),
                            pago: true,
                            categoria: 1,
                            grupo: 1,
                            status: 1,
                            metodoPagamento: 1,
                            dataPagamento: new Date(),
                            desconto: 0
                        });
                        await Account.create({
                            nome: 'Conta de cartão de débito',
                            total: 133.25,
                            vencimento: getDataComOffset(true),
                            pago: false,
                            categoria: 1,
                            grupo: 1,
                            status: 1
                        });
                        await Account.create({
                            nome: 'Conta de boleto',
                            total: 80,
                            vencimento: getDataComOffset(true),
                            pago: false,
                            categoria: 1,
                            grupo: 1,
                            status: 1
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

start()