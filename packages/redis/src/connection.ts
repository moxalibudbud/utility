import IORedis, { RedisOptions } from 'ioredis';
import { defaultOptions } from './options';

let connection: IORedis | null = null;

type Options = RedisOptions & { connectionName?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConnection = (options: Options = { connectionName: 'moxalibudbud_redis'}): IORedis => {
  if (!connection) {
    connection = createConnection(options);
  }

  return connection;
};

const createConnection = (customOptions: Options): IORedis => {
  const options: Options = { ...defaultOptions, ...customOptions };
  const connectionName = options?.connectionName || 'moxalibudbud_redis';
  const newConnection = new IORedis(options);

  newConnection.on('connect', () => {
    console.info('\u2713', `REDIS Server connected to ${connectionName}`);
    try {
      newConnection?.client('SETNAME', connectionName);
    } catch (err) {
      console.error('\u2717', 'Failed to set Redis client name:', err);
    }
  });

  newConnection.on('error', (err) => {
    console.error('\u2717', 'REDIS Server error:', err);
  });

  return newConnection;
};


export const isReady = async (): Promise<void> => {
  const redis = getConnection()
  return new Promise((resolve, reject) => {
    const onError = (err: Error) => {
      console.error('\u2717', 'REDIS Server error:', err);
      cleanup();
      reject(err);
    };

    const onReady = () => {
      console.info('\u2713', 'REDIS Server is ready!');
      cleanup();
      resolve();
    };

    const cleanup = () => {
      redis.off('error', onError);
      redis.off('ready', onReady);
    };

    redis.once('error', onError);
    redis.once('ready', onReady);
  });
};
