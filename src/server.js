import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
    getEnvVar
} from './utils/getEnvVar.js';
import router from './routers/index.js';
import {
    errorHandler
} from './middlewares/errorHandler.js';
import {
    notFoundHandler
} from './middlewares/notFoundHandler.js';
import {
    UPLOAD_DIR
} from './constants/index.js';
import {
    swaggerDocs
} from './middlewares/swaggerDocs.js';
import usersRouter from './routers/users.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(
        cors({
            origin: getEnvVar('APP_DOMAIN', 'http://localhost:3000'),
            credentials: true,
        }),
    );
    app.use(cookieParser());
    app.use('/uploads', express.static(UPLOAD_DIR));
    app.use('/api-docs', swaggerDocs());
    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.get('/', (req, res) => {
        res.json({
            message: 'Hello world!',
        });
    });

    app.use('/api/users', usersRouter);
    app.use(router);
    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
};