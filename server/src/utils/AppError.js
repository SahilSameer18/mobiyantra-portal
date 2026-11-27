// Use this for expected failures that are safe to explain to the client.
// Example: throw new AppError('You cannot approve this request', 403);
export class AppError extends Error {
  constructor(message, statusCode = 400, errors) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
