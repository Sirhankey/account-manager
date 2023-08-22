import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import * as AdminJSSequelize from '@adminjs/sequelize'
import { User } from './src/models/user.entity'
import { Account } from './src/models/account.entity'
import { generateResource } from './src/utils/resource-utils'
import { encryptPassword } from './src/utils/bcrypt-utils'
import { sequelize } from './db'

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


    const admin = new AdminJS({
        resources: [
            generateResource(User, {
                password: {
                    type: 'password',
                    isVisible: {
                        add: true, list: false, edit: true, filter: false, show: false
                    }
                }
            }, {
                new: {
                    before: async (request: any) => {
                        return encryptPassword(request);
                    }
                },
                edit: {
                    before: async (request: any) => {
                        return encryptPassword(request);
                    }
                },
            }),
            generateResource(Account)
        ],
        rootPath: '/admin',
        branding: {
            favicon: "https://t4.ftcdn.net/jpg/05/06/81/59/360_F_506815935_cvsf1tKw8WuPeHpHSm2efPbbH08Tw8nN.png",
            logo: "https://t4.ftcdn.net/jpg/05/06/81/59/360_F_506815935_cvsf1tKw8WuPeHpHSm2efPbbH08Tw8nN.png",
            companyName: "Meu gestor de contas"
        }
    })

    const adminRouter = AdminJSExpress.buildRouter(admin);

    app.use(admin.options.rootPath, adminRouter);



    sequelize.sync({ force: false })
        .then(() => {
            console.log('sync OK')
            app.listen(PORT, () => {
                console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
            })
        })
        .catch((error) => {
            console.error('Error sync:', error);
        })
}

start()