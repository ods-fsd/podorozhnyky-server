import dotenv from 'dotenv';
import {
    initMongoDBConnection
} from './db/initMongoDBConnection.js';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await initMongoDBConnection();

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
};

startServer();