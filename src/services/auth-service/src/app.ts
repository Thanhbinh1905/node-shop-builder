import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import logger from './config/logger';
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { globalMiddleware } from "./middlewares/global.middleware";
import { reqLogger } from './middlewares/req.middleware';
import routes from "./routes";

const app = express();

globalMiddleware(app);

app.use(reqLogger);

app.use("/api/v1/auth", routes);

app.use(errorHandler);

app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'resource not found' });
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(
    `${new Date().toLocaleString('vi-VN')}: Express is listening on port ${port}`,
  );
});