import dotenv from 'dotenv';
import { initMongoDBConnection } from './db/initMongoDBConnection.js';
import express from 'express';
import cors from 'cors';

import usersRouter from './routers/users.js';
import storiesRouter from './routers/stories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/stories', storiesRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// централізована помилка (під ctrlWrapper/service errors)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const startServer = async () => {
  await initMongoDBConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();