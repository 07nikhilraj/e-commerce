const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next) => {
  // Setting default status code and error message
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handling specific errors and converting them to custom error objects
  if (err.name === "CastError") {
    // Wrong MongoDB ID error
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    // Mongoose duplicate key error
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    // Wrong JWT error
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    // JWT expired error
    const message = `Json Web Token is expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // Sending a JSON response with the error status code and message
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
