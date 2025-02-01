import { LogSeverityLevel } from "../domain/entities/log.entity";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";

const fsLogRepository = new LogRepositoryImpl(
    new FileSystemDatasource()
);
const mongoLogRepository = new LogRepositoryImpl(
    new MongoLogDatasource()
);
const postgresLogRepository = new LogRepositoryImpl(
    new PostgresLogDatasource()
);

const emailService = new EmailService();

export class ServerApp {

    public static async start()
    {
        console.log('Server started');
        
        //Envio de correos
        // new SendEmailLogs(
        //     emailService,
        //     fileSystemLogRepository
        // ).execute(
        //     ['isaiasgarciacuya@gmail.com']
        // )

        // emailService.sendEmailWithFileSystemLogs(['isaiasgarciacuya@gmail.com']);

        // const logs = await logRepository.getLogs( LogSeverityLevel.high );
        // console.log(logs);

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                //const url = 'https://google.com';
                const url = 'http://localhost:3000';
                new CheckServiceMultiple(
                    [
                        fsLogRepository,
                        mongoLogRepository,
                        postgresLogRepository
                    ],
                    () => console.log(`${ url } is ok`),
                    ( error ) => console.log( error )
                ).execute( url );
            }
        );
    }
}