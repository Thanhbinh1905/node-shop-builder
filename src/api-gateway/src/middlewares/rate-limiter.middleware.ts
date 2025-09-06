import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW * 60 * 1000,
  max: config.RATE_LIMIT_MAX_REQUESTS, // limit each IP to config requests per windowMs
});