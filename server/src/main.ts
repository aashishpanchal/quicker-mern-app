import 'reflect-metadata';
import logger from '#/logger';
import config from '#/config';
import {createApp} from '#/app';
import {dbConnect} from '#/db/mongo';

const main = async () => {
  // DB-Connect
  await dbConnect();
  // Create app
  const app = createApp();
  const {port, host} = config;
  // Start the server
  app.listen(port, host, () => {
    logger.info(`http://${host}:${port}`);
    logger.info(`Press CTRL + C to exit.`);
  });
};

void main();
