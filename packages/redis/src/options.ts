import { RedisOptions } from 'ioredis';

export const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  port: (process.env.APP_REDIS_PORT || 6379) as number,
  host: process.env.APP_REDIS_HOST || '127.0.0.1',
  username: process.env.APP_REDIS_USERNAME,
  password: process.env.APP_REDIS_PASSWORD,
};
