import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminSequelize from '@adminjs/sequelize'
import AdminMongoose from '@adminjs/mongoose';
import express from 'express';

// Models
import { Role } from './models/role.entity';
import { User } from './models/user.entity';
import { Document } from './models/document.entity';

// Controllers
import UserController from './controllers/UserController';

// Routes
import document from './routes/document';
import auth from './routes/auth';

import session from 'express-session';
import cors from 'cors';

import hbs from 'hbs';
const path = require('node:path');

require('dotenv').config()

const bcrypt = require("bcryptjs");

const mysqlStore = require('express-mysql-session')(session);

const PORT = 3001

const sessionStore = new mysqlStore({
    connectionLimit: 10,
    password: process.env.SQL_DB_PASS,
    user: process.env.SQL_DB_USER,
    database: process.env.SQL_DB_NAME,
    host: process.env.SQL_DB_HOST,
    port: process.env.SQL_DB_PORT,
    createDatabaseTable: true
});

const ROOT_DIR = __dirname

AdminJS.registerAdapter({
    Resource: AdminSequelize.Resource,
    Database: AdminSequelize.Database
});

AdminJS.registerAdapter({
    Resource: AdminMongoose.Resource,
    Database: AdminMongoose.Database
})

const generateResource = (Model: object, properties: any = {}, actions: any = {}) => {
    return {
        resource: Model,
        options: {
            properties: {
                ...properties,
                createdAt: {
                    isVisible: {
                        list: true, edit: false, create: false, show: true
                    }
                },
                updatedAt: {
                    isVisible: {
                        list: true, edit: false, create: false, show: true
                    }
                }
            },
            actions: {
                ...actions
            }
        }
    }
}

const start = async () => {
    const app = express()

    const adminOptions = {
        resources: [
            generateResource(Role),
            generateResource(
                    User, 
                    {
                        password: {
                            type: 'password'
                        }
                    },
                    {
                        new: {
                            before: async(request: any, context: any) => {
                                if(request.payload.password){
                                    request.payload.password = await bcrypt.hashSync(request.payload.password, 10);
                                }
                                return request;
                            },
                            after: async(originalResponse: any, request: any, context: any) => {
                                // TODO: Enviar e-mail com acessos ao usuário criado
                                console.log(originalResponse.record.params)
                                return originalResponse;
                            }
                        }
                    }
                    // TODO: Add Edit
                ),
            generateResource(Document)
        ],
        dashboard: {
            component: AdminJS.bundle('./components/DashboardComponent')
        },
        // rootPath: '/internal/admin',
        branding: {
            companyName: 'Documentos Online',
            logo: 'https://assets.stickpng.com/images/61447cbd5953a50004ee16d8.png',
            favicon: 'https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_docs.png'
        }
    }

    const admin = new AdminJS(adminOptions)
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin, 
        {
            authenticate: async (email, password) => {
                const userCtrl = new UserController()
                return await userCtrl.login(email, password); 
            },
            cookieName: 'adminjs-internal-admin',
            cookiePassword: '5E8vsHT1i4KXbn8hULxa8&^4xP^JR@7A'
        },
        null,
        {
            store: sessionStore,
            resave: true,
            saveUninitialized: true,
            secret: 'B9z+!AH7k)UECV^7f!d)4^KV?CM}(.!.dSV+-cPCFJw2yN11I"v209O>k8KWkO}',
            cookie:{
                httpOnly: process.env.NOD_ENV !== 'production',
                secure: process.env.NOD_ENV === 'production'
            },
            name: 'adminjs-internal-admin'
        }
    )
   

    app.use(cors());
    app.use(express.json());
    hbs.registerPartials(path.join(ROOT_DIR, 'views'))
    app.set('view engine', '.hbs')

    app.use(admin.options.rootPath, adminRouter)
    app.use('/document', document)
    app.use('/auth', auth)

    app.get('/', (req, res) => {
        res.send('Api is runnning')
    })
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
}

start()