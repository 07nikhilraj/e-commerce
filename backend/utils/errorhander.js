class ErrorHandler extends Error {
    constructor(message, statusCode) {
      // Calling the parent class constructor (Error) with the error message
      super(message);
  
      // Setting the statusCode property of the error object
      this.statusCode = statusCode;
  
      // Capturing the stack trace for debugging purposes
      Error.captureStackTrace(this, this.constructor);
    }
  }
  