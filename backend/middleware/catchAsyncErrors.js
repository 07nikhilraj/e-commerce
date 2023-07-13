module.exports = (theFunc) => (req, res, next) => {
  // Wrapping theFunc in a Promise to handle any potential errors
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
