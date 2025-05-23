import { RedisOptions } from 'ioredis';

export const defaultOptions: RedisOptions = {
  port: (process.env.APP_REDIS_PORT || 6379) as number,
  host: process.env.APP_REDIS_HOST || '127.0.0.1',
  username: process.env.APP_REDIS_USERNAME,
  password: process.env.APP_REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  retryStrategy: function (times: number) {
    // Reference: https://docs.bullmq.io/guide/going-to-production#retrystrategy
    return Math.max(Math.min(Math.exp(times), 30000), 1000);
 }

};
