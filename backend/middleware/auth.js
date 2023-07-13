// Importing required modules and files
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/*************************************************************************************************************************/
// Middleware to check if the user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // Extracting the token from cookies
  const { token } = req.cookies;

  // Checking if the token is not available
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  // Verifying the token and decoding its data
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // Finding the user based on the decoded data
  req.user = await User.findById(decodedData.id);
  next();
});

/*************************************************************************************************************************/
// Middleware to authorize user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Checking if the user role is not allowed
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
