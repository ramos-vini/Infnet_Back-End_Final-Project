const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const exphbs = require('exphbs')
const { resolve } = require('path');

require('dotenv').config()

class Mail{
    root_dir: string;
    transporter: any;

    constructor(root_dir: string){
        this.root_dir = root_dir;

        this.transporter = nodemailer.createTransport({
            port:  process.env.EMAIL_PORT,
            host:  process.env.EMAIL_SMTP,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            secure: true
        })
        const viewPath = resolve(this.root_dir, 'views', 'emails');
        this.transporter.use('compile', hbs({
            viewEngine: exphbs.create({
                defaultLayout: 'default',
                extname: '.hbs'
            }),
            viewPath,
            extName: '.hbs' 
        }))
    }

    async sendEmail(to: string, subject: string, template:string, context: any): Promise<any>{
        const data = {
            from: process.env.EMAIL,
            to,
            subject,
            template,
            context
        }

        try{
            return await this.transporter.sendMail(data)
        }catch(err){
            throw err;
        }
    }
}

export default Mail;