export class AppError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && {
        stack: this.stack,
        originalError: this.originalError
      })
    };
  }
}
