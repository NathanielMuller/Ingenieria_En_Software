import { HttpError } from '../utils/HttpError.js';

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  if (statusCode === 500) {
    console.error('[500]', error.message, error.stack);
  }
  const message = statusCode === 500 ? 'Error interno del servidor.' : error.message;

  response.status(statusCode).json({
    success: false,
    message,
    details: error instanceof HttpError ? error.details : null
  });
}