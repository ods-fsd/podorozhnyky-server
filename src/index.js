import {
    setupServer
} from './server.js';
import {
    initMongoDBConnection
} from './db/initMongoDBConnection.js';
import {
    createDirIfNotExists
} from './utils/createDirIfNotExists.js';
import {
    TEMP_UPLOAD_DIR,
    UPLOAD_DIR
} from './constants/index.js';

const bootstrap = async () => {
    await initMongoDBConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);

    setupServer();
};
void bootstrap();