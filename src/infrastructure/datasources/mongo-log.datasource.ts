import { LogModel } from './../../data/mongo/models/log.model';
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class MongoLogDatasource implements LogDatasource {

    async saveLog(log: LogEntity): Promise<void>
    {    
        const newLog = await LogModel.create( log );
        console.log('Mongo Log created:', newLog.id );
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]>
    {
        const logs = await LogModel.find({
            level: severityLevel
        });

        //En un callback, cuando un argumento tiene como único objetivo ser proporcionado
        //a una función interna esta puede resumirce de la siguiente manera:
        //return logs.map( mongoLog => LogEntity.fromObject( mongoLog )); //antes
        return logs.map( LogEntity.fromObject ); //después
    }
    
}

