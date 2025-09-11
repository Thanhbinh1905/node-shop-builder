import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import logger from './config/logger';
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { globalMiddleware } from "./middlewares/global.middleware";
import { reqLogger } from './middlewares/req.middleware';
import routes from "./routes";
import { config } from './config';
import { corsMiddleware } from './middlewares/cors.middleware';

const app = express();

globalMiddleware(app);

app.use(corsMiddleware);

app.use(reqLogger);

app.use("/api/v1/auth", routes);

app.use(errorHandler);

app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'resource not found' });
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  logger.info(
    `${config.SERVICE_NAME} is listening on port ${port}`,
  );
});