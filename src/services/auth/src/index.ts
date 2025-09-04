import dotenv from 'dotenv';
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { globalMiddleware } from "./middlewares/global.middleware";
import routes from "./routes";

dotenv.config();

const app = express();

globalMiddleware(app);

app.use("/api", routes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `${new Date().toLocaleString('vi-VN')}: Express is listening on port ${port}`,
  );
});