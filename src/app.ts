import { PrismaClient } from "@prisma/client";
import { envs } from "./config/plugins/envs.plugins";
import { MongoDatabase } from "./data/mongo";
import { ServerApp } from "./presentation/server";

(() => {
    main();
})();

async function main()
{
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    });

    ServerApp.start();
}