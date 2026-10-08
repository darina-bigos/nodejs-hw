import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Не забудьте переконатися, що cookie-parser підключено
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

export const startServer = async () => {
  await connectMongoDB();

  const app = express();

  app.use(cors({ credentials: true, origin: true }));
  app.use(express.json());
  app.use(cookieParser()); // Підключення парсера кукі
  app.use(logger);

  app.use(authRouter);
  app.use(notesRouter);

  app.use(notFoundHandler);
  app.use(errors());
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
