import cors from 'cors';
import config from '#/config';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import express, {type Express} from 'express';
import {apisRoutes} from '#/apis/apis.routes';
import {terminalLog, errorHandler, notFoundError} from './middlewares';

/** create express server. */
export const createApp = (): Express => {
  // Express App
  const app = express();

  // Middlewares
  app.use(terminalLog()); // log on requests
  app.use(cookieParser()); // cookies parsers
  app.use(cors({origin: config.clientUrl, credentials: true})); // Cross Origin Resource Sharing (CORS)
  app.use(express.json({limit: '30mb'})); // Parse JSON requests
  app.use(express.urlencoded({extended: true, limit: '30mb'}));
  app.use(passport.initialize());

  // Routers
  app.use('/api', apisRoutes());

  // Error handler
  app.use(notFoundError);
  app.use(errorHandler);

  return app;
};
