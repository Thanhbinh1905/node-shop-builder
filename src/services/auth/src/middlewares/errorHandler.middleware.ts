import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/ApiError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  console.error(err.stack);
  return res.status(500).json({
    stackTrace: process.env.NODE_ENV === 'production' ? null : err.stack,
    status: 'error',
    statusCode: 500,
    message: 'Something went wrong on the server.',
  });
};