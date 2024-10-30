import logger from '#/logger';
import config from '#/config';
import mongoose from 'mongoose';
import {format} from './plugins';

// Add global plugins
mongoose.plugin(format);

/** This function help database connection */
export const dbConnect = async () => {
  try {
    const db = await mongoose.connect(config.databaseUrl, {
      autoIndex: true,
    });
    // Close MongoDB server on exit
    process.on('SIGTERM', () => {
      db.connection.close();
      process.exit(1);
    });
    logger.info('Mongodb connected');
  } catch (error) {
    // Handle error
    console.error(error);
    process.exit(1);
  }
};
