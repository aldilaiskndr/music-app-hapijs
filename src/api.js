'use strict';

import Hapi from "@hapi/hapi";
import createDBConnection from "./database/connection";
import configure from "./config";
import routes from "./routes";
import {validate} from "./auth/user.validate";

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

export default async () => {
    configure();
    const connection = await createDBConnection();
    const server = Hapi.server({
        port: process.env.APP_PORT,
        host: process.env.APP_HOST
    });

    await server.register(require('@hapi/cookie'));
    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'sid-example',
            password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
            isSecure: false
        },
        redirectTo: '/login',
        validateFunc: async (request, session) => {
            console.log(session, "ini session");
            return validate(request, session.username, session.password);
        }
    });

    server.auth.default('session');

    server.route(routes);
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    if (connection.isConnected) {
        await server.start();
        console.log(`Connected to ${process.env.DB_DRIVER} database at ${process.env.DB_HOST}`);
        console.log(`Server ${process.env.APP_NAME} running on ${server.info.uri}`);
    }else {
        console.log(`error`);
    }

    // return server.listener;
}
