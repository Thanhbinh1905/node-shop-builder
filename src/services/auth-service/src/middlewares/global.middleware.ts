import cors from 'cors';
import express, { Application, json, urlencoded } from "express";
import helmet from 'helmet';

export const globalMiddleware = (app: Application) => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
};