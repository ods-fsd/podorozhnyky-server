import {
    initMongoDBConnection
} from './db/initMongoDBConnection.js';
import {
    setupServer
} from './app.js';

const bootstrap = async () => {
    await initMongoDBConnection();
    setupServer();
};

bootstrap();