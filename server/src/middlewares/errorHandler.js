import { AppError } from '../utils/AppError.js';

// Runs after all routes: reaching this point means no endpoint matched.
export const notFound = (req, res, next) => {
  next(new AppError('Route not found', 404));
};

// Express recognizes error middleware by these four parameters.
export const errorHandler = (error, req, res, next) => {
  // If a response has started, let Express close it instead of sending JSON twice.
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.type === 'entity.parse.failed') {
    // Invalid JSON fails before a request reaches its controller.
    statusCode = 400;
    message = 'Request body contains invalid JSON';
  } else if (error.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  }

  const response = { success: false, message };

  // Validation code can supply [{ field, message }] through AppError.
  if (error instanceof AppError && error.errors) {
    response.errors = error.errors;
  }

  // Unexpected errors never expose stack traces or internal error messages.
  res.status(statusCode).json(response);
};
