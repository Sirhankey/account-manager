import * as dotenv from 'dotenv';
dotenv.config();
const nodemailer = require('nodemailer');
const hbs = require("nodemailer-express-handlebars");
const exphbs = require('exphbs');
const { resolve } = require('path');

export default class Mail {

    transporter: any;

    constructor(rootDir: string | null) {
        this.transporter = nodemailer.createTransport({
            port: process.env.EMAIL_PORT,
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true
        });
        if(rootDir){
            const viewPath = resolve(rootDir, "src", "views");
            this.transporter.use("compile", hbs({
                viewEngine: exphbs.create({
                    defaultLayout: 'default',
                    extname: '.hbs',
                }),
                viewPath,
                extname: '.hbs',
            }));
        }

    }

    public async sendEmail(to: string | null, subject: string | null, template: string | null, context: any){
        const data = {
            from: process.env.EMAIL,
            to,
            subject,
            template,
            context
        }
        try{
            return await this.transporter.sendMail(data);
        }catch(err){
            throw err;
        }
    }
}