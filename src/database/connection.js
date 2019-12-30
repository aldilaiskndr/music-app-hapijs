import {createConnection} from "typeorm";
import entities from "./entities";

async function createDBConnection() {
    const connection = await createConnection({
        type:process.env.DB_DRIVER,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: (process.env.DB_SYNC==='true'),
        logging: (process.env.DB_LOGGING==='true'),
        entities: Object.values(entities),
    });
    return connection;
}

export default createDBConnection;