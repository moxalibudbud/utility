import IORedis from 'ioredis';
import { redisOptions } from './options';

let connection: IORedis | null = null;

export const getConnectionWithOptions = (options: { [key: string]: any } = {}): IORedis => {
  if (!connection) {
    connection = createConnectionWithOptions('connection_with_options', options);
  }

  return connection;
};

const createConnectionWithOptions = (name: string, options = {}): IORedis => {
  const newConnection = new IORedis({ ...redisOptions, ...options });

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
