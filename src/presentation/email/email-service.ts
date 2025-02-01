import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugins';

interface SendMailOptions
{
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachments?: Attachment[],
}

interface Attachment {
    filename: string,
    path: string,
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET,
        }
    });

    constructor() {}

    async sendEmail( options: SendMailOptions ): Promise<boolean>
    {
        const { to, subject, htmlBody, attachments = [] } = options;

        try
        {
            const sentInformation = await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments,
            });

            console.log(sentInformation);

            return true;
        }
        catch ( error ) {

            return false;
        }
    }

    async sendEmailWithFileSystemLogs( to: string | string[] )
    {
        const subject = 'Logs del servidor';
        const htmlBody = `
                <h3>Logs de sistema con archivos</h3>
                <p>Voluptate mollit aute non cupidatat laborum duis tempor proident.</p>
                <p>Ver logs adjuntos</p>
            `;
        
        const attachments: Attachment[] = [
            { filename: 'log-all.log', path: './logs/logs-all.log' },
            { filename: 'log-high.log', path: './logs/logs-high.log' },
            { filename: 'log-medium.log', path: './logs/logs-medium.log' },
        ]

        return this.sendEmail({
            to,
            subject,
            htmlBody,
            attachments
        })
    }
}