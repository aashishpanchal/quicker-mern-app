import config from '#/config';
import logger from '#/logger';
import {ErrorRequestHandler, Router} from 'express';
import {httpErrorHandler, NotFoundError} from 'exlite';

// Error-Handler
export const errorHandler: ErrorRequestHandler = httpErrorHandler({
  dev: config.isDev,
  log: logger.error.bind(logger),
});

// NotFound handler
export const notFoundError: Router = Router().all('*', req => {
  // Generate NotFound Error
  const err = new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`, {
    url: req.originalUrl,
    method: req.method,
  });
  // Send json format response
  req.res.status(err.status).json(err.toJson());
});
