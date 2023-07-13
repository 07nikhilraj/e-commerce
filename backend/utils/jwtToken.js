const sendToken = (user, statusCode, res) => {
  // Generate a JWT token using the user object
  const token = user.getJWTToken();

  // Options for the cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Set the token as a cookie in the response
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
