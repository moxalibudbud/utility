import IORedis from 'ioredis';
import { redisOptions } from './options';

let connection: IORedis | null = null;

export const getConnection = (): IORedis => {
  if (!connection) {
    connection = createConnection('main');
  }

  return connection;
};

export const createConnection = (name: string): IORedis => {
  const newConnection = new IORedis(redisOptions);

  newConnection.on('connect', () => {
    const connectionName = `${process.env.APP_NAME}_${name}_connection`;
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
  const redis = getConnection(); // Ensure connection is initialized
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
